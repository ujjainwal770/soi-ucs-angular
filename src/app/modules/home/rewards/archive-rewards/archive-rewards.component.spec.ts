import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveRewardsComponent } from './archive-rewards.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { getArchiveRewardsQuery } from 'src/app/core/query/rewards';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import mockValues from 'src/app/core/constants/mock.values';
import { SharedService } from 'src/app/core/services/shared.service';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ArchiveRewardsComponent', () => {
  let component: ArchiveRewardsComponent;
  let fixture: ComponentFixture<ArchiveRewardsComponent>;
  let backend: ApolloTestingController;
  let _utilityService: UtilityService;
  let _router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchiveRewardsComponent],
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
        ToastrService,
        UtilityService,
        SharedService,
        NgxSpinnerService,
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
    fixture = TestBed.createComponent(ArchiveRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _utilityService = TestBed.inject(UtilityService);
    _router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);

    spyOn(component, 'handlePage').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
    spyOn(component, 'fetchArchiveRewardsList').and.callThrough();
    spyOn(component, 'userAction').and.callThrough();
    spyOn(component, 'searchUserText').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'remapRewardsList').and.callThrough();
    spyOn(component, 'onDateChange').and.callThrough();
    spyOn(component, 'custmSorting').and.callThrough();
    spyOn(component, 'convertPickerValueToSearchKeyword').and.callThrough();
  });

  it('should create', () => {
    console.log(`ArchiveRewardsComponent -> first test`);
    expect(component).toBeTruthy();
  });

  it('should call handlePage() return valid', () => {
    console.log(`ArchiveRewardsComponent -> handlePage()`);

    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  // it('should call resetFilter()', () => {
  //   console.log(`ArchiveRewardsComponent -> resetFilter()`);

  //   component.resetFilter();
  //   expect(component.fetchArchiveRewardsList).toHaveBeenCalled();
  // });

  it('should check searchUserText() - test when searchKeyword length > 2', () => {
    console.log(`ArchiveRewardsComponent -> searchUserText() -> 1`);

    let searchData = "test";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check searchUserText() - test when searchKeyword length = 0', () => {
    console.log(`ArchiveRewardsComponent -> searchUserText() -> 2`);

    let searchData = "";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check searchUserText() - test when searchKeyword length not > 2 and not 0', () => {
    console.log(`ArchiveRewardsComponent -> searchUserText() -> 3`);

    let searchData = "t";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check #userAction() - when calling rewards view detail page', () => {
    console.log(`ArchiveRewardsComponent -> userAction() -> 1`);

    let action: Object = { path: 'view' };
    let selectedDetails = { rewardId: "01", id: 35 }
    const spy = spyOn(_router, 'navigateByUrl');
    component.userAction(action, selectedDetails);
    const url = spy.calls.first().args[0];
    expect(url).toBe('rewards/reward-details/35');
  });

  it('should check #userAction() - when not calling rewards view detail page', () => {
    console.log(`ArchiveRewardsComponent -> userAction() -> 2`);

    let action: Object = {};
    let selectedDetails = { rewardId: "01", id: 35 }
    component.userAction(action, selectedDetails);
    spyOn(_router, "navigateByUrl").and.callThrough();
    expect(_router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('#getSearchTxt should return when search searchType is title', () => {
    console.log(`ArchiveRewardsComponent -> getSearchTxt() -> 1`);

    const fakeName = 'Rewards';
    component.archiveRewardListForm.get('searchBy').setValue('title');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeName);
  });

  it('#getSearchTxt should return when searchType is publishDate', () => {
    console.log(`ArchiveRewardsComponent -> getSearchTxt() -> 2`);

    const fakeName = 'Publish Date';
    component.archiveRewardListForm.get('searchBy').setValue('publishDate');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeName);
  });

  it('#getSearchTxt shoul return when searchType is resultDate', () => {
    console.log(`ArchiveRewardsComponent -> getSearchTxt() -> 3`);

    const fakeName = 'Result Date';
    component.archiveRewardListForm.get('searchBy').setValue('resultDate');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeName);
  });

  it('#getSearchTxt shoul return when search text is empty', () => {
    console.log(`ArchiveRewardsComponent -> getSearchTxt() -> 4`);

    const fakeName = '';
    component.archiveRewardListForm.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeName);
  });

  it('should check getSearch() when searchText not empty', () => {
    console.log(`ArchiveRewardsComponent -> getSearch() -> 1`);

    let val = 'test';
    component.archiveRewardListForm.get('searchBy').setValue("title");
    component.archiveRewardListForm.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
    expect(component.fetchArchiveRewardsList).toBeTruthy();
  });

  it('should check getSearch() when searchText is empty', () => {
    console.log(`ArchiveRewardsComponent -> getSearch() -> 2`);

    let val = '';
    component.archiveRewardListForm.get('searchBy').setValue("title");
    component.archiveRewardListForm.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
  });

  it('should check getSearch() - when isShowDatePicker = true', () => {
    console.log(`ArchiveRewardsComponent -> getSearch() -> 3`);

    component.archiveRewardListForm.get('searchBy').setValue("publishDate");
    component.getSearch();
    expect(component.isShowDatePicker).toBe(true);
  });

  it('should check #remapRewardsList()', () => {
    console.log(`ArchiveRewardsComponent -> remapRewardsList() -> 1`);

    component.rewardListDetails = [
      {
        closingDate: new Date().getTime(),
        publishDate: new Date().getTime(),
      }
    ];
    component.remapRewardsList();
    expect(component.rewardListDetails).toBeDefined;
  });

  it('should check #fetchArchiveRewardsList()', () => {
    console.log(`ArchiveRewardsComponent -> fetchArchiveRewardsList() -> 1`);

    component.fetchArchiveRewardsList();
    const op = backend.expectOne(addTypenameToDocument(getArchiveRewardsQuery));
    op.flush({
      "data": { "getAllArchivedRewardList": { "rewards": [{ "id": "34", "rewardId": "00000182-aaa7-d145-a3e3-aeb7aca10000", "title": "Attend an ESPN Top 5 Banner Presentation__33", "totalUser": 1, "resultDate": 1661949992961, "closingDate": 1661431587433, "publishDate": 1660720542020, "rewardType": "Class", "tileImage": "https://soi-brightspot-lower.s3.amazonaws.com/ucs-headless/24/96/358c8c7c434bab3f87a10cb725bb/include-challenge-details-pic2.png", "__typename": "AllRewardListResponse" }], "count": 12, "currentDate": 1661183615782, "__typename": "AdminRewardList" } }
    });
    expect(component.dataSource).toBeDefined();
  });

  it('should check #isDatePicker() - when it returns true', () => {
    console.log(`ArchiveRewardsComponent -> isDatePicker() -> 1`);

    spyOn(component, 'isDatePicker').and.callThrough();
    component.archiveRewardListForm.get('searchBy').setValue('publishDate');
    expect(component.isDatePicker()).toBe(true);
  });

  it('should check #isDatePicker() - when it returns false', () => {
    console.log(`ArchiveRewardsComponent -> isDatePicker() -> 2`);

    spyOn(component, 'isDatePicker').and.callThrough();
    component.archiveRewardListForm.get('searchBy').setValue('title');
    expect(component.isDatePicker()).toBe(false);
  });

  it('should check #onDateChange() - when datePicker value exist', () => {
    console.log(`ArchiveRewardsComponent -> onDateChange() -> 1`);

    let isInvalidDateEntered = false;
    let date = new Date('07/27/2022');
    component.archiveRewardListForm.get('datePickerVal').setValue(date);
    component.onDateChange(isInvalidDateEntered);
    expect(component.archiveRewardListForm.value.searchText).toBeDefined();
  });

  it('should check #onDateChange() - when datePicker value does not exist', () => {
    console.log(`ArchiveRewardsComponent -> onDateChange() -> 2`);

    let date = '';
    let isInvalidDateEntered = false;
    component.archiveRewardListForm.get('datePickerVal').setValue(date);
    component.onDateChange(isInvalidDateEntered);
    expect(component.archiveRewardListForm.value.searchText).toBe('');
  });

  it('should check #onDateChange() - when datePicker value contains an invalid date', () => {
    console.log(`ArchiveRewardsComponent -> onDateChange() -> 3`);

    let isInvalidDateEntered = true;
    component.onDateChange(isInvalidDateEntered);
    expect(false).toBe(false);
  });

  it('should check #custmSorting()', () => {
    component.sorting.sortingByColumn = "title";
    let sortingByColumn = "resultDate";

    // ascending order.
    component.sorting.sortingClickCounter = 0;
    component.custmSorting(sortingByColumn);

    // descending order.
    component.sorting.sortingClickCounter = 1;
    component.custmSorting(sortingByColumn);

    // Initial sorting i.e descending
    component.sorting.sortingClickCounter = 2;
    component.custmSorting(sortingByColumn);

    // When an invalid choice
    component.sorting.sortingByColumn = "resultDate";
    component.sorting.sortingClickCounter = 3;
    component.custmSorting(sortingByColumn);
    expect(component.fetchArchiveRewardsList).toHaveBeenCalled();
  });

  it("should check #convertPickerValueToSearchKeyword()- when datepicker active", () => {
    spyOn(component, "isDatePicker").and.returnValue(true);
    // When valid date selected
    component.archiveRewardListForm.get('datePickerVal').setValue(new Date());
    component.convertPickerValueToSearchKeyword();
    expect(component.archiveRewardListForm.value.searchText).not.toBe("");
  });

  it("should check #convertPickerValueToSearchKeyword()- when datepicker not active", () => {
    spyOn(component, "isDatePicker").and.returnValue(false);
    component.convertPickerValueToSearchKeyword();
    expect(component.archiveRewardListForm.value.searchText).toBe("");
  });
  it('test_error_is_handled_correctly fetchArchiveRewardsList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchArchiveRewardsList();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
});
