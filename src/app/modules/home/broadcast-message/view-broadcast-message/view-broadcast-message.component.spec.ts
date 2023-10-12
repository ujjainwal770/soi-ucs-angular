import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBroadcastMessageComponent } from './view-broadcast-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { APOLLO_TESTING_CACHE, ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { InMemoryCache } from '@apollo/client/cache';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { getBroadcastMessageDetailQuery } from 'src/app/core/query/broadcast-message';
import { of, throwError } from 'rxjs';

describe('ViewBroadcastMessageComponent', () => {
  let component: ViewBroadcastMessageComponent;
  let fixture: ComponentFixture<ViewBroadcastMessageComponent>;
  let backend: ApolloTestingController;
  let _router: Router;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockActivatedRoute = { params: of({ id: '1' }) };
    await TestBed.configureTestingModule({
      declarations: [ ViewBroadcastMessageComponent ],
      imports:[
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers:[
        HttpService, ToastrService, NgxSpinnerService, UtilityService, DialogsService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBroadcastMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);

    spyOn(component, 'getMessageDetails').and.callThrough();
    spyOn(component, 'gotoMessageEdit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check #gotoMessageEdit()', () => {
    component.messageId = 1;
    const spy = spyOn(_router, 'navigateByUrl');
    component.gotoMessageEdit();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/manage-broadcast-message/edit-broadcast-message/1');
  });
  it('should check #getMessageDetails()', () => {
    component.getMessageDetails();
    const op = backend.expectOne(addTypenameToDocument(getBroadcastMessageDetailQuery));
    op.flush({
      "data": { "getBroadcastMessageDetail": { "id": 1, "message": "test message", "expiration_date":913075200000,"status":'Active',
      "publish_date":913075200000,"__typename": "getBroadcastMessageDetail" } }
    });
    expect(true).toBeTruthy();
  });
  it('test_get_message_details_handles_error', () => {
    const apolloSpy = spyOn(component['_apollo'], 'query').and.returnValue(throwError({}));
    const errorHandlerSpy = spyOn(component['_errorHandler'], 'manageError');
    component.getMessageDetails();
    expect(apolloSpy).toHaveBeenCalled();
    expect(errorHandlerSpy).toHaveBeenCalled();
    expect(component.isEditable).toBe(false);
});
      // Tests that archieveMessage() archives message successfully
      it('test_archieve_message_success', () => {
        const apolloSpy = spyOn(component['_apollo'], 'mutate').and.returnValue(of({}));
        const dialogsSpy = spyOn(component['_dialogsService'], 'confirmationDialogPopUp').and.returnValue(of(true));
        const toastrSpy = spyOn(component['toastr'], 'success');
        component.archieveMessage();
        expect(dialogsSpy).toHaveBeenCalled();
        expect(apolloSpy).toHaveBeenCalled();
        expect(toastrSpy).toHaveBeenCalledWith('Message archieved successfully');
    });
        // Tests that archieveMessage() handles error when mutation fails
        it('test_archieve_message_handles_error', () => {
          const apolloSpy = spyOn(component['_apollo'], 'mutate').and.returnValue(throwError({}));
          const dialogsSpy = spyOn(component['_dialogsService'], 'confirmationDialogPopUp').and.returnValue(of(true));
          const errorHandlerSpy = spyOn(component['_errorHandler'], 'manageError');
          component.archieveMessage();
          expect(dialogsSpy).toHaveBeenCalled();
          expect(apolloSpy).toHaveBeenCalled();
          expect(errorHandlerSpy).toHaveBeenCalled();
      });
          // Tests that archieveMessage() handles user cancelling confirmation dialog
    it('test_archieve_message_cancelling_confirmation_dialog', () => {
      const dialogsSpy = spyOn(component['_dialogsService'], 'confirmationDialogPopUp').and.returnValue(of(false));
      const apolloSpy = spyOn(component['_apollo'], 'mutate');
      component.archieveMessage();
      expect(dialogsSpy).toHaveBeenCalled();
      expect(apolloSpy).not.toHaveBeenCalled();
  });
});
