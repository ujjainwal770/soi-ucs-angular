import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forgotPasswordVerificationLinkQuery } from 'src/app/core/query/auth';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
  });
  isFormSubmitted: boolean;
  constructor(
    public router: Router,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {
  }

  getFieldR(name: string) {
    return this.forgotPasswordForm.get(name);
  }

  login() {
    this.router.navigateByUrl('/auth/login');
  }

  /**
   *  Requesting API to change password for school admin
   */
  submit() {
    if (this.forgotPasswordForm.valid) {
      this._spinner.show();
      let body = {
        'input': {
          'email': this.getFieldR('username').value
        }
      };

      this._apollo.mutate({
        mutation: forgotPasswordVerificationLinkQuery,
        variables: body
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.isFormSubmitted = true;
        this.toastr.success('A verification link has been sent to your email account.');
        this.router.navigateByUrl('/auth/reset-password');
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
