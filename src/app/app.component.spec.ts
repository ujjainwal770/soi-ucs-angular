import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppComponent } from './app.component';
import mockValues from './core/constants/mock.values';
import { AuthService } from './core/services/auth.service';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService : AuthService;  
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        OktaAuthModule,
      ],
      providers:[ToastrService,AuthService,
        {provide: OKTA_CONFIG, useValue: {oktaAuth}}
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    console.log("AppComponent --> 1");

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  xit('should create the app', () => {
    console.log("AppComponent --> 2");

    expect(component).toBeTruthy();
  });

  xit('should check for octa user', () => {
    console.log("AppComponent --> 3");

    let token = spyOn(localStorage, 'getItem').and.returnValue('okta-token-storage');
    expect(token).toBeDefined();
    expect(authService.checkOctaAdminLogin).toHaveBeenCalled();
  });

  xit('should check for school user', () => {
    console.log("AppComponent --> 4");

    let token = spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(token).toBeFalsy();
    expect(authService.checkSoucsAdminLogin).toHaveBeenCalled();
  });

  xit(`should have as title 'soucs'`, () => {
    console.log("AppComponent --> 5");

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('soucs');
  });
});
