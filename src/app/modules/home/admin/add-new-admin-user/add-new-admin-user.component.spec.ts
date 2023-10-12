import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Apollo } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { addOktaAdminQuery, roleQuery } from 'src/app/core/query/admin';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AdminListComponent } from '../admin-list/admin-list.component';
import { AddNewAdminUserComponent } from './add-new-admin-user.component';
import { throwError } from 'rxjs';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('AddNewAdminUserComponent', () => {
  let component: AddNewAdminUserComponent;
  let fixture: ComponentFixture<AddNewAdminUserComponent>;
  let backend: ApolloTestingController;
  let _apollo: Apollo;
  let utilityService: UtilityService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAdminUserComponent ],
      imports: [
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
    fixture = TestBed.createComponent(AddNewAdminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    backend = TestBed.get(ApolloTestingController);
    
    spyOn(component,'fetchRoles').and.callThrough();
    spyOn(component, 'gotoAdminList').and.callThrough();
    spyOn(component, 'submit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchRoles()', () => {
    component.submit();
    const op = backend.expectOne(addTypenameToDocument(roleQuery));
    op.flush({
      "data":{"role":[{"roleName":"School Manager","status":"active","__typename":"Role"}]}
    })
    backend.verify()
    expect(backend).toBeDefined();
  });

  it('should call gotoAdminList()', () => {
    const spy = spyOn(router, 'navigateByUrl');
    component.gotoAdminList();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/admin/admin-list');
  });

  it("Should call submit()", () => {
    component.newAdminFormGroup.get('email').setValue('test@mail.com');
    component.newAdminFormGroup.get('roleName').setValue('School Manager');

    component.submit();
    const op = backend.expectOne(addTypenameToDocument(addOktaAdminQuery));
    op.flush({
      "data":{"addOktaAdmin":{"email":"test@mail.com","roleName":"School Manager","__typename":"OktaAdmin"}}
    })
  });
  it('test_error_is_handled_correctly fetchRoles', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchRoles();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly submit', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.newAdminFormGroup.get('email').setValue('test@mail.com');
    component.newAdminFormGroup.get('roleName').setValue('School Manager');
    component.submit();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
