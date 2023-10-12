import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  isNewNotificationReceived = new Subject;
  getNotificationCount = new BehaviorSubject(0);

  notificationCount = 0;
  notificationList: any = [];
  currentDeviceId = '';
  currentNotification: any;
  notificationTypeDetail = [
    {
      notificationId: 'student_new_request',
      description: '(School Admin) - when a new student is registered.',
      module: 'Manage Student',
      url: '/manage-students',
      icon: '../../../../assets/images/svg/notification_icon_new_student_registered.svg',
    },
    {
      notificationId: 'pre_approved_user_registered',
      description: '(School Admin) - when a pre-approved student is registered.',
      module: 'Manage Student',
      url: '/manage-students',
      icon: '../../../../assets/images/svg/notification_icon_pre_approved_student_registered.svg',
    },
    {
      notificationId: 'student_reported',
      description: '(School Admin) - When a user is reported in their school',
      module: 'Abuse Report',
      url: '/manage-students',
      icon: '../../../../assets/images/svg/notification_icon_report.svg',
    },
    {
      notificationId: 'admin_dismissed_student',
      description: 'Notification of dismiss to be received by SOUCS',
      module: 'Dismiss Student',
      url: '/app-users/dismissed-student-details',
      icon: '../../../../assets/images/svg/notification_icon_dismiss-user.svg'
    },
    {
      notificationId: 'admin_student_reported',
      description: 'User abuse notification for SOUCS admin',
      module: 'User Abuse',
      url: '/app-users/report-abuse-details',
      icon: '../../../../assets/images/svg/notification_icon_user-abuse.svg'
    },
    {
      notificationId: 'admin_content_reported',
      description: 'Content report notification for SOUCS admin',
      module: 'Report Content',
      url: '/content-management/challenge-abuse-details',
      icon: '../../../../assets/images/svg/notification_icon_report-content.svg'
    },
    {
      notificationId: 'student_deactivated',
      description: 'When a UCS student gets deactivated from soucs admin',
      module: '',
      url: '',
      icon: '../../../../assets/images/svg/notification_icon_deactivated.svg'
    },
    {
      notificationId: 'school_migration_request',
      description: 'When receives a school migration request on school admin',
      module: 'Manage Student',
      url: '/manage-students',
      icon: '../../../../assets/images/svg/notification_icon_school_migration_request.svg'
    },
    {
      notificationId: 'reward_closing_date',
      description: 'Soucs Admin - notification when reward closing date is reached.',
      module: 'Reward',
      url: '/rewards/reward-details',
      icon: '../../../../assets/images/svg/notification_icon_reward_closing.svg'
    },
    {
      notificationId: 'post_report_abuse',
      description: 'Soucs Admin - notification when there is an abuse report on post.',
      module: 'Crowdsourcing Gallery',
      url: '/crowdsource-gallery/gallery-details',
      icon: '../../../../assets/images/svg/notification_gallery_post_report_abuse.svg'
    },
    {
      notificationId: 'user_school_change_by_soucs_admin',
      description: 'School Admin - notification when user change school.',
      module: 'Manage Student',
      url: '/manage-students',
      icon: '../../../../assets/images/svg/notification_icon_school_migration_request.svg'
    },
    {
      notificationId: 'public_to_ucs_by_soucs_admin',
      description: 'School Admin - notification when user type changed from public to ucs.',
      module: 'Manage Student',
      url: '/manage-students',
      icon: '../../../../assets/images/svg/notification_icon_user_type_migration.png'
    },
  ];

  private messaging = getMessaging();

  constructor(private readonly _toastr: ToastrService) {

  }

  requestNotifyPermission() {
    getToken(this.messaging, { vapidKey: environment.FIREBASE_CONFIGURATION.vapidKey }).then((deviceId) => {
      if (deviceId) {
        this.setCurrentDeviceId(deviceId);
      }
    }).catch(err => {
      console.log('The notification permission was not granted and blocked instead. Please Allow to receive push notification.');
    });
  }

  listenPushNotification() {
    onMessage(this.messaging, (notificationPayload: any) => {
      this.currentNotification = notificationPayload;
      console.log('Received push notification:', this.currentNotification);
      this._toastr.info(this.currentNotification?.data?.body, this.currentNotification?.data?.title, {
        closeButton: true
      }).onTap.subscribe(() => this.onNotificationToasterClicked());
      this.isNewNotificationReceived.next(true); // You can get all updated values of notification related when this flag is true.
    });
  }

  onNotificationToasterClicked() {
    
  }

  setNotificationCount(count) {
    this.notificationCount = count;
    this.getNotificationCount.next(this.notificationCount);
  }

  getNotificationList() {
    return this.notificationList;
  }

  setNotificationList(list) {
    this.notificationList = list;
    this.setNotificationCount(this.notificationList?.length);
  }

  getCurrentDeviceId() {
    return this.currentDeviceId;
  }

  setCurrentDeviceId(deviceId) {
    this.currentDeviceId = deviceId;
  }

  getNotificationDetails(notificationId) {
    return this.notificationTypeDetail.find(item => item.notificationId === notificationId);
  }
}
