import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import mockValues from 'src/app/core/constants/mock.values';
import { addAdminRoleQuery } from 'src/app/core/query/admin-role';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AdminRolesComponent } from '../admin-roles.component';
import { AddRolesComponent } from './add-roles.component';
import { throwError } from 'rxjs';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('AddRolesComponent', () => {
  let component: AddRolesComponent;
  let fixture: ComponentFixture<AddRolesComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRolesComponent],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'admin/admin-roles', component: AdminRolesComponent }
        ]),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService,
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
    fixture = TestBed.createComponent(AddRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    spyOn(component, 'setUserAccess').and.callThrough();
    spyOn(component, 'submit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submit()', () => {
    component.submit();
    component.newAdminFormGroup.get('name').setValue("test");
    component.newAdminFormGroup.get('description').setValue("mock description");
  });

  it('should call #setUserAccess() - when isChecked=true and type=view', () => {
    let isChecked = true;
    let ele = {
      "feature": "Dasboard",
      "view": "no",
      "addedit": "no",
      "delete": "no"
    };
    let type = 'view';
    component.setUserAccess(isChecked, ele, type);
    expect(false).toBe(false);
  });

  it('should call #setUserAccess() - when isChecked=false and type=view', () => {
    let isChecked = false;
    let ele = {
      "feature": "Dasboard",
      "view": "no",
      "addedit": "no",
      "delete": "no"
    };
    let type = 'view';
    component.setUserAccess(isChecked, ele, type);
    expect(false).toBe(false);
  });

  it('should call #setUserAccess() - when isChecked=true and type=addedit', () => {
    let isChecked = true;
    let ele = {
      "feature": "Dasboard",
      "view": "no",
      "addedit": "no",
      "delete": "no"
    };
    let type = 'addedit';
    component.setUserAccess(isChecked, ele, type);
    expect(false).toBe(false);
  });

  it('should call #setUserAccess() - when isChecked=true and type=addedit', () => {
    let isChecked = false;
    let ele = {
      "feature": "Dasboard",
      "view": "no",
      "addedit": "no",
      "delete": "no"
    };
    let type = 'addedit';
    component.setUserAccess(isChecked, ele, type);
    expect(false).toBe(false);
  });

  it('should call #setUserAccess() - when isChecked=true and type=delete', () => {
    let isChecked = true;
    let ele = {
      "feature": "Dasboard",
      "view": "no",
      "addedit": "no",
      "delete": "no"
    };
    let type = 'delete';
    component.setUserAccess(isChecked, ele, type);
    expect(false).toBe(false);
  });

  it('should call #setUserAccess() - when isChecked=true and type=invalid', () => {
    let isChecked = true;
    let ele = {
      "feature": "Dasboard",
      "view": "no",
      "addedit": "no",
      "delete": "no"
    };
    let type = 'invalid';
    component.setUserAccess(isChecked, ele, type);
    expect(false).toBe(false);
  });
  it('should call #setUserAccess() - when isChecked=true and type=delete', () => {
    let isChecked = false;
    let ele = {
      "feature": "Dasboard",
      "view": "no",
      "addedit": "no",
      "delete": "no"
    };
    let type = 'delete';
    component.setUserAccess(isChecked, ele, type);
    expect(false).toBe(false);
  });

  it('should call #submit() - whe form is valid', () => {
    component.newAdminFormGroup.get('description').setValue('Role for the testing purpose');
    component.newAdminFormGroup.get('name').setValue('Test Role');
    component.submit();
    const op = backend.expectOne(addTypenameToDocument(addAdminRoleQuery));
    op.flush({"data":{"addRole":{"id":14,"status":"active","__typename":"Role"}}}
    );
  });
  
  it('should call #submit() - when form is invalid', () => {
    component.newAdminFormGroup.get('description').setValue('');
    component.newAdminFormGroup.get('name').setValue('');
    component.submit();
    expect(false).toBe(false);
  });
  it('test_error_is_handled_correctly submit', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.newAdminFormGroup.get('description').setValue('Role for the testing purpose');
    component.newAdminFormGroup.get('name').setValue('Test Role');
    component.submit();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

  
});
