import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { _CONST } from '../../../../core/constants/app.constants';
import { ChallengeAbuseListData } from '../../../../core/model/challenge-abuse-model';
import { getRewardsWinnerList } from '../../../../core/query/rewards';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { SharedService } from '../../../../core/services/shared.service';
import { AppConstantService } from 'src/app/core/services/app-constant.service';

@Component({
  selector: 'app-winner-list',
  templateUrl: './winner-list.component.html',
  styleUrls: ['./winner-list.component.scss']
})
export class WinnerListComponent implements OnInit {
  sorting = this._sharedService.getSortingData('winnerListing');
  displayedColumns: string[] = ['fullName', 'email', 'resultDate', 'ucs_status', 'schoolName', 'title'];
  dataSource = new MatTableDataSource<any>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  actionMenu: Array<{}> = [
    { name: 'View Details', path: 'view', icon: 'remove_red_eye' }
  ];

  count = 0;
  currentPage = 0;
  nextPage: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,

  ) {
    this.pageSizeCount = this.pageSizes[0];
   }

  ngOnInit(): void {
    this.fetchWinnerList();
  }

  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
   public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.fetchWinnerList();
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
      case  _CONST.one:
        this.sorting.currentOrder = 1;
        break;

      // Descending order
      case  _CONST.two:
        this.sorting.currentOrder = 0;
        break;

      // Intial order i.e. descending
      case  _CONST.three:
        this.sorting = { ...this._const.APP_WINNER_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('winnerListing', this.sorting);
    this.fetchWinnerList();
  }

   /**
   * Fetch Rewards list
   */
   fetchWinnerList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .watchQuery({
        query: getRewardsWinnerList,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        const listData = data['getRewardWinnerList'];
        this.sort.active = this.sorting.sortingByColumn;
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
        this.count = listData['count'];
        this.dataSource.sort = this.sort;
        this.dataSource = new MatTableDataSource(listData['winner']);        
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
}
