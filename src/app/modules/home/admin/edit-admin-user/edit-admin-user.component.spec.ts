import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Apollo } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { getOktaAdminByEmailQuery, roleQuery, updateOktaAdminQuery, updateOktaAdminRoleQuery } from 'src/app/core/query/admin';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AdminListComponent } from '../admin-list/admin-list.component';
import { EditAdminUserComponent } from './edit-admin-user.component';
import { throwError } from 'rxjs';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('EditAdminUserComponent', () => {
  let component: EditAdminUserComponent;
  let fixture: ComponentFixture<EditAdminUserComponent>;
  let backend: ApolloTestingController;
  let _apollo: Apollo;
  let utilityService: UtilityService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAdminUserComponent],
      imports: [
        OktaAuthModule,
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'admin/admin-list', component: AdminListComponent },
          { path: 'dashboard', component: DashboardComponent }
        ]),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
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
    fixture = TestBed.createComponent(EditAdminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);
    
    spyOn(component,'fetchRoles').and.callThrough();
    spyOn(component, 'gotoAdminList').and.callThrough();
    spyOn(component, 'updateUser').and.callThrough();
    spyOn(component, 'updateRole').and.callThrough();
    spyOn(component, 'getUserDetailByEmail').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it("Should call update()", () => {
    component.editAdminFormGroup.get('firstName').setValue('test');
    component.editAdminFormGroup.get('lastName').setValue('user');
    component.editAdminFormGroup.get('email').setValue('test@mail.com');
    component.editAdminFormGroup.get('mobile').setValue('8888888888');
    component.editAdminFormGroup.get('roleName').setValue('School Manager');

    component.updateUser();
    const op = backend.expectOne(addTypenameToDocument(updateOktaAdminQuery));
    op.flush({
      "data":{"updateOktaAdmin":{"firstName":"test","lastName":"user","email":"test@mail.com","roleName":"School Manager","mobilePhone":"8888888888","__typename":"OktaAdmin"}}
    });
  });
  it('test_error_is_handled_correctly fetchRoles', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.editAdminFormGroup.get('firstName').setValue('test');
    component.editAdminFormGroup.get('lastName').setValue('user');
    component.editAdminFormGroup.get('email').setValue('test@mail.com');
    component.editAdminFormGroup.get('mobile').setValue('8888888888');
    component.editAdminFormGroup.get('roleName').setValue('School Manager');

    component.updateUser();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

  it("Should call update()", () => {
    component.editAdminFormGroup.get('firstName').setValue('');
    component.editAdminFormGroup.get('lastName').setValue('');
    component.editAdminFormGroup.get('email').setValue('');
    component.editAdminFormGroup.get('mobile').setValue('');
    component.editAdminFormGroup.get('roleName').setValue('');
    component.updateUser();
    component.editAdminFormGroup.markAllAsTouched();
  });

  it('should call getUserDetailByEmail()', () => {
    component.getUserDetailByEmail();
    const op = backend.expectOne(addTypenameToDocument(getOktaAdminByEmailQuery));
    op.flush({
      "data":{"getOktaAdminByEmail":{"status":"active","mobilePhone":"8888888888","firstName":"test","lastName":"user","email":"sohan@mail.com","roleName":"Manager 2","__typename":"OktaAdmin"}}
    })
  });

  it('should call fetchRoles()', () => {
    component.fetchRoles();
    const op = backend.expectOne(addTypenameToDocument(roleQuery));
    op.flush({
      "data":{"role":[{"roleName":"School Manager","status":"active","__typename":"Role"},{"roleName":"Content Manager","status":"active","__typename":"Role"},{"roleName":"Manager 1","status":"active","__typename":"Role"},{"roleName":"Manager 2","status":"active","__typename":"Role"},{"roleName":"Manager 3","status":"active","__typename":"Role"},{"roleName":"Manager sub2","status":"active","__typename":"Role"},{"roleName":"Content Manager 3","status":"active","__typename":"Role"},{"roleName":"Content Manager 1","status":"active","__typename":"Role"},{"roleName":"role 1","status":"active","__typename":"Role"}]}
    })
  });

  it('should call updateRole()', () => {
    component.updateRole();
    const op = backend.expectOne(addTypenameToDocument(updateOktaAdminRoleQuery));
    op.flush({
      "data":{"updateOktaAdminRole":{"firstName":"test","lastName":"user","roleName":"Manager 1","mobilePhone":"8888888888","email":"sohan@mail.com","__typename":"OktaAdmin"}}
    })
  });
  it('test_error_is_handled_correctly getUserDetailByEmail', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getUserDetailByEmail();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_error_is_handled_correctly fetchRoles', () => {
  spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.fetchRoles();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_error_is_handled_correctly updateRole', () => {
  spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.updateRole();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
});
