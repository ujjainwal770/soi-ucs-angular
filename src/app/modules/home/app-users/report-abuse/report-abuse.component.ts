import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { UtilityService } from '../../../../core/services/utility.service';
import { AppUsersData, AppUsersTypeData } from '../../../../core/model/app-users.model';
import { appUserActiveStatusQuery, userReportAbuseQuery, userSearchByOptionQuery, userTypeOptionQuery } from '../../../../core/query/appuser';
import { removeSpaces } from '../../../../validators/custom.validator';
import { SharedService } from '../../../../core/services/shared.service';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { _CONST } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-report-abuse',
  templateUrl: './report-abuse.component.html',
  styleUrls: ['./report-abuse.component.scss']
})
export class ReportAbuseComponent implements OnInit, AfterViewInit {

  reportAbuseForm: FormGroup;

  sorting = this._sharedService.getSortingData('reportAbuseListing');
  filtering = this._sharedService.getFilteringData('reportAbuseListing');


  displayedColumns: string[] = ['trinanle', 'first_name', 'email', 'date_of_birth', 'ucs_status', 'reportabusecount', 'account_status', 'actions'];
  dataSource = new MatTableDataSource<AppUsersData>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  actionMenu: Array<{}> = [
    { name: 'View Detail', path: 'view', icon: 'remove_red_eye' }
  ];
  count = 0;
  currentPage = 0;
  nextPage: number;
  userTypeOptionList: AppUsersTypeData[] = [];
  userSearchByOptionList: AppUsersTypeData[] = [];
  searchbyTxt = 'Name';

  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _utilityService: UtilityService,
    private readonly _dialogsService: DialogsService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.getUserTypeOption();
    this.reportAbuseForm = new FormGroup({
      'filterbyusertype': new FormControl(this.filtering.userType, [Validators.required]),
      'searchBy': new FormControl(this.filtering.searchBy, [Validators.required]),
      'searchText': new FormControl(this.filtering.searchQuery, [Validators.required, removeSpaces]),
    });
    this.getReportAbuseUserList();
    this.getUserSearchByOption();
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
    this.getReportAbuseUserList();
  }

  /**
   * Fetch report abuse user list
   */

  getReportAbuseUserList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: userReportAbuseQuery,
        variables: {
          keyword: this.reportAbuseForm.value.searchText,
          query: this.reportAbuseForm.value.searchBy,
          user_type: this.reportAbuseForm.value.filterbyusertype,
          page: this.currentPage,
          limit: this.pageSizeCount,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        //hide spinner
        this._spinner.hide();
        //user report abuse data
        const dt = data['userReportAbuseList'];
        this.dataSource = new MatTableDataSource(dt['users']);
        this.count = dt['count'];
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
        this.sort.active = this.sorting.sortingByColumn;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
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
   *
   * @param field : input field name as string
   * @returns as field reference
   */
  getFieldRef(field: string) {
    return this.reportAbuseForm.get(field);
  }

  // Set search by text when option change and return a string value.
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

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.filtering = {
      userType: this.reportAbuseForm.value.filterbyusertype,
      searchBy: this.reportAbuseForm.value.searchBy,
      searchQuery: this.reportAbuseForm.value.searchText
    };
    this._sharedService.setFilteringData('reportAbuseListing', this.filtering);
    this.getReportAbuseUserList();
  }

  userAction(path: string, item: Object) {
    if (path === 'view') {
      this._router.navigateByUrl(`/app-users/report-abuse-details/${item['user_id']}`);
    }
  }

  /**
  * Reset search text on value change
  */
  getSearch() {
    if (this.reportAbuseForm.value.searchText !== '') {
      this.reportAbuseForm.value.searchText = '';
      this.searchTxtBox.nativeElement.value = '';
      this.getReportAbuseUserList();
    }
  }

  changeUserStatus(id, currentStatus) {
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
            this.getReportAbuseUserList();
          }, error => {
            this._spinner.hide();
            this._errorHandler.manageError(error, true);
          });
        }
      });
  }

  // Do search when user key in the text box
  searchUserText() {
    const searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
    searchTerms.subscribe(res => {
      if (res && res.length > 0) {
        this.reportAbuseForm.value.searchText = res;
        this.resetFilter();
      } else {
        this.resetFilter();
      }
    });
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
        this.sorting = { ...this._const.REPORT_ABUSE_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('reportAbuseListing', this.sorting);
    this.getReportAbuseUserList();
  }

}
