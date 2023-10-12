import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { studentaddQuery } from '../../../../core/query/manage-student';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { _CONST } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  addStudentForm: FormGroup;
  // Minimum 13 years old allowed as DOB
  minYearOld:Date = new Date();
  // Maximum 120 years old allowed as DOB
  maxDate: Date = new Date();
  constructor(private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,) { }

  ngOnInit(): void {
    this.minYearOld.setFullYear(new Date().getFullYear() - _CONST.maxAge);
    this.maxDate.setFullYear(new Date().getFullYear());
    this.addStudentForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'dob': new FormControl('', [Validators.required]),
      'phone': new FormControl('', []),
    });
  }
  getFieldR(name: string) {
    return this.addStudentForm.get(name);
  }

  submit() {
    if (this.addStudentForm.valid) {
      this._spinner.show();
      this._apollo.mutate({
        mutation: studentaddQuery,
        variables: {
          firstName: this.addStudentForm.value.firstName,
          lastName: this.addStudentForm.value.lastName,
          email: this.addStudentForm.value.email,
          dob: moment(new Date(this.addStudentForm.value.dob)).format('MM/DD/YYYY').toString(),
          phone: this.addStudentForm.value.phone,
        }
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this._toastr.success('Created successfully');
        this._router.navigateByUrl('/manage-students');
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.addStudentForm.markAllAsTouched();
    }
  }


}
