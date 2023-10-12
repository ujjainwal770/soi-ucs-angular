import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { SetPasswordComponent } from './set-password.component';

describe('SetPasswordComponent', () => {
  let component: SetPasswordComponent;
  let fixture: ComponentFixture<SetPasswordComponent>;
  let backend: ApolloTestingController;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetPasswordComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        PopoverModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [HttpService, ToastrService, SchoolService, NgxSpinnerService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component, 'login').and.callThrough();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    console.log(`SetPasswordComponent -> first test case`);
    expect(component).toBeTruthy();
  });

  it('should call submit', inject([Router], (router: Router) => {
    console.log(`SetPasswordComponent -> submit() -> 1`);

    component.form.get('password').setValue('12345678');
    component.form.get('confirmPassword').setValue('12345678');
    component.submit();
    spyOn(router, 'navigate').and.callThrough();
    expect(router.navigate).toBeDefined();

  }));

  it("should check checkLinkExpired()", () => {
    console.log(`SetPasswordComponent -> checkLinkExpired() -> 1`);

    const checkVerification = gql`
      query($verification:String!){
        findSchoolAdminByVerification(verification:$verification){
          id
        }
      }
    `;

    component.checkLinkExpired();
    const op = backend.expectOne(addTypenameToDocument(checkVerification));
    op.flush({ "data": { "findSchoolAdminByVerification": { "id": 55, "__typename": "SchoolAdmin" } } })
    expect(component.displayForm).toBeDefined();

  });

  it('should call login', () => {
    console.log(`SetPasswordComponent -> login() -> 1`);

    const spy = spyOn(router, 'navigateByUrl');
    component.login();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/auth/login');
  });
});
