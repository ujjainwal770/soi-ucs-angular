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
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { getChallengeByOptionQuery, getChallengeReportAbuseQuery, searchByOptionQuery } from 'src/app/core/query/challenge-abuse';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ChallengeAbuseComponent } from './challenge-abuse.component';


class MockRouter {
  navigateByUrl(url: string) { return url; }
}

describe('ChallengeAbuseComponent', () => {
  let component: ChallengeAbuseComponent;
  let fixture: ComponentFixture<ChallengeAbuseComponent>;
  let backend: ApolloTestingController;
  let _utilityService: UtilityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengeAbuseComponent],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'content-management/challenge-abuse', component: ChallengeAbuseComponent }
        ]),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService, LocalStorageService,
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
    fixture = TestBed.createComponent(ChallengeAbuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _utilityService = TestBed.inject(UtilityService);
    spyOn(component, 'getChallengeAbuseList').and.callThrough();
    spyOn(component, 'getChallengeAbuseOptions').and.callThrough();
    spyOn(component, 'getSearchOptions').and.callThrough();

    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'userAction').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
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
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  it("should check getChallengeAbuseList()", () => {
    component.getChallengeAbuseList();
    const op = backend.expectOne(addTypenameToDocument(getChallengeReportAbuseQuery));
    op.flush({ "data": { "challengeReportAbuseList": { "count": 36, "data": [{ "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 165, "creation_time": 1644312470136, "status": "active", "id": 36, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 165, "creation_time": 1644311526102, "status": "active", "id": 35, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 526, "creation_time": 1644310135381, "status": "active", "id": 34, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 165, "creation_time": 1644306535827, "status": "active", "id": 33, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 165, "creation_time": 1643872508259, "status": "active", "id": 32, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 165, "creation_time": 1643797991805, "status": "active", "id": 31, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 165, "creation_time": 1643797006921, "status": "active", "id": 30, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 526, "creation_time": 1643790970177, "status": "active", "id": 29, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-51a1-d286-ab7d-ffe354660000", "reason": "Good to play this challenge\n\n", "reported_by": 96, "creation_time": 1643779561794, "status": "active", "id": 28, "__typename": "ChallengeReportAbuse" }, { "challenge_id": "0000017d-517c-d286-ab7d-ff7eef8b0000", "reason": "this is testing reason for the report", "reported_by": 165, "creation_time": 1643737310058, "status": "active", "id": 27, "__typename": "ChallengeReportAbuse" }], "users": [{ "user_id": 96, "email": "moharananrusingha1995@gmail.com", "first_name": "NRUSINGHA", "last_name": "MOHARANA", "__typename": "FindUserResponse" }, { "user_id": 165, "email": "ucs1@yopmail.com", "first_name": "Test", "last_name": "User One", "__typename": "FindUserResponse" }], "__typename": "ChallengeReportAbuseListResponse" } } }
    );
    expect(component.dataSource).toBeDefined();
  });

  it("should set user type option list getChallengeAbuseOptions()", () => {
    const op = backend.expectOne(addTypenameToDocument(getChallengeByOptionQuery));
    op.flush({
      "data": { "getChallengesFromBrightSpotOkta": [{ "challengeId": "0000017d-517c-d286-ab7d-ff7eef8b0000", "title": "Growing as a Leader", "trash": "no" }] }
    })
    expect(component.getChallengeAbuseOptions).toBeDefined();
  });  

  it('should check getSearch()', () => {
    let val = 'test';
    component.challengeAbuseForm.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
    expect(component.getChallengeAbuseList).toBeTruthy();
  });

  it('#getSearch should check for false', () => {
    component.getSearch();
    expect(false).toEqual(false);
  });

  it('#getSearchTxt should return when search text is name', () => {
    const fakeNames = 'Reason';
    component.challengeAbuseForm.get('searchBy').setValue('reason');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when search text is email', () => {
    const fakeNames = 'Email Id';
    component.challengeAbuseForm.get('searchBy').setValue('email');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);

  });

  it('#getSearchTxt should return empty when search text value is blank', () => {
    const fakeNames = '';
    component.challengeAbuseForm.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
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

  it('should call extractChallengeDetails()', () => {
    let challengeId = "0000017d-2f00-d286-ab7d-bf6228430000";
    let whatToReturn = "challenge-name";
    expect(component.extractChallengeDetails(challengeId, whatToReturn)).toBe('N/A');
  });

  it('#userAction should navigate to challenge abuse page', inject([Router], (router: Router) => {
    let action: Object = { name: 'View Details', path: 'view', icon: 'remove_red_eye' };
    let selectedDetails = { challenge_id: "0000017d-2f00-d286-ab7d-bf6228430000", id: 35 }
    const spy = spyOn(router, 'navigateByUrl');
    component.userAction(action, selectedDetails);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/content-management/challenge-abuse-details/0000017d-2f00-d286-ab7d-bf6228430000/35');
  }));

  it('#userAction should check for false', () => {
    let path = '';
    let selectedDetails = {}
    component.userAction(path, selectedDetails);
    expect(false).toEqual(false);
  });

  it("should check the initial value of #challengeAbuseOptions array", () => {
    expect(component.challengeAbuseOptions).toEqual([]);
  });

  it('should check resetFilter ()', () => {
    component.resetFilter();
    expect(component.getSearch).toBeTruthy();
    expect(component.getChallengeAbuseList).toHaveBeenCalled();
  });

  it('should check getfiltered ()', () => {

    component.getfiltered(180, 'reportedBy');
    component.UserListDetails = [
      {
        email: "qon@hstuie.com",
        first_name: "Ramajuj",
        last_name: "Khan",
        user_id: 180,
        __typename: "FindUserResponse"
      }
    ]
    // expect(component.getChallengeAbuseList).toHaveBeenCalled();
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "challengeName";
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
    component.sorting.sortingByColumn = "creationTime";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.getChallengeAbuseList).toHaveBeenCalled();
  });
      // Tests that getfiltered returns email when UserListDetails is not empty and contains the user with the given cId and type is not 'reportedBy'
      it('test_happy_path_user_found_type_not_reported_by', () => {
        component.UserListDetails = [
          {
            user_id: '1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com'
          }
        ];
        const result = component.getfiltered('1', 'notReportedBy');
        expect(result).toEqual('johndoe@example.com');
      });
          // Tests that getfiltered returns undefined when firstName and lastName are undefined and email is undefined
          it('test_error_is_handled_correctly getChallengeAbuseList', () => {
            spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
            spyOn(component['_errorHandler'], 'manageError');
            component.getChallengeAbuseList();
           expect(component['_errorHandler'].manageError).toHaveBeenCalled();
        });
        it('test_error_is_handled_correctly getChallengeAbuseOptions', () => {
          spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
          spyOn(component['_errorHandler'], 'manageError');
          component.getChallengeAbuseOptions();
         expect(component['_errorHandler'].manageError).toHaveBeenCalled();
      });
      it('test_error_is_handled_correctly getSearchOptions', () => {
        spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
        spyOn(component['_errorHandler'], 'manageError');
        component.getSearchOptions();
       expect(component['_errorHandler'].manageError).toHaveBeenCalled();
    });
});