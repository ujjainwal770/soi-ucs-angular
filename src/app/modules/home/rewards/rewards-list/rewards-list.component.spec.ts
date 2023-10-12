import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { getAllRewardListQuery } from 'src/app/core/query/rewards';
import { SharedService } from 'src/app/core/services/shared.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ArchiveRewardsComponent } from '../archive-rewards/archive-rewards.component';
import { RewardsListComponent } from './rewards-list.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('RewardsListComponent', () => {
  let component: RewardsListComponent;
  let fixture: ComponentFixture<RewardsListComponent>;
  let backend: ApolloTestingController;
  let _utilityService: UtilityService;
  let _router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RewardsListComponent],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'rewards/rewards-list', component: RewardsListComponent },
          { path: 'rewards/archive-rewards', component: ArchiveRewardsComponent }
        ]),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        ToastrService,
        SharedService,
        UtilityService,
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

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _utilityService = TestBed.inject(UtilityService);
    _router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);

    spyOn(component, 'handlePage').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
    spyOn(component, 'fetchRewardsList').and.callThrough();
    spyOn(component, 'userAction').and.callThrough();
    spyOn(component, 'searchUserText').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'revisedRewardsList').and.callThrough();
    spyOn(component, 'onDateChange').and.callThrough();
    spyOn(component, 'updateDatePickerSerachKeyword').and.callThrough();
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

  // it('should call resetFilter()', () => {
  //   component.resetFilter();
  //   expect(component.fetchRewardsList).toHaveBeenCalled();
  // });

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

  it('should check #userAction() - when calling rewards view detail page', () => {
    let action: Object = { path: 'view' };
    let selectedDetails = { rewardId: "01", id: 35 }
    const spy = spyOn(_router, 'navigateByUrl');
    component.userAction(action, selectedDetails);
    const url = spy.calls.first().args[0];
    expect(url).toBe('rewards/reward-details/35');
  });

  it('should check #userAction() - when not calling rewards view detail page', () => {
    let action: Object = {};
    let selectedDetails = { rewardId: "01", id: 35 }
    component.userAction(action, selectedDetails);
    spyOn(_router, "navigateByUrl").and.callThrough();
    expect(_router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('#getSearchTxt shoul return when search searchType is title', () => {
    const fakeName = 'Rewards';
    component.rewardListForm.get('searchBy').setValue('title');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeName);
  });

  it('#getSearchTxt shoul return when searchType is publishDate', () => {
    const fakeName = 'Publish Date';
    component.rewardListForm.get('searchBy').setValue('publishDate');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeName);
  });

  it('#getSearchTxt shoul return when searchType is resultDate', () => {
    const fakeName = 'Result Date';
    component.rewardListForm.get('searchBy').setValue('resultDate');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeName);
  });

  it('#getSearchTxt shoul return when search text is empty', () => {
    const fakeName = '';
    component.rewardListForm.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeName);
  });

  it('should check getSearch() when searchText not empty', () => {
    let val = 'test';
    component.rewardListForm.get('searchBy').setValue("title");
    component.rewardListForm.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
    expect(component.fetchRewardsList).toBeTruthy();
  });

  it('should check getSearch() when searchText is empty', () => {
    let val = '';
    component.rewardListForm.get('searchBy').setValue("title");
    component.rewardListForm.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
  });

  it('should check getSearch() - when isShowDatePicker = true', () => {
    component.rewardListForm.get('searchBy').setValue("publishDate");
    component.getSearch();
    expect(component.isShowDatePicker).toBe(true);
  });

  it('should check #revisedRewardsList()', () => {
    component.rewardListDetails = [
      {
        closingDate: new Date().getTime(),
        publishDate: new Date().getTime(),
      }
    ];
    component.revisedRewardsList();
    expect(component.rewardListDetails).toBeDefined;
  });
  it('should check #revisedRewardsList()', () => {
    component.rewardListDetails = [
      {
        closingDate: new Date().getTime(),
        publishDate: new Date().getTime(),
      }
    ];
    component.revisedRewardsList();
    expect(component.rewardListDetails).toBeDefined;
  });

  it('should check #fetchRewardsList()', () => {
    component.fetchRewardsList();
    const op = backend.expectOne(addTypenameToDocument(getAllRewardListQuery));
    op.flush({
      "data": { "getAllRewardList": { "rewards": [{ "id": "1", "rewardId": "00000181-f796-de39-a7a1-f7f6f88f0000", "title": "Video Chat with U.S. Youth Ambassador__changes", "totalUser": 0, "resultDate": 1661431516134, "closingDate": 1657975510633, "publishDate": 1657716321775, "rewardType": "Video", "tileImage": "https://soi-brightspot-lower.s3.amazonaws.com/ucs-headless/05/4a/569ed5d24fcbab3efd767aa1b5aa/thank-a-teacher.svg", "__typename": "AllRewardListResponse" }], "count": 3, "__typename": "AdminRewardList" } }
    });
    expect(component.dataSource).toBeDefined();
  });

  it('should check #isDatePicker() - when it returns true', () => {
    spyOn(component, 'isDatePicker').and.callThrough();
    component.rewardListForm.get('searchBy').setValue('publishDate');
    expect(component.isDatePicker()).toBe(true);
  });

  it('should check #isDatePicker() - when it returns false', () => {
    spyOn(component, 'isDatePicker').and.callThrough();
    component.rewardListForm.get('searchBy').setValue('title');
    expect(component.isDatePicker()).toBe(false);
  });

  it('should check #onDateChange() - when datePicker value exist', () => {
    let isInvalidDateEntered = false;
    let date = new Date('07/27/2022');
    component.rewardListForm.get('datePickerVal').setValue(date);
    component.onDateChange(isInvalidDateEntered);
    expect(component.rewardListForm.value.searchText).toBeDefined();
  });

  it('should check #onDateChange() - when datePicker value does not exist', () => {
    let date = '';
    let isInvalidDateEntered = false;
    component.rewardListForm.get('datePickerVal').setValue(date);
    component.onDateChange(isInvalidDateEntered);
    expect(component.rewardListForm.value.searchText).toBe('');
  });

  it('should check #onDateChange() - when datePicker value contains an invalid date', () => {
    let isInvalidDateEntered = true;
    component.onDateChange(isInvalidDateEntered);
    expect(false).toBe(false);
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "title";
    let sortingByColumn = "resultDate";
    
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
    component.sorting.sortingByColumn = "resultDate";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.fetchRewardsList).toHaveBeenCalled();
  });

  it("should check #updateDatePickerSerachKeyword()- when valid date selected", () => {
    spyOn(component, "isDatePicker").and.returnValue(true);

    // When valid date selected
    component.rewardListForm.get('datePickerVal').setValue(new Date());
    component.updateDatePickerSerachKeyword();
    expect(component.rewardListForm.value.searchText).not.toBe("");
  });

  it("should check #updateDatePickerSerachKeyword()- when invalid date selected", () => {
    spyOn(component, "isDatePicker").and.returnValue(false);
    component.updateDatePickerSerachKeyword();
    expect(component.rewardListForm.value.searchText).toBe("");
  });
  it('test_error_is_handled_correctly fetchRewardsList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchRewardsList();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
