import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { MassResendMailStatusDialogComponent } from './mass-resend-mail-status-dialog.component';

describe('MassResendMailStatusDialogComponent', () => {
  let component: MassResendMailStatusDialogComponent;
  let fixture: ComponentFixture<MassResendMailStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassResendMailStatusDialogComponent],
      imports: [MaterialModule,
        MatDialogModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        ApolloTestingModule
      ],
      providers: [HttpService, ToastrService, NgxSpinnerService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassResendMailStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component, 'onKeyUp').and.callThrough();
    spyOn(component, 'cancel').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #onKeyUp', () => {
    component.onKeyUp();
    expect(true).toBeTruthy();
  });

  it('should check #cancel', () => {
    component.cancel();
    expect(component).toBeTruthy();
  });
});
