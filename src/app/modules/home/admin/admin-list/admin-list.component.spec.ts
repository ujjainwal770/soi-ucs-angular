import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { adminSearchByListQuery, adminUserListQuery, deactivateOktaAdminQuery, fetchAdminStatusQuery, reactivateOktaAdmin, soucsAdminProfileDetailQuery } from 'src/app/core/query/admin';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { AdminListComponent } from './admin-list.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('AdminListComponent', () => {
  let component: AdminListComponent;
  let fixture: ComponentFixture<AdminListComponent>;
  let backend: ApolloTestingController;
  let _dialogsService;
  let _utilityService: UtilityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminListComponent],
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
      providers: [
        HttpService,
        ToastrService,
        NgxSpinnerService,
        UtilityService,
        LocalStorageService,
        DialogsService,
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

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _dialogsService = TestBed.inject(DialogsService);
    _utilityService = TestBed.inject(UtilityService);
    spyOn(component, 'getAdminUserList').and.callThrough();
    spyOn(component, 'getFilterByOption').and.callThrough();
    spyOn(component, 'getSearchByOption').and.callThrough();
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'searchUserText').and.callThrough();
    spyOn(component, 'openConfirmationDialog').and.callThrough();
    spyOn(component, 'changeStatus').and.callThrough();
    spyOn(component, 'userAction').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
    spyOn(component, 'getSoucsAdminProfile').and.callThrough();
    spyOn(component, 'customSorting').and.callThrough();
    spyOn(component, 'processElementStatus').and.callThrough();
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

  it("should check getAdminUserList()", () => {
    component.getAdminUserList();
    const op = backend.expectOne(addTypenameToDocument(adminUserListQuery));
    op.flush({
      "data":{"adminUserList":{"admins":[{"fullName":"Akshit Kumar", "email":"akshit.goel@optimizeitsystems.com","mobilePhone":"555555555","status":"active","roleName":"Super Admin","creationTime":1646998823568,"created_by_email":"mukesh.kumar@optimizeitsystems.com","__typename":"OktaAdmin"}],"count":24,"__typename":"OktaAdminListResponse"}}
    });
    expect(component.dataSource).toBeDefined();
  });

  it('should check getSearch() when searchText not empty', () => {
    let val = 'test';
    component.adminUsersFormGroup.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
    expect(component.getAdminUserList).toBeTruthy();
  });

  it('should check getSearch() when searchText is empty', () => {
    let val = '';
    component.adminUsersFormGroup.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
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

  it('#getSearchTxt shoul return when search text is name', () => {
    const fakeNames = 'Name';
    component.adminUsersFormGroup.get('searchBy').setValue('fullName');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt shoul return when search text is email', () => {
    const fakeEmail = 'Email Id';
    component.adminUsersFormGroup.get('searchBy').setValue('email');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeEmail);
  });

  it('#getSearchTxt shoul return when search text is roleName', () => {
    const fakeRole = 'Role';
    component.adminUsersFormGroup.get('searchBy').setValue('roleName');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeRole);
  });

  it('#getSearchTxt shoul return when search text is created_by_email', () => {
    const fakeRole = 'Created By';
    component.adminUsersFormGroup.get('searchBy').setValue('created_by_email');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeRole);
  });

  it('#getSearchTxt shoul return when search text is empty', () => {
    const fakeRole = '';
    component.adminUsersFormGroup.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeRole);
  });

  it('should call getFilterByOption()', () => {
    component.getFilterByOption();
    const op = backend.expectOne(addTypenameToDocument(fetchAdminStatusQuery));
    op.flush({
      "data": { "adminStatusList": { "options": [{ "text": "All", "query": "all", "__typename": "SearchOptionSingle" }, { "text": "Active", "query": "active", "__typename": "SearchOptionSingle" }, { "text": "Deactivated", "query": "inactive", "__typename": "SearchOptionSingle" }], "__typename": "SearchOptionList" } }
    })
  });

  it('should call getSearchByOption()', () => {
    component.getSearchByOption();
    const op = backend.expectOne(addTypenameToDocument(adminSearchByListQuery));
    op.flush({
      "data": { "adminSearchByList": { "options": [{ "text": "Name", "query": "fullName", "__typename": "SearchOptionSingle" }, { "text": "Email", "query": "email", "__typename": "SearchOptionSingle" }, { "text": "Roles", "query": "roleName", "__typename": "SearchOptionSingle" }], "__typename": "SearchOptionList" } }
    })
  });

  it('#userAction should navigate to challenge abuse page', inject([Router], (router: Router) => {
    let selectedUserEmail = "test@mail.com";
    const spy = spyOn(router, 'navigateByUrl');
    component.userAction(selectedUserEmail);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/admin/edit-admin-user/test@mail.com');
  }));

  it('should call resetFilter()', () => {
    component.resetFilter();
    expect(component.getAdminUserList).toHaveBeenCalled();
  });

  it("should check openConfirmationDialog() - when dialog response available", () => {
    let currentEmail = "test@mail.com";
    let currentStatus = "active";
    let res = {
     "data": "data"
    };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.openConfirmationDialog(currentEmail, currentStatus);
    fixture.detectChanges();
    expect(component.changeStatus).toHaveBeenCalled();

    currentStatus = "inactive";
    component.openConfirmationDialog(currentEmail, currentStatus);
    expect(true).toBeTruthy();
  });

  it("should check openConfirmationDialog() - when dialog response not available", () => {
    let currentEmail = "test@mail.com";
    let currentStatus = "active";
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.openConfirmationDialog(currentEmail, currentStatus);
  });

  it("should check changeStatus() when current status is active", () => {
    let currentEmail = "test@mail.com";
    let currentStatus = "active";
    component.changeStatus(currentEmail, currentStatus);
    let changeStatusQuery = (currentStatus == 'active') ? deactivateOktaAdminQuery : reactivateOktaAdmin;
    const op = backend.expectOne(addTypenameToDocument(changeStatusQuery));
    op.flush({
      "data":{"deactivateOktaAdmin":{"firstName":"test","lastName":"user","status":"inactive","email":"sohan@mail.com","userId":"00u3odxep83RpEy945d7","mobilePhone":"8888888888","__typename":"OktaAdmin"}}
    })
  });

  it("should check changeStatus() when current status is inactive", () => {
    let currentEmail = "test@mail.com";
    let currentStatus = "inactive";
    component.changeStatus(currentEmail, currentStatus);
    let changeStatusQuery = (currentStatus == 'active') ? deactivateOktaAdminQuery : reactivateOktaAdmin;
    const op = backend.expectOne(addTypenameToDocument(changeStatusQuery));
    op.flush({
      "data":{"reactivateOktaAdmin":{"firstName":"test","lastName":"user","status":"active","email":"sohan@mail.com","userId":"00u3odxep83RpEy945d7","mobilePhone":"8888888888","__typename":"OktaAdmin"}}
    });
  });

  it('should call getSoucsAdminProfile()', () => {
    component.getSoucsAdminProfile();
    const op = backend.expectOne(addTypenameToDocument(soucsAdminProfileDetailQuery));
    op.flush({
      "data":{"adminUserProfile":{"firstName":"Inadev","lastName":"Soucs","email":"inadevsoucs@gmail.com","roleName":"Super Admin","__typename":"OktaAdmin"}}
    })
  });
  it('test_error_is_handled_correctly getAdminUserList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getAdminUserList();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
    it('test_error_is_handled_correctly getSoucsAdminProfile', () => {
        spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
        spyOn(component['_errorHandler'], 'manageError');
        component.getSoucsAdminProfile();
      expect(component['_errorHandler'].manageError).toHaveBeenCalled();
    });
    it('test_error_is_handled_correctly getFilterByOption', () => {
      spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
      spyOn(component['_errorHandler'], 'manageError');
      component.getFilterByOption();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getSearchByOption', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getSearchByOption();
  expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});



  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "fullName";
    let sortingByColumn = "creationTime";

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
    component.sorting.sortingByColumn = "creationTime";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.getAdminUserList).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly changeStatus', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    let currentEmail = "test@mail.com";
    let currentStatus = "active";
    component.changeStatus(currentEmail, currentStatus);
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_happy_path_capitalizes_first_letter', () => {
  const input = 'hello world';
  const expectedOutput = 'Hello world';
  const output = component.processElementStatus(input);
  expect(output).toEqual(expectedOutput);
});


});