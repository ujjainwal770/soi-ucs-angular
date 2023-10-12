import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { getStudentDetailsByIdQuery, updateStudentDetailsQuery } from 'src/app/core/query/manage-student';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ManageUserComponent } from '../manage-user.component';
import { EditStudentComponent } from './edit-student.component';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('EditStudentComponent', () => {
  let component: EditStudentComponent;
  let fixture: ComponentFixture<EditStudentComponent>;
  let backend: ApolloTestingController;
  let router: Router;
  let dob = new Date();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditStudentComponent,ConvertToLocalDatePipe],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'manage-students', component: ManageUserComponent },
          { path: 'dashboard', component: DashboardComponent }
        ]),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService, AuthService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);
    dob.setFullYear(new Date().getFullYear() - 120);

    spyOn(component,'initForm').and.callThrough();
    spyOn(component, 'getUserDetailsById').and.callThrough();
    spyOn(component, 'getFieldR').and.callThrough();
    spyOn(component, 'getTimestamp').and.callThrough();
    spyOn(component, 'goBack').and.callThrough();
  });

  it('should create', () => {
    console.log(`EditStudentComponent -> first test case`);


    expect(component).toBeTruthy();
  });
  
  it('should call getTimestamp()', () => {
    console.log(`EditStudentComponent -> getTimestamp() -> 1`);

    let date = new Date();
    let timestamp = component.getTimestamp(date);
    expect(new Date(date).setHours(0, 0, 0, 0) + (((new Date().getTimezoneOffset()) * (1000 * 60)) * -1)).toBe(timestamp);
  });
  
  it('should call goBack()', () => {
    console.log(`EditStudentComponent -> goBack() -> 1`);

    const spy = spyOn(router, 'navigateByUrl');
    component.goBack();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/manage-students');
  });

  it('should call getUserDetailsById()', () => {
    console.log(`EditStudentComponent -> getUserDetailsById() -> 1`);

    component.getUserDetailsById();
    const op = backend.expectOne(addTypenameToDocument(getStudentDetailsByIdQuery));
    op.flush({
      "data":{"getPreapprovedStudentDetails":{"user_id":368,"first_name":"Agnik","last_name":"dlk","email":"ddd22s@yopmail.com","date_of_birth":820368000000,"phone":"2222222223","__typename":"User"}}
    });
  });

  it('should call updateStudentDetails() - when form is valid', () => {
    console.log(`EditStudentComponent -> updateStudentDetails() -> 1`);

    component.editStudentForm.get('firstName').setValue('Agnik');
    component.editStudentForm.get('lastName').setValue('kumar');
    component.editStudentForm.get('email').setValue('ddd22s@yopmail.com');
    component.editStudentForm.get('dob').setValue(dob);
    component.editStudentForm.get('phoneNumber').setValue('8888888888');

    component.updateStudentDetails();
    const op = backend.expectOne(addTypenameToDocument(updateStudentDetailsQuery));
    op.flush({
      "data":{"updatePreapprovedStudentDetails":{"full_name":"Agnik kumar","email":"ddd22s@yopmail.com","__typename":"User"}}
    });
  });

  it('should call updateStudentDetails() - when form is invalid', () => {
    console.log(`EditStudentComponent -> updateStudentDetails() -> 2`);

    component.editStudentForm.get('firstName').setValue('');
    component.editStudentForm.get('lastName').setValue('');
    component.editStudentForm.get('email').setValue('');
    component.editStudentForm.get('dob').setValue(dob);
    component.editStudentForm.get('phoneNumber').setValue('');
    component.updateStudentDetails();
    component.editStudentForm.markAllAsTouched();
  });
});
