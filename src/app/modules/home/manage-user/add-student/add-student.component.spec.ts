import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { studentaddQuery } from 'src/app/core/query/manage-student';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ManageUserComponent } from '../manage-user.component';

import { AddStudentComponent } from './add-student.component';
import { throwError } from 'rxjs';

describe('AddStudentComponent', () => {
  let component: AddStudentComponent;
  let fixture: ComponentFixture<AddStudentComponent>;
  let backend: ApolloTestingController;
  let dob = new Date();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStudentComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'manage-students', component: ManageUserComponent }
        ]),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers:[HttpService, ToastrService, NgxSpinnerService, UtilityService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    dob.setFullYear(new Date().getFullYear() - 120);

    spyOn(component, 'submit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call submit() - when form is valid', () => {
    component.addStudentForm.get('firstName').setValue('Agniak');
    component.addStudentForm.get('lastName').setValue('kumaar');
    component.addStudentForm.get('email').setValue('st11s@yopmail.com');
    component.addStudentForm.get('dob').setValue(dob);
    component.addStudentForm.get('phone').setValue('5675675678');

    component.submit();
    const op = backend.expectOne(addTypenameToDocument(studentaddQuery));
    op.flush({
      "data": {
        "insertCorrectSingleUserData": {
          "full_name": "zxcxcx cxzcx",
          "email": "absssscd@yopmail.com"
        }
      }
    });
  });
  it('should call submit() - when form is invalid', () => {
    component.addStudentForm.get('firstName').setValue('');
    component.addStudentForm.get('lastName').setValue('');
    component.addStudentForm.get('email').setValue('');
    component.addStudentForm.get('dob').setValue(dob);
    component.addStudentForm.get('phone').setValue('');
    component.submit();
    component.addStudentForm.markAllAsTouched();
  });
  it('test_error_is_handled_correctly submit', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.addStudentForm.get('firstName').setValue('Agniak');
    component.addStudentForm.get('lastName').setValue('kumaar');
    component.addStudentForm.get('email').setValue('st11s@yopmail.com');
    component.addStudentForm.get('dob').setValue(dob);
    component.addStudentForm.get('phone').setValue('5675675678');
    component.submit();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});


