import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/core/services/http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddAdminFormComponent } from './add-admin-form.component';
import { SchoolService } from 'src/app/core/services/school.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { HttpClientModule, } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SchoolListComponent } from '../../school-list/school-list.component';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { of } from 'rxjs';

describe('AddAdminFormComponent', () => {
  let component: AddAdminFormComponent;
  let fixture: ComponentFixture<AddAdminFormComponent>;
  let backend: ApolloTestingController;
  let _schoolService: SchoolService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAdminFormComponent],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'school-management', component: SchoolListComponent }
        ]),
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
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdminFormComponent);
    component = fixture.componentInstance;
    backend = TestBed.get(ApolloTestingController);
    _schoolService = TestBed.inject(SchoolService)
    fixture.detectChanges();
    spyOn(_schoolService, 'getMessage').and.returnValue(of({'text':{'schoolDetails':{'input':{'id':'1'}}}}));
    spyOn(component, 'getSchoolID').and.callThrough();

  });
  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should getSchoolID', () => {
    component.getSchoolID()
    expect(component).toBeTruthy();
  });

  it('should call getSchoolID', async(inject([SchoolService], (_schoolService: SchoolService) => {
    component.getSchoolID()
    const edata = {
      'text':{'schoolDetails':{'input':{'id':'1'}}}
    }
    _schoolService.getMessage().subscribe(data =>
      expect(data).toEqual(edata)
    )

  })))
  const createSchoolQuery = gql`
    mutation createSchoolWithAdmin($input:CreateSchoolWithAdminInput!){
      createSchoolWithAdmin(createSchoolWithAdminInput:$input){
        school{
          id
          schoolName
        }
        schoolAdmin{
          id
          schoolid
          email
          name
          phone
        }
      }
    }`
  it('should call submitAddAdminForm if new admin', inject([Router], (router: Router) => {

    component.schoolDetails = {
      addressFirst: "P123",
      addressSecond: "Subdivision- Tufanganj,Block-Tufanganj (II)",
      banner: "no",
      cityName: "dsfsd",
      countryName: "USA",
      districtName: "a center for creative education (79457)",
      email: "rttgfdgd@kjh.co",
      emailNotificationStatus: "yes",
      mainEmail: "",
      mainName: "",
      mainPhone: "",
      name: "test One two",
      nces: "553322256780",
      phone: "4353453534",
      schoolName: "vidya pith",
      schoolProfile: "private",
      stateName: "AK",
      zipcode: "79900"
    }
    let body = {
      input: {
        name: component.addAdminForm.get('mainName').setValue('dsfdsf'),
        phone: component.addAdminForm.get('mainPhone').setValue('9999999999'),
        email: component.addAdminForm.get('mainEmail').setValue('dsad@ddas.com'),
        schoolName: component.schoolDetails?.schoolName,
        countryName: component.schoolDetails?.countryName,
        stateName: component.schoolDetails?.stateName,
        districtName: component.schoolDetails?.districtName,
        cityName: component.schoolDetails?.cityName,
        addressFirst: component.schoolDetails?.addressFirst,
        addressSecond: component.schoolDetails?.addressSecond,
        zipcode: component.schoolDetails?.zipcode,
        schoolProfile: component.schoolDetails?.schoolProfile,
        nces: component.schoolDetails?.nces,
        "mainName": "",
        "mainEmail": "",
        "mainPhone": "",
        banner: component.schoolDetails?.banner,
        "emailNotificationStatus": "yes",
      }

    }
    component.submitAddAdminForm();
    const op = backend.expectOne(addTypenameToDocument(createSchoolQuery));

    op.flush({ "data": { "createSchoolWithAdmin": { "school": { "id": 134, "schoolName": "vidya pith", "__typename": "School" }, "schoolAdmin": { "id": 83, "schoolid": 134, "email": "rttgfdgd@kjh.co", "name": "test One two", "phone": "4353453534", "__typename": "SchoolAdmin" }, "__typename": "SchoolWithAdminResponse" } } }
    )

    spyOn(router, 'navigate').and.callThrough();
    expect(router.navigate).toBeDefined();
  }));

});
