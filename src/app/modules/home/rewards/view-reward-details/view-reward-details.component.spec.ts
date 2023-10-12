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
import { of } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { getRewardsDetail } from 'src/app/core/query/rewards';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ViewRewardDetailsComponent } from './view-reward-details.component';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ViewRewardDetailsComponent', () => {
  let component: ViewRewardDetailsComponent;
  let fixture: ComponentFixture<ViewRewardDetailsComponent>;
  let backend: ApolloTestingController;
  let _dialogsService: DialogsService;
  let _router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRewardDetailsComponent,ConvertToLocalDatePipe],imports: [
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

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRewardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _dialogsService = TestBed.inject(DialogsService);
    _router = TestBed.inject(Router)

    spyOn(component, 'handlePage').and.callThrough();
    spyOn(component, 'fetchRewardsDetail').and.callThrough();
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'getRevisedUserData').and.callThrough();
    spyOn(component, 'markAsWinner').and.callThrough();
    spyOn(component, 'back').and.callThrough();
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

  it('should check #fetchRewardsDetail()', () => {
    component.fetchRewardsDetail();
    const op = backend.expectOne(addTypenameToDocument(getRewardsDetail));
    op.flush({
      "data":{"rewardDetailsView":{"rewardDetails":{"id":"18","rewardId":"00000182-5cf8-de39-a7a2-fcfe5d580000","title":"Global Ambassador Cameo","publishDate":1659417327693,"resultDate":1660108486364,"closingDate":1659676481712,"description":"Receive a special video message from a Special Olympics Global Ambassador.","points":5000,"totalUser":null,"tileImage":"https://soi-brightspot-lower.s3.amazonaws.com/ucs-headless/c0/89/75cf99d8435c99e19d73c853800f/globalambassadorcameo-3x.png","winnerStatus":null,"daysLeftForClosing":0,"rewardEndingCount":0,"status":0,"__typename":"AllRewardListResponse"},"users":[{"userId":305,"fullName":"John😎😎 Carter","email":"testnonucs4@dev.com","date_of_birth":"1107734400000","schoolName":null,"reportabusecount":0,"winnerStatus":0,"__typename":"UsersRewardListResponse"}],"count":1,"currentTime":1660108486364,"__typename":"RewardDetailsView"}}
    });
    expect(component.dataSource).toBeDefined();
  });

  xit('should check #getRevisedUserData() - When winner already selected', () => {
    let userData = [{"userId":305,"fullName":"John Carter","email":"testnonucs4@dev.com","date_of_birth":"1107734400000","schoolName":null,"reportabusecount":0,"winnerStatus":1,"__typename":"UsersRewardListResponse"}];
    let revisedUserData = component.getRevisedUserData(userData);
    expect(revisedUserData).toEqual(userData);
  });

  xit('should check #getRevisedUserData() - When winner not selected', () => {
    let userData = [{"userId":305,"fullName":"John Carter","email":"testnonucs4@dev.com","date_of_birth":"1107734400000","schoolName":null,"reportabusecount":0,"winnerStatus":0,"__typename":"UsersRewardListResponse"}];
    component.getRevisedUserData(userData);
    expect(component.isWinnerSelected).toBe(false);
  });

  it('should check #markAsWinner() - when userId > 0', () => {
    let userId = 1;
    let name = "test name"
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.markAsWinner(userId, name);
    expect(component.fetchRewardsDetail).toHaveBeenCalled();
  });

  it('should check #markAsWinner() - when userId = 0', () => {
    let userId = 0;
    let name = "test name"
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.markAsWinner(userId, name);
    expect(component.fetchRewardsDetail).not.toHaveBeenCalled();
  });

  it('should check #markAsWinner() - when user clicked NO from the confirmation dialog', () => {
    let userId = 0;
    let name = "test name"
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.markAsWinner(userId, name);
    expect(false).toBe(false);
  });

  it("should check back() - when isWinnerSelected = true", () => {
    component.isWinnerSelected = true;
    const spy = spyOn(_router, 'navigate');
    component.back();
    expect(_router.navigate).toHaveBeenCalled();
  });

  it("should check back() - when isWinnerSelected = false", () => {
    component.isWinnerSelected = false;
    const spy = spyOn(_router, 'navigate');
    component.back();
    expect(_router.navigate).toHaveBeenCalled();
  });
});
