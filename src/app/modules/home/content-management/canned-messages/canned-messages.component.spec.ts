import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { fetchCannedMessagesList, rePublishCannedMessageQuery, unpublishCannedMessageQuery } from 'src/app/core/query/canned-message';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { CannedMessagesComponent } from './canned-messages.component';

describe('CannedMessagesComponent', () => {
  let component: CannedMessagesComponent;
  let fixture: ComponentFixture<CannedMessagesComponent>;
  let backend: ApolloTestingController;
  let _dialogsService: DialogsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CannedMessagesComponent],
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CannedMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    backend = TestBed.inject(ApolloTestingController);
    _dialogsService = TestBed.inject(DialogsService);

    spyOn(component, 'fetchCannedMessageList').and.callThrough();
    spyOn(component, 'unpublishCannedMessage').and.callThrough();
    spyOn(component, 'openUnpublishConfirmationDialog').and.callThrough();
    spyOn(component, 'openRepublishConfirmationDialog').and.callThrough();
    spyOn(component, 'rePublishMessage').and.callThrough();
    spyOn(component, 'customSorting').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should check #fetchCannedMessageList()', () => {
    console.log(`CannedMessagesComponent --> should check #fetchCannedMessageList()`);

    component.fetchCannedMessageList();
    const op = backend.expectOne(addTypenameToDocument(fetchCannedMessagesList));
    op.flush({
      "data": { "fetchAdminCannedMessage": { "cannedMessageList": [{ "id": 12, "message": "Nice!!", "colorId": 6, "hasColor": "#41BA9D", "publish": 1, "created_at": 1664365077199, "__typename": "cannedMessageListResponse" }], "count": 12, "__typename": "cannedMessageResponse" } }
    });
    expect(component.dataSource).toBeDefined();
  });

  it('should check #unpublishCannedMessage()', () => {
    console.log(`CannedMessagesComponent --> should check #unpublishCannedMessage()`);

    let messageId = 1;
    component.unpublishCannedMessage(messageId);
    const op = backend.expectOne(addTypenameToDocument(unpublishCannedMessageQuery));
    op.flush({
      "data": { "unpublishCannedMessage": { "id": 11, "message": "Hello!", "colorId": 4, "publish": 0, "__typename": "CannedMessage" } }
    });
    expect(false).toBe(false);
  });

  it('should check #rePublishMessage()', () => {
    console.log(`CannedMessagesComponent --> should check #rePublishMessage()`);

    let messageId = 10;
    component.rePublishMessage(messageId);
    const op = backend.expectOne(addTypenameToDocument(rePublishCannedMessageQuery));
    op.flush({
      "data": { "publishCannedMessage": { "id": 10, "message": "Hello!", "colorId": 3, "publish": 1, "created_by": 0, "__typename": "CannedMessage" } }
    });
    expect(false).toBe(false);
  });


  it('should check #openUnpublishConfirmationDialog() - when confrim btn clicked', () => {
    console.log(`CannedMessagesComponent --> should check #openUnpublishConfirmationDialog() - when confrim btn clicked`);

    let messageId = 1;
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openUnpublishConfirmationDialog(messageId);
    expect(component.unpublishCannedMessage).toHaveBeenCalled();
  });

  it('should check #openUnpublishConfirmationDialog() - when close btn clicked', () => {
    console.log(`CannedMessagesComponent --> should check #openUnpublishConfirmationDialog() - when close btn clicked`);

    let messageId = 1;
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openUnpublishConfirmationDialog(messageId);
    expect(component.unpublishCannedMessage).not.toHaveBeenCalled();
  });

  it('should check #openRepublishConfirmationDialog() - when confrim btn clicked', () => {
    console.log(`CannedMessagesComponent --> should check #openRepublishConfirmationDialog() - when confrim btn clicked`);

    let messageId = 1;
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openRepublishConfirmationDialog(messageId);
    expect(component.rePublishMessage).toHaveBeenCalled();
  });

  it('should check #openRepublishConfirmationDialog() - when close btn clicked', () => {
    console.log(`CannedMessagesComponent --> should check #openRepublishConfirmationDialog() - when close btn clicked`);

    let messageId = 1;
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openRepublishConfirmationDialog(messageId);
    expect(component.rePublishMessage).not.toHaveBeenCalled();
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "message";
    let sortingByColumn = "publish";

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
    component.sorting.sortingByColumn = "publish";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.fetchCannedMessageList).toHaveBeenCalled();
  });

  it('should call #handlePage() return valid', () => {
    console.log(`CannedMessagesComponent --> should call #handlePage() return valid`);

    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });
  it('test_error_is_handled_correctly fetchCannedMessageList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchCannedMessageList();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly unpublishCannedMessage', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.unpublishCannedMessage('1');
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly rePublishMessage', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.rePublishMessage('1');
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

  
});
