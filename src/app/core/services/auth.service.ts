import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';
import { LocalStorageService } from './local-storage.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  oktaAuth: OktaAuth;
  user = new BehaviorSubject<any>(null);
  tokenExpirationTimer: any;
  constructor(private readonly _router: Router,
    private readonly _toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private readonly _utilityService: UtilityService,
    private readonly _localStorage: LocalStorageService,
    public authStateService: OktaAuthStateService
  ) {
    this.oktaAuth = new OktaAuth(environment.OKTA_CONFIGURATION);
  }


  // School Admin login
  signIn(user: Object) {
    const { name, schoolid, __typename: usertype } = user['user'];
    let expireDt = (JSON.parse(atob(user['token'].split('.')[1]))).exp * 1000;
    let emailid = (JSON.parse(atob(user['token'].split('.')[1]))).email;
    let schoolName = (JSON.parse(atob(user['token'].split('.')[1]))).schoolName;
    this.authenticatedUser(emailid, name, schoolid, schoolName, usertype, user['token'], expireDt);
  }

  checkSoucsAdminLogin() {
    const userData = JSON.parse(localStorage.getItem('UserData'));
    if (!userData) {
      return;
    }
    const expirationDate = new Date(new Date().getTime() + userData._tokenExpirationDate * 1000);
    const loggedInUser = new User(userData.email, userData.name, userData.schoolid, userData.schoolName, userData.usertype, userData._token, expirationDate);
    if (loggedInUser.token) {
      this.user.next(loggedInUser);
      this._utilityService.routeReuseUrl();
      // this._router.navigate(['/dashboard']);
      const expirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expirationTime);
    }
  }

  checkOctaAdminLogin() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._utilityService.routeReuseUrl();
    //   console.log(url);
    //   this._router.navigateByUrl(url);
    // })
  }

  autoLoginIn() {
    const userData = localStorage.getItem('UserData');
    this.authStateService.authState$.subscribe((response) => {
      if (response.isAuthenticated && localStorage.getItem('okta-token-storage')) {
        this._router.navigateByUrl('/dashboard');
        this._toastr.success('Welcome back Soucs Admin!! <br> Your session still alive', '', { enableHtml: true });
      }
    });
    if (userData) {
      this._router.navigateByUrl('/dashboard');
      this._toastr.success('Welcome back School Admin!! <br> Your session still alive', '', { enableHtml: true });
    }
  }

  public authenticatedUser(email: string, name: string, schoolId: number, schoolName: string, typeName: string, token: string, expirein: number) {
    const expirationDate = new Date(expirein / 1000);
    const expiresIn = (expirationDate.getTime() / 1000);
    const expiresTime = (parseInt(expiresIn.toString()));
    const user = new User(email, name, schoolId, schoolName, typeName, token, expirationDate);
    this.user.next(user);
    this.autoSignOut(expiresTime);
    localStorage.setItem('UserData', JSON.stringify(user));
  }

  autoSignOut(expirationDuration: number) {
    this.tokenExpirationTimer = setInterval(() => {
      this.schoolAdminLogout();
    }, expirationDuration);
    clearInterval(this.tokenExpirationTimer);
  }

  schoolAdminLogout() {
    this.user.next(null);
    localStorage.removeItem('UserData');
    this.spinner.hide();
    this._toastr.success('Logged out successfully');
    this._router.navigate(['auth/home']);
  }

  soucsAdminLogout() {
    let octaCache = localStorage.getItem('okta-cache-storage');
    let octaToken = localStorage.getItem('okta-token-storage');
    if (octaCache) localStorage.removeItem('okta-cache-storage');
    if (octaToken) localStorage.removeItem('okta-token-storage');
    this.oktaAuth.signOut();
  }

  logout() {
    let isSchoolAdmin = this._localStorage.isSchoolAdmin();
    if (isSchoolAdmin) {
      this.schoolAdminLogout();
    } else {
      this.soucsAdminLogout();
    }
  }

}
