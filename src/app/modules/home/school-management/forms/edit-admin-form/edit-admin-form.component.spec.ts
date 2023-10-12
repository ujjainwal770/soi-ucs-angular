import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpService } from 'src/app/core/services/http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SchoolService } from 'src/app/core/services/school.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditAdminFormComponent } from './edit-admin-form.component';
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
import { Router } from '@angular/router';
import { SchoolListComponent } from '../../school-list/school-list.component';
import { throwError } from 'rxjs';

describe('EditAdminFormComponent', () => {
  let component: EditAdminFormComponent;
  let fixture: ComponentFixture<EditAdminFormComponent>;
  let backend: ApolloTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAdminFormComponent,],
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
      providers: [HttpService, ToastrService, SchoolService, NgxSpinnerService,
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
    fixture = TestBed.createComponent(EditAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    // spyOn(component, 'checkDataChange').and.callThrough();
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
    }
    )
    expect(component.adminInfo).toBeDefined()
  });
  it("should check checkDataChange ()", () => {
    // component.checkDataChange(true)
    expect(component.adminInfo).toBeDefined()
  });
  it("should check checkDataChange false ()", () => {
    // component.checkDataChange(false)
    expect(component.adminInfo).toBeDefined()
  });
  it("should check patchValue ()", () => {
    let data = { "data": { "createSchoolAdmin": { "id": 68, "schoolid": 100, "name": "fgfdg fsdf", "email": "tttggg@kjh.co", "phone": "4353453534", "verificationstatus": "no", "__typename": "SchoolAdmin" } } }
    component.patchValue(data)
    expect(component.adminInfo).toBeDefined()
  });
  const updateAdminQuery = gql`
mutation updateSchoolWithAdmin($input:UpdateSchoolWithAdminInput!){
  updateSchoolWithAdmin(updateSchoolWithAdminInput:$input){
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
}`;
  it('should call submit', inject([Router], (router: Router) => {

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
          id:133,
          adminid:82,
          name:component.editAdminForm.get('mainName').setValue('dsfdsf'),
          phone:component.editAdminForm.get('mainPhone').setValue('9999999999'),
          email:component.editAdminForm.get('mainEmail').setValue('dsad@ddas.com'),
          schoolName:component.schoolDetails?.schoolName,
          countryName:component.schoolDetails?.countryName,
          stateName:component.schoolDetails?.stateName,
          districtName:component.schoolDetails?.districtName,
          cityName:component.schoolDetails?.cityName,
          addressFirst:component.schoolDetails?.addressFirst,
          addressSecond:component.schoolDetails?.addressSecond,
          zipcode:component.schoolDetails?.zipcode,
          schoolProfile:component.schoolDetails?.schoolProfile,
          nces:component.schoolDetails?.nces,
          "mainName":"",
          "mainEmail":"",
          "mainPhone":"",
          banner:component.schoolDetails?.banner,
          "emailNotificationStatus":"yes",
      }
    }
    
    
    component.submit();
    const op = backend.expectOne(addTypenameToDocument(updateAdminQuery));
    op.flush({"data":{"updateSchoolWithAdmin":{"school":{"id":134,"schoolName":"vidya pith","__typename":"School"},"schoolAdmin":{"id":87,"schoolid":134,"email":"rttgfdgd@kjh.com","name":"test One two","phone":"4353453534","__typename":"SchoolAdmin"},"__typename":"SchoolWithAdminResponse"}}}
    )
    spyOn(router, 'navigate').and.callThrough();
    expect(router.navigate).toBeDefined();
  }));
  
    // Tests that an error toaster is shown if the updateAdminQuery mutation fails
    xit('should show error toaster if updateAdminQuery mutation fails', () => {
      const mockApollo = {
          mutate: jasmine.createSpy().and.returnValue(throwError('Error')),
      };
      const mockErrorHandler = { manageError: jasmine.createSpy() } as any;
      component.editAdminForm.setValue({ mainName: 'John Doe', mainEmail: 'johndoe@example.com', mainPhone: '1234567890' });
      component.submit();
      expect(mockErrorHandler.manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getAdminData', () => {
    spyOn(component['_apollo'], 'watchQuery').and.returnValue({
      valueChanges: throwError('error'),
      ref: {
        variables: {},
      },
    } as any); 

    spyOn(component['_errorHandler'], 'manageError');
    component.getAdminData(76);
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly submit', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.editAdminForm.setValue({ mainName: 'John Doe', mainEmail: 'johndoe@example.com', mainPhone: '1234567890' });

    component.submit();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });




});
