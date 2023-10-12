import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { gql } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { SchoolDetailById, getStateAndCityUsingZipCode, resendInviteLinkQuery } from 'src/app/core/query/school-management';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { SchoolViewComponent } from './school-view.component';
import { Router } from '@angular/router';

describe('SchoolViewComponent', () => {
  let component: SchoolViewComponent;
  let fixture: ComponentFixture<SchoolViewComponent>;
  let backend: ApolloTestingController;
  let _dialogsService: DialogsService;
  let _router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchoolViewComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
        MatIconModule,
        MatTabsModule
      ],
      providers: [HttpService, ToastrService, SchoolService, NgxSpinnerService, DialogsService,
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
    fixture = TestBed.createComponent(SchoolViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    _dialogsService = TestBed.inject(DialogsService);
    _router = TestBed.inject(Router);

    spyOn(component, 'checkZipCodeValidity').and.callThrough();
    spyOn(component, 'zipCodeErrorResponse').and.callThrough();
    spyOn(component, 'resendLink').and.callThrough();
    spyOn(component, 'startTimer').and.callThrough();
    spyOn(component, 'confirmationDialog').and.callThrough();
    spyOn(component, 'gotoSchoolEdit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const getAdminQuey = gql`
  query($id:Int!){
    findAllSchoolAdmins(schoolid:$id){
      id,
      schoolid
      name,
      email,
      phone,
      verificationstatus
    }
  }`;
  it("should check getAdminData()", () => {
    const op = backend.expectOne(addTypenameToDocument(getAdminQuey));
    component.getAdminData(61)
    op.flush({
      "data": {
        "findAllSchoolAdmins":
          [{
            "id": 19,
            "schoolid": 61,
            "name": "rere",
            "email": "eee@kjh.co",
            "phone": "4353453534",
            "verificationstatus": "no",
            "__typename": "SchoolAdmin"
          }]
      }
    });
    expect(component.adminInfo).toBeDefined();
  });

  it("should check SchoolDetailById()", () => {
    const op = backend.expectOne(addTypenameToDocument(SchoolDetailById));
    component.getSchoolByID(170);
    op.flush({
      "data": {
        "getSchoolDetailById": {
          "id": 170,
          "schoolName": "Dilip jhgj",
          "countryName": "USA",
          "stateName": "TX",
          "zipcode": "75006",
          "cityName": "sjkf",
          "creationTime": 1667226760147,
          "addressFirst": "kjsfhkjds",
          "addressSecond": "jksdfj",
          "schoolProfile": "private",
          "mainName": "",
          "mainEmail": "",
          "mainPhone": "",
          "districtName": "abernathy isd",
          "nces": "SG6818733559",
          "isSysGenNces": true,
          "banner": "yes",
          "deactivateReason": "",
          "adminActiveStatus": "no",
          "__typename": "School"
        }
      }
    });
    expect(component.selectedSchool).toBeDefined();
  });

  it("should check #checkZipCodeValidity()", () => {
    console.log(`SchoolViewComponent --> should check #checkZipCodeValidity()`);

    let zipCode = "12345";
    component.checkZipCodeValidity(zipCode);
    const op = backend.expectOne(addTypenameToDocument(getStateAndCityUsingZipCode));
    op.flush({ "data": { "getStateAndCityByAdmin": { "state_name": "New York", "state_id": "NY", "city": "Schenectady", "__typename": "stateCityResponse" } } }
    )
    expect(component.isValidZipCode).toBe(true);
  });

  it("should check #zipCodeErrorResponse()", () => {
    console.log(`SchoolViewComponent --> should check #zipCodeErrorResponse()`);

    let error = { "errors": [{ "status": 400, "error": ["Please Enter valid US Zip Code"], "message": "Http Exception" }], "data": null };
    component.zipCodeErrorResponse(error);
    expect(component.isValidZipCode).toBe(false);
  });

  it("should check #resendLink()", () => {
    console.log(`SchoolViewComponent --> should check #resendLink()`);

    component.resendLink();
    const op = backend.expectOne(addTypenameToDocument(resendInviteLinkQuery));
    op.flush({ "data": { "resendSchoolAdminInvitationEmail": { "id": 133, "schoolid": 170, "__typename": "SchoolAdmin" } } }
    )
    expect(false).toBe(false);
  });

  it("should check #confirmationDialog() - when click yes", () => {
    console.log(`SchoolViewComponent --> should check #confirmationDialog() - when click yes`);

    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.confirmationDialog();
    expect(component.resendLink).toHaveBeenCalled();
  });

  it("should check #confirmationDialog() - when click no", () => {
    console.log(`SchoolViewComponent --> should check #confirmationDialog() - when click no`);

    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.confirmationDialog();
    expect(component.resendLink).not.toHaveBeenCalled();
  });
  it('should check #gotoSchoolEdit()', () => {
    component.selectedSchoolId = '1';
    const spy = spyOn(_router, 'navigateByUrl');
    component.gotoSchoolEdit();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/school-management/school-edit/1');
    component.gotoSchoolEdit();
    expect(component).toBeTruthy();
  });
});
