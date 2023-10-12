import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { _CONST } from '../../../../core/constants/app.constants';
import { dismissedUserListQuery } from '../../../..//core/query/dismiss-user';
import { AppConstantService } from '../../../..//core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { SharedService } from '../../../../core/services/shared.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces } from '../../../../validators/custom.validator';

@Component({
  selector: 'app-dismissed-students',
  templateUrl: './dismissed-students.component.html',
  styleUrls: ['./dismissed-students.component.scss']
})

export class DismissedStudentsComponent implements OnInit {

  dismissedStudentsFormGroup: FormGroup;
  sorting = this._sharedService.getSortingData('dismissStudentListing');
  filtering = this._sharedService.getFilteringData('dismissStudentListing');
  displayedColumns: string[] = ['first_name', 'email', 'school_name', 'nces_id', 'state_name', 'school_admin_name', 'dismissReason', 'account_status', 'actions'];
  columnMapping = {
    full_name:'first_name',
    email:'email',
    schoolName:'school_name',
    nces:'nces_id',
    stateName:'state_name',
    schoolAdminname:'school_admin_name',
    dismissReason:'dismissReason',
    account_status:'account_status',
    actions:'actions'
  };
  dataSource = new MatTableDataSource([]);
  originalListResp = [];
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  actionMenu: Array<{}> = [
    { name: 'Edit', path: 'edit', icon: 'edit' }
  ];
  count = 0;
  currentPage = 0;
  nextPage: number;
  filterByStatusOptionList = [];
  searchOptions = [
    {name: 'User Name', value: 'full_name'},
    {name: 'Email ID', value: 'email'},
    {name: 'School Name', value: 'schoolName'},
    {name: 'School Admin Name', value: 'schoolAdminname'}
  ];

  searchbyTxt = 'User Name';

  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _utilityService: UtilityService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.dismissedStudentsFormGroup = new FormGroup({
      'filterByStatus': new FormControl('all', [Validators.required]),
      'searchBy': new FormControl(this.filtering.searchBy, [Validators.required]),
      'searchText': new FormControl(this.filtering.searchQuery, [Validators.required, removeSpaces])
    });

    this.getDismissedUserList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.searchUserText();
  }

  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getDismissedUserList();
  }

  /**
   * Fetch Dismissed User list
   */

  getDismissedUserList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: dismissedUserListQuery,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          query: this.dismissedStudentsFormGroup.value.searchBy,
          keyword: this.dismissedStudentsFormGroup.value.searchText,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.originalListResp = data['dismissList'];
        this.dataSource = this.getFilteredDataSource();
        this.count = this.originalListResp['count'];
        this.sort.active = this.columnMapping[this.sorting.sortingByColumn];
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  getFilteredDataSource() {
    const userList = this.originalListResp['users'];
    const filteredList = userList.map(item => ({
      ...item,
      school_name: this.getfilteredColumn(item?.trackSchoolId, 'id', 'schoolName', 'school'),
      nces_id: this.getfilteredColumn(item?.trackSchoolId, 'id', 'nces', 'school'),
      state_name: this.getfilteredColumn(item?.trackSchoolId, 'id', 'stateName', 'school'),
      school_admin_name: this.getfilteredColumn(item?.trackSchoolId, 'schoolid', 'name', 'schoolAdmin')
    }));
    return new MatTableDataSource(filteredList);
  }

  getfilteredColumn(schoolid, compareWith: string, whichColumn: string, valueFromObject: string) {
    let res;
    if (this.originalListResp[valueFromObject]?.length > 0) {
      res = this.originalListResp[valueFromObject].find(element => element[compareWith] === schoolid);
    }
    return res ? res[whichColumn] : '';
  }

  /**
   *
   * @param field : input field name as string
   * @returns as field reference
   */
  getFieldRef(field: string) {
    return this.dismissedStudentsFormGroup.get(field);
  }

  /**
   * Reset search text on value change
   */
  getSearch() {
    if (this.dismissedStudentsFormGroup.value.searchText !== '') {
      this.dismissedStudentsFormGroup.value.searchText = '';
      this.searchTxtBox.nativeElement.value = '';
      this.getDismissedUserList();
    }
  }

  /**
   * Set search by text when option change
   * @returns value as string
   */
  getSearchTxt() {
    switch (this.getFieldRef('searchBy').value) {
      case 'full_name':
        return 'User Name';
      case 'email':
        return 'Email Id';
      case 'schoolName':
        return 'School Name';
      case 'schoolAdminname':
        return 'School Admin Name';
      default:
        return '';
    }
  }

  /**
   * do search when user key in the text box
   */
  searchUserText() {
    const searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
    searchTerms.subscribe(res => {
      if (res && res.length > 0) {
        this.dismissedStudentsFormGroup.value.searchText = res;
        this.resetFilter();
      } else {
        this.resetFilter();
      }
    });
  }

  resetFilter () {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.filtering = {
      searchBy: this.dismissedStudentsFormGroup.value.searchBy,
      searchQuery: this.dismissedStudentsFormGroup.value.searchText
    };
    this._sharedService.setFilteringData('dismissStudentListing', this.filtering);
    this.getDismissedUserList();
  }

  userAction(userId: string) {
    this._router.navigateByUrl('/app-users/dismissed-student-details/' + userId);
  }

  customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting.sortingByColumn !== sortingByColumn) {
      this.sorting.currentOrder = 1;
      this.sorting.sortingClickCounter = 0;
    }

    this.sorting.sortingClickCounter++;
    this.sorting.sortingByColumn = sortingByColumn;
    switch (this.sorting.sortingClickCounter) {

      //Ascending order
      case _CONST.one:
        this.sorting.currentOrder = 1;
        break;

      // Descending order
      case _CONST.two:
        this.sorting.currentOrder = 0;
        break;

      // Initial order i.e. descending
      case _CONST.three:
        this.sorting = { ...this._const.DISMISS_STUDENTS_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('dismissStudentListing', this.sorting);
    this.getDismissedUserList();
  }
}
