import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { HttpService } from '../../../core/services/http.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SharedService } from 'src/app/core/services/shared.service';


interface userData {
  email: string,
  password: string
}

const loginQuery = gql`
query($email:String!,$password:String!) {
  emailLoginSchoolAdmin(emailLoginInput:{
    email:$email,
    password:$password
  }) {
    user{
      name,id,schoolid
    },
    token
  }
}`;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent implements OnInit {
  submitted = false;
  hide = true;
  form: FormGroup;
  user: Observable<userData[]>;
  constructor(public router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _localStorgeService: LocalStorageService,
    private readonly _sharedService: SharedService,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this._authService.autoLoginIn();
    this._sharedService.schoolAdminDetails = null;
    let rememberMe = this._localStorgeService.get('rememberMe') ? this._localStorgeService.get('rememberMe') : false;
    let email = this._localStorgeService.get('email') ? this._localStorgeService.decryptData(this._localStorgeService.get('email')) : '';
    let password = this._localStorgeService.get('password') ? this._localStorgeService.decryptData(this._localStorgeService.get('password')) : '';
    this.form = new FormGroup({
      email: new FormControl(email, [Validators.required, Validators.email]),
      password: new FormControl(password, Validators.required),
      rememberMe: new FormControl(rememberMe)
    });

    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        let element: HTMLElement = document.getElementById('login-btn') as HTMLElement;
        element.click();
        this.submit(e);
      }
    })
  }

  getFieldR(name: string) {
    return this.form.get(name);
  }

  submit(e) {
    e.preventDefault();
    let octaCache = this._localStorgeService.get('okta-cache-storage');
    let octaToken = this._localStorgeService.get('okta-token-storage');
    if (octaCache) this._localStorgeService.remove('okta-cache-storage');
    if (octaToken) this._localStorgeService.remove('okta-token-storage');
    this.submitted = true;
    if (this.form.valid) {
      this._spinner.show();
      this._apollo
        .query({
          query: loginQuery,
          variables: {
            email: this.form.value.email,
            password: this.form.value.password
          },
          fetchPolicy: 'no-cache'
        }).subscribe(({ data }) => {
          this._spinner.hide();
          if (this.form.value.rememberMe) {
            this._authService.signIn(data['emailLoginSchoolAdmin']);

            this._localStorgeService.set('email', this._localStorgeService.encryptData(this.form.value.email));
            this._localStorgeService.set('password', this._localStorgeService.encryptData(this.form.value.password));
            this._localStorgeService.set('rememberMe', this.form.value.rememberMe);
          } else {
            this._localStorgeService.remove('email');
            this._localStorgeService.remove('password');
            this._localStorgeService.remove('rememberMe');
          }
          this._authService.signIn(data['emailLoginSchoolAdmin']);
          //this._localStorgeService.set('accesstoken', data['emailLoginSchoolAdmin']['token']);
          // this._localStorgeService.set('adminType', 'school_admin')
          this.router.navigateByUrl('/dashboard');
        }, error => {
          this._spinner.hide();
          this._errorHandler.manageError(error, true);
        });
    }
  }
  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.submit(e);
    }
  }
}
