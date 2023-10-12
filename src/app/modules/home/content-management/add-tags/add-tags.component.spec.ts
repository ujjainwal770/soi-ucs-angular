import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/core/services/http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { HttpClientModule, } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ReactiveFormsModule } from '@angular/forms';
import { AddTagsComponent } from './add-tags.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ManageTagsComponent } from '../manage-tags/manage-tags.component';
import { throwError } from 'rxjs';

describe('AddTagsComponent', () => {
  let component: AddTagsComponent;
  let fixture: ComponentFixture<AddTagsComponent>;
  let backend: ApolloTestingController;

  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTagsComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes( [{path: 'content-management/manage-tags', component: ManageTagsComponent}]),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
      ],
      providers: [HttpService, ToastrService, NgxSpinnerService,
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
    fixture = TestBed.createComponent(AddTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);

    spyOn(component,'getFilterStatus').and.callThrough();
    // spyOn(router, 'navigate').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  const categoryQuery = gql`
  { tagcategory {
      id,
      tagcount,
      categoryname
    }
  }`;

  it("should check getFilterStatus()", () => {
    const op = backend.expectOne(addTypenameToDocument(categoryQuery));
    op.flush({
      "data": {
        "tagcategory": [
          {
            "id": 1,
            "tagcount": 29,
            "categoryname": "Hobbies"
          },
          {
            "id": 2,
            "tagcount": 105,
            "categoryname": "Food"
          },
          {
            "id": 3,
            "tagcount": 118,
            "categoryname": "Places"
          },
          {
            "id": 4,
            "tagcount": 95,
            "categoryname": "Animals"
          },
          {
            "id": 5,
            "tagcount": 209,
            "categoryname": "Personality"
          },
          {
            "id": 6,
            "tagcount": 22,
            "categoryname": "UnifiedGeneration"
          },
          {
            "id": 7,
            "tagcount": 83,
            "categoryname": "Things"
          }
        ]
      }
    })
    backend.verify()
    expect(backend).toBeDefined();
  });
  const addtagQuery = gql`
  mutation addTag($input:AddTagsInput!){
    addTag(addTagInput:$input){
      id,
      tagname
    }
  }`;
  it('should call submit', inject([Router], (router: Router) => {
    component.addtagForm.get('tagname').setValue('dsfds,dsfsdd');
    component.addtagForm.get('categoryid').setValue(6);
    component.submit();
    const op = backend.expectOne(addTypenameToDocument(addtagQuery));
    op.flush({
      "data": {
        "addTag": [
          {
            "id": 707,
            "tagname": "sadas"
          },
          {
            "id": 708,
            "tagname": "sadasd"
          }
        ]
      }
    })
    spyOn(router, 'navigate').and.callThrough();
    expect(router.navigate).toBeDefined();
  }));
  it('test_error_is_handled_correctly getFilterStatus', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getFilterStatus();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly submit', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.addtagForm.get('tagname').setValue('dsfds,dsfsdd');
    component.addtagForm.get('categoryid').setValue(6);
    component.submit();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

});
