import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { getAdminRolesQuery, removeAdminRoleQuery } from '../../../../core/query/admin-role';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { AppUsersTypeData } from '../../../../core/model/app-users.model';
import { SharedService } from '../../../../core/services/shared.service';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { _CONST } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.scss']
})
export class AdminRolesComponent implements OnInit {

  adminRoleForm: FormGroup;
  sorting = this._sharedService.getSortingData('adminRoleListing');

  displayedColumns: string[] = ['roleName', 'count', 'description'];
  dataSource = new MatTableDataSource([]);
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  actionMenu: Array<{}> = [
    { name: 'Edit', path: 'edit', icon: 'edit' },
    { name: 'View Details', path: 'view', icon: 'remove_red_eye' }
  ];
  count = 0;
  currentPage = 0;
  nextPage: number;
  userTypeOptionList: AppUsersTypeData[] = [];
  userStatusOptionList: AppUsersTypeData[] = [];
  searchbyTxt = 'Name';

  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _dialogsService: DialogsService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.adminRoleForm = new FormGroup({
      'filterByRole': new FormControl('all', [Validators.required])
    });
    this.getAdminRoles();
  }


  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getAdminRoles();
  }

  /**
   * Fetch Admin roles.
   */

  getAdminRoles() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: getAdminRolesQuery,
        variables: {
          // filter: this.adminRoleForm.value.filterByRole,
          filter: 'active',
          page: this.currentPage,
          limit: this.pageSizeCount,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getAdminRoleList']['data'];
        this.dataSource = new MatTableDataSource(dt);
        this.count = dt['count'];
        // this.d ataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Remove a role from the list
  onRemoveActionClicked(roleName) {
    const pgtitle = 'Confirm';
    const message = 'Are you sure want to remove this role ?';

    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this.removeAdminRole(roleName);
        }
      });
  }

  removeAdminRole(roleName) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: removeAdminRoleQuery,
      variables: {
        roleName
      }
    }).subscribe(({ data }) => {
      this.getAdminRoles();
      this._toastr.success('Role has been removed successfully');
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  // Implementing custom sorting and fetch the sorted data though API.
  customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting.sortingByColumn !== sortingByColumn) {
      this.sorting.currentOrder = 1;
      this.sorting.sortingClickCounter = 0;
    }

    this.sorting.sortingClickCounter++;
    this.sorting.sortingByColumn = sortingByColumn;
    switch (this.sorting.sortingClickCounter) {

      //for Ascending order
      case  _CONST.one:
        this.sorting.currentOrder = 1;
        break;

      //for Descending order
      case  _CONST.two:
        this.sorting.currentOrder = 0;
        break;

      // default Intial order i.e. descending
      case  _CONST.three:
        this.sorting = { ...this._const.ADMIN_ROLE_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('adminRoleListing', this.sorting);
    this.getAdminRoles();
  }
}
