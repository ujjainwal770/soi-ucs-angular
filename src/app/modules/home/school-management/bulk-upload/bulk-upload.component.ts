import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { schoolBulkUploadQuery } from '../../../../core/query/bulk-upload';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {

  isUploadLoaderRunning = false;
  fileName: string;
  requiredFileType = '.csv';
  displayField = true;
  localUrl: any[];
  bulkForm: FormGroup;
  baseurl:string = environment.UPLOAD_API_URL;
  containerurl:string = environment.CONTAINER_URL;
  @ViewChild('bulk') bulk: ElementRef;
  fileExtension: string;
  @ViewChild('fileUpload') fileUpload: any;
  constructor(private readonly toastr: ToastrService,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly http: HttpClient,
    private readonly _utilityService: UtilityService) { }

  ngOnInit(): void {
    //set form
    this.bulkForm = new FormGroup({
      'bulkfile': new FormControl(null),
    });
  }
  onFileSelected(event) {

    const file: File = event.target.files[0];
    this.fileExtension = file?.name.split('.').pop();
    //check file type is csv or not
    if (this.fileExtension === 'csv') {
      this.fileName = file.name;
      this.displayField = false;
      this.bulkForm.patchValue({
        bulkfile: file
      });
      this.bulkForm.get('bulkfile').updateValueAndValidity();
    } else {
      this.toastr.error('Please upload csv files.');
    }
  }

  cancel() {
    this.displayField = true;
    //reset file name
    this.fileName = '';
    this.bulkForm.get('bulkfile').setValue('');
    this.bulkForm.updateValueAndValidity();
  }
  upload() {
    this.isUploadLoaderRunning = true;
    this._spinner.show();
    const uploadpath = this.baseurl + 'file-bulk-upload/upload';
    if (this.bulkForm.get('bulkfile').value) {
      const formData: any = new FormData();
      formData.append('csv', this.bulkForm.get('bulkfile').value);
      this.http.post(uploadpath, formData).subscribe((response: any) => {
        this.getBulkUploadValidations(response.obj.fileName);
        this.fileUpload.nativeElement.value = '';
      });
    } else {
      this.isUploadLoaderRunning = false;
      this._spinner.hide();
      this.toastr.error('Please select atleast one file to upload.');
    }
  }
  getBulkUploadValidations(fileName: string) {
    this._spinner.show();
    this._apollo
      .mutate({
        mutation: schoolBulkUploadQuery,
        variables: {
          filename: fileName,
          dataCategory: 'School'
        },
      }).subscribe(() => {

        this._utilityService.sendClickEvent('school');
        this.cancel();
        this.isUploadLoaderRunning = false;
        this._spinner.hide();
        this.toastr.success('The file has been uploaded for further validations. Please check the status in the Table Below');
      }, error => {
        this.isUploadLoaderRunning = false;
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  handleClick(event) {
    if (event) {
      event.target.value = null;
      this.fileUpload.nativeElement.value = '';
    }
  }
}
