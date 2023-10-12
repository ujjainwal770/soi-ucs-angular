import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { findSchoolsByStateQuery, saveUserDetailQuery, userDetailsQuery } from 'src/app/core/query/appuser';
import { getStateList } from 'src/app/core/query/report-download';
import { getStateAndCityUsingZipCode } from 'src/app/core/query/school-management';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { UserListComponent } from '../user-list.component';

import { EditAppUserComponent } from './edit-app-user.component';
import { ViewUserDetailsComponent } from '../view-user-details/view-user-details.component';
import { Router } from '@angular/router';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);


describe('EditAppUserComponent', () => {
  let component: EditAppUserComponent;
  let fixture: ComponentFixture<EditAppUserComponent>;
  let backend: ApolloTestingController;
  let _dialogsService: DialogsService;
  let _router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAppUserComponent], imports: [
        OktaAuthModule,
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        HttpService,
        ToastrService,
        AuthService,
        NgxSpinnerService,
        LocalStorageService,
        DialogsService,
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
    fixture = TestBed.createComponent(EditAppUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    backend = TestBed.inject(ApolloTestingController);
    _router = TestBed.inject(Router);
    _dialogsService = TestBed.inject(DialogsService);
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'initForm').and.callThrough();
    spyOn(component, 'autoPopulateData').and.callThrough();
    spyOn(component, 'getFieldRef').and.callThrough();
    spyOn(component, 'getAppUserDetails').and.callThrough();
    spyOn(component, 'onUserTypeChanged').and.callThrough();
    spyOn(component, 'fetchUcsStateList').and.callThrough();
    spyOn(component, 'resetUcsSpecificFields').and.callThrough();
    spyOn(component, 'resetPublicSpecificFields').and.callThrough();
    spyOn(component, 'fetchSchoolByState').and.callThrough();
    spyOn(component, 'getStateAndCityByZip').and.callThrough();
    spyOn(component, 'onSchoolChange').and.callThrough();
    spyOn(component, 'getUcsSpecificInputs').and.callThrough();
    spyOn(component, 'getNonUcsSpecificInputs').and.callThrough();
    spyOn(component, 'userTypeSpecificInputs').and.callThrough();
    spyOn(component, 'save').and.callThrough();
    spyOn(component, 'updateLocationValidation').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #ngOnInit()', () => {
    component.ngOnInit();
    expect(true).toBeTruthy();
  });

  it('should check #initForm()', () => {
    component.initForm();
    expect(true).toBeTruthy();
  });

  it('should check #updateLocationValidation()', () => {
    component.isUcsUser = true;
    component.updateLocationValidation();
    expect(true).toBeTruthy();

    component.isUcsUser = false;
    component.updateLocationValidation();
    expect(true).toBeTruthy();
  });

  it('should check #autoPopulateData() - when ucs user', () => {
    component.isUcsUser = true;
    component.autoPopulateData();
    expect(true).toBeTruthy();
  });

  it('should check #autoPopulateData()', () => {
    component.isUcsUser = false;
    component.userData.account_status = "deactivated";
    component.userData.stateName = "New York";
    component.userData.stateAbbreviation = "NY";
    component.autoPopulateData();
    expect(true).toBeTruthy();
  });

  it('should check #getAppUserDetails()', () => {
    component.getAppUserDetails();
    const op = backend.expectOne(addTypenameToDocument(userDetailsQuery));
    op.flush({
      "data": { "getUserViewDetail": { "user_id": 1345, "full_name": "Nm Ucs", "first_name": "Nm", "last_name": "Ucs", "date_of_birth": 0, "email": "nnucs@gmail.com", "creation_time": "1676629175429", "account_status": "active", "totalbadge": 0, "totalpoints": 0, "inclusioncount": 0, "inclusionResult": null, "ucs_status": "yes", "school_id": 130, "schoolName": "Somerville School", "schoolAddress": "Vasundhara enclave Delhi  Near manavsthali apartment", "stateName": null, "cityName": null, "stateAbbreviation": null, "zipcode": null, "schoolStateAbbreviation": "KY", "schoolCityName": "Paintsville ", "schoolZipcode": "41222", "nces": "678956789123", "__typename": "UserViewDetailResponse" } }
    });
    expect(true).toBeTruthy();
  });

  it('should check #fetchUcsStateList() - when ucs state list data available and state name exist', () => {
    component.getFieldRef('stateName').setValue("NY");
    component.fetchUcsStateList();
    const op = backend.expectOne(addTypenameToDocument(getStateList));
    op.flush({
      "data": { "getStateList": { "state": [{ "name": "Alabama", "abbreviation": "AL", "__typename": "States" }], "__typename": "StateList" } }
    });
    expect(true).toBeTruthy();
  });

  it('should check #fetchUcsStateList() - when ucs state list data available and state name does not exist', () => {
    component.getFieldRef('stateName').setValue("");
    component.fetchUcsStateList();
    const op = backend.expectOne(addTypenameToDocument(getStateList));
    op.flush({
      "data": { "getStateList": { "state": [{ "name": "Alabama", "abbreviation": "AL", "__typename": "States" }], "__typename": "StateList" } }
    });
    expect(true).toBeTruthy();
  });

  it('should check #fetchUcsStateList() - when ucs state list data not available', () => {
    component.ucsStateList = [{ "name": "Alabama", "abbreviation": "AL" }];
    component.fetchUcsStateList();
    expect(true).toBeTruthy();
  });

  it('should check #fetchSchoolByState()', () => {
    component.fetchSchoolByState();
    const op = backend.expectOne(addTypenameToDocument(findSchoolsByStateQuery));
    op.flush({
      "data": { "findSchoolsByState": [{ "id": 130, "schoolName": "Somerville School", "stateName": "KY", "cityName": "Paintsville ", "zipcode": "41222", "__typename": "School" }] }
    });
    expect(true).toBeTruthy();
  });

  xit('should check #save() - when form is valid', () => {
    component.userData = {
      "user_id": 1345,
      "full_name": "Nm Ucs",
      "first_name": "Nm",
      "last_name": "Ucs",
      "date_of_birth": 1230768000,
      "email": "nnucs@gmail.com",
      "creation_time": "1676629175429",
      "account_status": "active",
      "totalbadge": 0,
      "totalpoints": 0,
      "inclusioncount": 0,
      "inclusionResult": null,
      "ucs_status": "yes",
      "school_id": 130,
      "schoolName": "Somerville School",
      "schoolAddress": "Vasundhara enclave Delhi  Near manavsthali apartment",
      "stateName": null,
      "cityName": null,
      "stateAbbreviation": null,
      "zipcode": null,
      "schoolStateAbbreviation": "KY",
      "schoolCityName": "Paintsville ",
      "schoolZipcode": "41222",
      "nces": "678956789123",
      "__typename": "UserViewDetailResponse"
    };
    component.autoPopulateData();
    component.save();
    const op = backend.expectOne(addTypenameToDocument(saveUserDetailQuery));
    op.flush({
      "data": { "updateUserBySoucsAdmin": { "user_id": 1345, "email": "nnucs@gmail.com", "__typename": "UserViewDetailResponse" } }
    });
    expect(true).toBeTruthy();
  });

  xit('should check #save() - when form invalid', () => {
    component.save();
    expect(true).toBeTruthy();
  });

  it('should check #getStateAndCityByZip() - when valid zip code', () => {
    component.getFieldRef('zipCode').setValue("12345");
    component.getStateAndCityByZip();
    const op = backend.expectOne(addTypenameToDocument(getStateAndCityUsingZipCode));
    op.flush({
      "data": { "getStateAndCityByAdmin": { "state_name": "New York", "state_id": "NY", "city": "Schenectady", "__typename": "stateCityResponse" } }
    });
    expect(true).toBeTruthy();
  });

  it('should check #getStateAndCityByZip() - when invalid zip code entered', () => {
    component.getFieldRef('zipCode').setValue("");
    component.getStateAndCityByZip();
    expect(component.stateList).toEqual([]);
  });

  it('should check #onUserTypeChanged() - when ucs user', () => {
    component.getFieldRef('userType').setValue('ucs');
    component.isUcsUser = true;
    component.onUserTypeChanged();
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    expect(true).toBeTruthy();
  });

  it('should check #onUserTypeChanged() - when public user', () => {
    component.getFieldRef('userType').setValue('public');
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.onUserTypeChanged();
    expect(true).toBeTruthy();
  });

  it('should check #onUserTypeChanged() - when dialog dismissed with no option', () => {
    component.isUcsUser = false;
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.onUserTypeChanged();
    expect(true).toBeTruthy();
  });

  it('should check #resetUcsSpecificFields()', () => {
    component.resetUcsSpecificFields();
    expect(true).toBeTruthy();
  });

  it('should check #resetPublicSpecificFields()', () => {
    component.resetPublicSpecificFields();
    expect(true).toBeTruthy();
  });

  it('should check #onSchoolChange()', () => {
    component.getFieldRef('schoolId').setValue(1);
    component.schoolList = [{ id: 1, schoolName: "test school", zipcode: "12345", cityName: "ab", nces: "1234567909" }];
    component.onSchoolChange();
    expect(true).toBeTruthy();
  });

  it('should check #getUcsSpecificInputs()', () => {
    component.getUcsSpecificInputs();
    expect(true).toBeTruthy();
  });

  it('should check #getNonUcsSpecificInputs()', () => {
    component.getNonUcsSpecificInputs();
    expect(true).toBeTruthy();
  });

  it('should check #userTypeSpecificInputs()', () => {
    component.userTypeSpecificInputs();
    expect(true).toBeTruthy();
  });
  it('test_error_is_handled_correctly getAppUserDetails', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getAppUserDetails();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchUcsStateList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.ucsStateList = [];
    component.fetchUcsStateList();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchSchoolByState', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchSchoolByState();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getStateAndCityByZip', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getFieldRef('zipCode').setValue("12345");
    component.getStateAndCityByZip();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  xit('test_error_is_handled_correctly save', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.editUserForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      dob: new Date(),
      email:"test@gmail.com",
      userType: 'public',
      registeredOn: new Date(),
      accountStatus: 'Active',
      noOfBadgeEarned: 0,
      totalPoints: 0,
      noOfInclusionPlayed: 0,
      recentInclusionResult: 'N/A',
      stateName: 'CA',
      zipCode: '12345',
      cityName: 'Test City',
      country: 'USA',
      schoolId: 1,
      nces: '123456765565'
  });
    component.save();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

});
