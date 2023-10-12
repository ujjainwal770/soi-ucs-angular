import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from 'src/app/core/constants/app.constants';
import { dismissSchoolAdminQuery, dismissSoucsAdminQuery, schoolAdminNotificationListQuery, soucsAdminNotificationListQuery, updateSchoolAdminReadStatusQuery, updateSoucsAdminReadStatusQuery } from 'src/app/core/query/push-notification';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { PushNotificationService } from 'src/app/core/services/push-notification.service';

@Component({
  selector: 'app-notification-widget',
  templateUrl: './notification-widget.component.html',
  styleUrls: ['./notification-widget.component.scss']
})
export class NotificationWidgetComponent implements OnInit {

  displayedColumns = ['title', 'creation_time', 'actions'];
  dataSource = new MatTableDataSource([]);
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;
  isSchoolAdmin: boolean;

  constructor(
    private _pushNotificationService: PushNotificationService,
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _localStorage: LocalStorageService
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.isSchoolAdmin = this._localStorage.isSchoolAdmin();
    this.getAllNotifications();
  }

  // API call to fetch all the notification list from the server
  getAllNotifications() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .watchQuery({
        query: this.isSchoolAdmin ? schoolAdminNotificationListQuery : soucsAdminNotificationListQuery,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount,
          filter: 'all'
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
      }).valueChanges.subscribe(({ data }) => {
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

  // show notification list on UI
  initNotificationList() {
    let notificationList;
    notificationList = this._pushNotificationService.getNotificationList();
    this.dataSource = new MatTableDataSource(notificationList);
  }

  getNotificationIcon(notificationId) {
    return this._pushNotificationService.getNotificationDetails(notificationId)?.icon;
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
    }).subscribe(() => {
      this._spinner.hide();
      // this._toastr.success('Read Status updated successfully');
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
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
    }).subscribe(() => {
      this._spinner.hide();
      // this._toastr.success('Read Status updated successfully');
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }
}
