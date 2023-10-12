import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../../core/constants/app.constants';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { SharedService } from '../../../../core/services/shared.service';
import { AppUserSchoolData, AppUsersData, AppUsersTypeData } from '../../../../core/model/app-users.model';
import { appUserActiveStatusQuery, getAppUserQuery, userSearchByOptionQuery, userStatusOptionQuery, userTypeOptionQuery } from '../../../../core/query/appuser';
import { removeSpaces } from '../../../../validators/custom.validator';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {

  userListForm: FormGroup;
  // custom sorting to get the sorted data from database.
  sorting = this._sharedService.getSortingData('appUserListing');
  filtering = this._sharedService.getFilteringData('appUserListing');

  displayedColumns: string[] = ['first_name', 'email', 'date_of_birth', 'school_name', 'ucs_status', 'creation_time', 'schoolverifystatus', 'account_status', 'actions'];
  dataSource = new MatTableDataSource<AppUsersData>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;
  userTypeOptionList: AppUsersTypeData[] = [];
  userStatusOptionList: AppUsersTypeData[] = [];
  userSearchByOptionList: AppUsersTypeData[] = [];
  searchbyTxt = 'Name';
  schoolData: Array<AppUserSchoolData> = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _dialogsService: DialogsService,
    private readonly _toastr: ToastrService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
    private readonly _router: Router
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.userListForm = new FormGroup({
      'filterbyusertype': new FormControl(this.filtering.userType || 'all', [Validators.required]),
      'filterbyuserstatus': new FormControl(this.filtering.accountStatus || 'all', [Validators.required]),
      'searchBy': new FormControl(this.filtering.searchBy || 'full_name', [Validators.required]),
      'searchText': new FormControl(this.filtering.searchQuery || '', [Validators.required, removeSpaces]),
    });
    this.getAppUserList();
    this.getUserTypeOption();
    this.getUserAccountStatusOption();
    this.getUserSearchByOption();
  }


  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getAppUserList();
  }

  /**
   * Fetch App User
   */

  getAppUserList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: getAppUserQuery,
        variables: {
          keyword: this.userListForm.value.searchText,
          query: this.userListForm.value.searchBy,
          filter: this.userListForm.value.filterbyuserstatus,
          user_type: this.userListForm.value.filterbyusertype,
          page: this.currentPage,
          limit: this.pageSizeCount,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['adminPortalAppUserList'];
        this.schoolData = dt['schools'];
        const userListData = this.initSelect(data['adminPortalAppUserList']['users']);
        this.dataSource = new MatTableDataSource(userListData);
        this.count = dt['count'];
        this.sort.active = this.sorting.sortingByColumn;
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  initSelect = data => {
    return data.map(item => ({
      ...item,
      school_name: this.getfilteredSchool(item.school_id)
    }));
  };

  getfilteredSchool(catId) {
    const res = this.schoolData.find(element => element.id === catId);
    return res ? res['schoolName'] : 'N/A';
  }


  /**
   * Fetch User type option list
   */
  getUserTypeOption() {
    this._apollo
      .query({
        query: userTypeOptionQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.userTypeOptionList = data['getUserTypeOptionList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * Fetch User account status option list
   */
  getUserAccountStatusOption() {
    this._apollo
      .query({
        query: userStatusOptionQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.userStatusOptionList = data['getUserStatusOptionList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   *
   * @param field : input field name as string
   * @returns as field reference
   */
  getFieldRef(field: string) {
    return this.userListForm.get(field);
  }

  /**
   * Reset search text on value change
   */
  getSearch() {
    this.userListForm.get('searchText').setValue('');
    this.getAppUserList();
  }

  /**
   * Fetch User account status option list
   */
  getUserSearchByOption() {
    this._apollo
      .query({
        query: userSearchByOptionQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.userSearchByOptionList = data['getUserSearchByList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * Set search by text when option change
   * @returns value as string
   */
  getSearchTxt() {
    switch (this.getFieldRef('searchBy').value) {
      case 'full_name':
        return 'Name';
      case 'email':
        return 'Email Id';
      default:
        return '';
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  changeStatus(id, currentStatus) {
    const pgtitle = 'Confirm';
    const message = 'Are you sure want to change the status for this user ?';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this._spinner.show();
          this._apollo.mutate({
            mutation: appUserActiveStatusQuery,
            variables: {
              user_id: id,
              status: currentStatus
            }
          }).subscribe(({ data }) => {
            this._spinner.hide();
            this._toastr.success('User status changed successfully');
            this.getAppUserList();
          }, error => {
            this._spinner.hide();
            this._errorHandler.manageError(error, true);
          });
        }
      });
  }

  resetFilter() {
    this.filtering = {
      userType: this.userListForm.value.filterbyusertype,
      accountStatus: this.userListForm.value.filterbyuserstatus,
      searchBy: this.userListForm.value.searchBy,
      searchQuery: this.userListForm.value.searchText
    };
    this._sharedService.setFilteringData('appUserListing', this.filtering);
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.getAppUserList();
  }

  // Implementing custom sorting 
 customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting.sortingByColumn !== sortingByColumn) {
      this.sorting.sortingClickCounter = 0;
      this.sorting.currentOrder = 1;
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

      // Intial order i.e. descending
      case _CONST.three:
        this.sorting = { ...this._const.APP_USER_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('appUserListing', this.sorting);
    this.getAppUserList();
  }
  userAction(path: string, item: Object) {
    if (path === 'edit') {
      this._router.navigateByUrl(`/app-users/edit-user-details/${item['user_id']}`);
    } else if (path === 'view') {
      this._router.navigateByUrl(`/app-users/user-details/${item['user_id']}`);
    } else {
      return;
    }
  }
}
