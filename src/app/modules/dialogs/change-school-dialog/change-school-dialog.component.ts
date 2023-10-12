/**
 * Title:  Change School Dialog Component
 * Description: This Angular component provides a dialog box for changing the current school of a user
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { getAllAssociatedSchoolsQuery } from '../../../core/query/school-management';
import { CustomErrorHandlerService } from '../../../core/services/custom-error-handler.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'app-change-school-dialog',
  templateUrl: './change-school-dialog.component.html',
  styleUrls: ['./change-school-dialog.component.scss']
})
export class ChangeSchoolDialogComponent implements OnInit {

  currentSchoolId = 0;
  schoolList = [];
  pgtitle = '';
  schoolChangeForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) private readonly data,
    public dialogRef: MatDialogRef<ChangeSchoolDialogComponent>,
    private readonly _spinner: NgxSpinnerService,
    public _localStorage: LocalStorageService,
    private readonly _apollo: Apollo,
    private readonly _errorHandler: CustomErrorHandlerService,
  ) {
    if (data) {
      this.pgtitle = data.pgtitle || this.pgtitle;
    }
  }

  ngOnInit(): void {
    this.currentSchoolId = this._localStorage.getSchoolAdminSchoolId();
    this.schoolChangeForm = new FormGroup({
      'selectedSchool': new FormControl('', [Validators.required])
    });
    this.getAllAssociatedSchools();
  }

  cancel() {
    this.dialogRef.close();
  }

  getAllAssociatedSchools() {
    this._spinner.show();
    this._apollo
      .query({
        query: getAllAssociatedSchoolsQuery,
        variables: {},
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.schoolList = data['getSameAdminSchool'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  confirm() {
    if (this.schoolChangeForm.valid) {
      const schoolId = parseFloat(this.schoolChangeForm.get('selectedSchool').value);
      this.dialogRef.close({
        schoolId
      });
    } else {
      this.schoolChangeForm.markAllAsTouched();
    }
  }
}
