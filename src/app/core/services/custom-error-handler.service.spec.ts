import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthComponent } from 'src/app/modules/auth/auth/auth.component';

import { CustomErrorHandlerService } from './custom-error-handler.service';

describe('CustomErrorHandlerService', () => {
  let service: CustomErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth/home', component: AuthComponent }
        ]),
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
      ],
      providers: [CustomErrorHandlerService, ToastrService]
    });
    service = TestBed.inject(CustomErrorHandlerService);
    spyOn(service, 'manageError').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check #manageError - isShowToasterMsg = true', () => {
    let error = { "graphQLErrors": [{ "message": "Bad Request", "error": ["test error message"], "status": 400 }], "data": null };
    service.manageError(error, true);
  });

  it('should check #manageError - isShowToasterMsg = false', () => {
    let error = { "graphQLErrors": [{ "message": "Bad Request", "error": ["test error message"], "status": 400 }], "data": null };
    service.manageError(error, false);
  });

  it('should check #manageError - errorStatus = 401', () => {
    let error = { "graphQLErrors": [{ "message": "Bad Request", "error": ["test error message"], "status": 401 }], "data": null };
    service.manageError(error, false);
  });

  it('should check #manageError - errorStatus = 403', () => {
    let error = { "graphQLErrors": [{ "message": "Bad Request", "error": ["test error message"], "status": 403 }], "data": null };
    service.manageError(error, false);
  });
});
