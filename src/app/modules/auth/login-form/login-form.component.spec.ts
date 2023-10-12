import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpService } from 'src/app/core/services/http.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SoucsDashboardComponent } from '../../home/dashboard/soucs-dashboard/soucs-dashboard.component';
import { LoginFormComponent } from './login-form.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let backend: ApolloTestingController;
  let authService: AuthService;
  // beforeAll(() => {
  //   TestBed.initTestEnvironment(
  //     BrowserDynamicTestingModule,
  //     platformBrowserDynamicTesting()
  //   );
  // });
  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [ LoginFormComponent ],
      imports:[
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
        OktaAuthModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: SoucsDashboardComponent},
      ])
        
      ],
      providers:[HttpService,ToastrService,SchoolService,NgxSpinnerService,LocalStorageService,
        
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
             addTypename: true
          }),
       },
       {provide: OKTA_CONFIG, useValue: {oktaAuth}}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);

    authService = TestBed.inject(AuthService);

    

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('should create the app', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  const loginQuery = gql`
    query($email:String!,$password:String!) {
      emailLoginSchoolAdmin(emailLoginInput:{
        email:$email,
        password:$password
      }) {
        user{
          name,id,schoolid
        },
        token
      }
    }`;
  xit("should check submit()", () => {
    component.form.get('email').setValue('abc@gmail.com');
    component.form.get('password').setValue('12345678');
    component.form.get('rememberMe').setValue('true');
    component.submit({});
    const op = backend.expectOne(addTypenameToDocument(loginQuery));
    op.flush({
      "data":
        {
          "emailLoginSchoolAdmin":
          {
            "user":
            {
              "name":"Devi",
              "id":6,
              "schoolid":45,
              "__typename":"SchoolAdmin"
            },
            "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldmlvaXRAeW9wbWFpbC5jb20iLCJzdWIiOjYsInNjaG9vbGlkIjo0NSwiaWF0IjoxNjM3NTcxNjg5LCJleHAiOjE2Mzc2MzE2ODl9.L4biqLTblV0VAkITuCZbB6yI1qRlCMr5gvUAAIm9oEo",
            "__typename":"AdminEmailLoginResponse"
          }
        }
    })

    let dt = {
        "user":
        {
          "name":"Devi",
          "id":6,
          "schoolid":45,
          "__typename":"SchoolAdmin"
        },
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldmlvaXRAeW9wbWFpbC5jb20iLCJzdWIiOjYsInNjaG9vbGlkIjo0NSwiaWF0IjoxNjM3NTcxNjg5LCJleHAiOjE2Mzc2MzE2ODl9.L4biqLTblV0VAkITuCZbB6yI1qRlCMr5gvUAAIm9oEo",
        "__typename":"AdminEmailLoginResponse"
    }
   authService.signIn(dt);

   expect(authService.signIn).toBeDefined();

   // backend.verify();

  });

  xit("should check submit()", () => {
    component.form.get('email').setValue('abc@gmail.com');
    component.form.get('password').setValue('12345678');
    component.form.get('rememberMe').setValue('false');
    component.submit({});
    const op = backend.expectOne(addTypenameToDocument(loginQuery));
    op.flush({
      
      // "errors":[{
      //   // "status":400,
      //   // "error":["You have entered wrong password"],
      //   // "message":"Http Exception"
      // }],
      // "data":null
      
    })
    backend.verify();
    // router.navigateByUrl('/dashboard')
  });

});
