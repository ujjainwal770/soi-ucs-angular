import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../core/constants/app.constants';
import { getStateList, schoolReportDownloadLinkQuery, soucsReportDownloadLinkQuery } from '../../../core/query/report-download';
import { CustomErrorHandlerService } from '../../../core/services/custom-error-handler.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'app-report-download-dialog',
  templateUrl: './report-download-dialog.component.html',
  styleUrls: ['./report-download-dialog.component.scss']
})
export class ReportDownloadDialogComponent implements OnInit {

  pgtitle = '';
  maxDate: Date = new Date();
  reportType = '';
  schoolid = 0;
  isSchoolReport = false;
  stateList = [];

  downloadReportDialogForm: FormGroup;
  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _localStorage: LocalStorageService,
    public dialogRef: MatDialogRef<ReportDownloadDialogComponent>
  ) { }

  ngOnInit(): void {
    this.isSchoolReport = (this.reportType === 'SCHOOLS');
    // Mat dialog position change
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.position = { top: this.isSchoolReport ? '50px' : '100px' };
    this.dialogRef.updatePosition(matDialogConfig.position);

    this.schoolid = this._localStorage.getSchoolAdminSchoolId();
    this.downloadReportDialogForm = new FormGroup({
      'state': new FormControl('all', [Validators.required]),
      'dateRangeType': new FormControl('custom', [Validators.required]),
      'startDate': new FormControl('', [Validators.required]),
      'endDate': new FormControl('', [Validators.required]),
      'fileType': new FormControl('xlxs', [Validators.required])
    });
    if (this.isSchoolReport) {
      this.getStateList();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  /**
   * @param name of the reactive form control
   * @returns detail of reactive form control
   */
  getFieldR(name: string) {
    return this.downloadReportDialogForm.get(name);
  }

  getTimestamp(date) {
    return new Date(date).getTime();
  }

  // Fetch all state list.
  getStateList() {
    this._spinner.show();
    this._apollo.query({
      query: getStateList,
      variables: {
        countryname: ''
      },
      fetchPolicy: 'no-cache'
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this.stateList = data['getStateList']['state'];
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });

  }

  // Preparing inputs as query payload.
  getInput() {
    const startDateTimestamp = this.getTimestamp(this.downloadReportDialogForm.value.startDate);
    let endDateTimestamp = this.getTimestamp(this.downloadReportDialogForm.value.endDate);

    /**
     * Adding 24 hrs into endDate time as date picker gives date of when it starts i.e midnight date.
     * i.e. Tuesday, May 10, 2022 12:00:00 AM  ---> '12:00:00 AM'
     **/
    const endDateTimeGap = (_CONST['hour'] * _CONST['minutes'] * _CONST['seconds'] * _CONST['milliSeconds']);
    endDateTimestamp += endDateTimeGap;

    const inputs: any = {
      reportType: this.reportType,
      fileType: this.downloadReportDialogForm.value.fileType,
    };

    // When school report
    if (this.isSchoolReport) {
      if (this.downloadReportDialogForm.value.state !== 'all') {
        inputs.state = this.downloadReportDialogForm.value.state;
      }
      inputs.dateRangeType = this.downloadReportDialogForm.value.dateRangeType;
    }

    // when custom date range => default type = custom
    if (this.downloadReportDialogForm.value.dateRangeType === 'custom') {
      this.setRequiredValidation('startDate');
      this.setRequiredValidation('endDate');
      inputs.startDate = startDateTimestamp;
      inputs.endDate = endDateTimestamp;
    } else {
      this.removeValidation('startDate');
      this.removeValidation('endDate');
      inputs.startDate = 0;
      inputs.endDate = 0;
    }
    return inputs;
  }

  setRequiredValidation(fieldName) {
    this.downloadReportDialogForm.controls[fieldName].setValidators([Validators.required]);
    this.downloadReportDialogForm.get(fieldName).updateValueAndValidity();
  }

  removeValidation(fieldName) {
    this.downloadReportDialogForm.controls[fieldName].clearValidators();
    this.downloadReportDialogForm.get(fieldName).updateValueAndValidity();
  }

  getDonwloadLink(schooId) {       
    const inputs: any = this.getInput();
    if (this.downloadReportDialogForm.valid) {
      // when souch admin
      let downloadQuery = soucsReportDownloadLinkQuery;
      inputs.timeZoneOffset = new Date().getTimezoneOffset();
      // when school admin
      if (schooId) {
        inputs.schoolid = schooId;
        downloadQuery = schoolReportDownloadLinkQuery;
      }

      let downloadLink;
      this._spinner.show();
      this._apollo.mutate({
        mutation: downloadQuery,
        variables: inputs
      }).subscribe(({ data }) => {
        this._spinner.hide();
        if (schooId) {
          // School admin
          downloadLink = data['uploadToAzureBlobForSchool']?.readUri;
        } else {
          //Soucs admin
          downloadLink = data['uploadToAzureBlobForSoucs']?.readUri;
        }
        this._toastr.success('Your download should automatically begin in a few seconds');
        this.downloadReport(downloadLink);
        this.cancel();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.downloadReportDialogForm.markAllAsTouched();
    }
  }

  // Download the report file.
  downloadReport(downloadLink) {
    const link = document.createElement('a');
    link.download = `${this.reportType} . ${this.downloadReportDialogForm.value.fileType}`;
    link.href = downloadLink;
    link.click();
  }

  /**
   * On Date change, we have checked if the start date is greater than the end date.
   * */
  onDateChange() {
    const startDateTimestamp = this.getTimestamp(this.downloadReportDialogForm.value.startDate);
    const endDateTimestamp = this.getTimestamp(this.downloadReportDialogForm.value.endDate);
    if (startDateTimestamp && endDateTimestamp && (startDateTimestamp > endDateTimestamp)) {
      this.downloadReportDialogForm.controls['startDate'].setErrors({ 'greaterDateError': true });
    } else {
      this.downloadReportDialogForm.controls['startDate'].setErrors({ 'greaterDateError': null });
      this.downloadReportDialogForm.get('startDate').updateValueAndValidity();
    }
  }
  
}
