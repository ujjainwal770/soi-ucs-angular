import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { _CONST } from '../../../../core/constants/app.constants';
import { getCommentsDataList } from '../../../../core/query/crowdsourcing-gallery';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { SharedService } from '../../../../core/services/shared.service';

@Component({
  selector: 'app-view-comment-tab',
  templateUrl: './view-comment-tab.component.html',
  styleUrls: ['./view-comment-tab.component.scss']
})
export class ViewCommentTabComponent implements OnInit {

  @Input('postId') postId;
  displayedColumns: string[] = ['commented_by', 'comment_date', 'comment', 'actions'];
  columnMapping = {
    full_name:'commented_by',
    created_at:'comment_date',
    message:'comment'
  };
  dataSource = new MatTableDataSource([]);
  sorting = this._sharedService.getSortingData('galleryDetailCommentsTabListing');

  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;

  tableData: any = [];

  @Input('socketEventResponse') socketEventResponse;
  @Output() updateLatestCommentCount: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
    private readonly _errorHandler: CustomErrorHandlerService,
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.fetchCommentTabList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.manageLatestEventData();
  }

  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.fetchCommentTabList();
  }

  updateLatestCount() {
    this.updateLatestCommentCount.emit(this.count);
  }

  manageLatestEventData() {
    if (this.socketEventResponse) {
      const socketData = this.socketEventResponse.data;
      const socketEventType = this.socketEventResponse.eventType;
      this.count = this.socketEventResponse.updatedCount;

      switch (socketEventType) {
        case 'add':
          this.addComment(socketData);
          break;
        case 'update':
          this.updateComment(socketData);
          break;
        case 'delete':
          this.deleteComment(socketData);
          break;
        default:
          break;
      }
    }
  }

  // Comment tab data list
  fetchCommentTabList() {
    this.dataSource = new MatTableDataSource([]);
    this._spinner.show();
    this._apollo
      .query({
        query: getCommentsDataList,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          postDetailType: 'comments',
          post_id: this.postId,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();

        const dt = data['getGalleryDetails'] || {};
        const commentsData = dt.comments || {};
        const listData = commentsData.data || [];

        this.count = commentsData.count;
        this.updateLatestCount();
        this.prepareDataSource(listData);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  prepareDataSource(commentsData) {
    this.tableData = [];
    if (commentsData && commentsData.length > 0) {
      commentsData.forEach(item => {
        this.tableData.push({
          id: item.data.id,
          commented_by: item.users.full_name,
          comment_date: item.data.created_at,
          comment: item.messages.message
        });
      });
      this.dataSource = new MatTableDataSource(this.tableData);
      // Perform sorting logic here
      this.sort.active = this.columnMapping[this.sorting.sortingByColumn];
      this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
      this.dataSource.sort = this.sort;
    }
  }

  // Manage the latest comment recieved through socket.
  addComment(latestComment) {
    this.tableData = [...this.tableData];
    this.tableData.unshift({
      id: latestComment.id,
      commented_by: `${latestComment.first_name} ${latestComment.last_name}`,
      comment_date: latestComment.created_at,
      comment: latestComment.message
    });

    // maximum 10 elements allowd in a page
    if (this.count > this.pageSizeCount) {
      // delete from the last
      this.tableData.splice(-1);
    }

    this.dataSource = new MatTableDataSource(this.tableData);
  }

  updateComment(latestComment) {
    if (this.tableData && this.tableData.length > 0) {
      const indexToUpdate = this.tableData?.findIndex(item => item?.id === latestComment?.id);
      if (indexToUpdate >= 0) {
        this.tableData = [...this.tableData];
        this.tableData[indexToUpdate] = {
          id: latestComment?.id,
          commented_by: `${latestComment.first_name} ${latestComment.last_name}`,
          comment_date: latestComment.updated_at,
          comment: latestComment.message
        };
        this.dataSource = new MatTableDataSource(this.tableData);
      }
    }
  }

  deleteComment(latestComment) {
    const indexToDelete = this.tableData.findIndex(item => item.id === latestComment.id);
    if (indexToDelete >= 0) {
      this.tableData = [...this.tableData];
      this.tableData.splice(indexToDelete, 1);
      this.dataSource = new MatTableDataSource(this.tableData);
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
        this.sorting = { ...this._const.CROWDSOURCE_DETAIL_COMMENTS_TAB_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('galleryDetailCommentsTabListing', this.sorting);
    this.fetchCommentTabList();
  }
}
