import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from 'src/app/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UtilityService } from 'src/app/core/services/utility.service';
import _ from 'lodash';

import { ViewDismissedStudentsComponent } from './view-dismissed-students.component';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { userDismissDetailsQuery, userDismissInformationQuery } from 'src/app/core/query/dismiss-user';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';
import { throwError } from 'rxjs';

describe('ViewDismissedStudentsComponent', () => {
  let component: ViewDismissedStudentsComponent;
  let fixture: ComponentFixture<ViewDismissedStudentsComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDismissedStudentsComponent,ConvertToLocalDatePipe],
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
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService,
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
    fixture = TestBed.createComponent(ViewDismissedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    spyOn(component, 'getDismissalType').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should check getStudentDetails()", () => {
    const userId = '369';
    const op = backend.expectOne(addTypenameToDocument(userDismissInformationQuery));
    component.getStudentDetails(userId);
    op.flush({
      "data": { "userDismissInformation": { "user": { "user_id": 369, "full_name": "Alan Border", "date_of_birth": 1172361600000, "email": "aks7@yopmail.com", "phone": "", "account_status": "active", "dismissStatus": "yes", "__typename": "User" }, "school": null, "schoolAdmin": null, "__typename": "DismissUserInfoResponse" } }
    });
  });

  it("should check getUserDetailForList()", () => {
    const userId = '881';
    const op = backend.expectOne(addTypenameToDocument(userDismissDetailsQuery));
    component.getUserDetailForList(userId);
    op.flush({
      "data":{"userDismissDetails":{"count":2,"schoolAdmin":[{"id":81,"name":"Abdul","__typename":"SchoolAdmin"}],"data":[{"school_admin_id":81,"mode":1,"reason":"Unable to validate information","creation_time":1654669730202,"description":"Testing","__typename":"UserDismiss"},{"school_admin_id":81,"mode":1,"reason":"Unable to validate information","creation_time":1654669729998,"description":"Testing","__typename":"UserDismiss"}],"__typename":"UserDismissDetailsResponse"}}
    });
  });

  it('should call handlePage() return valid', () => {
    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    };
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  it('should check getDismissalType()', () => {
    let mode = 1;
    let dismissalType = component.getDismissalType(mode);
    expect(dismissalType).toBe('NEW STUDENT REQUEST');
  });
  it('test_error_is_handled_correctly getStudentDetails', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getStudentDetails('1');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getUserDetailForList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getUserDetailForList('1');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
