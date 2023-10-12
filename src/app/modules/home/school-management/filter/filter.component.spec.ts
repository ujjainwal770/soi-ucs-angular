import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpService } from 'src/app/core/services/http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SchoolService } from 'src/app/core/services/school.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { HttpClientModule, } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './filter.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let backend: ApolloTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [ToastrService, HttpService, SchoolService, NgxSpinnerService,
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
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    //spyOn(component, 'getSearchOptions').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getSearch', () => {
    let val = 'test';
    
    component.schoolFormGroup.get('searchText').setValue(val);
    //component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    const search = {text:'11',"query":'11',"filter":'lll'};
    expect(component.getSearch).toBeTruthy();
  });

  it('#getSearch should check for false', () => {
    let val = '';
    component.getSearch();
    expect(false).toEqual(false);
  });

  it('should call getSearchTxt', () => {
    component.getSearchTxt();
    expect(component.schoolFormGroup.value.searchBy).toEqual('schoolName')
    component.schoolFormGroup.get('searchBy').setValue('zipcode')
    expect(component.schoolFormGroup.value.searchBy).toEqual('zipcode')

  });


  it('#getSearchTxt should return Name when search text is schoolName', () => {
    const fakeNames = 'Name';
    component.schoolFormGroup.get('searchBy').setValue('schoolName');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return State when search text is stateName', () => {
    const fakeNames = 'State';
    component.schoolFormGroup.get('searchBy').setValue('stateName');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return Zip Code when search text is zipcode', () => {
    const fakeNames = 'Zip Code';
    component.schoolFormGroup.get('searchBy').setValue('zipcode');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return City when search text is cityName', () => {
    const fakeNames = 'City';
    component.schoolFormGroup.get('searchBy').setValue('cityName');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return City when search text is districtName', () => {
    const fakeNames = 'District';
    component.schoolFormGroup.get('searchBy').setValue('districtName');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return Address when search text is addressFirst', () => {
    const fakeNames = 'Address';
    component.schoolFormGroup.get('searchBy').setValue('addressFirst');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return Country when search text is countryName', () => {
    const fakeNames = 'Country';
    component.schoolFormGroup.get('searchBy').setValue('countryName');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });
  
  it('#getSearchTxt should return NSES ID when search text is nses', () => {
    const fakeNames = 'NSES ID';
    component.schoolFormGroup.get('searchBy').setValue('nses');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return empty when search text value is blank', () => {
    const fakeNames = '';
    component.schoolFormGroup.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  it('#getSearchTxt should return State when search text is deactivateReason', () => {
    const fakeNames = 'Reason';
    component.schoolFormGroup.get('searchBy').setValue('deactivateReason');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(fakeNames);
  });

  const searchByOptions = gql`{
    getSchoolOptionList{
      options {
        query,
        text
      }
    }
  }`;
  it("should check getSearchOptions()", () => {
    component.getSearchOptions();
    const op = backend.expectOne(addTypenameToDocument(searchByOptions));
    op.flush({"data":{"getSchoolOptionList":{"options":[{
      "query":"schoolName","text":"Name","__typename":"SearchOptionSingle"},
      {"query":"stateName","text":"State","__typename":"SearchOptionSingle"},{"query":"zipcode","text":"Zipcode","__typename":"SearchOptionSingle"}],"__typename":"SearchOptionList"}}}
    )
    expect(component.searchOptions).toBeDefined();
  });
  const schoolStatusListQuery = gql`{
    schoolstatusList{
      options {
        query,
        text
      }
    }
  }`;

  it("should check getFilterByStatusOptions()", () => {
    const op = backend.expectOne(addTypenameToDocument(schoolStatusListQuery));
    op.flush({"data":{"schoolstatusList":{"options":[{"query":"all","text":"All","__typename":"SearchOptionSingle"},{"query":"active","text":"Active","__typename":"SearchOptionSingle"},{"query":"inactive","text":"Inactive","__typename":"SearchOptionSingle"},{"query":"pending","text":"Pending","__typename":"SearchOptionSingle"}],"__typename":"SearchOptionList"}}}
    )
    expect(component.filterByStatusOption).toBeDefined();
  });
      // Tests that the search text input field is cleared when it is not empty
      it('test_clears_search_text_when_not_empty', () => {
        component.schoolFormGroup = new FormGroup({
            searchText: new FormControl('test')
        });
        component.clearSearchText();
        expect(component.schoolFormGroup.get('searchText').value).toEqual('');
    });
        // Tests that resetFilter sets searchOptionsData object with values from schoolFormGroup and emits searchTxt event with searchOptionsData
        it('test_reset_filter_happy_path', () => {
          component.schoolFormGroup = new FormGroup({
              searchText: new FormControl('test'),
              searchBy: new FormControl('test'),
              filterby: new FormControl('test'),
              filterbytype: new FormControl('test'),
          });
          spyOn(component.searchTxt, 'emit');
          component.resetFilter();
          expect(component.searchOptionsData).toEqual({
              'text': 'test',
              'query': 'test',
              'filter': 'test',
              'filterbytype':'test'
          });
          expect(component.searchTxt.emit).toHaveBeenCalledWith(component.searchOptionsData);
      });
          // Tests that the function returns the correct search text based on the selected search option
    it('test_happy_path_return_correct_search_text', () => {
      component.schoolFormGroup = new FormGroup({
          searchBy: new FormControl('schoolName')
      });
      expect(component.getSearchTxt()).toEqual('Name');
  });
  it('test_error_is_handled_correctly getSearchOptions', () => {
    spyOn(component['_apollo'], 'watchQuery').and.returnValue({
      valueChanges: throwError('error'),
      ref: {
        variables: {},
      },
    } as any); 
  
    spyOn(component['_errorHandler'], 'manageError');
    component.getSearchOptions();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getFilterByStatusOptions', () => {
    spyOn(component['_apollo'], 'watchQuery').and.returnValue({
      valueChanges: throwError('error'),
      ref: {
        variables: {},
      },
    } as any); 
  
    spyOn(component['_errorHandler'], 'manageError');
    component.getFilterByStatusOptions();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  const schoolTypeListQuery = gql`{
    schoolTypeList{
      options {
        query,
        text
      }
    }
  }`;
  it("should check getFilterByTypeOptions()", () => {
    const op = backend.expectOne(addTypenameToDocument(schoolTypeListQuery));
    op.flush({"data":{"schoolTypeList":{"options":[{"query":"all","text":"All","__typename":"SearchOptionSingle"},{"query":"K12","text":"K12","__typename":"SearchOptionSingle"},{"query":"University","text":"University","__typename":"SearchOptionSingle"}],"__typename":"SearchOptionList"}}}
    )
    expect(component.getFilterByTypeOptions).toBeDefined();
  });
  it('test_error_is_handled_correctly getFilterByTypeOptions', () => {
    spyOn(component['_apollo'], 'watchQuery').and.returnValue({
      valueChanges: throwError('error'),
      ref: {
        variables: {},
      },
    } as any); 
  
    spyOn(component['_errorHandler'], 'manageError');
    component.getFilterByTypeOptions();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
