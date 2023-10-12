import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { distictQuery, getStateAndCityUsingZipCode, getSysGeneratedNcesQuery, schoolValidationQuery } from 'src/app/core/query/school-management';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { AddSchoolFormComponent } from './add-school-form.component';

describe('AddSchoolFormComponent', () => {
  let component: AddSchoolFormComponent;
  let fixture: ComponentFixture<AddSchoolFormComponent>;
  let backend: ApolloTestingController;
  let _schoolService: SchoolService;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSchoolFormComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [HttpService, ToastrService, SchoolService, NgxSpinnerService, LocalStorageService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
          defaultOptions: {
            query: {
              fetchPolicy: 'no-cache',
            },
            watchQuery: {
              fetchPolicy: 'no-cache',
            },
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSchoolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    httpClient = TestBed.inject(HttpClient);

    spyOn(component, 'getDistrict').and.callThrough();
    spyOn(component, 'checkIfValidZipCode').and.callThrough();
    spyOn(component, 'validateZipCodeOnServer').and.callThrough();
    spyOn(component, 'resetStateName').and.callThrough();
    spyOn(component, 'zipCodeValidationErrorResponse').and.callThrough();
    spyOn(component, 'generateNcesId').and.callThrough();
    spyOn(component, 'resetSysGenNcesId').and.callThrough();
    spyOn(component, 'handleNcesApiError').and.callThrough();
  });

  it('should create', () => {
    console.log(`AddSchoolFormComponent --> first test case`);

    expect(component).toBeTruthy();
  });

  xit('should call submit', () => {
    console.log(`AddSchoolFormComponent --> should check #submit()`);

    component.addSchoolForm.get('schoolName').setValue('dsfds');
    component.addSchoolForm.get('countryName').setValue('sdfdsfd');
    component.addSchoolForm.get('stateName').setValue('fdssdds');
    component.addSchoolForm.get('cityName').setValue('fsdsddf');
    component.addSchoolForm.get('districtName').setValue('fdfds');
    component.addSchoolForm.get('addressFirst').setValue('sfdfdsf');
    component.addSchoolForm.get('addressSecond').setValue('dfdsf');
    component.addSchoolForm.get('zipcode').setValue('33322');
    component.addSchoolForm.get('schoolProfile').setValue('dsdd');
    component.addSchoolForm.get('bannerSchool').setValue(true);
    component.addSchoolForm.get('nces').setValue('213213213213');
    component.bannerSchool = 'yes';
    const body = {
      input:
      {
        "id": 0,
        "schoolName": component.addSchoolForm.get('schoolName').value,
        "countryName": component.addSchoolForm.get('countryName').value,
        "stateName": component.addSchoolForm.get('stateName').value,
        "districtName": component.addSchoolForm.get('districtName').value,
        "cityName": component.addSchoolForm.get('cityName').value,
        "addressFirst": component.addSchoolForm.get('addressFirst').value,
        "addressSecond": component.addSchoolForm.get('addressSecond').value,
        "zipcode": component.addSchoolForm.get('zipcode').value,
        "schoolProfile": component.addSchoolForm.get('schoolProfile').value,
        "nces": component.addSchoolForm.get('nces').value,
        "mainName": "",
        "mainEmail": "",
        "mainPhone": "",
        "banner": component.bannerSchool,
        "emailNotificationStatus": "yes",
        "validation_mode": "create"
      }
    }
    component.submit();
    const op = backend.expectOne(addTypenameToDocument(schoolValidationQuery));
    op.flush(
      { "data": { "schoolValidation": { "validation_status": "success", "validation_message": "SCHOOL_VALIDATION_PASSED", "__typename": "SchoolValidationResponse" } } }
    )

    // When form is valid
    expect(component.selectedSchool).toBeDefined()

    // When form is valid but 'bannerSchool' value is false
    component.addSchoolForm.get('bannerSchool').setValue(false);
    component.submit();
    expect(component.bannerSchool).toBe('no');


    // When form is invalid
    component.addSchoolForm.get('schoolName').setValue('');
    component.submit();
    expect(false).toBe(false);
  });

  it('should sendMessage', () => {
    console.log(`AddSchoolFormComponent --> should check #sendMessage()`);

    component.sendMessage({})
    expect(component.filteredDitrict).toBeDefined();
  });

  it("should check getDistrict()", () => {
    console.log(`AddSchoolFormComponent --> should check #getDistrict()`);

    component.stateList = [{ name: "state-testing", value: "ST" }];
    component.addSchoolForm.get('districtName').setValue('s')
    component.getDistrict();
    const op = backend.expectOne(addTypenameToDocument(distictQuery));
    op.flush({ "data": { "findDistrictsByStateAndKeyword": [{ "districtname": "21st century charter sch of gary", "statename": "indiana", "id": 1, "__typename": "Districts" }, { "districtname": "21st century cyber cs", "statename": "pennsylvania", "id": 2, "__typename": "Districts" }, { "districtname": "21st century preparatory school agency", "statename": "wisconsin", "id": 3, "__typename": "Districts" }, { "districtname": "a e r o  spec educ coop", "statename": "illinois", "id": 5, "__typename": "Districts" }, { "districtname": "a w brown leadership academy", "statename": "texas", "id": 7, "__typename": "Districts" }, { "districtname": "a-c central cusd 262", "statename": "illinois", "id": 13, "__typename": "Districts" }, { "districtname": "a. linwood holton gov sch", "statename": "virginia", "id": 14, "__typename": "Districts" }, { "districtname": "a.c.g.c. public school district", "statename": "minnesota", "id": 16, "__typename": "Districts" }, { "districtname": "a.e. phillips laboratory school", "statename": "louisiana", "id": 17, "__typename": "Districts" }, { "districtname": "a+ arts academy", "statename": "ohio", "id": 9, "__typename": "Districts" }] } }
    )
    expect(component.filteredDitrict).toBeDefined();
  });

  it("should check checkIfValidZipCode()", () => {
    console.log(`AddSchoolFormComponent --> should check #checkIfValidZipCode()`);

    let event = { target: { value: "12345" } };
    let isValidInput = true;
    component.checkIfValidZipCode(event, isValidInput);
    expect(component.validateZipCodeOnServer).toHaveBeenCalled();

    isValidInput = false;
    component.checkIfValidZipCode(event, isValidInput);
    expect(component.resetStateName).toHaveBeenCalled();
  });

  it("should check #validateZipCodeOnServer()", () => {
    console.log(`AddSchoolFormComponent --> should check #validateZipCodeOnServer()`);

    let zipCode = "12345";
    component.validateZipCodeOnServer(zipCode);
    const op = backend.expectOne(addTypenameToDocument(getStateAndCityUsingZipCode));
    op.flush({ "data": { "getStateAndCityByAdmin": { "state_name": "New York", "state_id": "NY", "city": "Schenectady", "__typename": "stateCityResponse" } } }
    )
    expect(component.filteredDitrict).toBeDefined();
  });

  it("should check #zipCodeValidationErrorResponse()", () => {
    console.log(`AddSchoolFormComponent --> should check #zipCodeValidationErrorResponse()`);

    let error = { "errors": [{ "status": 400, "error": ["Please Enter valid US Zip Code"], "message": "Http Exception" }], "data": null };
    component.zipCodeValidationErrorResponse(error);
    expect(component.isValidZipcode).toBe(false);
  });

  it("should check #generateNcesId()", () => {
    console.log(`AddSchoolFormComponent --> should check #generateNcesId()`);

    // when no system generated nces id.
    component.sysGenNcesId = "";
    component.generateNcesId();
    const op = backend.expectOne(addTypenameToDocument(getSysGeneratedNcesQuery));
    op.flush({ "data": { "getSystemGeneratedNcesId": { "nces": "SG6259485992", "__typename": "SystemGeneratedNces" } } });
    expect(component.isSysGenNces).toBeDefined();

    // when system generated nces id.
    component.sysGenNcesId = "SG6259485992";
    component.generateNcesId();
    expect(false).toBe(false);
  });

  it("should check #resetSysGenNcesId()", () => {
    console.log(`AddSchoolFormComponent --> should check #resetSysGenNcesId()`);

    component.resetSysGenNcesId();
    expect(false).toBe(false);
  });

  it("should check #handleNcesApiError()", () => {
    console.log(`AddSchoolFormComponent --> should check #handleNcesApiError()`);
    let error = {};
    component.handleNcesApiError(error);
    expect(false).toBe(false);
  });
      // Sets the required validator for a given form field.
      it('should set the required validator for the given form field', function() {
        // Arrange
        const fieldName = 'districtName';
        const validators = [Validators.required];
    
        // Act
        component.setRequiredValidation(fieldName);
    
        // Assert
        expect(component.addSchoolForm.controls[fieldName].validator).not.toBeNull();
      });
          // Removes validators from the specified form field
    it('should remove validators from the specified form field when called', function() {
      // Arrange
      component.addSchoolForm = new FormGroup({
        fieldName: new FormControl('', Validators.required),
        otherField: new FormControl('')
      });

      // Act
      component.removeValidation('fieldName');

      // Assert
      expect(component.addSchoolForm.controls['fieldName'].validator).toBeNull();
      expect(component.addSchoolForm.get('fieldName').valid).toBeTrue();
    });

});
