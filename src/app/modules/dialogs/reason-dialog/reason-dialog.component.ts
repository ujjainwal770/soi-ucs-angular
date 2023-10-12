import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from '../../../core/services/custom-error-handler.service';
import { removeSpaces } from '../../../../app/validators/custom.validator';
const updateSchoolStatusQuery = gql`
  mutation updateSchoolStatus(
    $id: Float!,
    $status: String!,
    $deactivateReason:String!
  ) {
    updateSchoolStatus(updateSchoolStatusInput: {
      id: $id,
      status: $status, 
      deactivateReason: $deactivateReason  
    }) {
      id,
      status,
      deactivateReason
    }
  }
`;
@Component({
  selector: 'app-reason-dialog',
  templateUrl: './reason-dialog.component.html',
  styleUrls: ['./reason-dialog.component.scss']
})
export class ReasonDialogComponent implements OnInit {
  reasonForm: FormGroup;
  pgtitle = '';
  message = '';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';
  categoryId: any;
  reviewParm: any = {};

  constructor(
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReasonDialogComponent>,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly toastr: ToastrService,
    private readonly _router: Router,
  ) { }

  cancel() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    // Define a constant for the maximum reason length
    const MAX_REASON_LENGTH = 200;
    this.reasonForm = this.formBuilder.group({
      'reason': new FormControl(null, [Validators.required, removeSpaces, Validators.maxLength(MAX_REASON_LENGTH)]),
      'schoolId': new FormControl(this.reviewParm.schoolId ? this.reviewParm.schoolId : ''),
      'status': new FormControl('inactive')
    });
  }
  getFieldRef(field: string) {
    return this.reasonForm.get(field);
  }
  submit() {
    if (this.reasonForm.valid) {
      this._spinner.show();
      this._apollo.mutate({
        mutation: updateSchoolStatusQuery,
        variables: {
          id: this.reviewParm.schoolId,
          status: this.reasonForm.get('status').value,
          deactivateReason: this.reasonForm.get('reason').value
        }
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.toastr.success('School status changed successfully');
        this.dialogRef.close({ data: 'data' });
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
  }

}
