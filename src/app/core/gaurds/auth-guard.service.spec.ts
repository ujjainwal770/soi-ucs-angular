import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaAuthModule, OktaAuthStateService, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { AuthComponent } from 'src/app/modules/auth/auth/auth.component';
import mockValues from '../constants/mock.values';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthGuard } from './auth-guard.service';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('AuthGuard', () => {
  let authStateService: OktaAuthStateService;
  let guard : AuthGuard;
  let routeMock: any = { snapshot: {}};
  let routeStateMock: any = { snapshot: {}, url: '/cookies'};
  let routerMock = {navigate: jasmine.createSpy('navigate')}
  let injector: TestBed;
  let locaStorageService: LocalStorageService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule.withRoutes([
          { path: 'auth/home', component: AuthComponent }
        ]),
        OktaAuthModule,
        HttpClientTestingModule
      ],
      providers:[
        LocalStorageService, 
        {provide: OKTA_CONFIG, useValue: {oktaAuth}},
        AuthGuard,
        { provide: Router, useValue: routerMock },
        LocalStorageService
      ]
    });
    injector = getTestBed();
    authStateService = injector.get(OktaAuthStateService);
    guard = injector.get(AuthGuard);
    locaStorageService = injector.get(LocalStorageService);
   // service = TestBed.inject(AuthGuard)
  });

  it('should be created', () => {
    console.log("AuthGuard --> 1");

    expect(guard).toBeTruthy();
  });

  xit('should redirect an unauthenticated user to the login route', () => {
    console.log("AuthGuard --> 2");

    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    //expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/home']);
  });

  xit('should allow the authenticated user to access app', () => {
    console.log("AuthGuard --> 3");

   // spyOn(authStateService, 'authState$').and.returnValue(true);

    // let isAuthentic = authStateService.authState$.subscribe((res) => {
    //     return res.isAuthenticated
    // })
    // expect(!isAuthentic).toEqual(true);
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
  });

  xit('checks if isLoggedIn as false', () => {
    console.log("AuthGuard --> 4");

   spyOn(locaStorageService, 'get').and.returnValue(false);
   expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
   expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/home']);
  });

  xit('checks if isLoggedIn as true', () => {
    console.log("AuthGuard --> 5");

   spyOn(locaStorageService, 'get').and.returnValue(true);
   expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
  });
  
});
