import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard } from '@okta/okta-angular';
import { AuthGuard } from 'src/app/core/gaurds/auth-guard.service';
import { AddNewAdminUserComponent } from './admin/add-new-admin-user/add-new-admin-user.component';
import { AdminListComponent } from './admin/admin-list/admin-list.component';
import { AddRolesComponent } from './admin/admin-roles/add-roles/add-roles.component';
import { AdminRolesComponent } from './admin/admin-roles/admin-roles.component';
import { EditAdminUserComponent } from './admin/edit-admin-user/edit-admin-user.component';
import { DismissedStudentsComponent } from './app-users/dismissed-students/dismissed-students.component';
import { ViewDismissedStudentsComponent } from './app-users/dismissed-students/view-dismissed-students/view-dismissed-students.component';
import { ReportAbuseComponent } from './app-users/report-abuse/report-abuse.component';
import { ViewAbuseComponent } from './app-users/report-abuse/view-abuse/view-abuse.component';
import { EditAppUserComponent } from './app-users/user-list/edit-app-user/edit-app-user.component';
import { UserListComponent } from './app-users/user-list/user-list.component';
import { ViewUserDetailsComponent } from './app-users/user-list/view-user-details/view-user-details.component';
import { AddCategoriesComponent } from './content-management/add-categories/add-categories.component';
import { AddTagsComponent } from './content-management/add-tags/add-tags.component';
import { AddCannedMessagesComponent } from './content-management/canned-messages/add-canned-messages/add-canned-messages.component';
import { CannedMessagesComponent } from './content-management/canned-messages/canned-messages.component';
import { ChallengeAbuseViewDetailComponent } from './content-management/challenge-abuse-view-detail/challenge-abuse-view-detail.component';
import { ChallengeAbuseComponent } from './content-management/challenge-abuse/challenge-abuse.component';
import { ManageTagsComponent } from './content-management/manage-tags/manage-tags.component';
import { CrowdsourceGalleryDetailsComponent } from './crowdsource-gallery/crowdsource-gallery-details/crowdsource-gallery-details.component';
import { CrowdsourceGalleryComponent } from './crowdsource-gallery/crowdsource-gallery.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddStudentComponent } from './manage-user/add-student/add-student.component';
import { EditStudentComponent } from './manage-user/edit-student/edit-student.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { StudentBulkUploadComponent } from './manage-user/student-bulk-upload/student-bulk-upload.component';
import { ProfileComponent } from './profile/profile.component';
import { PushNotificationComponent } from './push-notification/push-notification.component';
import { ReportDownloadComponent } from './report-download/report-download.component';
import { ArchiveRewardsComponent } from './rewards/archive-rewards/archive-rewards.component';
import { RewardsListComponent } from './rewards/rewards-list/rewards-list.component';
import { ViewRewardDetailsComponent } from './rewards/view-reward-details/view-reward-details.component';
import { WinnerListComponent } from './rewards/winner-list/winner-list.component';
import { BulkUploadComponent } from './school-management/bulk-upload/bulk-upload.component';
import { SchoolAddComponent } from './school-management/school-add/school-add.component';
import { SchoolEditComponent } from './school-management/school-edit/school-edit.component';
import { SchoolListComponent } from './school-management/school-list/school-list.component';
import { SchoolViewComponent } from './school-management/school-view/school-view.component';
import { BroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { AddBroadcastMessageComponent } from './broadcast-message/add-broadcast-message/add-broadcast-message.component';
import { EditBroadcastMessageComponent } from './broadcast-message/edit-broadcast-message/edit-broadcast-message.component';
import { ViewBroadcastMessageComponent } from './broadcast-message/view-broadcast-message/view-broadcast-message.component';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { AddEventComponent } from './event-calendar/add-event/add-event.component';
import { ParticipantsListComponent } from './event-calendar/participants-list/participants-list.component';
import { EditEventComponent } from './event-calendar/edit-event/edit-event.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: DashboardComponent
          }
        ]
      },
      {
        path: 'view-profile',
        canActivate: [AuthGuard],
        component: ProfileComponent,
      },
      {
        path: 'content-management',
        canActivate: [OktaAuthGuard],
        children: [
          {
            path: 'manage-tags',
            component: ManageTagsComponent
          },
          {
            path: 'add-tags',
            component: AddTagsComponent
          },
          {
            path: 'add-categories',
            component: AddCategoriesComponent
          },
          {
            path: 'challenge-abuse',
            component: ChallengeAbuseComponent
          },
          {
            path: 'challenge-abuse-details/:id1/:id2',
            component: ChallengeAbuseViewDetailComponent
          },
          {
            path: 'challenge-abuse-details/:id1',
            redirectTo: '/content-management/challenge-abuse'
          },
          {
            path: 'challenge-abuse-details',
            redirectTo: '/content-management/challenge-abuse'
          },
          {
            path: 'canned-messages',
            component: CannedMessagesComponent
          },
          {
            path: 'add-canned-messages',
            component: AddCannedMessagesComponent
          },
        ]
      },
      {
        path: 'app-users',
        canActivate: [OktaAuthGuard],
        children: [
          {
            path: 'user-list',
            component: UserListComponent
          },
          {
            path: 'user-details/:id',
            component: ViewUserDetailsComponent
          },
          {
            path: 'user-details',
            redirectTo: '/app-users/user-list'
          },
          {
            path: 'edit-user-details/:id',
            component: EditAppUserComponent
          },
          {
            path: 'edit-user-details',
            redirectTo: '/app-users/user-list'
          },
          {
            path: 'report-abuse',
            component: ReportAbuseComponent
          },
          {
            path: 'report-abuse-details/:id',
            component: ViewAbuseComponent
          },
          {
            path: 'report-abuse-details',
            redirectTo: '/app-users/report-abuse'
          },
          {
            path: 'dismissed-students',
            component: DismissedStudentsComponent
          },
          {
            path: 'dismissed-student-details/:id',
            component: ViewDismissedStudentsComponent
          },
          {
            path: 'dismissed-student-details',
            redirectTo: '/app-users/dismissed-students'
          },
        ]
      },
      {
        path: 'reports',
        canActivate: [AuthGuard],
        component: ReportDownloadComponent
      },
      {
        path: 'rewards',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'rewards-list',
            component: RewardsListComponent
          },
          {
            path: 'reward-details/:id',
            component: ViewRewardDetailsComponent
          },
          {
            path: 'winner-list',
            component: WinnerListComponent
          },
          {
            path: 'archive-rewards',
            component: ArchiveRewardsComponent
          }
        ]
      },
      {
        path: 'crowdsource-gallery',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: CrowdsourceGalleryComponent
          },
          {
            path: 'gallery-details/:id',
            component: CrowdsourceGalleryDetailsComponent
          },
          {
            path: 'gallery-details',
            redirectTo: '/crowdsource-gallery'
          },
        ]
      },
      {
        path: 'manage-students',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: ManageUserComponent
          },
          {
            path: 'bulk-upload',
            component: StudentBulkUploadComponent
          },
          {
            path: 'add-student',
            component: AddStudentComponent
          },
          {
            path: 'edit-student/:id',
            component: EditStudentComponent
          },
          {
            path: 'edit-student',
            redirectTo: '/manage-students'
          }
        ]
      },
      {
        path: 'push-notification',
        canActivate: [AuthGuard],
        component: PushNotificationComponent,
      },
      {
        path: 'admin',
        canActivate: [OktaAuthGuard],
        children: [
          {
            path: 'admin-list',
            component: AdminListComponent
          },
          {
            path: 'add-new-admin',
            component: AddNewAdminUserComponent
          },
          {
            path: 'edit-admin-user/:id',
            component: EditAdminUserComponent
          },
          {
            path: 'admin-roles',
            component: AdminRolesComponent
          },
          {
            path: 'admin-roles/add-roles',
            component: AddRolesComponent
          }
        ]
      },
      {
        path: 'school-management',
        canActivate: [OktaAuthGuard],
        children: [
          {
            path: '',
            component: SchoolListComponent
          },
          {
            path: 'school-add',
            component: SchoolAddComponent
          },
          {
            path: 'school-view/:id',
            component: SchoolViewComponent
          },
          {
            path: 'school-edit/:id',
            component: SchoolEditComponent
          },
          {
            path: 'bulk-upload',
            component: BulkUploadComponent
          }
        ]
      },
      {
        path: 'manage-broadcast-message',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: BroadcastMessageComponent
          },
          {
            path: 'add-broadcast-message',
            component: AddBroadcastMessageComponent
          },
          {
            path: 'edit-broadcast-message/:id',
            component: EditBroadcastMessageComponent
          },
          {
            path: 'view-broadcast-message/:id',
            component: ViewBroadcastMessageComponent
          },
        ]
      },
      {
        path: 'manage-events',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: EventCalendarComponent
          },
          {
            path: 'add-event',
            component: AddEventComponent
          },
          {
            path: 'add-event/:event_id',
            component: AddEventComponent
          },
          {
            path: 'participants/:event_id',
            component: ParticipantsListComponent
          },
          {
            path: 'edit-event/:event_id',
            component: EditEventComponent
          },
        ]
      },
     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
