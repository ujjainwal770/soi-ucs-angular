import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces } from '../../../../validators/custom.validator';

const searchByOptions = gql`{
  getSchoolOptionList{
    options {
      query,
      text
    }
  }
}`;

const schoolStatusListQuery = gql`{
  schoolstatusList{
    options {
      query,
      text
    }
  }
}`;
const schoolTypeListQuery = gql`{
  schoolTypeList{
    options {
      query,
      text
    }
  }
}`;


@Component({
  selector: 'app-school-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  schoolFormGroup: FormGroup;
  searchbyTxt = '';
  filterTxt = 'all';
  searchOptions: any = [];
  filterByStatusOption: any = [];
  filterByTypeOption: any = [];
  searchTxtvalue: any = '';
  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @Output() statusSelection = new EventEmitter<string>();


  @Output() searchTxt = new EventEmitter();
  @Input() set filterData(data:{ query: string; text: string; filter: string,filterbytype: string  }){
    this.searchOptionsData = data;
    this.schoolFormGroup = new FormGroup({
      'filterbytype': new FormControl(this.searchOptionsData?.filterbytype || 'all', [Validators.required]),
      'filterby': new FormControl(this.searchOptionsData?.filter || 'all', [Validators.required]),
      'searchBy': new FormControl(this.searchOptionsData?.query || 'schoolName', [Validators.required]),
      'searchText': new FormControl(this.searchOptionsData?.text || '', [Validators.required, removeSpaces]),
    });
  }

  private readonly searchTxtEvent = new Subject<Observable<string>>();
  searchOptionsData: { query: any; text: string; filter: string,filterbytype: string };

  constructor(
    private readonly _apollo: Apollo,
    private readonly _utilityService: UtilityService,
    private readonly _errorHandler: CustomErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.getSearchOptions();
    this.schoolFormGroup = new FormGroup({
      'filterbytype': new FormControl(this.searchOptionsData?.filterbytype || 'all', [Validators.required]),
      'filterby': new FormControl(this.searchOptionsData?.filter || 'all', [Validators.required]),
      'searchBy': new FormControl(this.searchOptionsData?.query || 'schoolName', [Validators.required]),
      'searchText': new FormControl(this.searchOptionsData?.text || '', [Validators.required, removeSpaces]),
    });
    this.getFilterByStatusOptions();
    this.getFilterByTypeOptions();
  }
  getSearchOptions() {
    this._apollo
      .watchQuery({
        query: searchByOptions,
        variables: {},
      }).valueChanges.subscribe(({ data }) => {
        this.searchOptions = data['getSchoolOptionList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  getFilterByStatusOptions() {
    this._apollo
      .watchQuery({
        query: schoolStatusListQuery,
        variables: {},
      }).valueChanges.subscribe(({ data }) => {
        this.filterByStatusOption = data['schoolstatusList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  getFilterByTypeOptions() {
    this._apollo
      .watchQuery({
        query: schoolTypeListQuery,
        variables: {},
      }).valueChanges.subscribe(({ data }) => {
       this.filterByTypeOption = data['schoolTypeList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  clearSearchText(){
    if (this.schoolFormGroup.value.searchText !== '') {
      this.schoolFormGroup.get('searchText').setValue('');
    }
  }

  getSearch() {
    this.searchOptionsData = {
      'text': this.schoolFormGroup.value.searchText,
      'query': this.schoolFormGroup.value.searchBy,
      'filter': this.schoolFormGroup.value.filterby,
      'filterbytype': this.schoolFormGroup.value.filterbytype
    };
    this.searchTxt.emit(this.searchOptionsData);
  }

  getSearchTxt() {
    switch (this.schoolFormGroup.value.searchBy) {
      case 'schoolName':
        return 'Name';
      case 'stateName':
        return 'State';
      case 'zipcode':
        return 'Zip Code';
      case 'cityName':
        return 'City';
      case 'districtName':
        return 'District';
      case 'addressFirst':
        return 'Address';
      case 'countryName':
        return 'Country';
      case 'nses':
        return 'NSES ID';
      case 'deactivateReason':
        return 'Reason';
      default:
        return '';
    }
  }
  resetFilter()
  {
    this.searchOptionsData = {
      'text': this.schoolFormGroup.value.searchText,
      'query': this.schoolFormGroup.value.searchBy,
      'filter': this.schoolFormGroup.value.filterby,
      'filterbytype': this.schoolFormGroup.value.filterbytype
    };
    this.searchTxt.emit(this.searchOptionsData);
  }

  // ngAfterViewInit(): void {
  //   const searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
  //   searchTerms.subscribe(res => {
  //     this.searchOptionsData = {
  //       'text': res,
  //       'query': this.schoolFormGroup.value.searchBy,
  //       'filter': this.schoolFormGroup.value.filterby
  //     };
  //     this.searchTxt.emit(this.searchOptionsData);
  //   });
  // }

}
