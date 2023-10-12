import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { Observable, addTypenameToDocument } from '@apollo/client/utilities';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { getAppUserQuery, userDetailsQuery } from 'src/app/core/query/appuser';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { ViewUserDetailsComponent } from './view-user-details.component';
import { UserListComponent } from '../user-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';
import { of, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';

describe('ViewUserDetailsComponent', () => {
  let component: ViewUserDetailsComponent;
  let fixture: ComponentFixture<ViewUserDetailsComponent>;
  let backend: ApolloTestingController;
  let _router: Router;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockActivatedRoute = { params: of({ id: '1' }) };
    await TestBed.configureTestingModule({
      declarations: [ViewUserDetailsComponent,ConvertToLocalDatePipe],
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
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService, LocalStorageService, DialogsService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
          
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);

    spyOn(component, 'getUserDetails').and.callThrough();
    spyOn(component, 'gotoUserEdit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #gotoUserEdit()', () => {
    component.userId = 1;
    const spy = spyOn(_router, 'navigateByUrl');
    component.gotoUserEdit();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/app-users/edit-user-details/1');
    component.gotoUserEdit();
    expect(component).toBeTruthy();
  });
    // Tests that user details are successfully retrieved
    it('test_retrieves_user_details_successfully', () => {
      const apolloSpy = spyOn(component['_apollo'], 'query').and.returnValue(of());
      const spinnerShowSpy = spyOn(component['_spinner'], 'show');
      const spinnerHideSpy = spyOn(component['_spinner'], 'hide');

      component.getUserDetails();

      expect(apolloSpy).toHaveBeenCalledWith({
        query: userDetailsQuery,
        variables: {
          id: component.userId
        },
        fetchPolicy: 'no-cache'
      });
      expect(spinnerShowSpy).toHaveBeenCalled();
      expect(component.userDetails).toEqual({});
    });
              
  it('test_handles_error_response_from_server', () => {
    const apolloSpy = spyOn(component['_apollo'], 'query').and.returnValue(throwError({}));
    const spinnerShowSpy = spyOn(component['_spinner'], 'show');
    const spinnerHideSpy = spyOn(component['_spinner'], 'hide');
    const errorHandlerSpy = spyOn(component['_errorHandler'], 'manageError');

    component.getUserDetails();

    expect(apolloSpy).toHaveBeenCalledWith({
      query: userDetailsQuery,
      variables: {
        id: component.userId
      },
      fetchPolicy: 'no-cache'
    });
    expect(spinnerShowSpy).toHaveBeenCalled();
    expect(spinnerHideSpy).toHaveBeenCalled();
    expect(errorHandlerSpy).toHaveBeenCalledWith({}, true);
  });
  it('params.id is defined', () => {
    component.ngOnInit();
    expect(component.userId).toBe(1);
});
  

  it("should check getAppUserList()", () => {
    component.getUserDetails();
    const op = backend.expectOne(addTypenameToDocument(userDetailsQuery));
    op.flush({
      "data": { "getUserViewDetail": { "user_id": 1224, "full_name": "Nm Test1234", "date_of_birth": 913075200000, "email": "nmtest1234@gmail.com", "user_type": "", "creation_time": "1670499961785", "account_status": "active", "totalbadge": 0, "totalpoints": 100, "inclusioncount": 0, "inclusionResult": null, "ucs_status": "yes", "school_id": 130, "schoolName": "Somerville School", "schoolAddress": "Vasundhara enclave Delhi  Near manavsthali apartment", "stateName": null, "cityName": null, "nces": "678956789123", "__typename": "UserViewDetailResponse" } }
    });
    expect(component.userDetails).toBeDefined();
  });
});
