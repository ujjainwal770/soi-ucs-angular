import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { changeSchoolAdminPasswordQuery } from 'src/app/core/query/auth';
import { AuthService } from 'src/app/core/services/auth.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardComponent } from '../../home/dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let router: Router;
  let authService: AuthService;
  let backend: ApolloTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        ApolloTestingModule,
        OktaAuthModule,
        PopoverModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent }
        ])
      ],
      providers: [ToastrService, AuthService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'goBack').and.callThrough();
    spyOn(component, 'submit').and.callThrough();
    router = TestBed.inject(Router);
    backend = TestBed.get(ApolloTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("Should call submit() - test when the form is valid", () => {
    component.changePasswordForm.get('oldPassword').setValue('Welcome@1111');
    component.changePasswordForm.get('newPassword').setValue('Welcome@1234');
    component.changePasswordForm.get('confirmPassword').setValue('Welcome@1234');

    component.submit();
    const op = backend.expectOne(addTypenameToDocument(changeSchoolAdminPasswordQuery));
    op.flush({
      "data": { "ChangeSchoolAdminPassword": { "schoolid": 95, "name": "sssss284", "email": "test_mail@mail.com" } }
    })
    backend.verify()
    expect(backend).toBeDefined();
  });
  
  it("Should call submit() - test when the form is invalid", () => {
    component.changePasswordForm.get('oldPassword').setValue('');
    component.changePasswordForm.get('newPassword').setValue('');
    component.changePasswordForm.get('confirmPassword').setValue
    component.submit();
    component.changePasswordForm.markAllAsTouched();
  });

  it('should call goBack', () => {
    const spy = spyOn(router, 'navigateByUrl');
    component.goBack();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/dashboard');
  });
});
