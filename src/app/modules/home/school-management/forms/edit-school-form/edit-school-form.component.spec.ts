import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditSchoolFormComponent } from './edit-school-form.component';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from 'src/app/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { SchoolService } from 'src/app/core/services/school.service';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SchoolDetailById, getStateAndCityUsingZipCode, getSysGeneratedNcesQuery, schoolQuery, schoolValidationQuery } from 'src/app/core/query/school-management';
import { GraphQLModule } from 'src/app/graphql.module';
import { throwError } from 'rxjs';

describe('EditSchoolFormComponent', () => {
  let component: EditSchoolFormComponent;
  let fixture: ComponentFixture<EditSchoolFormComponent>;
  let backend: ApolloTestingController;
  let _schoolService: SchoolService;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSchoolFormComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
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
        },

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSchoolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    httpClient = TestBed.inject(HttpClient);
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'getDistrict').and.callThrough();
    spyOn(component, 'submit').and.callThrough();
    spyOn(component, 'sendMessage').and.callThrough();
    spyOn(component, 'checkZipCode').and.callThrough();
    spyOn(component, 'checkZipCodeOnServer').and.callThrough();
    spyOn(component, 'resetState').and.callThrough();
    spyOn(component, 'zipcodeAPIErrorResponse').and.callThrough();
    spyOn(component, 'getSysGeneratedNcesId').and.callThrough();
    spyOn(component, 'resetSysGenNces').and.callThrough();
    spyOn(component, 'onNcesAPIError').and.callThrough();
    spyOn(component, 'updateValidators').and.callThrough();
    spyOn(component, 'setRequiredValidation').and.callThrough();
    
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should check getSchoolByID()", () => {
    const op = backend.expectOne(addTypenameToDocument(SchoolDetailById));
    component.getSchoolByID(97)
    op.flush({
      "data": {
        "getSchoolDetailById": {
          addressFirst: "416, Charms Solitair",
          addressSecond: "Ahinsa Khand -2",
          banner: "yes",
          cityName: "Ghaziabadn",
          countryName: "USA",
          creationTime: 1639742780277,
          districtName: "a-c central cusd 262",
          id: 97,
          mainEmail: "",
          mainName: "",
          mainPhone: "",
          nces: "111111111111",
          schoolName: "local school113ddegb",
          schoolProfile: "public",
          stateName: "AK",
          zipcode: "12345",
          __typename: "School",

        }
      }
    })
  });

  const distictQuery = gql`
  query($keyword:String!,$state:String!){
    findDistrictsByStateAndKeyword(keyword:$keyword,state:$state){
      districtname,
      id
    }
  }`;

  it("should check getDistrict()", () => {
    component.stateList = [{ name: "state-testing", value: "ST" }];
    component.editSchoolForm.get('districtName').setValue('s');
    const op = backend.expectOne(addTypenameToDocument(distictQuery));
    op.flush({ "data": { "findDistrictsByStateAndKeyword": [{ "districtname": "21st century charter sch of gary", "statename": "indiana", "id": 1, "__typename": "Districts" }, { "districtname": "21st century cyber cs", "statename": "pennsylvania", "id": 2, "__typename": "Districts" }, { "districtname": "21st century preparatory school agency", "statename": "wisconsin", "id": 3, "__typename": "Districts" }, { "districtname": "a e r o  spec educ coop", "statename": "illinois", "id": 5, "__typename": "Districts" }, { "districtname": "a w brown leadership academy", "statename": "texas", "id": 7, "__typename": "Districts" }, { "districtname": "a-c central cusd 262", "statename": "illinois", "id": 13, "__typename": "Districts" }, { "districtname": "a. linwood holton gov sch", "statename": "virginia", "id": 14, "__typename": "Districts" }, { "districtname": "a.c.g.c. public school district", "statename": "minnesota", "id": 16, "__typename": "Districts" }, { "districtname": "a.e. phillips laboratory school", "statename": "louisiana", "id": 17, "__typename": "Districts" }, { "districtname": "a+ arts academy", "statename": "ohio", "id": 9, "__typename": "Districts" }] } }
    )
    expect(component.filteredDitrict).toBeDefined();
  });

  xit('should call submit', () => {
    component.editSchoolForm.get('schoolName').setValue('dsfds');
    component.editSchoolForm.get('countryName').setValue('sdfdsfd');
    component.editSchoolForm.get('stateName').setValue('fdssdds');
    component.editSchoolForm.get('cityName').setValue('fsdsddf');
    component.editSchoolForm.get('districtName').setValue('fdfds');
    component.editSchoolForm.get('addressFirst').setValue('sfdfdsf');
    component.editSchoolForm.get('addressSecond').setValue('dfdsf');
    component.editSchoolForm.get('zipcode').setValue('33322');
    component.editSchoolForm.get('schoolProfile').setValue('dsdd');
    component.editSchoolForm.get('bannerSchool').setValue(true);
    component.editSchoolForm.get('nces').setValue('213213213213');
    component.selectedSchoolId = '61';
    component.bannerSchool = 'yes';
    const body = {
      input:
      {
        "id": parseFloat(component.selectedSchoolId),
        "schoolName": component.editSchoolForm.get('schoolName').value,
        "countryName": component.editSchoolForm.get('countryName').value,
        "stateName": component.editSchoolForm.get('stateName').value,
        "districtName": component.editSchoolForm.get('districtName').value,
        "cityName": component.editSchoolForm.get('cityName').value,
        "addressFirst": component.editSchoolForm.get('addressFirst').value,
        "addressSecond": component.editSchoolForm.get('addressSecond').value,
        "zipcode": component.editSchoolForm.get('zipcode').value,
        "schoolProfile": component.editSchoolForm.get('schoolProfile').value,
        "nces": component.editSchoolForm.get('nces').value,
        "mainName": "",
        "mainEmail": "",
        "mainPhone": "",
        "banner": component.bannerSchool,
        "emailNotificationStatus": "yes",
        "validation_mode": "update",
        "isUniversity":1
      }
    }
    component.submit();

    const op = backend.expectOne(addTypenameToDocument(schoolValidationQuery));
    op.flush(
      { "data": { "schoolValidation": { "validation_status": "success", "validation_message": "SCHOOL_VALIDATION_PASSED", "__typename": "SchoolValidationResponse" } } }
    )
    // When form is valid
    expect(component.filteredDitrict).toBeDefined()

    // When form is valid but 'bannerSchool' value is false
    component.editSchoolForm.get('bannerSchool').setValue(false);
    component.submit();
    expect(component.bannerSchool).toBe('no');
    

    // When form is invalid
    component.editSchoolForm.get('schoolName').setValue('');
    component.submit();
    expect(false).toBe(false);
  });

  it("should check checkZipCode()", () => {
    console.log(`EditSchoolFormComponent --> should check #checkZipCode()`);

    let event = { target: { value: "12345" } };
    let isValidInput = true;
    component.checkZipCode(event, isValidInput);
    expect(component.checkZipCodeOnServer).toHaveBeenCalled();

    isValidInput = false;
    component.checkZipCode(event, isValidInput);
    expect(component.resetState).toHaveBeenCalled();
  });

  it("should check #checkZipCodeOnServer()", () => {
    console.log(`EditSchoolFormComponent --> should check #checkZipCodeOnServer()`);

    let zipCode = "12345";
    component.checkZipCodeOnServer(zipCode);
    const op = backend.expectOne(addTypenameToDocument(getStateAndCityUsingZipCode));
    op.flush({ "data": { "getStateAndCityByAdmin": { "state_name": "New York", "state_id": "NY", "city": "Schenectady", "__typename": "stateCityResponse" } } }
    )
    expect(component.filteredDitrict).toBeDefined();
  });

  it("should check #zipcodeAPIErrorResponse()", () => {
    console.log(`EditSchoolFormComponent --> should check #zipcodeAPIErrorResponse()`);

    let error = { "errors": [{ "status": 400, "error": ["Please Enter valid US Zip Code"], "message": "Http Exception" }], "data": null };
    component.zipcodeAPIErrorResponse(error);
    expect(false).toBe(false);
  });

  it("should check #getSysGeneratedNcesId()", () => {
    console.log(`AddSchoolFormComponent --> should check #getSysGeneratedNcesId()`);

    // when no system generated nces id.
    component.sysGenNcesId = "";
    component.getSysGeneratedNcesId();
    const op = backend.expectOne(addTypenameToDocument(getSysGeneratedNcesQuery));
    op.flush({ "data": { "getSystemGeneratedNcesId": { "nces": "SG6259485992", "__typename": "SystemGeneratedNces" } } });
    expect(component.isSysGenNces).toBeDefined();

    // when system generated nces id.
    component.sysGenNcesId = "SG6259485992";
    component.getSysGeneratedNcesId();
    expect(false).toBe(false);
  });

  it("should check #resetSysGenNces()", () => {
    console.log(`AddSchoolFormComponent --> should check #resetSysGenNces()`);

    component.resetSysGenNces();
    expect(false).toBe(false);
  });

  it("should check #onNcesAPIError()", () => {
    console.log(`AddSchoolFormComponent --> should check #onNcesAPIError()`);
    let error = {};
    component.onNcesAPIError(error);
    expect(false).toBe(false);
  });

  xit('test_error_is_handled_correctly getSchoolByID', () => {
    spyOn(component['_apollo'], 'watchQuery').and.returnValue({
      valueChanges: throwError('error'),
      ref: {
        variables: {},
      },
    } as any); 

    spyOn(component['_errorHandler'], 'manageError');
    component.getSchoolByID('1');
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly checkZipCodeOnServer', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    component.checkZipCodeOnServer('1');
    expect(component.zipcodeAPIErrorResponse).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getSysGeneratedNcesId', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    component.getSysGeneratedNcesId();
    expect(component.onNcesAPIError).toHaveBeenCalled();
  });
  xit('test_error_is_handled_correctly getDistrict', () => {
    spyOn(component['_apollo'], 'watchQuery').and.returnValue({
      valueChanges: throwError('error'),
      ref: {
        variables: {},
      },
    } as any); 

    spyOn(component['_errorHandler'], 'manageError');
    component.getDistrict();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test updateValidators', () => {
    component.selectedType = "School";
    component.updateValidators();
    expect(component.setRequiredValidation).toHaveBeenCalled();
  });});
