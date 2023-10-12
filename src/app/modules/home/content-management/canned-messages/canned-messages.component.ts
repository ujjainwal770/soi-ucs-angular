import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../../core/constants/app.constants';
import { fetchCannedMessagesList, rePublishCannedMessageQuery, unpublishCannedMessageQuery } from '../../../../core/query/canned-message';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { SharedService } from '../../../../core/services/shared.service';

@Component({
  selector: 'app-canned-messages',
  templateUrl: './canned-messages.component.html',
  styleUrls: ['./canned-messages.component.scss']
})
export class CannedMessagesComponent implements OnInit {

  sorting = this._sharedService.getSortingData('cannedMessageListing');
  activeEnv: string;
  displayedColumns: string[] = ['message', 'created_at', 'hasColor', 'publish', 'actions'];
  dataSource = new MatTableDataSource([]);

  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private readonly _apollo: Apollo,
    private readonly _sharedService: SharedService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _const: AppConstantService,
    private readonly _toastr: ToastrService,
    private readonly _dialogsService: DialogsService
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.fetchCannedMessageList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.fetchCannedMessageList();
  }

  // Fetch canned messages list
  fetchCannedMessageList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: fetchCannedMessagesList,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          fetchVia: 'admin',
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['fetchAdminCannedMessage'];
        this.dataSource = new MatTableDataSource(dt['cannedMessageList']);
        this.count = dt['count'];
        this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  openUnpublishConfirmationDialog(messageId) {
    const pgtitle = '';
    const message = 'This Message will be removed from the user’s available options. This will not impact previously sent comments. Confirm to proceed.';
    const dialogType = 'confirm';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message, dialogType)
      .subscribe(res => {
        if (res) {
          this.unpublishCannedMessage(messageId);
        }
      });
  }

  unpublishCannedMessage(messageId) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: unpublishCannedMessageQuery,
      variables: {
        id: messageId,
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this._toastr.success('This message has been successfully un-published.');
      this.fetchCannedMessageList();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  openRepublishConfirmationDialog(messageId) {
    const pgtitle = '';
    const message = 'This Message will be shown in the user\'s available options. Confirm to proceed.';
    const dialogType = 'confirm';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message, dialogType)
      .subscribe(res => {
        if (res) {
          this.rePublishMessage(messageId);
        }
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
        this.sorting = { ...this._const.CANNED_MSG_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('adminUserListing', this.sorting);
    this.fetchCannedMessageList();
  }

  rePublishMessage(messageId) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: rePublishCannedMessageQuery,
      variables: {
        id: messageId,
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this._toastr.success('This message has been successfully Published.');
      this.fetchCannedMessageList();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }
}
