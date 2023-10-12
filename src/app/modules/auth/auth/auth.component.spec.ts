import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { environment } from 'src/environments/environment';
import { SoucsDashboardComponent } from '../../home/dashboard/soucs-dashboard/soucs-dashboard.component';
import { AuthComponent } from './auth.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);
environment.OKTA_CONFIGURATION = mockValues.oktaConfig;

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let _dialogService: DialogsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [
        RouterTestingModule,
        OktaAuthModule,
        MatDialogModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: SoucsDashboardComponent }
        ]),
      ],
      providers: [NgxSpinnerService, ToastrService, AuthService,
        {
          provide: DialogsService,
          userValue: ""
        },
        {
          provide: OKTA_CONFIG,
          useValue: { oktaAuth }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    _dialogService = TestBed.inject(DialogsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should login', fakeAsync(() => {
    component.login();
    spyOn(component, 'login').and.callFake(oktaAuth.signInWithRedirect);
    expect(component.login).toBeTruthy();
    flush();
  }));
});
