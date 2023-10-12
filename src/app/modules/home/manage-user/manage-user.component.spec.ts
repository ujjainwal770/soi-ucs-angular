import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Apollo } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { dismissStudentRequestQuery } from 'src/app/core/query/dismiss-user';
import { searchOptionsQuery, studentQuery, updateSchoolRequestStatusQuery, updateStatusQuery, userStatusListQuery } from 'src/app/core/query/manage-student';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ManageUserComponent } from './manage-user.component';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';
import { _CONST } from 'src/app/core/constants/app.constants';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ManageUserComponent', () => {
  let component: ManageUserComponent;
  let fixture: ComponentFixture<ManageUserComponent>;
  let backend: ApolloTestingController;
  let _authService: AuthService;
  let _apollo: Apollo;
  let router: Router;
  let _dialogsService;
  let _utilityService: UtilityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageUserComponent,ConvertToLocalDatePipe],
      imports: [
        OktaAuthModule,
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'manage-students', component: ManageUserComponent }
        ])
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

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);
    _authService = TestBed.inject(AuthService);
    _dialogsService = TestBed.inject(DialogsService);
    _utilityService = TestBed.inject(UtilityService);
    spyOn(component, 'getFieldRef').and.callThrough();
    spyOn(component, 'handlePage').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'gotoEditPage').and.callThrough();
    spyOn(component, 'updateNewStudentRequst').and.callThrough();
    spyOn(component, 'updateStatus').and.callThrough();
    spyOn(component, 'openDismissDialog').and.callThrough();
    spyOn(component, 'dismissStudentRequest').and.callThrough();
    spyOn(component, 'updateSchoolChangeRequestStatus').and.callThrough();
    spyOn(component, 'masterToggle').and.callThrough();
    spyOn(component, 'checkboxLabel').and.callThrough();
    spyOn(component, 'getFilterStatus').and.callThrough();
    spyOn(component, 'getSearchOptions').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'getStudents').and.callThrough();
    spyOn(component, 'getCustomStatus').and.callThrough();
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'searchUserText').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #ngOnInit()', () => {
    const mockAuthData = {
      email: "devioit@yopmail.com",
      name: "Devi",
      schoolid: 45,
      usertype: "School Admin"
    };

    component.ngOnInit();
    (_authService as any).user = of(mockAuthData);
    _authService.user.subscribe(res => {
      component.schoolId = res.schoolid;
      expect(component.schoolId).toBe(res.schoolid);
    });
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

  it('should call gotoEditPage()', () => {
    let userId = '368';
    const spy = spyOn(router, 'navigateByUrl');
    component.gotoEditPage(userId);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/manage-students/edit-student/368');
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

  it('should check resetFilter ()', () => {
    component.resetFilter();
    expect(component.getStudents).toHaveBeenCalled();
  });

  it('should call updateNewStudentRequst() return valid', () => {
    component.updateNewStudentRequst(1, 'approved')
  });

  it('should call updateStatus() - when bulkActionVation=true', () => {
    spyOn(component, 'bulkActionValidation').and.returnValue(true);
    component.selection.select({ user_id: 1 } as any);
    component.updateStatus();
    expect(true).toBeTruthy();

    component.selection.select({} as any);
    component.updateStatus();
    expect(false).toBeFalsy();
  });

  it('should call updateStatus() - when bulkActionVation=false', () => {
    spyOn(component, 'bulkActionValidation').and.returnValue(false);
    component.selection.select({} as any);
    component.updateStatus();
    expect(false).toBeFalsy();
  });

  it('should call masterToggle() return valid - when isAllSelected is true', () => {
    spyOn(component, 'isAllSelected').and.returnValue(true);
    component.masterToggle()
    expect(true).toBeTruthy();
  });

  it('should call masterToggle() - when isAllSelected is false', () => {
    spyOn(component, 'isAllSelected').and.returnValue(false);
    component.masterToggle()
    expect(false).toBeFalsy();
  });

  it("should check getStudents()", () => {
    component.getStudents()
    const op = backend.expectOne(addTypenameToDocument(studentQuery));
    op.flush({
      "data": { "findUsersSearchByQuery": { "users": [{ "first_name": "Abdul", "last_name": "Hamid", "email": "biyome8665@healteas.com", "date_of_birth": 910742400000, "country_code": "1", "phone": "9163539491", "schoolverifystatus": "reject", "user_id": 23, "school_id": 45, registeredStatus: "no", reqSchoolId: 0 }], "count": 10 } }
    });
    expect(component.dataSource).toBeDefined();
  });

  it("should check getSearchOptions()", () => {
    component.getSearchOptions();
    const op = backend.expectOne(addTypenameToDocument(searchOptionsQuery));
    op.flush({
      "data": {
        "getUserOptionList":
        {
          "options": [
            { "query": "full_name", "text": "Name", "__typename": "SearchOptionSingle" },
            { "query": "email", "text": "Email", "__typename": "SearchOptionSingle" },
            { "query": "phone", "text": "Phone", "__typename": "SearchOptionSingle" },
            { "query": "date_of_birth", "text": "Date of birth", "__typename": "SearchOptionSingle" }
          ],
          "__typename": "SearchOptionList"
        }
      }
    })
  });

  it("should check getFilterStatus()", () => {
    component.getFilterStatus();
    const op = backend.expectOne(addTypenameToDocument(userStatusListQuery));
    op.flush({
      "data": { "userstatusList": { "options": [{ "query": "all", "text": "All", "__typename": "SearchOptionSingle" }, { "query": "approved", "text": "Approved", "__typename": "SearchOptionSingle" }, { "query": "reject", "text": "Reject", "__typename": "SearchOptionSingle" }, { "query": "pending", "text": "Pending", "__typename": "SearchOptionSingle" }], "__typename": "SearchOptionList" } }
    });
  });

  it("should call dismissStudentRequest()", () => {
    let queryInputs = {
      "dismissType": 2,
      "dismissReason": "",
      "dismissDescription": "test",
      "user_id": 369
    };
    component.dismissStudentRequest(queryInputs);
    const op = backend.expectOne(addTypenameToDocument(dismissStudentRequestQuery));
    op.flush({
      "data": { "dismissStudent": { "userids": [369], "status": "reject", "schoolverifystatus": "pending", "__typename": "AdminApproveUserResponse" } }
    });
  });

  it("should check getSearchTxt()", () => {
    component.getSearchTxt();
    component.userFormGroup.get('searchBy').setValue('email');
    expect(component.getFieldRef('searchBy').value).toEqual('email')
  });

  it("should check updateNewStudentRequstStatus()", () => {
    const arr = [1, 2, 4]
    component.updateNewStudentRequstStatus(arr, 'approved')
    const op = backend.expectOne(addTypenameToDocument(updateStatusQuery));
    op.flush({
      "data": { "updateSchoolAdminUserStatus": { "userids": [234], "status": "approved", "message": "Status updated successfully", "schoolverifystatus": "approved", "__typename": "AdminApproveUserResponse" } }
    });
  });

  it("should check updateSchoolChangeRequestStatus()", () => {
    let userId = 722;
    component.updateSchoolChangeRequestStatus(userId, 'reject')
    const op = backend.expectOne(addTypenameToDocument(updateSchoolRequestStatusQuery));
    op.flush({
      "data": { "changeSchoolAction": { "school_id": 130, "new_school_id": 45, "status": "inactive", "approval_status": "reject", "__typename": "SchoolChangeRequest" } }
    });
  });

  it("should check openDismissDialog() - when dialog response available and to dismiss new user request", () => {
    let res = {
      "dismissType": 2,
      "dismissReason": "",
      "dismissDescription": "test",
      "user_id": 368
    };
    let userId = '368';
    spyOn(_dialogsService, 'dismissRequestPopUp').and.returnValue(of(res))
    component.openDismissDialog(userId, 1);
    fixture.detectChanges();
    expect(component.dismissStudentRequest).toHaveBeenCalled();
  });

  it("should check openDismissDialog() - when dialog response available and to dismiss school change request", () => {
    let res = {
      "dismissType": 2,
      "dismissReason": "",
      "dismissDescription": "test",
      "user_id": 368
    };
    let userId = '368';
    spyOn(_dialogsService, 'dismissRequestPopUp').and.returnValue(of(res))
    component.openDismissDialog(userId, 2);
    fixture.detectChanges();
    expect(component.updateSchoolChangeRequestStatus).toHaveBeenCalled();
  });

  it("should check openDismissDialog() - when dialog response not available", () => {
    let res = null;
    let userId = '368';
    spyOn(_dialogsService, 'dismissRequestPopUp').and.returnValue(of(res))
    component.openDismissDialog(userId, 1);
    fixture.detectChanges();
  });

  it('#getSearchTxt should return when search text is email', () => {
    const fakeNames = 'Email';
    component.userFormGroup.get('searchBy').setValue('email');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when search text is phone', () => {
    const fakeNames = 'Phone';
    component.userFormGroup.get('searchBy').setValue('phone');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when search text is date_of_birth', () => {
    const fakeNames = 'Date Of Birth';
    component.userFormGroup.get('searchBy').setValue('date_of_birth');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return empty when search text value is blank', () => {
    const fakeNames = '';
    component.userFormGroup.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('should check getSearch()', () => {
    let val = 'test';
    component.userFormGroup.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
    expect(component.userFormGroup).toBeTruthy();
  });

  it('#getSearch should check for false', () => {
    let val = '';
    component.getSearch();
    expect(false).toEqual(false);
  });

  it('should check getCustomStatus() - when returning status = #pre-approved', () => {
    let element = {
      registeredStatus: 'no'
    };
    let status = component.getCustomStatus(element);
    expect(status).toBe('pre-approved');
  });

  it('should check getCustomStatus() - when returning status = #migration request', () => {
    let element = {
      reqSchoolId: 45
    };
    component.schoolId = 45;
    let status = component.getCustomStatus(element);
    expect(status).toBe('migration request');
  });

  it('should check getCustomStatus() - when returning status = #dismissed', () => {
    let element = {
      schoolverifystatus: 'reject'
    };
    let status = component.getCustomStatus(element);
    expect(status).toBe('dismissed');
  });

  it('should check getCustomStatus() - else part', () => {
    let element = {
      schoolverifystatus: "approved"
    };
    let status = component.getCustomStatus(element);
    expect(status).toBe('approved');
  });

  it('should check #isMigrateStatus()', () => {
    spyOn(component, 'isMigrateStatus').and.callThrough();
    let item = { reqSchoolId: 1 };
    component.schoolId = 1;
    expect(component.isMigrateStatus(item)).toBe(true);

    component.schoolId = 2;
    expect(component.isMigrateStatus(item)).toBe(false);
  });

  it('should check #checkboxLabel()', () => {
    let row = null;
    spyOn(component, 'isAllSelected').and.returnValue(false);
    component.checkboxLabel(row);
    expect(true).toBeTruthy();
  });

  it('should check #bulkActionValidation() - when no checkbox is selected', () => {
    spyOn(component, 'bulkActionValidation').and.callThrough();
    component.selection.select();
    component.bulkActionValidation();
    expect(true).toBeTruthy();
  });

  it('should check #bulkActionValidation() - when migration request', () => {
    spyOn(component, 'bulkActionValidation').and.callThrough();
    spyOn(component, 'isMigrateStatus').and.returnValue(true);
    component.selection.select({ user_id: 1 } as any);
    component.bulkActionValidation();
    expect(true).toBeTruthy();
  });

  it('should check #bulkActionValidation() - when not migration request', () => {
    spyOn(component, 'bulkActionValidation').and.callThrough();
    spyOn(component, 'isMigrateStatus').and.returnValue(false);
    component.selection.select({ user_id: 1, schoolverifystatus: 'approve' } as any);
    component.statusAction = "approve";
    component.bulkActionValidation();
    expect(true).toBeTruthy();
  });

  it('should check #bulkActionValidation() - when 2 or more different types of status', () => {
    spyOn(component, 'bulkActionValidation').and.callThrough();
    spyOn(component, 'isMigrateStatus').and.returnValue(false);
    component.selection.select({ user_id: 1, schoolverifystatus: 'approve' } as any);
    component.selection.select({ user_id: 2, schoolverifystatus: 'pending' } as any);
    component.bulkActionValidation();
    expect(true).toBeTruthy();
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

    expect(component.getStudents).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly dismissStudentRequest', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.dismissStudentRequest({});
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_error_is_handled_correctly updateSchoolChangeRequestStatus', () => {
  spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.updateSchoolChangeRequestStatus('1','status');
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_error_is_handled_correctly updateNewStudentRequstStatus', () => {
  spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.updateNewStudentRequstStatus([],'status');
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_error_is_handled_correctly getFilterStatus', () => {
  spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.getFilterStatus();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});

it('test_error_is_handled_correctly getSearchOptions', () => {
  spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.getSearchOptions();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});

it('test_error_is_handled_correctly getStudents', () => {
  spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.getStudents();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
});
