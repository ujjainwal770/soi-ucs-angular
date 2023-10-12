import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { schoolAdminUpdateDeviceIdQuery, soucsAdminUpdateDeviceIdQuery } from 'src/app/core/query/push-notification';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { PushNotificationService } from 'src/app/core/services/push-notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isSchoolAdmin: boolean;
  constructor(
    private _pushNotificationService: PushNotificationService,
    public localStorage: LocalStorageService,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isSchoolAdmin = this.localStorage.get('UserData') ? true : false;
    let deviceId = this._pushNotificationService.getCurrentDeviceId();
    if(deviceId) {
      this.updateDeviceIdForThePushNotification(deviceId);
    }
  }

  //Activate push notification: send device id and 'active' status when successfull login
  updateDeviceIdForThePushNotification(deviceId) {
    this._spinner.show();
      this._apollo.mutate({
        mutation: this.isSchoolAdmin ? schoolAdminUpdateDeviceIdQuery : soucsAdminUpdateDeviceIdQuery,
        variables: {
          device_id: deviceId,
          status: 'active' // when login
        }
      }).subscribe(({ data }) => {
        this._spinner.hide();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error);
      });
  }
}
