import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../../core/constants/app.constants';
import { AdminUserData } from '../../../../core/model/admin-model';
import {
  adminSearchByListQuery, adminUserListQuery, deactivateOktaAdminQuery,
  fetchAdminStatusQuery, reactivateOktaAdmin, soucsAdminProfileDetailQuery
} from '../../../../core/query/admin';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { SharedService } from '../../../../core/services/shared.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces } from '../../../../validators/custom.validator';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit, AfterViewInit {

  adminUsersFormGroup: FormGroup;
  filtering = this._sharedService.getFilteringData('adminUserListing');
  sorting = this._sharedService.getSortingData('adminUserListing');


  displayedColumns: string[] = ['fullName', 'email', 'creationTime', 'created_by_email', 'roleName', 'status', 'actions'];
  dataSource = new MatTableDataSource<AdminUserData>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  actionMenu: Array<{}> = [
    { name: 'Edit', path: 'edit', icon: 'edit' }
  ];
  count = 0;
  currentPage = 0;
  nextPage: number;
  filterByStatusOptionList = [];
  searchOptions = [];
  soucsAdminProfileDetails: any = [];

  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _toastr: ToastrService,
    private readonly _utilityService: UtilityService,
    private readonly _dialogsService: DialogsService,
    private readonly _const: AppConstantService,
    private readonly _sharedService: SharedService,
    private readonly _errorHandler: CustomErrorHandlerService
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.adminUsersFormGroup = new FormGroup({
      'filterByStatus': new FormControl(this.filtering.status || 'all', [Validators.required]),
      'searchBy': new FormControl(this.filtering.searchBy || 'fullName', [Validators.required]),
      'searchText': new FormControl(this.filtering.searchQuery || '', [Validators.required, removeSpaces])
    });

    this.getFilterByOption();
    this.getSearchByOption();
    this.getSoucsAdminProfile();
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
    this.getAdminUserList();
  }

  /**
   * Fetch Admin User List
   */

  getAdminUserList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: adminUserListQuery,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          query: this.adminUsersFormGroup.value.searchBy,
          keyword: this.adminUsersFormGroup.value.searchText,
          filter: this.adminUsersFormGroup.value.filterByStatus,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        //hide loader
        this._spinner.hide();
        const dt = data['adminUserList'];
        this.dataSource = new MatTableDataSource(dt['admins']);
        this.count = dt['count'];
        this.sort.active = this.sorting.sortingByColumn;
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * Get SOUCS admin profile details
   */
  getSoucsAdminProfile() {
    this._spinner.show();
    this._apollo
      .query({
        query: soucsAdminProfileDetailQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.soucsAdminProfileDetails = data['adminUserProfile'];
        this.getAdminUserList();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * Get option list for the filter by status option:
   */
  getFilterByOption() {
    this._apollo
      .query({
        query: fetchAdminStatusQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.filterByStatusOptionList = data['adminStatusList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * Get option list for the search by filter:
   */
  getSearchByOption() {
    this._apollo
      .query({
        query: adminSearchByListQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.searchOptions = data['adminSearchByList']['options'];
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
    return this.adminUsersFormGroup.get(field);
  }

  /**
   * Reset search text on value change
   */
  getSearch() {
    if (this.adminUsersFormGroup.value.searchText !== '') {
      this.adminUsersFormGroup.value.searchText = '';
      this.searchTxtBox.nativeElement.value = '';
      this.getAdminUserList();
    }
  }

  /**
   * Set search by text when option change
   * @returns value as string
   */
  getSearchTxt() {
    switch (this.getFieldRef('searchBy').value) {
      case 'fullName':
        return 'Name';
      case 'email':
        return 'Email Id';
      case 'roleName':
        return 'Role';
      case 'created_by_email':
        return 'Created By';
      default:
        return '';
    }
  }

  processElementStatus(status:string) {
    let processedStatus = status?.charAt(0).toUpperCase() +
      status?.substring(1).toLowerCase();
    processedStatus = processedStatus.split('_').join(' ');
    return processedStatus;
  }

  /**
   * do search when user key in the text box
   */
  searchUserText() {
    const searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
    searchTerms.subscribe(res => {
      if (res && res.length > 0) {
        this.adminUsersFormGroup.value.searchText = res;
        this.resetFilter();
      } else {
        this.resetFilter();
      }
    });
  }

  openConfirmationDialog(userEmail: string, currentStatus: string) {
    const pgtitle = 'Confirm';
    const message = `Are you sure you want change admin status to ${currentStatus === 'active' ? 'inactive' : 'active'}?`;

    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this.changeStatus(userEmail, currentStatus);
        }
      });
  }

  changeStatus(userEmail: string, currentStatus: string) {
    const changeStatusQuery = (currentStatus === 'active') ? deactivateOktaAdminQuery : reactivateOktaAdmin;
    this._spinner.show();
    this._apollo.mutate({
      mutation: changeStatusQuery,
      variables: {
        email: userEmail
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this._toastr.success('User status changed successfully');
      this.getAdminUserList();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  userAction(selectedUserEmail: string) {
    this._router.navigateByUrl('/admin/edit-admin-user/' + selectedUserEmail);
  }

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.filtering = {
      status: this.adminUsersFormGroup.value.filterByStatus,
      searchBy: this.adminUsersFormGroup.value.searchBy,
      searchQuery: this.adminUsersFormGroup.value.searchText
    };
    this._sharedService.setFilteringData('adminUserListing', this.filtering);
    this.getAdminUserList();
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

      // Intial order i.e. descending
      case _CONST.three:
        this.sorting = { ...this._const.ADMIN_USER_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('adminUserListing', this.sorting);
    this.getAdminUserList();
  }
}
