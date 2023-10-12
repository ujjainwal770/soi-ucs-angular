import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { getStudentDetailsByIdQuery, updateStudentDetailsQuery } from '../../../../core/query/manage-student';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { ManageUserComponent } from '../manage-user.component';
import { _CONST } from '../../../../core/constants/app.constants';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {

  selectedStudentUserId: string;
  studentDetails: any;
  editStudentForm: FormGroup;
  // Minimum 13 years old allowed as DOB
  minYearOld: Date = new Date();
  maxDate: Date = new Date();
  ConvertToLocalDate = new ConvertToLocalDatePipe()

  @ViewChild(ManageUserComponent) manageUserCompData;
  constructor(
    private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _router: Router,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _activateRouter: ActivatedRoute  ) { }

  ngOnInit(): void {
    this.minYearOld.setFullYear(new Date().getFullYear() - _CONST.maxAge);
    this.maxDate.setFullYear(new Date().getFullYear());
    this._activateRouter.params.subscribe(params => {
      this.selectedStudentUserId = params.id;
      this.getUserDetailsById();
      this.initForm();
    });
  }

  initForm() {
    this.editStudentForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required, Validators.pattern('.*\\S.*')]),
      'lastName': new FormControl('', [Validators.required, Validators.pattern('.*\\S.*')]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'dob': new FormControl('', [Validators.required]),
      'phoneNumber': new FormControl('', []),
      'isSendInvite': new FormControl(false, [Validators.required]),
    });
  }

  getUserDetailsById() {
    const inputVariables = {
      user_id: parseFloat(this.selectedStudentUserId)
    };
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: getStudentDetailsByIdQuery,
        variables: inputVariables,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.studentDetails = data['getPreapprovedStudentDetails'];
        this.getFieldR('firstName').setValue(this.studentDetails?.first_name);
        this.getFieldR('lastName').setValue(this.studentDetails.last_name);
        this.getFieldR('email').setValue(this.studentDetails?.email);
        this.getFieldR('dob').setValue(new Date(this.ConvertToLocalDate.transform(this.studentDetails?.date_of_birth)));
        this.getFieldR('phoneNumber').setValue(this.studentDetails?.phone);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * @param name of the reactive form control
   * @returns detail of reactive form control
   */
  getFieldR(name: string) {
    return this.editStudentForm.get(name);
  }

  getTimestamp(date) {
    return new Date(date).setHours(0, 0, 0, 0) + (((new Date().getTimezoneOffset()) * (1000 * 60)) * -1)
  }

  updateStudentDetails() {
    if (this.editStudentForm.valid) {
      const inputVariables = {
        user_id: parseFloat(this.selectedStudentUserId),
        fname: this.editStudentForm.value.firstName,
        lname: this.editStudentForm.value.lastName,
        email: this.editStudentForm.value.email,
        dob: this.getTimestamp(this.editStudentForm.value.dob),
        mobile_no: this.editStudentForm.value.phoneNumber,
        send_invite: this.editStudentForm.value.isSendInvite ? 'yes' : 'no'
      };

      this._spinner.show();
      this._apollo.mutate({
        mutation: updateStudentDetailsQuery,
        variables: inputVariables
      }).subscribe(() => {
        this._toastr.success('User detail has been updated successfully');
        this.goBack();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.editStudentForm.markAllAsTouched();
    }
  }

  goBack() {
    this.initForm();
    this._router.navigateByUrl('/manage-students');
  }
}
