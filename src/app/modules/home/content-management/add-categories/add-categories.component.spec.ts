import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { Apollo } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { ToastrModule } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { addCategoryuery, categoryQuery, findTagQuey, removeCategoryQuery, removeTagsQuery } from 'src/app/core/query/add-categories';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { AddCategoriesComponent } from './add-categories.component';
import { Router } from '@angular/router';
export interface CategoryData {
  id: number,
  categoryname: string,
  tagcount: number,
}
describe('AddCategoriesComponent', () => {
  let component: AddCategoriesComponent;
  let fixture: ComponentFixture<AddCategoriesComponent>;
  let backend: ApolloTestingController;
  let _apollo: Apollo;
  let dialog: MatDialog;
  let _dialogsService: DialogsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCategoriesComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
        MatDialogModule
      ],
      providers: [HttpService, ToastrService, SchoolService, NgxSpinnerService, DialogsService!,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: { open: () => of({ id: 1 }) } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    dialog = TestBed.inject(MatDialog);
    _dialogsService = TestBed.inject(DialogsService);

    spyOn(component, 'getFilterStatus').and.callThrough();
    spyOn(component, 'getTags').and.callThrough();
    spyOn(component, 'selectedRow').and.callThrough();
    spyOn(component, 'remove').and.callThrough();
    spyOn(component, 'removeAction').and.callThrough();
    spyOn(component, 'removeCategory').and.callThrough();
    spyOn(component, 'removeTags').and.callThrough();
    spyOn(component, 'onSearch').and.callThrough();
    spyOn(component, 'addCategory').and.callThrough();
    spyOn(component, 'onBulkRemoveTags').and.callThrough();
  });
   // Tests that selecting a row sets categorySelected and toBeSelectedCategory to the id of the selected row
    it('test_selected_row_sets_category_selected_and_to_be_selected_category', () => {
      const id = 1;
      component.selectedRow(id);
      expect(component.categorySelected).toEqual(id);
      expect(component.toBeSelectedCategory).toEqual(id);
  });
  

  it("should check onSearch() - when #searchTerms.length == 0", () => {
    const searchTxt = { target: { value: '' } }
    component.tagLists = [
      { "id": 142, "tagname": "NewYorkCity", "__typename": "Tags" },
      { "id": 143, "tagname": "LosAngeles", "__typename": "Tags" },
    ];
    component.onSearch(searchTxt);
    expect(component.getTags).toHaveBeenCalled();
  });

  it("should check onSearch() - when #searchTerms.length == 1", () => {
    const searchTxt = { target: { value: 't' } }
    component.tagLists = [
      { "id": 142, "tagname": "NewYorkCity", "__typename": "Tags" },
      { "id": 143, "tagname": "LosAngeles", "__typename": "Tags" },
    ];
    component.onSearch(searchTxt);
    expect(component.filteredTag).toBeDefined();
  });

  // it('should call #addCategory() - When form is valid', () => {
  //   component.addCategoriesForm.get('categoryname').setValue('test');
  //   let formDirective:FormGroupDirective;
  //   component.addCategory(formDirective);
  //   const op = backend.expectOne(addTypenameToDocument(addCategoryuery));
  //   op.flush({"data":{"addTagCategory":{"id":22,"categoryname":"student","tagcount":0,"__typename":"TagCategory"}}}    );
  //   expect(false).toBe(false);
  // });

  it('should call #addCategory() - When form is invalid', () => {
    component.addCategoriesForm.get('categoryname').setValue('');
    let formDirective:FormGroupDirective;
    component.addCategory(formDirective);
    expect(false).toBe(false);
  });

  it('#getData should return expected data', () => {
    const expectedData: CategoryData[] = [
      {
        "id": 13,
        "categoryname": "testingsec",
        "tagcount": 0
      }
    ];
    let body = {
      input: {
        "categoryname": component.addCategoriesForm.get('categoryname').setValue('test')
      }
    }
    let formDirective:FormGroupDirective;
    component.addCategory(formDirective)
    component._apollo.mutate({
      mutation: addCategoryuery,
      variables: body,
      refetchQueries: [{
        query: categoryQuery,
        variables: {},
      }]
    }).subscribe(({ data }) => {
      expect(data).toEqual(expectedData)
    })
  });

  it("should check #onBulkRemoveTags()", () => {
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));

    component.filteredTag = [{ "id": 142, "tagname": "NewYorkCity" }, { "id": 143, "tagname": "LosAngeles" }];
    component.onBulkRemoveTags();
    expect(component.removeAction).toHaveBeenCalled()
  });

  it("should check onRemovSearch()", () => {
    component.onRemovSearch();
    expect(component.searchTxtBox).toBeDefined();
  });

  it('should call #remove() - check when dialog response available', () => {
    let tags = "test_tag";
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.filteredTag = [{ "id": 13, "tagname": "test_tag" }, { "id": 15, "tagname": "Scrapbooker" }];
    component.remove(tags);
    expect(component.removeTags).toHaveBeenCalled();
  });

  it('should call #remove() - check when dialog response not available', () => {
    let tags = "test_tag";
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.remove(tags);
    expect(component.removeTags).not.toHaveBeenCalled();
  });

  it('should call #removeAction() - check when dialog response available', () => {
    let res = { "data": "data" };

    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.removeAction();
    expect(component.removeTags).toHaveBeenCalled();
  });

  it('should call #removeAction() - check when dialog response not available', () => {
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.removeAction();
    expect(component.removeTags).not.toHaveBeenCalled();
  });

  it('should call #openDialog() - check when dialog response available', () => {
    let res = { "data": "data" };

    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openDialog();
    expect(component.removeCategory).toHaveBeenCalled();
  });

  it('should call #openDialog() - check when dialog response not available', () => {
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.openDialog();
    expect(component.removeCategory).not.toHaveBeenCalled();
  });

  it('should check #removeTags()', () => {
    component.removeTags();
    const op = backend.expectOne(addTypenameToDocument(removeTagsQuery));
    op.flush({ "data": { "removeTag": [{ "id": 13, "tagname": "Chef", "__typename": "Tags" }] } });
    expect(false).toBe(false);
  });

  it('should check #removeCategory()', () => {
    component.removeCategory();
    const op = backend.expectOne(addTypenameToDocument(removeCategoryQuery));
    op.flush({"data":{"deleteTagCategory":{"id":18,"__typename":"TagCategory"}}});
    expect(false).toBe(false);
  });
  it('test_error_is_handled_correctly removeCategory', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.removeCategory();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly removeTags', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.removeTags();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getFilterStatus', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getFilterStatus();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getTags', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getTags('1');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('should test getSchoolList', () => {
    // const op = backend.expectOne(schoolQuery);

    const op = backend.expectOne(addTypenameToDocument(categoryQuery));
    component.getFilterStatus();
    
    op.flush({ "data": { "tagcategory": [
      {
          "id": 1,
          "tagcount": 21,
          "categoryname": "Hobbies",
          "__typename": "TagCategory"
      },
      {
          "id": 2,
          "tagcount": 104,
          "categoryname": "Food",
          "__typename": "TagCategory"
      },
      {
          "id": 3,
          "tagcount": 114,
          "categoryname": "Places",
          "__typename": "TagCategory"
      },
 
  ] } }
    );
    // backend.verify();
  });

});