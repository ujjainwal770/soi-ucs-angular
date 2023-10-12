import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { getChallengeByIdQuery, getChallengeReportAbuseDetails, getChallengeReportByIdQuery } from 'src/app/core/query/challenge-abuse';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InMemoryCache } from '@apollo/client/cache';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { HttpService } from 'src/app/core/services/http.service';
import { ChallengeAbuseComponent } from '../challenge-abuse/challenge-abuse.component';
import { ChallengeAbuseViewDetailComponent } from './challenge-abuse-view-detail.component';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ChallengeAbuseViewDetailComponent', () => {
  let component: ChallengeAbuseViewDetailComponent;
  let fixture: ComponentFixture<ChallengeAbuseViewDetailComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengeAbuseViewDetailComponent],
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
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id1: '0000017d-517c-d286-ab7d-ff7eef8b0000'
            }, {
              id2: 165
            }
            ),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeAbuseViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    spyOn(component, 'getChallengeReportList').and.callThrough();
    spyOn(component, 'extractUser').and.callThrough();
    spyOn(component, 'getChallengeById').and.callThrough();
    spyOn(component, 'getChallengeReportAbuseById').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should check ngOnInit()', () => {
  //   component.ngOnInit();
  //   expect(component.getChallengeReportAbuseById).toHaveBeenCalled();
  // });

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

  it("should check getChallengeReportList()", () => {
    component.getChallengeReportList();
    const op = backend.expectOne(addTypenameToDocument(getChallengeReportAbuseDetails));
    op.flush({
      "data": { "challengeReportAbuseDetails": { "count": 5, "data": [{ "reason": "This is another report of abuse", "reported_by": 180, "creation_time": 1643439910995, "__typename": "ChallengeReportAbuse" }, { "reason": "this is a test report", "reported_by": 180, "creation_time": 1643439004991, "__typename": "ChallengeReportAbuse" }, { "reason": "this is a test, bhjjj, ghhjjjj", "reported_by": 180, "creation_time": 1643438859759, "__typename": "ChallengeReportAbuse" }, { "reason": " Add Ada adds a dfsadfsdf s", "reported_by": 207, "creation_time": 1643001430349, "__typename": "ChallengeReportAbuse" }, { "reason": "this is a test reason to report a challenge", "reported_by": 165, "creation_time": 1641811621603, "__typename": "ChallengeReportAbuse" }], "users": [{ "email": "ucs1@yopmail.com", "user_id": 165, "first_name": "Test", "last_name": "User One", "__typename": "FindUserResponse" }, { "email": "qon@hstuie.com", "user_id": 180, "first_name": "Ramajuj", "last_name": "Khan", "__typename": "FindUserResponse" }, { "email": "testucs3@dev.com", "user_id": 207, "first_name": "Testin", "last_name": "User", "__typename": "FindUserResponse" }], "__typename": "ChallengeReportAbuseDetailsResponse" } }
    });
    expect(component.dataSource).toBeDefined();
  });

  it("should check getChallengeById()", () => {
    component.getChallengeById("0000017d-517c-d286-ab7d-ff7eef8b0000");
    const op = backend.expectOne(addTypenameToDocument(getChallengeByIdQuery));
    op.flush({
      "data": { "getChallengeByIDBrightSpot": { "challengeId": "0000017d-517c-d286-ab7d-ff7eef8b0000", "title": "Growing as a Leader", "badgeCategory": "Learn", "submissionType": "Text", "publishDate": 1637749912372, "challengeType": "Video", "__typename": "BrightSpotModifiedChallengeResponse" } }
    });
  });

  it("should check getChallengeReportAbuseById()", () => {
    let reportAbuseId = 36;
    component.getChallengeReportAbuseById(reportAbuseId);
    const op = backend.expectOne(addTypenameToDocument(getChallengeReportByIdQuery));
    op.flush({
      "data": { "getChallengeReportAbuseById": { "data": { "reported_by": 165, "reason": "this is testing reason for the report", "creation_time": 1644312470136, "__typename": "ChallengeReportAbuse" }, "user": { "full_name": "Test User One", "__typename": "FindUserResponse" }, "__typename": "ChallengeReportFindOne" } }
    });
  });

  it("should check extractUser() - check when the if condtion is false", () => {
    let reportedBy = '165';
    let type = 'reportedBy';
    component.extractUser(reportedBy, type);
  });
  it('test_error_is_handled_correctly getChallengeReportList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getChallengeReportList();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getChallengeById', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getChallengeById('1');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getChallengeReportAbuseById', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getChallengeReportAbuseById('1');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});