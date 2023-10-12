import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { uniq, filter, map } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../core/constants/app.constants';
import { StudentData } from '../../../core/model/student-model';
import { dismissStudentRequestQuery } from '../../../core/query/dismiss-user';
import { searchOptionsQuery, studentQuery, updateSchoolRequestStatusQuery, updateStatusQuery, userStatusListQuery } from '../../../core/query/manage-student';
import { AuthService } from '../../../core/services/auth.service';
import { CustomErrorHandlerService } from '../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../core/services/dialog-service';
import { SharedService } from '../../../core/services/shared.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { UtilityService } from '../../../core/services/utility.service';
import { removeSpaces } from '../../../validators/custom.validator';
import { AppConstantService } from '../../../core/services/app-constant.service';

export interface UserListData {
  user_id: number,
  first_name: string,
  last_name: string,
  email: string,
  date_of_birth: any,
  country_code: string,
  phone: string,
  schoolverifystatus: string,
  school_id: number,
}
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})


export class ManageUserComponent implements OnInit, AfterViewInit {
  schoolId = 0;
  userFormGroup: FormGroup;
  searchbyTxt = 'Name';
  filterTxt = 'all';
  searchTxtvalue: any = '';
  statusAction = 'approved';
  searchOptions: any = [];
  filterOptions: any = [];
  bulkArr: any = [];
  dataSource = new MatTableDataSource<StudentData>();
  studentListData: StudentData[] = [];
  selectedSchool = {};
  pageEvent: PageEvent;
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  count: any;
  currentPage = 0;
  nextPage: number;
  searchOptionsData: { query: any; text: string; filter: string };
  displayedColumns: string[] = ['id', 'first_name', 'email', 'date_of_birth', 'phone', 'schoolverifystatus', 'actions'];
  columnMapping = {
    id: 'id',
    first_name: 'first_name',
    email:'email',
    date_of_birth:'date_of_birth',
    phone:'phone',
    approvalStatus: 'schoolverifystatus',
    actions:'actions'
  };
  actionMenu: Array<{}> = [
    { name: 'Edit', path: 'edit', icon: 'edit' },
    // { name: 'View Details', path: 'view', icon: 'remove_red_eye' },
    // { name: 'Deactivate', path: 'deactive', icon: 'not_interested', action: 'status' },
    // { name: 'Active', path: 'active', icon: 'check_circle_outline', action: 'status' },
  ];
  selection = new SelectionModel<UserListData>(true, []);
  dismissDialogResponse: any = {
    'dismissType': 0,
    'dismissReason': '',
    'dismissDescription': ''
  };
  sorting = this._sharedService.getSortingData('appManageUser');

  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  constructor(private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _dialogsService: DialogsService,
    private readonly _localStorage: LocalStorageService,
    private readonly _authService: AuthService,
    private readonly _utilityService: UtilityService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
    ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.schoolId = this._localStorage.getSchoolAdminSchoolId();
    this.userFormGroup = new FormGroup({
      'filterby': new FormControl('all', [Validators.required]),
      'searchBy': new FormControl('full_name', [Validators.required]),
      'searchText': new FormControl('', [Validators.required, removeSpaces]),
    });
    this.getFilterStatus();
    this.getSearchOptions();
    this.getStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.searchUserText();
  }

  /**
   * do search when user key in the text box
   */
  searchUserText() {
    const searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
    searchTerms.subscribe(res => {
      if (res && res.length > 0) {
        this.userFormGroup.value.searchText = res;
        this.resetFilter();
      } else {
        this.resetFilter();
      }
    });
  }

  getFieldRef(field: string) {
    return this.userFormGroup.get(field);
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getStudents();
  }

  getSearchTxt() {
    switch (this.getFieldRef('searchBy').value) {
      case 'full_name':
        return 'Name';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'date_of_birth':
        return 'Date Of Birth';
      default:
        return '';
    }
  }

  gotoEditPage(userId:string) {
    this._router.navigateByUrl('/manage-students/edit-student/' + userId);
  }

  updateNewStudentRequst(id: number, currentStatus: string) {
    this.bulkArr = [];
    this.bulkArr.push(id);
    this.updateNewStudentRequstStatus(this.bulkArr, currentStatus);
  }

  updateStatus() {
    const isValidated = this.bulkActionValidation();
    if (isValidated) {
      this.bulkArr = [];
      this.selection.selected.forEach(element => {
        if (this.bulkArr.indexOf(element['user_id']) !== 0) {
          this.bulkArr.push(element['user_id']);
        }
      });

      const newArr = uniq(this.bulkArr);
      this.updateNewStudentRequstStatus(newArr, this.statusAction);
    }
  }

  openDismissDialog(userId: string, requestType) {
    /**
     * requestType =
     * 1: 'NEW_STUDENT_REQUEST_DISMISS',
     * 2: 'SCHOOL_CHANGE_REQUEST_DISMISS'
     */

    const pgtitle = 'Dismissed';
    this._dialogsService
      .dismissRequestPopUp(pgtitle)
      .subscribe(res => {
        if (res) {
          this.dismissDialogResponse = res;
          if (requestType === 1) {
            this.dismissDialogResponse.user_id = parseFloat(userId);
            this.dismissStudentRequest(this.dismissDialogResponse);
          } else {
            this.updateSchoolChangeRequestStatus(userId, 'reject');
          }
        }
      });
  }

  // Update school change request - approve/reject
  updateSchoolChangeRequestStatus(userId, updatingStatus) {
    const queryInputs = this.dismissDialogResponse;
    queryInputs.user_id = userId;
    queryInputs.approval_status = updatingStatus;

    this._spinner.show();
    this._apollo.mutate({
      mutation: updateSchoolRequestStatusQuery,
      variables: queryInputs
    }).subscribe(() => {
      this._spinner.hide();
      this.getStudents();
      this._toastr.success('Status updated successfully');
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  dismissStudentRequest(queryInputs) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: dismissStudentRequestQuery,
      variables: queryInputs
    }).subscribe(() => {
      this._spinner.hide();
      this._toastr.success('User has been dismissed successfully');
      this.getStudents();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  updateNewStudentRequstStatus(arr: Array<number>, currentStatus: string) {
    this._spinner.show();
    const body = {
      message: '',
      status: currentStatus,
      userids: arr
    };
    this._apollo.mutate({
      mutation: updateStatusQuery,
      variables: body,
      refetchQueries: [{
        query: studentQuery,
        variables: {
          keyword: this.userFormGroup.value.searchText,
          query: this.userFormGroup.value.searchBy,
          filter: this.userFormGroup.value.filterby,
          page: this.currentPage,
          limit: this.pageSizeCount,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
      }]
    }).subscribe(() => {
      this._spinner.hide();
      this._toastr.success('Status updated successfully');
      this.selection.clear();
      this.getStudents();

    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserListData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.user_id + 1}`;
  }

  getFilterStatus() {
    this._apollo
      .query({
        query: userStatusListQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.filterOptions = data['userstatusList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  getSearchOptions() {
    this._apollo
      .query({
        query: searchOptionsQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        const opt = data['getUserOptionList']['options'];
        this.searchOptions = filter(opt, item =>  item.query !== 'date_of_birth');
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.getStudents();
  }

  getSearch() {
    if (this.userFormGroup.value.searchText !== '') {
      this.userFormGroup.value.searchText = '';
      this.searchTxtBox.nativeElement.value = '';
      this.getStudents();
    }

  }

  /**
   * get list of user
   */
  getStudents() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: studentQuery,
        variables: {
          keyword: this.userFormGroup.value.searchText,
          query: this.userFormGroup.value.searchBy,
          filter: this.userFormGroup.value.filterby,
          page: this.currentPage,
          limit: this.pageSizeCount,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        let users = JSON.parse(JSON.stringify(data['findUsersSearchByQuery']['users']));
        users.forEach((element,index) => {
          users[index]["schoolverifystatus"] = this.getCustomStatus(element);
        });
        this.dataSource = new MatTableDataSource(users);
        this.count = data['findUsersSearchByQuery']['count'];
        this.sort.active = this.columnMapping[this.sorting.sortingByColumn];
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
        this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * Validate selection for bulk status update
   * @returns boolean value
   */
  bulkActionValidation(): boolean {
    const { selected } = this.selection;

    if (selected.length < 1) {
      this._toastr.error('please select data from table for Bulk Action');
      return false;
    }

    const selectedItem = map(selected, item => (this.isMigrateStatus(item) ? 'migrate' : item.schoolverifystatus));

    const uniqeItem = uniq(selectedItem);

    if (uniqeItem.length > 1) {
      this._toastr.error('More the one status selected. Please choose  similar status category , for Bulk Action');
      return false;
    }

    if (uniqeItem[0] === this.statusAction) {
      this._toastr.error('Action can not apply for similar status');
      return false;
    }
    return true;
  }

  isMigrateStatus(item) {
    if (item.reqSchoolId > 0 && item.reqSchoolId === this.schoolId) {
      return true;
    } else {
      return false;
    }
  }

  customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting.sortingByColumn !== sortingByColumn) {
      this.sorting.sortingClickCounter = 0;
      this.sorting.currentOrder = 1;
    }
    this.sorting.sortingByColumn = sortingByColumn;
    this.sorting.sortingClickCounter++;
    switch (this.sorting.sortingClickCounter) {
      // for Ascending order
      case _CONST.one:
        this.sorting.currentOrder = 1;
        break;
      // for Descending order
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
    this._sharedService.setSortingData('appManageUser', this.sorting);
    this.getStudents();
  }
  getCustomStatus(element) {
    if (element.registeredStatus === 'no') {
      return 'pre-approved';
    }else if (this.isMigrateStatus(element)) {
      return 'migration request';
    }else if (element.schoolverifystatus === 'reject') {
      return 'dismissed';
    } else {
      return element.schoolverifystatus;
    }
  }
}
