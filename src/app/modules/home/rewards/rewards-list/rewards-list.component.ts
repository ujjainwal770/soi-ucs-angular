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
import { getAllRewardListQuery } from '../../../../core/query/rewards';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { SharedService } from '../../../../core/services/shared.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces } from '../../../../validators/custom.validator';

@Component({
  selector: 'app-rewards-list',
  templateUrl: './rewards-list.component.html',
  styleUrls: ['./rewards-list.component.scss']
})

export class RewardsListComponent implements OnInit, AfterViewInit {
  rewardListForm: FormGroup;

  // custom sorting to get the sorted data from database.
  sorting = this._sharedService.getSortingData('rewardListing');
  filtering = this._sharedService.getFilteringData('rewardListing');
  displayedColumns: string[] = ['title', 'rewardType', 'publishDate', 'resultDate', 'daysLeft', 'totalUser', 'actions'];
  dataSource = new MatTableDataSource([]);
  pageSizeCount: number;
  pageSizes = _CONST['defaultPageSizeArray'];
  actionMenu: Array<{}> = [
    { name: 'View Details', path: 'view', icon: 'remove_red_eye' }
  ];

  count = 0;
  currentPage = 0;
  nextPage: number;
  serverCurrentDate: number;
  filterByTypeOptions: any;

  searchbyTxt = 'Rewards';
  challengeAbuseDataList: any = [];
  isShowDatePicker = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  rewardListDetails: any;

  constructor(
    private readonly _apollo: Apollo,
    private readonly _router: Router,
    private readonly _sharedService: SharedService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _utilityService: UtilityService,
    private readonly _const: AppConstantService,
    private readonly _errorHandler: CustomErrorHandlerService
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.filterByTypeOptions = this._const.REWARD_FILTER_BY_TYPE_OPTIONS;
    this.rewardListForm = new FormGroup({
      'filterByType': new FormControl(this.filtering.type, [Validators.required]),
      'searchBy': new FormControl(this.filtering.searchBy, [Validators.required]),
      'searchText': new FormControl(this.filtering.searchQuery, [Validators.required, removeSpaces]),
      'datePickerVal': new FormControl(new Date(this.filtering.dateVal), []),
    });
    this.fetchRewardsList();
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
    this.fetchRewardsList();
  }

  /**
   * Fetch Rewards list
   */
  fetchRewardsList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: getAllRewardListQuery,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount,
          keyword: this.rewardListForm.value.searchText,
          filter: this.rewardListForm.value.filterByType,
          query: this.rewardListForm.value.searchBy,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getAllRewardList'];
        this.rewardListDetails = dt?.rewards;
        this.serverCurrentDate = dt?.currentDate;
        this.revisedRewardsList();
        this.dataSource = new MatTableDataSource(this.rewardListDetails);
        this.count = dt['count'];
        this.sort.active = this.sorting.sortingByColumn;
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   *
   * @param field : input field name as string
   * @returns as field reference
   */
  getFieldRef(field: string) {
    return this.rewardListForm.get(field);
  }

  /**
   * Reset search text on value change
   */
  getSearch() {
    this.rewardListForm.get('datePickerVal').setValue('');
    if (this.rewardListForm.get('searchBy').value !== 'title') {
      this.isShowDatePicker = true;
    } else {
      this.isShowDatePicker = false;
    }
      this.rewardListForm.value.searchText = '';
      this.searchTxtBox.nativeElement.value = '';
      this.fetchRewardsList();
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

  revisedRewardsList() {
    this.rewardListDetails = this.rewardListDetails.map(item => ({
      ...item,
      // result date - current date
      daysLeft: this._utilityService.getDateDiffInDays(item.resultDate, this.serverCurrentDate)
    }));
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
        this.rewardListForm.value.searchText = res;
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
        this.rewardListForm.get('datePickerVal').setValue('');
      }
      this.updateDatePickerSerachKeyword();
    }
    this.filtering = {
      type: this.rewardListForm.value.filterByType,
      searchBy: this.rewardListForm.value.searchBy,
      searchQuery: this.rewardListForm.value.searchText,
      dateVal: this.rewardListForm.value.datePickerVal
    };
    this._sharedService.setFilteringData('rewardListing', this.filtering);

    this.fetchRewardsList();
  }

  isDatePicker() {
    if (this.rewardListForm.value.searchBy === 'publishDate' || this.rewardListForm.value.searchBy === 'resultDate') {
      return true;
    } else {
      return false;
    }
  }

  updateDatePickerSerachKeyword() {
    if (this.isDatePicker()) {
      if (this.rewardListForm.value.datePickerVal) {
        this.rewardListForm.value.searchText = formatDate(this.rewardListForm.value.datePickerVal, 'MM/dd/y', 'en-US');
      } else {
        this.rewardListForm.value.searchText = '';
      }
    }
  }

  onDateChange(isInvalidDateEntered) {
    // Only Call the list API when there is no invalid date.
    this.updateDatePickerSerachKeyword();
    this.resetFilter();
    if (!isInvalidDateEntered) {
      this.fetchRewardsList();
    }
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
        this.sorting = { ...this._const.REWARD_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('rewardListing', this.sorting);
    this.fetchRewardsList();
  }
}
