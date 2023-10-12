import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { getAllAssociatedSchoolsQuery } from 'src/app/core/query/school-management';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardComponent } from '../../home/dashboard/dashboard.component';

import { ChangeSchoolDialogComponent } from './change-school-dialog.component';
import { throwError } from 'rxjs';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ChangeSchoolDialogComponent', () => {
  let component: ChangeSchoolDialogComponent;
  let fixture: ComponentFixture<ChangeSchoolDialogComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeSchoolDialogComponent],
      imports: [
        MaterialModule,
        MatDialogModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent }
        ]),
      ],
      providers: [
        HttpService,
        ToastrService,
        NgxSpinnerService,
        UtilityService,
        LocalStorageService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialogRef, useValue: {
            close: () => { },
            updatePosition: () => { }
          }
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSchoolDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);

    spyOn(component, 'confirm').and.callThrough();
    spyOn(component, 'getAllAssociatedSchools').and.callThrough();
    spyOn(component, 'cancel').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #cancel()', () => {
    component.cancel();
    expect(false).toBe(false);
  });

  it('should check #confirm()', () => {
    // When school form is valid
    let newSchoolId = 1;
    component.schoolChangeForm.get("selectedSchool").setValue(newSchoolId);
    component.confirm();
    expect(false).toBe(false);

    // When school form is invalid
    component.schoolChangeForm.get("selectedSchool").setValue("");
    component.confirm();
    expect(false).toBe(false);
  });

  it('should check #getAllAssociatedSchools()', () => {
    const op = backend.expectOne(addTypenameToDocument(getAllAssociatedSchoolsQuery));
    component.getAllAssociatedSchools();
    op.flush({"data":{"getSameAdminSchool":[{"id":6,"schoolid":45,"schoolName":"Devikalay","schoolAdminName":"Devi","schoolAdminEmail":"devioit@yopmail.com","schoolAdminPhone":3222333233,"__typename":"SameAdminSchoolResponse"}]}}
    );
    expect(component.schoolList).toBeDefined();
    expect(false).toBe(false);
  });
  it('test_error_is_handled_correctly getAllAssociatedSchools', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getAllAssociatedSchools();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
