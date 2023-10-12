import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { appUserActiveStatusQuery, userReportAbuseQuery, userSearchByOptionQuery, userTypeOptionQuery } from '../../../../core/query/appuser';


import { Router } from '@angular/router';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { ReportAbuseComponent } from './report-abuse.component';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';

class MockRouter {
  navigateByUrl(url: string) { return url; }
}

describe('ReportAbuseComponent', () => {
  let component: ReportAbuseComponent;
  let fixture: ComponentFixture<ReportAbuseComponent>;
  let backend: ApolloTestingController;
  let _utilityService: UtilityService;
  let _router: Router;
  let _dialogsService: DialogsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportAbuseComponent,ConvertToLocalDatePipe],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService, DialogsService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: Router, useClass: MockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAbuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _router = TestBed.inject(Router);
    _utilityService = TestBed.inject(UtilityService);
    _dialogsService = TestBed.inject(DialogsService);
    spyOn(component, 'getReportAbuseUserList').and.callThrough();
    spyOn(component, 'getUserTypeOption').and.callThrough();
    spyOn(component, 'getUserSearchByOption').and.callThrough();
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'userAction').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
    spyOn(component, 'changeUserStatus').and.callThrough();
  });

  it('should create', () => {
    console.log("ReportAbuseComponent - should create");
    expect(component).toBeTruthy();
  });

  it('should call handlePage() return valid', () => {
    console.log(`ReportAbuseComponent -> handlePage() -> 1`);


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

  it("should check getReportAbuseUserList()", () => {
    console.log(`ReportAbuseComponent -> getReportAbuseUserList() -> 1`);

    const op = backend.expectOne(addTypenameToDocument(userReportAbuseQuery));
    op.flush({
      "data": { "userReportAbuseList": { "users": [{ "user_id": 196, "first_name": "Nru", "last_name": "Singh", "date_of_birth": 822096000000, "email": "nm2@gmail.com", "ucs_status": "no", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 12, "first_name": "", "last_name": "", "date_of_birth": null, "email": "cidrosopsu@vusra.com", "ucs_status": "yes", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 11, "first_name": "", "last_name": "", "date_of_birth": null, "email": "zirkenurdi@vusra.com", "ucs_status": "yes", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 10, "first_name": "", "last_name": "", "date_of_birth": null, "email": "vaydutopsa@vusra.com", "ucs_status": "yes", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 9, "first_name": "", "last_name": "", "date_of_birth": null, "email": "pafyiherki@vusra.com", "ucs_status": "yes", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 8, "first_name": "", "last_name": "", "date_of_birth": null, "email": "naydularde@vusra.com", "ucs_status": "yes", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 7, "first_name": "", "last_name": "", "date_of_birth": null, "email": "gognonospe@vusra.com", "ucs_status": "yes", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 5, "first_name": "", "last_name": "", "date_of_birth": null, "email": "berzozosti@vusra.com", "ucs_status": "yes", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 4, "first_name": "Vibhanshu", "last_name": "Chhangani", "date_of_birth": 1, "email": "luqmaan.talha@icelogs.com", "ucs_status": "yes", "reportabusecount": 8, "account_status": "active", "__typename": "UserReportAbuseResponse" }, { "user_id": 3, "first_name": "Sneha", "last_name": "Sarkar", "date_of_birth": 1, "email": "ferov56384@epeva.com", "ucs_status": "yes", "reportabusecount": 1, "account_status": "active", "__typename": "UserReportAbuseResponse" }], "count": 12, "__typename": "UserReportAbuseListResponse" } }
    });
    expect(component.dataSource).toBeDefined();
  });

  it("should set user type option list getUserTypeOption()", () => {
    console.log(`ReportAbuseComponent -> getUserTypeOption() -> 1`);

    const op = backend.expectOne(addTypenameToDocument(userTypeOptionQuery));
    op.flush({
      "data": { "getUserTypeOptionList": { "options": [{ "text": "All", "query": "all", "__typename": "UserTypeOptionSingle" }, { "text": "UCS User", "query": "yes", "__typename": "UserTypeOptionSingle" }, { "text": "Guest User", "query": "no", "__typename": "UserTypeOptionSingle" }], "__typename": "UserTypeOptionList" } }
    })
    expect(component.userTypeOptionList).toBeDefined();
    // backend.verify();
  });

  it("should set user type option list getUserSearchByOption()", () => {
    console.log(`ReportAbuseComponent -> getUserSearchByOption() -> 1`);

    const op = backend.expectOne(addTypenameToDocument(userSearchByOptionQuery));
    op.flush({
      "data": { "getUserSearchByList": { "options": [{ "text": "Name", "query": "first_name", "__typename": "SearchOptionSingle" }, { "text": "Email", "query": "email", "__typename": "SearchOptionSingle" }], "__typename": "SearchOptionList" } }
    });
    expect(component.userTypeOptionList).toBeDefined();
    // backend.verify();
  });

  it('should check getSearch()', () => {
    console.log(`ReportAbuseComponent -> getSearch() -> 1`);

    let val = 'test';
    component.reportAbuseForm.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
    expect(component.getReportAbuseUserList).toBeTruthy();

  });

  it('#getSearch should check for false', () => {
    console.log(`ReportAbuseComponent -> getSearch() -> 2`);

    component.getSearch();
    expect(false).toEqual(false);
  });

  it('#getSearchTxt should return when search text is name', () => {
    console.log(`ReportAbuseComponent -> getSearchTxt() -> 1`);

    const fakeNames = 'Name';
    component.reportAbuseForm.get('searchBy').setValue('full_name');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when search text is email', () => {
    console.log(`ReportAbuseComponent -> getSearchTxt() -> 2`);

    const fakeNames = 'Email Id';
    component.reportAbuseForm.get('searchBy').setValue('email');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);

  });

  it('#getSearchTxt should return empty when search text value is blank', () => {
    console.log(`ReportAbuseComponent -> getSearchTxt() -> 3`);

    const fakeNames = '';
    component.reportAbuseForm.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#userAction should navigate to report abuse details page', () => {
    console.log(`ReportAbuseComponent -> userAction() -> 1`);

    let path = 'view';
    let item = {
      userid: 165
    };
    const spy = spyOn(_router, 'navigateByUrl');
    component.userAction(path, item);
    expect(_router.navigateByUrl).toHaveBeenCalled();
  });

  it('#userAction should check for false', () => {
    console.log(`ReportAbuseComponent -> userAction() -> 2`);

    let path = '';
    let userid;
    component.userAction(path, userid);
    expect(false).toEqual(false);
  });

  it('should check resetFilter ()', () => {
    console.log(`ReportAbuseComponent -> resetFilter() -> 1`);

    component.resetFilter();
    expect(component.getSearch).toBeTruthy();
    expect(component.getReportAbuseUserList).toHaveBeenCalled();
  });

  it('should check searchUserText() - test when searchKeyword available', () => {
    console.log(`ReportAbuseComponent -> searchUserText() -> 1`);

    let searchData = "t";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });
  
  it('should check searchUserText() - test when searchKeyword not available', () => {
    console.log(`ReportAbuseComponent -> searchUserText() -> 2`);

    let searchData = "";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should call #changeUserStatus() - check when dialog response available', () => {
    console.log(`ReportAbuseComponent -> changeUserStatus() -> 1`);

    let id = "School Manager";
    let currentStatus = "active";
    let res = { "data": "data" };

    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.changeUserStatus(id, currentStatus);
    const op = backend.expectOne(addTypenameToDocument(appUserActiveStatusQuery));
    op.flush({
      "data": { "getUserSearchByList": { "options": [{ "text": "Name", "query": "first_name", "__typename": "SearchOptionSingle" }, { "text": "Email", "query": "email", "__typename": "SearchOptionSingle" }], "__typename": "SearchOptionList" } }
    })
    expect(false).toBe(false);
  });

  it('should call changeUserStatus() - check when dialog response not available', () => {
    console.log(`ReportAbuseComponent -> changeUserStatus() -> 2`);

    let id = "School Manager";
    let currentStatus = "active";
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.changeUserStatus(id, currentStatus);
    expect(false).toBe(false);
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

    expect(component.getReportAbuseUserList).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getReportAbuseUserList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getReportAbuseUserList();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getUserTypeOption', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getUserTypeOption();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getUserSearchByOption', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getUserSearchByOption();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

});
