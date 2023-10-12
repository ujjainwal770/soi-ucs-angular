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
import { of, throwError } from 'rxjs';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { appUserActiveStatusQuery, getAppUserQuery, userSearchByOptionQuery, userStatusOptionQuery, userTypeOptionQuery } from '../../../../core/query/appuser';
import { UserListComponent } from './user-list.component';
import { ViewUserDetailsComponent } from './view-user-details/view-user-details.component';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';
import { Router } from '@angular/router';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let backend: ApolloTestingController;
  let _utilityService: UtilityService;
  let _dialogsService: DialogsService;
  let mockRouter;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy()
    };
    await TestBed.configureTestingModule({
      declarations: [UserListComponent,ConvertToLocalDatePipe],
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
      providers: [HttpService, SharedService, ToastrService, NgxSpinnerService, UtilityService, LocalStorageService, DialogsService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    _utilityService = TestBed.inject(UtilityService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _dialogsService = TestBed.inject(DialogsService);
    spyOn(component, 'getAppUserList').and.callThrough();
    spyOn(component, 'getUserTypeOption').and.callThrough();
    spyOn(component, 'getUserAccountStatusOption').and.callThrough();
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
    spyOn(component, 'getUserSearchByOption').and.callThrough();
    spyOn(component, 'getfilteredSchool').and.callThrough();
    spyOn(component, 'customSorting').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handlePage() return valid', () => {
    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    const searchOptionsData = {
      "text": 'cc',
      "query": 'schoolName',
      "filter": 'active'
    }
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });



  it("should check getAppUserList()", () => {
    component.getAppUserList();
    const op = backend.expectOne(addTypenameToDocument(getAppUserQuery));
    op.flush({
      "data": { "adminPortalAppUserList": { "users": [{ "user_id": 1337, "first_name": "Dev User 88", "last_name": "Test", "date_of_birth": 820108800000, "country_code": "1", "phone": "6566869569", "email": "devuser88@yopmail.com", "schoolverifystatus": "approved", "school_id": 245, "account_status": "active", "ucs_status": "yes", "reportabusecount": 0, "creation_time": 1676365501205, "__typename": "AppUserResponse" }], "schools": [{ "id": 130, "schoolName": "Somerville School", "__typename": "School" }, { "id": 245, "schoolName": "2nd Feb Dev School 8", "__typename": "School" }], "count": 932, "__typename": "AppUserListResponse" } }
    });
    expect(component.dataSource).toBeDefined();
    // backend.verify();
  });

  it("should set user type option list getUserTypeOption()", () => {
    const op = backend.expectOne(addTypenameToDocument(userTypeOptionQuery));
    op.flush({
      "data": { "getUserTypeOptionList": { "options": [{ "text": "All", "query": "all", "__typename": "UserTypeOptionSingle" }, { "text": "UCS User", "query": "yes", "__typename": "UserTypeOptionSingle" }, { "text": "Guest User", "query": "no", "__typename": "UserTypeOptionSingle" }], "__typename": "UserTypeOptionList" } }
    })
    expect(component.userTypeOptionList).toBeDefined();
    // backend.verify();
  });

  it("should set user accont status opion list getUserStatusOptionList()", () => {
    const op = backend.expectOne(addTypenameToDocument(userStatusOptionQuery));
    op.flush({
      "data": { "getUserStatusOptionList": { "options": [{ "text": "All", "query": "all", "__typename": "UserTypeOptionSingle" }, { "text": "Active", "query": "active", "__typename": "UserTypeOptionSingle" }, { "text": "Deactivated", "query": "inactive", "__typename": "UserTypeOptionSingle" }], "__typename": "UserTypeOptionList" } }
    })
    expect(component.userStatusOptionList).toBeDefined();
    //backend.verify();
  });
  it("should set user accont status opion list getUserSearchByOption ()", () => {
    const op = backend.expectOne(addTypenameToDocument(userSearchByOptionQuery));
    op.flush({ "data": { "getUserSearchByList": { "options": [{ "text": "Name", "query": "full_name", "__typename": "SearchOptionSingle" }, { "text": "Email", "query": "email", "__typename": "SearchOptionSingle" }], "__typename": "SearchOptionList" } } }
    )
    expect(component.userSearchByOptionList).toBeDefined();
    //backend.verify();
  });

  it('should check getSearch()', () => {
    component.getSearch();
    expect(component.getAppUserList).toHaveBeenCalled();
  });

  it('should check getSearch() - when value of #searchText = blank', () => {
    let val = '';
    component.userListForm.get('searchText').setValue(val);
    component.getSearch();
    expect(false).toBe(false);
  });

  it('#getSearchTxt should return when search text is name', () => {
    const fakeNames = 'Name';
    component.userListForm.get('searchBy').setValue('full_name');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when search text is email', () => {
    const fakeNames = 'Email Id';
    component.userListForm.get('searchBy').setValue('email');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt shoul return when search text is blank', () => {
    const fakeNames = '';
    component.userListForm.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('should check resetFilter ()', () => {
    component.resetFilter();
    expect(component.getSearch).toBeTruthy();
    expect(component.getAppUserList).toHaveBeenCalled();
  });

  it('should check #getfilteredSchool() - when school data result available', () => {
    let catId = 1;
    component.schoolData = [
      { id: 1, schoolName: "test school" }
    ];
    let school = component.getfilteredSchool(catId);
    expect(school).toBe('test school');
  });

  it('should check #getfilteredSchool() - when not school data available', () => {
    let catId = 1;
    component.schoolData = [];
    let school = component.getfilteredSchool(catId);
    expect(school).toBe('N/A');
  });

  it('should call #changeStatus() - check when dialog response available', () => {
    let id = "School Manager";
    let currentStatus = "active";
    let res = { "data": "data" };

    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.changeStatus(id, currentStatus);
    const op = backend.expectOne(addTypenameToDocument(appUserActiveStatusQuery));
    op.flush({
      "data": { "getUserSearchByList": { "options": [{ "text": "Name", "query": "first_name", "__typename": "SearchOptionSingle" }, { "text": "Email", "query": "email", "__typename": "SearchOptionSingle" }], "__typename": "SearchOptionList" } }
    })
    expect(false).toBe(false);
  });

  it('should call changeStatus() - check when dialog response not available', () => {
    let id = "School Manager";
    let currentStatus = "active";
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.changeStatus(id, currentStatus);
    expect(false).toBe(false);
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "full_name";
    let sortingByColumn = "creation_time";

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
    component.sorting.sortingByColumn = "creation_time";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.getAppUserList).toHaveBeenCalled();
  });
  it('should navigate to edit user details when path is "edit"', () => {
    const item = { user_id: 123 };

    component.userAction('edit', item);

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/app-users/edit-user-details/123`);
  });

  it('should navigate to user details when path is "view"', () => {
    const item = { user_id: 456 };

    component.userAction('view', item);

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/app-users/user-details/456`);
  });

  it('test_error_is_handled_correctly getAppUserList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getAppUserList();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getUserTypeOption', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getUserTypeOption();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getUserAccountStatusOption', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getUserAccountStatusOption();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getUserSearchByOption', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getUserSearchByOption();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
