import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { forgotPasswordVerificationLinkQuery } from 'src/app/core/query/auth';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardComponent } from '../../home/dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { ForgotPasswordComponent } from './forgot-password.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let router: Router;
  let backend: ApolloTestingController;

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        ApolloTestingModule,
        OktaAuthModule,
        RouterTestingModule.withRoutes([
          { path: 'auth/login', component: LoginComponent },
          { path: 'auth/reset-password', component: LoginComponent },
          { path: 'dashboard', component: DashboardComponent}
        ])
      ],
      providers: [ToastrService, 
        {provide: OKTA_CONFIG, useValue: {oktaAuth}},
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    backend = TestBed.get(ApolloTestingController);

    spyOn(component, 'login').and.callThrough();
    spyOn(component, 'submit').and.callThrough();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should call submit() - test when the form is valid", () => {
    component.forgotPasswordForm.get('username').setValue('test_mail@mail.com');
    component.submit();
    const op = backend.expectOne(addTypenameToDocument(forgotPasswordVerificationLinkQuery));
    op.flush({"data":{"generateForgotPasswordVerificationLink":{"email":"test_mail@mail.com","__typename":"SchoolAdmin"}}});
    spyOn(router, 'navigateByUrl').and.callThrough();
    expect(router.navigateByUrl).toBeDefined();
  });

  it("should call submit() - test when the form is invalid", () => {
    component.forgotPasswordForm.get('username').setValue('');
    component.submit();
    component.forgotPasswordForm.markAllAsTouched();
  });

  it('should call login', () => {
    const spy = spyOn(router, 'navigateByUrl');
    component.login();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/auth/login');
  });
});
