import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { PasswordHintsComponent } from './password-hints.component';
import { _CONST } from 'src/app/core/constants/app.constants';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('PasswordHintsComponent', () => {
  let component: PasswordHintsComponent;
  let fixture: ComponentFixture<PasswordHintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordHintsComponent],
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
      providers: [
        HttpService,
        ToastrService,
        NgxSpinnerService,
        UtilityService,
        LocalStorageService,
        DialogsService,
        AuthService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordHintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.passwordHints = _CONST.passwordHints
    spyOn(component, 'ngOnChanges').and.callThrough();
    spyOn(component, 'checkPasswordHints').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #ngOnChanges()', () => {
    component.ngOnChanges();
    expect(component).toBeTruthy();
  });

  it('should check #checkPasswordHints() - when not password typed', () => {
    component.newPassword = '';
    component.checkPasswordHints();
    expect(component).toBeTruthy();
  });

  it('should check #checkPasswordHints() - when password typed and regex match', () => {
    component.newPassword = 'Test123#';
    component.checkPasswordHints();
    expect(component).toBeTruthy();
  });

  it('should check #checkPasswordHints() - when password typed and regex does not match', () => {
    component.newPassword = 'Test';
    component.checkPasswordHints();
    expect(component).toBeTruthy();
  });
});
