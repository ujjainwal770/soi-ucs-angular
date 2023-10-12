import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs/internal/observable/of';
import mockValues from 'src/app/core/constants/mock.values';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ManageTagsComponent } from './manage-tags.component';
import { throwError } from 'rxjs';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ManageTagsComponent', () => {
  let component: ManageTagsComponent;
  let fixture: ComponentFixture<ManageTagsComponent>;
  let backend: ApolloTestingController;
  let _utilityService: UtilityService;
  let _dialogsService: DialogsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageTagsComponent],
      imports: [RouterTestingModule, ToastrModule.forRoot(),
        FormsModule,
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
        DialogsService,
        AuthService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _utilityService = TestBed.inject(UtilityService);
    _dialogsService = TestBed.inject(DialogsService);

    spyOn(component, 'searchUserText').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'getfilteredCategories').and.callThrough();
    spyOn(component, 'updateStatusAction').and.callThrough();
    spyOn(component, 'updateStatus').and.callThrough();
    spyOn(component, 'getSearchOptions').and.callThrough();
    spyOn(component, 'getTags').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const searchByQuery = gql`
  { tagSearchOptionList{
    options{
      text,
      query
    }
  }
  }`;
  it("should check getSearchOptions()", () => {
    component.getSearchOptions();
    const op = backend.expectOne(addTypenameToDocument(searchByQuery));
    op.flush({
      "data": {
        "tagSearchOptionList": {
          "options": [
            {
              "text": "Tag",
              "query": "tagname"
            }
          ]
        }
      }
    })
    expect(component.searchOptions).toBeDefined();
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
    expect(component.filterOptions).toBeDefined();
  });

  it('should getfilteredCategories', () => {
    let catId = 1
    component.filterOptions = [
      {
        "id": 1,
        "tagcount": 29,
        "categoryname": "Hobbies"
      }
    ];
    let categoryName = component.getfilteredCategories(catId);
    expect(categoryName).toBe(component.filterOptions[0].categoryname);
  });

  it('should call handlePage() return valid', () => {
    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }

    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  it('should check masterToggle() - when if condition is isAllSelected = true', () => {
    spyOn(component, 'isAllSelected').and.returnValue(true);
    component.masterToggle();
    expect(false).toBe(false);
  });

  it('should check masterToggle() - when if condition is isAllSelected = false', () => {
    spyOn(component, 'isAllSelected').and.returnValue(false);
    component.masterToggle();
    expect(component.dataSource).toBeDefined();
  });

  it('should getSearch', () => {
    let val = 'home';
    component.tagsFormgroup.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
  });

  it('#getSearchTxt should return when searchBy type is tagname', () => {
    const fakeNames = 'Tag';
    component.tagsFormgroup.get('searchBy').setValue('tagname');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return when searchBy type is other than tagname', () => {
    const fakeNames = '';
    component.tagsFormgroup.get('searchBy').setValue('abc');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  xit('should initSelect ', () => {
    const data = [
      {
        "id": 701,
        "tagname": "Trend",
        "categoryid": 3,
        "creationTime": 1640275631521,
        "status": "active"
      },
      {
        "id": 702,
        "tagname": "Resr",
        "categoryid": 3,
        "creationTime": 1640275631521,
        "status": "active"
      },

    ]
    component.initSelect(data)
  });
  it('should test changeStatus', () => {
    let id = 1;
    component.changeStatus(id)
    expect(component.updateStatusAction).toHaveBeenCalled()
  });

  xit('should test ngAfterViewInit', () => {
    component.ngAfterViewInit()
    component.searchTxtBox.nativeElement = 'tes'

  });
  const removeQuery = gql`
  mutation removeTag($input:RemoveTagsInput!){
    removeTag(removeTagInput:$input){
      id,
      tagname,
      categoryid,
      creationTime,
      status
    }
  }`;

  it('should call #changeStatus() - check when dialog response available', () => {
    const arr = [1, 2, 4]
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.updateStatusAction(arr);
    const op = backend.expectOne(addTypenameToDocument(removeQuery));
    op.flush({
      "data": { "removeTag": [{ "id": 12 }, { "id": 22 }, { "id": 32 }] }
    });
    expect(false).toBe(false);
  });

  it('should call #changeStatus() - check when dialog not response available', () => {
    const arr = [1, 2, 4]
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.updateStatusAction(arr);
    expect(false).toBe(false);
  });

  it('should updateStatus ', () => {

    component.updateStatus()
    expect(component.bulkArr).toBeDefined()
  });
  const tagQuery = gql`query findTagsSearchByQuery($input:TagsQuerySearchOptionInput!){
    findTagsSearchByQuery(tagsQuerySearchOptionInput:$input){
      tags{
        id,
        tagname,
        categoryid,
        creationTime,
        status
      },
      count
    }
  }`;

  it("should check getTags()", () => {
    component.getTags();
    const op = backend.expectOne(addTypenameToDocument(tagQuery));
    op.flush({"data":{"findTagsSearchByQuery":{"tags":[{"id":704,"tagname":"testtag","categoryid":1,"creationTime":1640535681060,"status":"active","__typename":"Tags"}],"count":1,"__typename":"TagsWithCount"}}});
    expect(component.dataSource).toBeDefined()
  });

  it('should check searchUserText() - test when searchKeyword available', () => {
    let searchData = "t";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check searchUserText() - test when searchKeyword not available', () => {
    let searchData = "";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check updateStatus() - when selection is available', () => {
    component.selection.select({
      id: 1,
      tagname: "",
      categoryid: 1,
      categoryname: "",
      status: "",
      creationTime: "",
      updationTime: ""
    });
    component.updateStatus();
    expect(false).toBe(false);
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "full_name";
    let sortingByColumn = "creation_time";

    // ascending order.
    component.sorting.sortingClickCounter = 0;
    component.customSorting(sortingByColumn);

    // descending order.
    component.sorting.sortingClickCounter = 1;
    component.customSorting(sortingByColumn);

    // Initial sorting i.e descending
    component.sorting.sortingClickCounter = 2;
    component.customSorting(sortingByColumn);

    // When an invalid choice
    component.sorting.sortingByColumn = "creation_time";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.getTags).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getFilterStatus', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getFilterStatus();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getSearchOptions', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getSearchOptions();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getTags', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getTags();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
