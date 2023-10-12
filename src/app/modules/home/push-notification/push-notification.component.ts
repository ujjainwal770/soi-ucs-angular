import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { dismissSchoolAdminQuery, dismissSoucsAdminQuery, schoolAdminNotificationListQuery, soucsAdminNotificationListQuery, updateSchoolAdminReadStatusQuery, updateSoucsAdminReadStatusQuery } from 'src/app/core/query/push-notification';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { PushNotificationService } from 'src/app/core/services/push-notification.service';
import * as _ from 'lodash';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { _CONST } from 'src/app/core/constants/app.constants';
export interface NotificationListData {
  'user_id': number,
  'action_id': string,
  'notification_id': string,
  'title': string,
  'body': string
}

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['actionCheckBox', 'title', 'creation_time', 'actions'];
  dataSource = new MatTableDataSource([]);
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;

  pushNotificationForm: FormGroup;
  filterOptions: any = [
    { query: 'all', text: 'all' },
    { query: 'yes', text: 'Read' },
    { query: 'no', text: 'Unread' }
  ];
  notificationList: any = [];
  selection = new SelectionModel<NotificationListData>(true, []);
  isSchoolAdmin: boolean;
  bulkArr: any[];

  constructor(
    private _pushNotificationService: PushNotificationService,
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _localStorage: LocalStorageService
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.isSchoolAdmin = this._localStorage.get('UserData') ? true : false;
    this.pushNotificationForm = new FormGroup({
      'bulkAction': new FormControl('no', [Validators.required]),
      'filterbyMsgType': new FormControl('all', [Validators.required]),
    });
    this.listenForNewNotification();
    this.getAllNotifications();
  }

  // When a new notification received.
  listenForNewNotification() {
    this._pushNotificationService.isNewNotificationReceived.subscribe((isReceived) => {
      if (isReceived) {
        this.getAllNotifications();
      }
    });
  }

  // show notification list on UI
  initNotificationList() {
    let notificationList;
    notificationList = this._pushNotificationService.getNotificationList();
    this.dataSource = new MatTableDataSource(notificationList);
  }

  getFieldRef(field: string) {
    return this.pushNotificationForm.get(field);
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getAllNotifications();
  }

  // API call to fetch all the notification list from the server
  getAllNotifications() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: this.isSchoolAdmin ? schoolAdminNotificationListQuery : soucsAdminNotificationListQuery,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount,
          filter: this.getFieldRef('filterbyMsgType').value
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();
        let dt = this.isSchoolAdmin ? data['getSchoolAdminNotificationList'] : data['getSoucsAdminNotificationList'];
        this.count = dt['count'];
        this._pushNotificationService.setNotificationList(dt['notifications']);
        this._pushNotificationService.setNotificationCount(dt['unread_count']);
        this.initNotificationList();
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
  checkboxLabel(row?: NotificationListData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
  }

  messageAction(notificationPayload) {
    // 'range' - user is selecting the text not trying to click
    if (document.getSelection()?.type?.toLowerCase() !== 'range') {
      let url = this._pushNotificationService.getNotificationDetails(notificationPayload?.notification_id)?.url;
      if (notificationPayload.is_read === 'no') {
        this.changeReadStatus([notificationPayload.id], 'yes');
      }
      if (notificationPayload?.action_id) {
        url = url + '/' + notificationPayload.action_id;
      }
      if (url) this._router.navigateByUrl(url);
    }
  }


  // This function is to change the read status of a message (individual / bulk)
  // where, markAs = read/unread.
  changeReadStatus(updateList: any, markAs) {
    if (updateList && updateList.length > 0) {
      this._spinner.show();
      this._apollo.mutate({
        mutation: this.isSchoolAdmin ? updateSchoolAdminReadStatusQuery : updateSoucsAdminReadStatusQuery,
        variables: {
          input: {
            'id': updateList,
            'is_read': markAs
          }
        },
        refetchQueries: [{
          query: this.isSchoolAdmin ? schoolAdminNotificationListQuery : soucsAdminNotificationListQuery,
          variables: {
            page: this.currentPage,
            limit: this.pageSizeCount,
            filter: 'all'
          },
        },
        ]
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.getAllNotifications();
        // this._toastr.success('Read Status updated successfully');
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
  }


  getNotificationIcon(notificationId) {
    return this._pushNotificationService.getNotificationDetails(notificationId)?.icon;
  }

  dismissNotification(id, status) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: this.isSchoolAdmin ? dismissSchoolAdminQuery : dismissSoucsAdminQuery,
      variables: {
        input: {
          'id': id,
          'status': status
        }
      },
      refetchQueries: [{
        query: this.isSchoolAdmin ? schoolAdminNotificationListQuery : soucsAdminNotificationListQuery,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount,
          filter: 'all'
        },
      },
      ]
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this.getAllNotifications();
      // this._toastr.success('Read Status updated successfully');
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  bulkUpdateNotificationRead() {
    let bulkArr = [];
    this.selection.selected.forEach(element => {

      if (bulkArr.indexOf(element['id']) !== 0) {
        bulkArr.push(element['id']);
      }
    });
    this.changeReadStatus(bulkArr, this.pushNotificationForm.get('bulkAction').value);
    this.selection.clear();
  }

  /**
   * Validate selection for bulk status update
   * @returns boolean value
   */
  bulkActionValidation(): boolean {
    let { selected } = this.selection;

    if (selected.length < 1) {
      this._toastr.error('please select data from table for Bulk Action');
      return false;
    }

    let selectedItem = _.map(selected, item => {
      return item.schoolverifystatus
    })
    let uniqeItem = _.uniq(selectedItem);

    if (uniqeItem.length > 1) {
      this._toastr.error('More the one status selected. Please choose  similar status category , for Bulk Action');
      return false;
    }

    if (uniqeItem[0] === this.pushNotificationForm.get('bulkAction').value) {
      this._toastr.error('Action can not apply for similar status')
      return false;
    }
    return true;
  }

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.getAllNotifications();
  }

}
