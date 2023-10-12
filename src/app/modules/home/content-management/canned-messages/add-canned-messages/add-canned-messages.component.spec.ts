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
import { BsModalService } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { getCannedMessageColorQuery, publishCannedMessageQuery } from 'src/app/core/query/canned-message';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SocketIoService } from 'src/app/core/services/socket-io.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { CannedMessagesComponent } from '../canned-messages.component';
import { AddCannedMessagesComponent } from './add-canned-messages.component';
import { throwError } from 'rxjs';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('AddCannedMessagesComponent', () => {
  let component: AddCannedMessagesComponent;
  let fixture: ComponentFixture<AddCannedMessagesComponent>;
  let backend: ApolloTestingController;
  let _router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCannedMessagesComponent],
      imports: [
        MaterialModule,
        PopoverModule,
        RouterTestingModule.withRoutes([
          { path: 'content-management/canned-messages', component: CannedMessagesComponent },
        ]),
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
        SocketIoService,
        AuthService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } },
        {
          provide: BsModalService, useValue: {}
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AddCannedMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _router = TestBed.inject(Router);

    spyOn(component, 'publish').and.callThrough();
    spyOn(component, 'gotoCannedMessageList').and.callThrough();
    spyOn(component, 'fetchApplicableColors').and.callThrough();
    spyOn(component, 'setSelectedColor').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should call #publish() - when form is valid", () => {
    console.log(`AddCannedMessagesComponent --> should check #publish() - when form is valid`);

    component.addCannedMessageForm.get('messageText').setValue('Hello!');
    component.publish();
    const op = backend.expectOne(addTypenameToDocument(publishCannedMessageQuery));
    op.flush(
      { "data": { "addCannedMessage": { "id": 11, "message": "Hello!", "colorId": 4, "publish": 1, "__typename": "CannedMessage" } } }
    );
    expect(false).toBe(false);
  });

  it("should call #publish() - when form is invalid", () => {
    console.log(`AddCannedMessagesComponent --> should check #publish() - when form is invalid`);

    component.addCannedMessageForm.get('messageText').setValue("");
    component.publish();
    expect(false).toBe(false);
  });

  it("should call #fetchApplicableColors()", () => {
    console.log(`AddCannedMessagesComponent --> should check #fetchApplicableColors()`);

    component.fetchApplicableColors();
    const op = backend.expectOne(addTypenameToDocument(getCannedMessageColorQuery));
    op.flush(
      { "data": { "fetchCannedMessageColor": [{ "id": 1, "hasColor": "#1A9EE3", "status": 1, "__typename": "cannedMessageColorResponse" }] } }
    );
    expect(false).toBe(false);
  });

  it("should call #setSelectedColor()", () => {
    console.log(`AddCannedMessagesComponent --> should check #setSelectedColor()`);

    let colorObj = { hasColor: "", id: 0 };
    let dummyColorOj = { hashColor: "", colorId: 0 };
    component.setSelectedColor(colorObj);
    expect(component.selectedColor).toEqual(dummyColorOj);
  });
  it('test_error_is_handled_correctly publish', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.addCannedMessageForm.get('messageText').setValue('Hello!');
    component.publish();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchApplicableColors', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchApplicableColors();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

});
