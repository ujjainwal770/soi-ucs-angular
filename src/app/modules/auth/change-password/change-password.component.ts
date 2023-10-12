import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { changeSchoolAdminPasswordQuery } from 'src/app/core/query/auth';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { MustMatch, validatePassword } from '../../../validators/custom.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  submitted = false;
  changePasswordForm: FormGroup;
  hide = true;
  hidden = true;
  uuid: any;
  isFormSubmitted = false;
  
  constructor(
    public _router: Router,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private formBuilder: FormBuilder,
    private readonly _apollo: Apollo,
    private readonly toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, validatePassword]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  /**
   * @param name of the reactive form control
   * @returns detail of reactive form control
   */
  getFieldR(name: string) {
    return this.changePasswordForm.get(name);
  }

  /**
   * Requesting API to change password for school admin
   */
  submit() {
    if (this.changePasswordForm.valid) {
      this._spinner.show();
      let body = {
        'input': {
          'oldpassword': this.getFieldR('oldPassword').value,
          'password': this.getFieldR('newPassword').value
        }
      };

      this._apollo.mutate({
        mutation: changeSchoolAdminPasswordQuery,
        variables: body
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.isFormSubmitted = true;
        this.toastr.success('Password changed successfully');
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  /* Back to dashboard on back button click */
  goBack() {
    this._router.navigateByUrl('/dashboard');
  }
}