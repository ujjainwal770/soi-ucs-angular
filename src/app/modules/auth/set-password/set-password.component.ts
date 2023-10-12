import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from '../../../core/services/custom-error-handler.service';
import { MustMatch, validatePassword } from '../../../validators/custom.validator';


const setPasswordData = gql`
  mutation SetSchoolAdminPassword(
    $password: String!,   
    $verification: String!,   
  ) {
    SetSchoolAdminPassword(setSchoolAdminPasswordInput: {
      password: $password,   
      verification: $verification,   
    }) {
      id,
    }
  }
`;
const checkVerification = gql`
query($verification:String!){
  findSchoolAdminByVerification(verification:$verification){
    id
  }
} 
`;



@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  submitted = false;
  form: FormGroup;
  hide = true;
  hidden = true;
  displayForm = true;
  isPasswordChanged = false;
  uuid: any;
  @Input('title') title : string;

  constructor(public router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly _activateRouter: ActivatedRoute,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {
    this.createForm();
    this._activateRouter.params.subscribe(params => {
      this.uuid = params.uuid;
    });
    this.checkLinkExpired();
  }
  createForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, validatePassword]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  getFieldR(name: string) {
    return this.form.get(name);
  }

  submit() {
    if (this.form.valid) {
      this._spinner.show();
      let body = {
        'password': this.getFieldR('password').value,
        'verification': this.uuid
      }
      this._apollo.mutate({
        mutation: setPasswordData,
        variables: body
      }).subscribe(({ data }) => {

        this._spinner.hide();
        this.toastr.success('Password Updated successfully');
        this.displayForm = false;
        this.isPasswordChanged = true;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  login() {
    this.router.navigateByUrl('/auth/login');
  }

  checkLinkExpired() {
    this._apollo
      .query({
        query: checkVerification,
        variables: {
          verification: this.uuid
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.displayForm = true;
      }, error => {
        this.displayForm = false;
        this._errorHandler.manageError(error);
      });
  }

}
