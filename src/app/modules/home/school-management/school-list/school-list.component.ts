import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { _CONST } from '../../../../core/constants/app.constants';
import { SchoolData } from '../../../../core/model/school-model';
import { massResendInvitationMail, searchQuery, updateSchoolStatusQuery } from '../../../../core/query/school-management';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { SchoolService } from '../../../../core/services/school.service';
import { SharedService } from '../../../../core/services/shared.service';

export interface SchoolListData {
  schoolName: string;
  stateName: string;
  zipcode: string;
  creationTime: string;
  status: string;
  districtName: string;
  nces: string;
  status_text: string;
  deactivateReason: string;

}
@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit, AfterViewInit, OnDestroy {
  statusFilter = '';
  searchbyTxt = '';
  selected = [];

  sorting = this._sharedService.getSortingData('schoolListing');
  filtering = this._sharedService.getFilteringData('schoolListing');

  displayedColumns: string[] = [
  'isValidUsZipCode',
  'id',
  'schoolName',
  'type',
  'stateName',
  'activeStudent',
  'pendingStudent',
  'school_admin_status',
  'status_text',
  'actions'];
  dataSource = new MatTableDataSource<SchoolData>();
  allPendings = [];
  pageSizes = _CONST['defaultPageSizeArray'];
  pageVisited = [];
  pageSizeCount: number;
  selectedSchool = {};
  pageEvent: PageEvent;
  destroyed = new Subject<any>();
  actionMenu: Array<{}> = [
    { name: 'Edit', path: 'edit', icon: 'edit' },
    { name: 'View Details', path: 'view', icon: 'remove_red_eye' },
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  count: any;
  currentPage = 0;
  nextPage: number;
  isAllSelected:boolean;
  searchOptionsData: { query: string; text: string; filter: string,filterbytype: string };
  constructor(
    private readonly _schoolService: SchoolService,
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly toastr: ToastrService,
    private readonly _dialogsService: DialogsService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }


  ngOnInit() {
    this.searchOptionsData = {
      'text': this.filtering.searchQuery ||'',
      'query': this.filtering.searchBy || 'schoolName',
      'filter': this.filtering.status || 'all',
      'filterbytype': this.filtering.filterbytype || 'All' };
    this.getSchoolList();
    this._schoolService.isSchoolEditChange.next(false);

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    if (e.length && this.searchOptionsData) {
      this.getSchoolList();
    }
  }

  applyFilter(searchTerm: any) {
    if (searchTerm.text && searchTerm.text.length > 1) {
      this.searchOptionsData = {
        'text': searchTerm.text,
        'query': searchTerm.query,
        'filter': searchTerm.filter,
        'filterbytype': searchTerm.filterbytype
      };
    } else {
      this.searchOptionsData = {
        'text': '',
        'query': searchTerm.query,
        'filter': searchTerm.filter,
        'filterbytype': searchTerm.filterbytype
      };
    }

    this.filtering =  {
      'searchQuery': this.searchOptionsData.text,
      'searchBy': this.searchOptionsData.query,
      'status': this.searchOptionsData.filter,
      'filterbytype': this.searchOptionsData.filterbytype

    };
    this._sharedService.setFilteringData('schoolListing',this.filtering);
    this.resetFilter();
  }

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.getSchoolList();
  }

  getSchoolList() {
    this._spinner.show();
    this._apollo
      .query({
        query: searchQuery,
        variables: {
          keyword: this.searchOptionsData.text,
          query: this.searchOptionsData.query,
          filter: this.searchOptionsData.filter,
          type: this.searchOptionsData.filterbytype,
          page: this.currentPage,
          limit: this.pageSizeCount,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['findSchoolSearchByQuery']['schools'];
        this.dataSource = new MatTableDataSource(dt);

        const pendingDataOnCurrentPage = dt.filter(item => item.status_text === 'Pending');
        if (pendingDataOnCurrentPage.length > 0) {
          // may have duplicate values.
          this.allPendings.push(...pendingDataOnCurrentPage);
          // Unique values.
          this.allPendings = [...new Map(this.allPendings.map(item => [item['id'], item])).values()];
        }

        this.count = data['findSchoolSearchByQuery']['count'];
        this.sort.active = this.sorting.sortingByColumn;
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  userAction(action: Object, selectedSchool: any) {
    if (action['path'] === 'edit') {
      this._router.navigateByUrl(`/school-management/school-edit/${selectedSchool.id}`);
    } else {
      if (action['path'] === 'view'){
      this._router.navigateByUrl(`/school-management/school-view/${selectedSchool.id}`);
      }
    }
    // No default action to perform
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected = !this.isAllSelected;
    this.selected = [];
 }


  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any) {
    if (!row) {
      return `${this.isAllSelected ? 'deselect' : 'select'} all`;
    }
    return `${this.isAllSelected ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  isSelected(id)
{
  return this.selected.indexOf(id)!=-1}

  OnChange(id){
    const index = this.selected.indexOf(id);

  if (index !== -1) {
    // Number exists in the array, so remove it
    this.selected.splice(index, 1);
  } else {
    // Number doesn't exist in the array, so add it
    this.selected.push(id);
  }
    
  }

  changeStatus(id, currentStatus) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: updateSchoolStatusQuery,
      variables: {
        id,
        status: currentStatus,
        deactivateReason: ''
      }
    }).subscribe(({ data }) => {
      this._schoolService.isDataChange.next(true);
      this._spinner.hide();
      this.toastr.success('School status changed successfully');
      this.getSchoolList();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }


  reasonDeclaration(title, reviewParm: any) {
    this._dialogsService
      .reasonDeclaration(title, reviewParm)
      .subscribe(res => {
        if (res) {
          this.getSchoolList();
        }else {
          this._spinner.hide();
        }
      });
  }

  openConfrmDlg() {
    const pgtitle = 'Confirm';
    const message = `Are you sure want to resend invite to all the pending school admins?`;

    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this.resendInvitationMail();
        }
      });
  }



  resendInvitationMail() {
    this._spinner.show();
    this._apollo.mutate({
      mutation: massResendInvitationMail,
      variables: {
        // 0 => sedning to the selected pending ids.
        // 1 => sending to all the pending ids.
        isForAllSchool: this.isAllSelected ? 1 : 0,
        ids: this.selected
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      const dt = data['massResendSchoolAdminInvitationEmail'];
      this.openResendFailedDialog(dt['failEmailSendSchoolAdmin']);
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  openResendFailedDialog(data) {
    if (data.length > 0) {
      // Mail sending failed
      this._dialogsService.massResendMailStatusDialog(data).subscribe();
    } else {
      // Mail sending success
      this.toastr.success('Invitation mail is successfully re-sent to the selected School Admins.');
    }
    this.resetSelection();
  }
  resetSelection()
  {
    this.selected = [];
    this.isAllSelected=false;
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
    // Define a constant for ascending order
    const ASCENDING_ORDER = 1;
    // Define a constant for descending order
    const DESCENDING_ORDER = 2;
     // Define a constant for default order
     const DEFAULT_ORDER = 3;
    switch (this.sorting.sortingClickCounter) {

      //Ascending order
      case ASCENDING_ORDER:
        this.sorting.currentOrder = 1;
        break;

      // Descending order
      case DESCENDING_ORDER:
        this.sorting.currentOrder = 0;
        break;

      // Intial order i.e. descending
      case DEFAULT_ORDER:
        this.sorting = { ...this._const.SCHOOL_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('schoolListing', this.sorting);
    // Calling school list function
    this.getSchoolList();
  }
}
