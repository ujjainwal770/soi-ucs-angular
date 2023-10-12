import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { studentBulkUploadQuery } from '../../../../core/query/bulk-upload';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { UtilityService } from '../../../../core/services/utility.service';
import { environment } from '../../../../../environments/environment';
import { _CONST } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-student-bulk-upload',
  templateUrl: './student-bulk-upload.component.html',
  styleUrls: ['./student-bulk-upload.component.scss']
})
export class StudentBulkUploadComponent implements OnInit {
  fileName = '';
  requiredFileType = '.csv';
  displayField = true;
  localUrl: any[];
  bulkForm: FormGroup;
  baseurl:string = environment.UPLOAD_API_URL;
  @ViewChild('bulk') bulk: ElementRef;
  fileExtension: string;
  @ViewChild('fileUpload') fileUpload: any;

  constructor(private readonly toastr: ToastrService,
    private readonly _dialogsService: DialogsService,
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly http: HttpClient,
    private readonly _utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    this.bulkForm = new FormGroup({
      'bulkfile': new FormControl(null),
    });
  }
  //validate selected file
  onFileSelected(event) {
    const file: File = event.target.files[0];
    // const file = (event.target as HTMLInputElement).files[0];
    this.fileExtension = file?.name.split('.').pop();
    //check file type
    if (this.fileExtension === 'csv') {
      this.displayField = false;
      this.fileName = file.name;
      this.bulkForm.patchValue({
        bulkfile: file
      });
      this.bulkForm.get('bulkfile').updateValueAndValidity();
    } else {
      this.toastr.error('Please upload csv files.');
    }
  }

  cancel() {
    this.fileName = '';
    this.displayField = true;
    this.bulkForm.get('bulkfile').setValue('');
    this.bulkForm.updateValueAndValidity();
  }

  upload() {
    this._spinner.show();
    const uploadpath = this.baseurl + 'file-bulk-upload/upload';
    if (this.bulkForm.get('bulkfile').value) {
      const formData: any = new FormData();
      formData.append('csv', this.bulkForm.get('bulkfile').value);
      this.http.post(uploadpath, formData).subscribe(
        (response: any) => {
          setTimeout(() => {
            this.getBulkUploadValidations(response.obj.fileName);
          }, _CONST.BULK_UPLOAD_DELAY_MS);
          this.fileUpload.nativeElement.value = '';
        }
      );
    } else {
      this.toastr.error('Please select atleast one file to upload.');
    }
  }

  getBulkUploadValidations(fileName: string) {
    this._apollo
      .mutate({
        mutation: studentBulkUploadQuery,
        variables: {
          filename: fileName,
          dataCategory: 'Student'
        },
      }).subscribe(({ data }) => {

        this._utilityService.sendClickEvent('student');
        this.cancel();
        this._spinner.hide();
        this.toastr.success('The file has been uploaded for further validations. Please check the status in the Table Below');
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  bulkUploadValidations(title, reviewParm: any) {
    this._dialogsService
      .bulkUploadValidations(title, reviewParm)
      .subscribe(res => {
        if (!res) {
          this._spinner.hide();
        }
      });
  }

  handleClick(event) {
    if (event) {
      event.target.value = null;
      this.fileUpload.nativeElement.value = '';
    }
  }
}
