import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { schoolAdminProfileDetailQuery, soucsAdminProfileDetailQuery } from 'src/app/core/query/admin';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ProfileComponent } from './profile.component';
import { throwError } from 'rxjs';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [OktaAuthModule, ToastrModule.forRoot(),
        ApolloTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'view-profile', component: ProfileComponent }
        ]), MatMenuModule, BrowserAnimationsModule],
      providers: [
        NgxSpinnerService,
        LocalStorageService,
        ToastrService,
        AuthService,
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

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);

    spyOn(component, 'getSoucsAdminProfile').and.callThrough();
    spyOn(component, 'getSchoolAdminProfile').and.callThrough();
    spyOn(component, 'fetchProfile').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchProfile() - adminType = "SCHOOL_ADMIN"', () => {
    let adminType = "SCHOOL_ADMIN";
    component.fetchProfile(adminType);
    expect(component.getSchoolAdminProfile).toHaveBeenCalled();
  });

  it('should call fetchProfile() - adminType = "SOUCS_ADMIN"', () => {
    let adminType = "SOUCS_ADMIN";
    component.fetchProfile(adminType);
    expect(component.getSoucsAdminProfile).toHaveBeenCalled();
  });

  it('should call getSoucsAdminProfile()', () => {
    component.getSoucsAdminProfile();
    const op = backend.expectOne(addTypenameToDocument(soucsAdminProfileDetailQuery));
    op.flush({
      "data": { "adminUserProfile": { "firstName": "test", "lastName": "name", "email": "test@mail.com", "roleName": "School Manager", "__typename": "OktaAdmin" } }
    });
  });

  it('should call getSchoolAdminProfile()', () => {
    component.getSchoolAdminProfile();
    const op = backend.expectOne(addTypenameToDocument(schoolAdminProfileDetailQuery));
    op.flush({
      "data":{"getMySchoolAdminDetails":{"user":{"name":"sssss28455","email":"test@mail.com","phone":"3333333333","__typename":"SchoolAdmin"},"school":{addressFirst:"3310 7th Avenue SE",addressSecond:"Holiday Inn Express and Suites Aberdeen, HIE Meeting Room",cityName:"Aberdeen",countryName:"USA",id:45,nces:"",schoolName:"Devikalay",stateName:"CA",zipcode:"57401"},"__typename":"AdminFullDetailsResponse"}}
    });
  });
  it('test_error_is_handled_correctly getSoucsAdminProfile', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getSoucsAdminProfile();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getSchoolAdminProfile', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getSchoolAdminProfile();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
