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
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { appUserActiveStatusQuery, userReportAbuseDetailQuery, userReportAbuseInformationQuery } from '../../../../../core/query/appuser';

import { ViewAbuseComponent } from './view-abuse.component';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';


describe('ViewAbuseComponent', () => {
  let component: ViewAbuseComponent;
  let fixture: ComponentFixture<ViewAbuseComponent>;
  let backend: ApolloTestingController;
  let _dialogsService: DialogsService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAbuseComponent,ConvertToLocalDatePipe],
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
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService, DialogsService,
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
    fixture = TestBed.createComponent(ViewAbuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _dialogsService = TestBed.inject(DialogsService);
    spyOn(component, 'getReportAbuseByID').and.callThrough();
    spyOn(component, 'getReportedAbuseList').and.callThrough();
    spyOn(component, 'getReportedByName').and.callThrough();
    spyOn(component, 'changeStatus').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get report abuse data based on user id getReportAbuseByID()', () => {
    const op = backend.expectOne(addTypenameToDocument(userReportAbuseInformationQuery));
    op.flush({
      "data": { "reportAbuseUserInformation": { "user": { "user_id": 1, "first_name": "Nrusingha ", "last_name": "Moharana", "date_of_birth": 820108800000, "email": "cefapi7012@datakop.com", "ucs_status": "yes", "account_status": "active", "reportabusecount": 5, "phone": "", "__typename": "User" }, "school": { "schoolName": "St Jospehs New", "addressFirst": "63536, 66th Floor", "addressSecond": "vil rd an nagar", "__typename": "School" }, "__typename": "ReportAbuseUserInfoResponse" } }
    });
    expect(component.dataSource).toBeDefined();
    // backend.verify();
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

  it("should check getReportedAbuseList()", () => {
    const op = backend.expectOne(addTypenameToDocument(userReportAbuseDetailQuery));
    op.flush({
      "data": { "userReportAbuseDetails": { "data": [{ "reported_by": 165, "creation_time": 1640935172764, "reason": "my test reason2222", "__typename": "UserReportAbuse" }, { "reported_by": 165, "creation_time": 1640935171175, "reason": "my test reason2222", "__typename": "UserReportAbuse" }, { "reported_by": 165, "creation_time": 1640935169700, "reason": "my test reason2222", "__typename": "UserReportAbuse" }, { "reported_by": 165, "creation_time": 1640935168791, "reason": "my test reason2222", "__typename": "UserReportAbuse" }, { "reported_by": 165, "creation_time": 1640935166002, "reason": "my test reason2222", "__typename": "UserReportAbuse" }], "users": [{ "user_id": 165, "first_name": "Test", "last_name": "User One", "__typename": "FindUserResponse" }], "count": 5, "__typename": "UserReportAbuseDetailsResponse" } }
    });
    expect(component.dataSource).toBeDefined();
    // backend.verify();
  });


  it("should check #getReportedByName - when reportedByUser available and userId match", () => {
    let usreid = 165;
    component.reportedByUser = [
      { user_id: 165, first_name: "Test", last_name: "User" }
    ];
    let username = component.reportedByUser[0].first_name + ' ' + component.reportedByUser[0].last_name;
    expect(username).toBe(component.getReportedByName(usreid));
  });

  it("should check #getReportedByName - when reportedByUser available and userId does not match", () => {
    let usreid = 165;
    component.reportedByUser = [
      { user_id: 170, first_name: "Test", last_name: "User" }
    ];
    let username = component.reportedByUser[0].first_name + ' ' + component.reportedByUser[0].last_name;
    expect(username).not.toBe(component.getReportedByName(usreid));
  });

  it("should check #getReportedByName - when reportedByUser is not available", () => {
    let usreid = 165;
    component.reportedByUser = [];
    let username = '';
    expect(username).toBe(component.getReportedByName(usreid));
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
  it('test_error_is_handled_correctly getReportAbuseByID', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getReportAbuseByID('1');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getReportedAbuseList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getReportedAbuseList('1');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

});
