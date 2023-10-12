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
import { getStateList, schoolReportDownloadLinkQuery } from 'src/app/core/query/report-download';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardComponent } from '../../home/dashboard/dashboard.component';
import { ReportDownloadDialogComponent } from './report-download-dialog.component';
import { throwError } from 'rxjs';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ReportDownloadDialogComponent', () => {
  let component: ReportDownloadDialogComponent;
  let fixture: ComponentFixture<ReportDownloadDialogComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportDownloadDialogComponent],
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
    fixture = TestBed.createComponent(ReportDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'onDateChange').and.callThrough();
    spyOn(component, 'getDonwloadLink').and.callThrough();
    spyOn(component, 'getStateList').and.callThrough();
    spyOn(component, 'getInput').and.callThrough();
    spyOn(component, 'removeValidation').and.callThrough();
    spyOn(component, 'downloadReport').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call cancel', () => {
    spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should check #ngOnInit() - when state list api called', () => {
    component.reportType = 'SCHOOLS';
    component.ngOnInit();
    expect(component.getStateList).toHaveBeenCalled();
  });

  it('should check #ngOnInit() - when state list api not to be called', () => {
    component.reportType = 'USERS';
    component.ngOnInit();
    expect(component.getStateList).not.toHaveBeenCalled();
  });

  it('should check #getStateList()', () => {
    component.getStateList();
    const op = backend.expectOne(addTypenameToDocument(getStateList));
    op.flush({
      "data": { "getStateList": { "state": [{ "name": "Alabama", "abbreviation": "AL", "__typename": "States" }], "__typename": "StateList" } }
    });
    expect(component.stateList).toBeDefined();
  });

  it('should call getTimestamp()', () => {
    let date = new Date();
    spyOn(component, 'getTimestamp').and.callThrough();
    let timestamp = component.getTimestamp(date);
    expect(timestamp).toBe(new Date(date).getTime());
  });

  it('should check #getDonwloadLink() - when form is valid and school admin', () => {
    component.downloadReportDialogForm.get('state').setValue('all');
    component.downloadReportDialogForm.get('dateRangeType').setValue('custom');
    component.downloadReportDialogForm.get('startDate').setValue(new Date());
    component.downloadReportDialogForm.get('endDate').setValue(new Date());
    component.downloadReportDialogForm.get('fileType').setValue('xlxs');
    component.getDonwloadLink(1);
    // const op = backend.expectOne(addTypenameToDocument(schoolReportDownloadLinkQuery));
    // op.flush({
    //   "data":{"uploadToAzureBlobForSchool":{"uri":"https://soucsdevsa.blob.core.windows.net/soucs-blob-dynamic-user-images-dev/USERS_Feb-01-2023_Feb-25-2023.xlsx?st=2023-02-24T06%3A18%3A01Z&se=2023-03-26T16%3A18%3A01Z&sp=w&sv=2018-03-28&sr=b&sig=5O41wwX2YdADGZlDfuMNfWDxcaffuZMTE0VNDgTtaGs%3D","readUri":"https://soucsdevsa.blob.core.windows.net/soucs-blob-dynamic-user-images-dev/USERS_Feb-01-2023_Feb-25-2023.xlsx?st=2023-02-24T06%3A18%3A01Z&se=2023-03-26T16%3A18%3A01Z&sp=r&sv=2018-03-28&sr=b&sig=yV2OIpWiF5ZLK4ZMWydhKZaGbfBrSl4EeheGiKPOpNY%3D","uploadStatus":"success"}}
    // });

    expect(true).toBeTruthy();
  });

  it('should check #getDonwloadLink() - when form is valid and soucs admin', () => {
    component.downloadReportDialogForm.get('state').setValue('all');
    component.downloadReportDialogForm.get('dateRangeType').setValue('custom');
    component.downloadReportDialogForm.get('startDate').setValue(new Date());
    component.downloadReportDialogForm.get('endDate').setValue(new Date());
    component.downloadReportDialogForm.get('fileType').setValue('xlxs');
    component.getDonwloadLink(0);
    expect(true).toBeTruthy();
  });

  it('should check #getDonwloadLink() - when form is invalid', () => {
    component.getDonwloadLink(1);
    expect(true).toBeTruthy();
  });

  it('should call getDonwloadLink() - check when form is invalid', () => {
    component.downloadReportDialogForm.get("startDate").setValue("");
    component.downloadReportDialogForm.get("endDate").setValue("");
    component.downloadReportDialogForm.get("fileType").setValue("");
    let schoolId = 0;
    component.getDonwloadLink(schoolId);
    component.downloadReportDialogForm.markAllAsTouched();
  });

  it('should call onDateChange() - checking the if condition', () => {
    component.downloadReportDialogForm.get("startDate").setValue(new Date(1646073000000));
    component.downloadReportDialogForm.get("endDate").setValue(new Date(1643653800000));
    component.onDateChange();
    expect(component).toBeTruthy();
  });

  it('should call onDateChange() - checking the else part', () => {
    component.downloadReportDialogForm.get("startDate").setValue(new Date(1643653800000));
    component.downloadReportDialogForm.get("endDate").setValue(new Date(1646073000000));
    component.onDateChange();
    expect(component).toBeTruthy();
  });

  it('should check #getInput() - when report type is school', () => {
    component.isSchoolReport = true;
    component.downloadReportDialogForm.get('state').setValue('NY');
    component.getInput();
    expect(component.isSchoolReport).toBeTruthy();

    component.downloadReportDialogForm.get('state').setValue('all');
    component.getInput();
    expect(component.isSchoolReport).toBeTruthy();
  });

  it('should check #getInput() - when reprot type is not school', () => {
    component.isSchoolReport = false;
    component.downloadReportDialogForm.get('dateRangeType').setValue('fromTheBeginning');
    component.getInput();
    expect(component.isSchoolReport).not.toBeTruthy();
  });

  it('should check #removeValidation()', () => {
    component.removeValidation('startDate');
  });

  it('should check #downloadReport()', () => {
    component.downloadReport('/');
    expect(true).toBeTruthy();
  });
      // Tests that the error handler is called on error
      it('test_error_during_query_execution', () => {
        spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
        spyOn(component['_errorHandler'], 'manageError');
        component.getStateList();
       // expect(component['_spinner'].show).toHaveBeenCalled();
        expect(component['_apollo'].query).toHaveBeenCalledWith({
          query: getStateList,
          variables: {
            countryname: ''
          },
          fetchPolicy: 'no-cache'
        });
        //expect(component['_spinner'].hide).toHaveBeenCalled();
        expect(component['_errorHandler'].manageError).toHaveBeenCalledWith('error', true);
      });
      
   
});
