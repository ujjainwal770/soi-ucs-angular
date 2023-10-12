import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardComponent } from '../../home/dashboard/dashboard.component';
import { DismissRequestDialogComponent } from './dismiss-request-dialog.component';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('DismissRequestDialogComponent', () => {
  let component: DismissRequestDialogComponent;
  let fixture: ComponentFixture<DismissRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DismissRequestDialogComponent],
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
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService,
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
    fixture = TestBed.createComponent(DismissRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'submit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on click cancel()', () => {
    spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog on call #submit() - in case form is valid ', () => {
    component.dismissForm.get('dismissType').setValue(2);
    component.dismissForm.get('dismissDescription').setValue("test");
    spyOn(component.dialogRef, 'close');
    component.submit();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog on call #submit() - in case form is invalid ', () => {
    component.dismissForm.get('dismissType').setValue("");
    component.dismissForm.get('dismissDescription').setValue("");
    component.submit();
    component.dismissForm.markAllAsTouched();
  });
});
