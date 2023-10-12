import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { _CONST } from '../../../../core/constants/app.constants';
import { getArchiveRewardsQuery } from '../../../../core/query/rewards';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { SharedService } from '../../../../core/services/shared.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces } from '../../../../validators/custom.validator';

@Component({
  selector: 'app-archive-rewards',
  templateUrl: './archive-rewards.component.html',
  styleUrls: ['./archive-rewards.component.scss']
})

export class ArchiveRewardsComponent implements OnInit, AfterViewInit {
  archiveRewardListForm: FormGroup;

  displayedColumns: string[] = ['title', 'rewardType', 'publishDate', 'resultDate', 'totalUser', 'actions'];
  dataSource = new MatTableDataSource([]);
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  actionMenu: Array<{}> = [
    { name: 'View Details', path: 'view', icon: 'remove_red_eye' }
  ];

  count = 0;
  currentPage = 0;
  nextPage: number;
  serverCurrentDate: number;

  filterByTypeOptions: any = [
    { value: 'all', title: 'all' },
    { value: 'video', title: 'Video' },
    { value: 'merchandise', title: 'Merchandise' },
    { value: 'class', title: 'Class' },
    { value: 'Event', title: 'Event' }
  ];

  challengeAbuseDataList: any = [];
  searchbyTxt = 'Rewards';
  isShowDatePicker = false;

  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  rewardListDetails: any;

  // custom sorting to get the sorted data from database.
  sorting = this._sharedService.getSortingData('archiveRewardListing');
  filtering = this._sharedService.getFilteringData('archiveRewardListing');


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
    this.archiveRewardListForm = new FormGroup({
      'filterByType': new FormControl(this.filtering.type, [Validators.required]),
      'searchBy': new FormControl(this.filtering.searchBy, [Validators.required]),
      'searchText': new FormControl(this.filtering.searchQuery, [Validators.required, removeSpaces]),
      'datePickerVal': new FormControl(new Date(this.filtering.dateVal), []),
    });
    this.fetchArchiveRewardsList();
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
    this.fetchArchiveRewardsList();
  }

  /**
   * Fetch Rewards list
   */
  fetchArchiveRewardsList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: getArchiveRewardsQuery,
        variables: {
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder],
          page: this.currentPage,
          limit: this.pageSizeCount,
          keyword: this.archiveRewardListForm.value.searchText,
          filter: this.archiveRewardListForm.value.filterByType,
          query: this.archiveRewardListForm.value.searchBy,
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.rewardListDetails = data['getAllArchivedRewardList']['rewards'];
        this.serverCurrentDate = data['getAllArchivedRewardList']['currentDate'];
        this.remapRewardsList();
        this.dataSource = new MatTableDataSource(this.rewardListDetails);
        this.count = data['getAllArchivedRewardList']['count'];
        this.sort.active = this.sorting.sortingByColumn;
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  remapRewardsList() {
    this.rewardListDetails = this.rewardListDetails.map(item => ({
      ...item,
      daysLeft: this._utilityService.getDateDiffInDays(item.closingDate, this.serverCurrentDate)
    }));
  }

  /**
   *
   * @param field : input field name as string
   * @returns as field reference
   */
  getFieldRef(field: string) {
    return this.archiveRewardListForm.get(field);
  }

  /**
   * Reset search text on value change
   */
  getSearch() {
    this.archiveRewardListForm.get('datePickerVal').setValue('');
    if (this.archiveRewardListForm.get('searchBy').value !== 'title') {
      this.isShowDatePicker = true;
    } else {
      this.isShowDatePicker = false;
    }
    if (this.archiveRewardListForm.value.searchText !== '') {
      this.archiveRewardListForm.value.searchText = '';
      this.searchTxtBox.nativeElement.value = '';
      this.fetchArchiveRewardsList();
    }
  }

  /**
   * Set search by text when option change
   * @returns value as string
   */
  getSearchTxt() {
    switch (this.getFieldRef('searchBy').value) {
      case 'title':
        return 'Rewards';
      case 'publishDate':
        return 'Publish Date';
      case 'resultDate':
        return 'Result Date';
      default:
        return '';
    }
  }

  /**
   * do search when user key in the text box
   */
  searchUserText() {
    let searchTerms;
    if (this.searchTxtBox && this.searchTxtBox.nativeElement) {
      searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
    }
    searchTerms.subscribe(res => {
      if (res && res.length > 0) {
        this.archiveRewardListForm.value.searchText = res;
        this.resetFilter();
      } else {
        this.resetFilter();
      }
    });
  }

  userAction(action: Object, selectedDetails: any) {
    if (action['path'] === 'view') {
      this._router.navigateByUrl(`rewards/reward-details/${selectedDetails.id}`);
    }
  }

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    if (this.isDatePicker) {
      if (this.getFieldRef('datePickerVal').invalid) {
        this.archiveRewardListForm.get('datePickerVal').setValue('');
      }
      this.convertPickerValueToSearchKeyword();
    }
    this.filtering = {
      type: this.archiveRewardListForm.value.filterByType,
      searchBy: this.archiveRewardListForm.value.searchBy,
      searchQuery: this.archiveRewardListForm.value.searchText,
      dateVal: this.archiveRewardListForm.value.datePickerVal
    };
    this._sharedService.setFilteringData('archiveRewardListing', this.filtering);    
    this.fetchArchiveRewardsList();
  }

  convertPickerValueToSearchKeyword() {
    if (this.isDatePicker()) {
      if (this.archiveRewardListForm.value.datePickerVal) {
        this.archiveRewardListForm.value.searchText = formatDate(this.archiveRewardListForm.value.datePickerVal, 'MM/dd/y', 'en-US');
      } else {
        this.archiveRewardListForm.value.searchText = '';
      }
    }
  }

  isDatePicker() {
    if (this.archiveRewardListForm.value.searchBy === 'publishDate' || this.archiveRewardListForm.value.searchBy === 'resultDate') {
      return true;
    } else {
      return false;
    }
  }

  onDateChange(isInvalidDateEntered) {
    this.convertPickerValueToSearchKeyword();
    this.resetFilter();
    // Only Call the list API when there is no invalid date.
    if (!isInvalidDateEntered) {
      this.fetchArchiveRewardsList();
    }
  }

  custmSorting(columnToSort) {
    // existing and new column are different
    if (this.sorting.sortingByColumn !== columnToSort) {
      this.sorting.currentOrder = 1;
      this.sorting.sortingClickCounter = 0;
    }

    this.sorting.sortingByColumn = columnToSort;
    this.sorting.sortingClickCounter++;
    // Define a constant for ascending order
    const ASCENDING_ORDER = 1;
    // Define a constant for descending order
    const DESCENDING_ORDER = 2;
     // Define a constant for default order
     const DEFAULT_ORDER = 3;
    switch (this.sorting.sortingClickCounter) {
      //Asc. order
      case ASCENDING_ORDER:
        this.sorting.currentOrder = 1;
        break;
        // Desc. order
      case DESCENDING_ORDER:
        this.sorting.currentOrder = 0;
        break;
        // Default initial order i.e. Desc.
      case DEFAULT_ORDER:
        this.sorting = { ...this._const.REWARD_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('archiveRewardListing', this.sorting);
    this.fetchArchiveRewardsList();
  }

}
