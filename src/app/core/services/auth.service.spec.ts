import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaAuthModule, OktaAuthStateService, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DashboardComponent } from 'src/app/modules/home/dashboard/dashboard.component';
import mockValues from '../constants/mock.values';
import { User } from '../model/user.model';
import { AuthService } from './auth.service';
import { UtilityService } from './utility.service';
import { environment } from 'src/environments/environment';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);
environment.OKTA_CONFIGURATION = mockValues.oktaConfig;

describe('AuthService', () => {
  let authService: AuthService,
    utilityService: UtilityService,
    oktaAuthStateService: OktaAuthStateService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent },
        ]),
        ToastrModule.forRoot(), OktaAuthModule],
      providers: [
        AuthService,
        { provide: OKTA_CONFIG, useValue: { oktaAuth }, schemas: [CUSTOM_ELEMENTS_SCHEMA] },
        ToastrService,
        NgxSpinnerService,
        UtilityService,
        OktaAuthStateService
      ]
    });
    authService = TestBed.get(AuthService);
    utilityService = TestBed.get(UtilityService);
    oktaAuthStateService = TestBed.get(OktaAuthStateService);

  });
  it('should create', () => {
    expect(authService).toBeTruthy();
  });

  it('should call sign in method', () => {
    let user = {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldmlvaXRAeW9wbWFpbC5jb20iLCJzdWIiOjYsInNjaG9vbGlkIjo0NSwiaWQiOjYsImlhdCI6MTY0MjIyNTM2NCwiZXhwIjoxNjUwODY1MzY0fQ.8vV1WzsFzkSXicmsXC4_DJq6db-1fCR7E-qKtCVnp4g",
      user: { __typename: 'SchoolAdmin', name: 'Devi', id: 6, schoolid: 45, schoolName: "test school" },
      __typename: "AdminEmailLoginResponse"
    }
    let expiryDt = (JSON.parse(atob(user['token'].split('.')[1]))).exp * 1000;
    let emailid = (JSON.parse(atob(user['token'].split('.')[1]))).email;

    authService.signIn(user);
    authService.authenticatedUser(emailid, user['name'], user['schoolid'], user['schoolName'], user['usertype'], user['token'], expiryDt);
    //let spy = spyOn(authService, 'authenticatedUser').and.callThrough();
    expect(authService.authenticatedUser).toBeDefined();
    //
  });

  xit('should call checkSoucsAdminLogin', () => {

    let userData = {
      email: "devioit@yopmail.com",
      name: "Devi",
      schoolid: 45,
      schoolName: "test school",
      usertype: "SchoolAdmin",
      _token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldmlvaXRAeW9wbWFpbC5jb20iLCJzdWIiOjYsInNjaG9vbGlkIjo0NSwiaWQiOjYsImlhdCI6MTY0MjIyNTM2NCwiZXhwIjoxNjUwODY1MzY0fQ.8vV1WzsFzkSXicmsXC4_DJq6db-1fCR7E-qKtCVnp4g",
      _tokenExpirationDate: "1970-01-20T02:34:25.364Z"
    }

    let expirationDate = new Date(new Date().getTime() + 6357737737 * 1000);
    let loggedInUser = new User(userData.email, userData.name, userData.schoolid, userData.schoolName, userData.usertype, userData._token, expirationDate);

    authService.checkSoucsAdminLogin();
    expect(loggedInUser.token).toBeTruthy();
    authService.autoSignOut(62772782);
    expect(authService.autoSignOut).toBeDefined()
    // expect()
    //expect(authService.authenticatedUser(emailid, userObj.user.name, userObj.user.schoolid, userObj.user.__typename, userObj.token, expiryDt)).toHaveBeenCalled();
  });
});
