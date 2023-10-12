import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { _CONST } from '../../../core/constants/app.constants';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { Apollo } from 'apollo-angular';
import { CustomErrorHandlerService } from '../../../core/services/custom-error-handler.service';
import { getBroadcastMessageList } from '../../../core/query/broadcast-message';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { AppConstantService } from '../../../core/services/app-constant.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.component.html',
  styleUrls: ['./broadcast-message.component.scss']
})
export class BroadcastMessageComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  sorting = this._sharedService.getSortingData('appBroadcastMessageListing');
  displayedColumns: string[] = ['message', 'publish_date', 'expiration_date', 'status', 'actions'];
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private readonly _router: Router,
    private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,

  ) {
    this.pageSizeCount = this.pageSizes[0];
   }

  ngOnInit(): void {
    this.getBroadCastMessages();
  }


   /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
   public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getBroadCastMessages();
  }

   // Fetch broadcast messages list
   getBroadCastMessages() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: getBroadcastMessageList,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getBroadcastMessageList'];
        this.dataSource = new MatTableDataSource(dt["broadcastMessage"]);
        this.sort.active = this.sorting.sortingByColumn;
        this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
        this.dataSource.sort = this.sort;
        this.count = dt['count'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  gotoEditPage(Id:string) {
    this._router.navigateByUrl('/manage-broadcast-message/edit-broadcast-message/' + Id);
  }
  gotoViewPage(Id:string) {
    this._router.navigateByUrl('/manage-broadcast-message/view-broadcast-message/' + Id);
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
        this.sorting = { ...this._const.APP_MANAGE_BROADCAST_MESSAGE_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('appManageUser', this.sorting);
    this.getBroadCastMessages();
  }

}
