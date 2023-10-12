import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { schoolAdminProfileDetailQuery, soucsAdminProfileDetailQuery } from 'src/app/core/query/admin';
import { schoolAdminUnreadNotificationCountQuery, schoolAdminUpdateDeviceIdQuery, soucsAdminUnreadNotificationCountQuery, soucsAdminUpdateDeviceIdQuery } from 'src/app/core/query/push-notification';
import { switchToNewSchoolQuery } from 'src/app/core/query/school-management';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NavService } from 'src/app/core/services/nav.service';
import { PushNotificationService } from 'src/app/core/services/push-notification.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isSchoolAdmin: boolean;
  adminType = 'Soucs Admin';
  notificationCount: any = 0;
  currentPushMessage: any;
  deviceId: any;
  schoolName: string = '';
  soucsAdminDetails: any;
  schoolAdminDetails: any;

  constructor(public authStateService: OktaAuthStateService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly _navService: NavService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _authService: AuthService,
    private readonly _localStorage: LocalStorageService,
    private readonly _dialogsService: DialogsService,
    public readonly _router: Router,
    private readonly _pushNotificationService: PushNotificationService,
    private readonly _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.isSchoolAdmin = this._localStorage.isSchoolAdmin();
    this.adminType = this.isSchoolAdmin ? 'School Admin' : 'Soucs Admin';
    if (this.isSchoolAdmin) {
      this.isLoggedIn = true;
      this.getSchoolAdminProfile();
    } else {
      this.fetchSoucsAdminDetails();
    }

    // Push Notification
    this._pushNotificationService.isNewNotificationReceived.subscribe((isReceived) => {
      if (isReceived) {
        this.getAllUnreadNotificationCount();
      }
    });

    // Push Notification
    this._pushNotificationService.getNotificationCount.subscribe((count) => {
      this.notificationCount = count;
    });

    // Push notification
    this.deviceId = this._pushNotificationService.getCurrentDeviceId();
    this.getAllUnreadNotificationCount();
  }

  //Activate push notification: send device id and 'active' status when successful login
  deactivatePushNotificationOnServer() {
    this._spinner.show();
    this._apollo.mutate({
      mutation: this.isSchoolAdmin ? schoolAdminUpdateDeviceIdQuery : soucsAdminUpdateDeviceIdQuery,
      variables: {
        device_id: this.deviceId,
        status: 'inactive' // when logout
      }
    }).subscribe(({ data }) => {
      this._authService.logout();
    }, error => {
      this._errorHandler.manageError(error, true);
      this._authService.logout();
    });
  }

  // Fetch all unread notification count from the database
  getAllUnreadNotificationCount() {
    this._apollo
      .query({
        query: this.isSchoolAdmin ? schoolAdminUnreadNotificationCountQuery : soucsAdminUnreadNotificationCountQuery,
        variables: {
          page: 0,
          limit: 10,
          filter: 'all'
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        let dt = this.isSchoolAdmin ? data['getSchoolAdminNotificationList'] : data['getSoucsAdminNotificationList'];
        this._pushNotificationService.setNotificationCount(dt['unread_count']);
      }, error => {
        this._errorHandler.manageError(error);
      });
  }

  onChangePassClicked() {
    this._router.navigateByUrl('/auth/change-password');
  }

  viewProfile() {
    this._router.navigateByUrl('/view-profile');
  }

  /**
   * Fetch School admin profile details
   */
  getSchoolAdminProfile() {
    this.schoolAdminDetails = this._sharedService.schoolAdminDetails;
    if (!this.schoolAdminDetails) {
      this._apollo
        .query({
          query: schoolAdminProfileDetailQuery,
          variables: {},
          fetchPolicy: 'no-cache'
        }).subscribe(({ data }) => {
          this._spinner.hide();
          this.schoolAdminDetails = data['getMySchoolAdminDetails'];
          this.schoolName = this.schoolAdminDetails.school.schoolName;

          //saving the value to shared service for the later use and stop the frequent api call. 
          this._sharedService.schoolAdminDetails = this.schoolAdminDetails;
        }, error => {
          this._errorHandler.manageError(error, true);
        });
    } else {
      this.schoolName = this.schoolAdminDetails.school.schoolName;
    }
  }

  fetchSoucsAdminDetails() {
    this.soucsAdminDetails = this._sharedService.soucsAdminDetails;
    if (!this.soucsAdminDetails) {
      this._apollo
        .query({
          query: soucsAdminProfileDetailQuery,
          variables: {},
          fetchPolicy: "no-cache"
        }).subscribe(({ data }) => {
          this.soucsAdminDetails = data['adminUserProfile'];

          //saving the value to shared service for the later use and stop the frequent api call. 
          this._sharedService.soucsAdminDetails = this.soucsAdminDetails;
        }, (error) => {
          this._errorHandler.manageError(error, true);
        });
    } else {
      return;
    }
  }

  switchToNewSchool(schoolId) {
    this._spinner.show();
    this._apollo
      .query({
        query: switchToNewSchoolQuery,
        variables: {
          schoolId: schoolId
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();

        // Setting user detail and token data
        this._authService.signIn(data['switchSchoolAdmin']);

        // Refreshing the page.
        let currentUrl = this._navService.getRouteUrl().currentUrl;
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate([currentUrl]);
        });
        this._sharedService.schoolAdminDetails = null;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  switchSchool() {
    let pgtitle = 'Change School';
    this._dialogsService
      .changeSchoolPopUp(pgtitle)
      .subscribe(res => {
        if (res) {
          this.switchToNewSchool(res.schoolId)
        }
      });
  }
}

