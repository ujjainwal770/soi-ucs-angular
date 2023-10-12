import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBroadcastMessageComponent } from './add-broadcast-message.component';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { Router } from '@angular/router';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { sendBroadcastMessageQuery } from 'src/app/core/query/broadcast-message';
import moment from 'moment';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { BroadcastMessageComponent } from '../broadcast-message.component';
import { of, throwError } from 'rxjs';

describe('AddBroadcastMessageComponent', () => {
  let component: AddBroadcastMessageComponent;
  let fixture: ComponentFixture<AddBroadcastMessageComponent>;
  let _apollo: ApolloTestingController;
  let _router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBroadcastMessageComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'manage-broadcast-message', component: BroadcastMessageComponent },
        ]),

        ToastrModule.forRoot(),
        ApolloTestingModule,
        // ReactiveFormsModule
      ],
      providers: [
        ToastrService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBroadcastMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _apollo = TestBed.inject(ApolloTestingController);
    _router = TestBed.inject(Router);

    spyOn(component, 'submit').and.callThrough();
    spyOn(component, 'gotoBroadcastMessageList').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the mutation with the form data when the form is valid', () => {
    const mutationResponse = { data: { sendBroadcastMessage: { id: 1, message: 'Test message', expiration_date: new Date() } } };

    spyOn(component["_apollo"], 'mutate').and.returnValue(of(mutationResponse))
    let expiration_date  = new Date()
    component.addBroadcastMessageForm.patchValue({
      message: 'Test Message',
      expiration_date: expiration_date
    });
    component.submit();
    expect(component["_apollo"].mutate).toHaveBeenCalledWith({
      mutation: sendBroadcastMessageQuery,
      variables: {
        message: 'Test Message',
        expiration_date: moment(expiration_date).valueOf()
      }
    });
  });
  it('should not call the mutation when the form is invalid', () => {
    spyOn(component["_apollo"], 'mutate').and.callThrough();
    component.submit();
    expect(component["_apollo"].mutate).not.toHaveBeenCalled();
  });

  it('should navigate to the broadcast message list page after sending a message', () => {
    spyOn(component._router, 'navigateByUrl');
    component.gotoBroadcastMessageList();
    expect(component._router.navigateByUrl).toHaveBeenCalledWith('/manage-broadcast-message');
  });
  it('test_error_is_handled_correctly', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    let expiration_date  = new Date()
    component.addBroadcastMessageForm.patchValue({
      message: 'Test Message',
      expiration_date: expiration_date
    });
    component.submit();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});


});
