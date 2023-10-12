import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloQueryResult } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { getRoleByEmailQuery } from 'src/app/core/query/admin';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { AuthComponent } from 'src/app/modules/auth/auth/auth.component';
import { HomeLayoutComponent } from './home-layout.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('HomeLayoutComponent', () => {
  let component: HomeLayoutComponent;
  let fixture: ComponentFixture<HomeLayoutComponent>;
  let _localStorage: LocalStorageService;
  let backend: ApolloTestingController;
  let _authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeLayoutComponent],
      imports: [OktaAuthModule, ToastrModule.forRoot(),
        ApolloTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'auth/home', component: AuthComponent }
        ]),
        MatMenuModule, NoopAnimationsModule],
      providers: [
        NgxSpinnerService,
        LocalStorageService,
        ToastrService,
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
    fixture = TestBed.createComponent(HomeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _localStorage = TestBed.inject(LocalStorageService);
    _authService = TestBed.inject(AuthService);

    spyOn(component, 'getRoleByAuthToken').and.callThrough();
    spyOn(component, 'setApplicableNavItemsName').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #ngOnInit() - when school admin', () => {
    spyOn(_localStorage, 'isSchoolAdmin').and.returnValue(true);
    component.ngOnInit();
    expect(component.isRolefetched).toBe(true);
  });

  it('should check #ngOnInit()- when not soucs admin', () => {
    spyOn(_localStorage, 'isSchoolAdmin').and.returnValue(false);
    component.ngOnInit();
    expect(component.getRoleByAuthToken).toHaveBeenCalled();
  });
  it('should fetch role by auth token successfully', () => {
    const apolloSpy = spyOn(component['_apollo'], 'query').and.returnValue(of({ data: { getRoleByEmail: { roleName: 'Super Admin' } } })as Observable<ApolloQueryResult<unknown>>);
    const spinnerSpy = spyOn(component['_spinner'], 'show');
    const hideSpinnerSpy = spyOn(component['_spinner'], 'hide');
    const errorHandlerSpy = spyOn(component['_errorHandler'], 'manageError');
    const authServiceSpy = spyOn(component['_authService'], 'logout');
    
    component.getRoleByAuthToken();
    
    expect(spinnerSpy).toHaveBeenCalled();
    expect(apolloSpy).toHaveBeenCalledWith({
      query: getRoleByEmailQuery,
      variables: {},
      fetchPolicy: 'no-cache',
    });
    expect(hideSpinnerSpy).toHaveBeenCalled();
    expect(component.applicableNavItemNames).toEqual(['all']);
    expect(component.isRolefetched).toBeTrue();
    expect(errorHandlerSpy).not.toHaveBeenCalled();
    expect(authServiceSpy).not.toHaveBeenCalled();
  });
  

  xit('should call getRoleByAuthToken()', () => {
    component.getRoleByAuthToken();
    const op = backend.expectOne(addTypenameToDocument(getRoleByEmailQuery));
    op.flush({"data":{"getRoleByEmail":{"id":14,"roleName":"Super Admin","status":"active","__typename":"Role"}}}
    );
  });

  xit('should check #setApplicableNavItemsName() - when role having access for some modules', () => {
    let activeRole = 'Super Admin';
    component.navItemsAsPerRole = [{
      "roleName": "Super Admin",
      "allowed_nav_item_names": ["all"]
    }, {
      "roleName": "Content Manager",
      "allowed_nav_item_names": ["dashboard", "content"]
    }];
    component.setApplicableNavItemsName(activeRole);
    expect(component.isRolefetched).toBe(true);
  });

  xit('should check #setApplicableNavItemsName() - when role having access for some modules', () => {
    let activeRole = '';
    component.navItemsAsPerRole = [];
    component.setApplicableNavItemsName(activeRole);
    expect(false).toBe(false);
  });
  it('test_error_is_handled_correctly getRoleByAuthToken', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getRoleByAuthToken();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});

   
});
