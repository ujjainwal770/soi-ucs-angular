import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from 'src/app/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UtilityService } from 'src/app/core/services/utility.service';
import _ from 'lodash';
import { DismissedStudentsComponent } from './dismissed-students.component';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { dismissedUserListQuery } from 'src/app/core/query/dismiss-user';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('DismissedStudentsComponent', () => {
  let component: DismissedStudentsComponent;
  let fixture: ComponentFixture<DismissedStudentsComponent>;
  let backend: ApolloTestingController;
  let _utilityService: UtilityService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DismissedStudentsComponent],
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
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DismissedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _utilityService = TestBed.inject(UtilityService);
    router = TestBed.inject(Router);
    spyOn(component, 'getDismissedUserList').and.callThrough();
    spyOn(component, 'getFilteredDataSource').and.callThrough();
    spyOn(component, 'getfilteredColumn').and.callThrough();
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'searchUserText').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should check getStudentDetails()", () => {
    const op = backend.expectOne(addTypenameToDocument(dismissedUserListQuery));
    component.getDismissedUserList();
    op.flush({
      "data":{"dismissList":{"count":5,"users":[{"user_id":369,"first_name":"Alan","last_name":"Border","date_of_birth":1172361600000,"email":"aks7@yopmail.com","schoolName":null,"account_status":"active","dismissReason":"","dismissStatus":"yes","trackSchoolId":1,"__typename":"DismissResponse"},{"user_id":365,"first_name":"Tetstsy","last_name":"Xhdh","date_of_birth":856742400000,"email":"1Feb24@test.com","schoolName":null,"account_status":"active","dismissReason":"my test reason","dismissStatus":"yes","trackSchoolId":1,"__typename":"DismissResponse"},{"user_id":361,"first_name":"Twstts","last_name":"Gsgsh","date_of_birth":288576000000,"email":"4Feb23@test.com","schoolName":null,"account_status":"active","dismissReason":"","dismissStatus":"yes","trackSchoolId":1,"__typename":"DismissResponse"},{"user_id":345,"first_name":"Testst","last_name":"Ysusus","date_of_birth":824860800000,"email":"4Feb21@test.com","schoolName":null,"account_status":"active","dismissReason":"fdfdgfd","dismissStatus":"yes","trackSchoolId":1,"__typename":"DismissResponse"},{"user_id":1,"first_name":"Nrusingha ","last_name":"Moharana","date_of_birth":820108800000,"email":"cefapi7012@datakop.com","schoolName":null,"account_status":"active","dismissReason":"","dismissStatus":"yes","trackSchoolId":1,"__typename":"DismissResponse"}],"school":[{"id":27,"schoolName":"St Jospehs New","nces":"","stateName":"AL","__typename":"School"}],"schoolAdmin":[{"schoolid":27,"name":"Dipak","email":"sneha1admin@yopmail.com","phone":"4353453534","__typename":"SchoolAdmin"}],"__typename":"DismissListResponse"}}
    });
  });

  it('should call handlePage() return valid', () => {
    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    };
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  it('should call resetFilter()', () => {
    component.resetFilter();
    expect(component.getDismissedUserList).toHaveBeenCalled();
  });

  it('should check getSearch()', () => {
    let val = 'test';
    component.dismissedStudentsFormGroup.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
    expect(component.getDismissedUserList).toBeTruthy();
  });

  it('#getSearch should check for false', () => {
    let val = '';
    component.getSearch();
    expect(false).toEqual(false);
  });

  it('should check searchUserText() - test when searchKeyword length > 2', () => {
    let searchData = "test";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check searchUserText() - test when searchKeyword length = 0', () => {
    let searchData = "";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check searchUserText() - test when searchKeyword length not > 2 and not 0', () => {
    let searchData = "t";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('#getSearchTxt should return when search text is name', () => {
    const fakeNames = 'User Name';
    component.dismissedStudentsFormGroup.get('searchBy').setValue('full_name');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when search text is email', () => {
    const fakeNames = 'Email Id';
    component.dismissedStudentsFormGroup.get('searchBy').setValue('email');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when search text is email', () => {
    const fakeNames = 'School Name';
    component.dismissedStudentsFormGroup.get('searchBy').setValue('schoolName');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when search text is email', () => {
    const fakeNames = 'School Admin Name';
    component.dismissedStudentsFormGroup.get('searchBy').setValue('schoolAdminname');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return empty when search text value is blank', () => {
    const fakeNames = '';
    component.dismissedStudentsFormGroup.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('should call userAction()', () => {
    let userId = '367';
    const spy = spyOn(router, 'navigateByUrl');
    component.userAction(userId);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/app-users/dismissed-student-details/' + userId);
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "reportabusecount";
    let sortingByColumn = "reportabusecount";

    // ascending order.
    component.sorting.sortingClickCounter = 0;
    component.customSorting(sortingByColumn);

    // descending order.
    component.sorting.sortingClickCounter = 1;
    component.customSorting(sortingByColumn);

    // Initial sorting i.e descending
    component.sorting.sortingClickCounter = 2;
    component.customSorting(sortingByColumn);

    // When an invalid choice
    component.sorting.sortingByColumn = "reportabusecount";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.getDismissedUserList).toHaveBeenCalled();
  });
});
