import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBroadcastMessageComponent } from './edit-broadcast-message.component';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { editBroadcastMessageQuery, getBroadcastMessageDetailQuery, } from 'src/app/core/query/broadcast-message';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BroadcastMessageComponent } from '../broadcast-message.component';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { ApolloQueryResult } from '@apollo/client/core';

describe('EditBroadcastMessageComponent', () => {
  let component: EditBroadcastMessageComponent;
  let fixture: ComponentFixture<EditBroadcastMessageComponent>;
  let mockRouter, mockActivatedRoute, mockApollo, mockSpinner, mockErrorHandler, mockToastr;
  let router: Router;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    mockActivatedRoute = { params: of({ id: '1' }) };
    mockApollo = jasmine.createSpyObj(['watchQuery', 'mutate']);
    mockSpinner = jasmine.createSpyObj(['show', 'hide']);
    mockToastr = jasmine.createSpyObj(['success']);
    await TestBed.configureTestingModule({
      declarations: [ EditBroadcastMessageComponent ],
      imports: [ReactiveFormsModule,RouterTestingModule.withRoutes([
        { path: 'manage-broadcast-message', component: BroadcastMessageComponent }
      ]),
      ApolloTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
       // { provide: Apollo, useValue: mockApollo },
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: ToastrService, useValue: mockToastr }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBroadcastMessageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);
    fixture.detectChanges();

    spyOn(component, 'getBroadcastMessageById').and.callThrough();
    spyOn(component,'initForm').and.callThrough();
    spyOn(component, 'getFieldR').and.callThrough();
    spyOn(component, 'getTimestamp').and.callThrough();
    spyOn(component, 'goBack').and.callThrough();
    spyOn(component, 'updateBroadcastMessageDetails').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initForm()', () => {
    it('should initialize the form correctly', () => {
      component.initForm();
      expect(component.editBroadcastMessageForm.controls.message).toBeDefined();
      expect(component.editBroadcastMessageForm.controls.expiration_date).toBeDefined();
    });
  });
      // Tests that the function successfully fetches broadcast message by ID and sets form field values based on fetched data
      it('test_successful_fetch', () => {
        const apolloSpy = spyOn(component['_apollo'], 'watchQuery').and.returnValue({
            valueChanges: of({ data: { getBroadcastMessageDetail: { id: 1, message: 'test message', expiration_date: '2022-12-31T23:59:59.000Z', publish_date: '2022-12-31T23:59:59.000Z', status: 'test status', archive_at: '2022-12-31T23:59:59.000Z', is_archive: true } } })
        } as QueryRef<unknown, unknown> );

        component.selectedBroadcastMessageId = '1';
        component.getBroadcastMessageById();

        expect(apolloSpy).toHaveBeenCalledWith({
            query: getBroadcastMessageDetailQuery,
            variables: { id: 1 },
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: true
        });
        expect(component.BroadcastMessage).toEqual({ id: 1, message: 'test message', expiration_date: '2022-12-31T23:59:59.000Z', publish_date: '2022-12-31T23:59:59.000Z', status: 'test status', archive_at: '2022-12-31T23:59:59.000Z', is_archive: true });
        expect(component.getFieldR('message').value).toEqual('test message');
        expect(component.getFieldR('expiration_date').value).toEqual(new Date('2022-12-31T23:59:59.000Z'));
    });
  


  // it('should call getBroadcastMessageById()', () => {
  //   component.selectedBroadcastMessageId = "1";
  //   component.getBroadcastMessageById();
  //   const op = backend.expectOne(addTypenameToDocument(getBroadcastMessageDetailQuery));
  //   op.flush({
  //     "data":{"getBroadcastMessageDetail":{"message":"test message","expiration_date":820368000000,"id":1}}
  //   });
  // });

describe('getFieldR(name: string)', () => {
  it('should return the specified form control', () => {
    component.initForm();
    expect(component.getFieldR('message')).toBe(component.editBroadcastMessageForm.get('message'));
    expect(component.getFieldR('expiration_date')).toBe(component.editBroadcastMessageForm.get('expiration_date'));
  });
});

describe('getTimestamp(date)', () => {
  it('should return the timestamp of the provided date', () => {
    const date = new Date('2023-05-09');
    const expectedTimestamp = date.getTime();
    const timestamp = component.getTimestamp(date);
    expect(timestamp).toBe(expectedTimestamp);
  });
});
describe('goBack()', () => {
  it('should call goBack()', () => {
    const spy = spyOn(router, 'navigateByUrl');
    component.goBack();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/manage-broadcast-message');
  });
  it('should initialize the form', () => {
    component.goBack();
    expect(component.initForm).toHaveBeenCalled();
  });
      // Tests that the router navigates to the manage-broadcast-message page
      it('test_navigate_to_manage_broadcast_message', () => {
        spyOn(router, 'navigateByUrl');
        component.goBack();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/manage-broadcast-message');
    });
});

     // Tests that the form is valid, mutation is successful, success message is shown, and user is redirected to previous page
     xit('test_valid_form', () => {
  
      spyOn(component["_apollo"], 'mutate').and.returnValue(of({}));
      component.editBroadcastMessageForm.setValue({
          message: 'test message',
          expiration_date: component.getTimestamp(new Date())
      });
      component.selectedBroadcastMessageId = '1';
      component.updateBroadcastMessageDetails();
      expect(component["_apollo"].mutate).toHaveBeenCalledWith({
          mutation: editBroadcastMessageQuery,
          variables: {
              id: 1,
              message: 'test message',
              expiration_date: component.getTimestamp(new Date())
          }
      });
      expect(component.goBack).toHaveBeenCalled();
  });   
  it('test_valid_form', () => {
    spyOn(component["_apollo"], 'mutate').and.callThrough();
    component.editBroadcastMessageForm.setValue({
        message: 'test message',
        expiration_date: new Date().toISOString()
    });
    component.updateBroadcastMessageDetails();
    expect(component["_apollo"].mutate).toHaveBeenCalled();
});
it('test_mutation_error', () => {
  spyOn(component["_apollo"], 'mutate').and.returnValue(throwError('error')); 
  spyOn(component['_errorHandler'], 'manageError');
  component.editBroadcastMessageForm.setValue({
      message: 'test message',
      expiration_date: new Date().toISOString()
  });
  component.updateBroadcastMessageDetails();
  expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
    // Tests that updateBroadcastMessageDetails() works correctly when the form is invalid
  it('test_invalid_form', () => {
    spyOn(component.editBroadcastMessageForm, 'markAllAsTouched');
    component.updateBroadcastMessageDetails();
    expect(component.editBroadcastMessageForm.markAllAsTouched).toHaveBeenCalled();
});
});
