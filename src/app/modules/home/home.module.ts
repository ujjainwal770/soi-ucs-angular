import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OktaAuthModule } from '@okta/okta-angular';
import { ChartsModule } from 'ng2-charts';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PhonePipe } from 'src/app/core/pipe/phone.pipe';
import { SocketIoService } from 'src/app/core/services/socket-io.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { AddNewAdminUserComponent } from './admin/add-new-admin-user/add-new-admin-user.component';
import { AdminListComponent } from './admin/admin-list/admin-list.component';
import { AddRolesComponent } from './admin/admin-roles/add-roles/add-roles.component';
import { AdminRolesComponent } from './admin/admin-roles/admin-roles.component';
import { EditAdminUserComponent } from './admin/edit-admin-user/edit-admin-user.component';
import { AppUsersComponent } from './app-users/app-users.component';
import { DismissedStudentsComponent } from './app-users/dismissed-students/dismissed-students.component';
import { ViewDismissedStudentsComponent } from './app-users/dismissed-students/view-dismissed-students/view-dismissed-students.component';
import { ReportAbuseComponent } from './app-users/report-abuse/report-abuse.component';
import { ViewAbuseComponent } from './app-users/report-abuse/view-abuse/view-abuse.component';
import { UserListComponent } from './app-users/user-list/user-list.component';
import { ViewUserDetailsComponent } from './app-users/user-list/view-user-details/view-user-details.component';
import { ImagePreviewComponent } from './common/image-preview/image-preview.component';
import { AddCategoriesComponent } from './content-management/add-categories/add-categories.component';
import { AddTagsComponent } from './content-management/add-tags/add-tags.component';
import { AddCannedMessagesComponent } from './content-management/canned-messages/add-canned-messages/add-canned-messages.component';
import { CannedMessagesComponent } from './content-management/canned-messages/canned-messages.component';
import { ChallengeAbuseViewDetailComponent } from './content-management/challenge-abuse-view-detail/challenge-abuse-view-detail.component';
import { ChallengeAbuseComponent } from './content-management/challenge-abuse/challenge-abuse.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { ManageTagsComponent } from './content-management/manage-tags/manage-tags.component';
import { CrowdsourceGalleryDetailsComponent } from './crowdsource-gallery/crowdsource-gallery-details/crowdsource-gallery-details.component';
import { CrowdsourceGalleryComponent } from './crowdsource-gallery/crowdsource-gallery.component';
import { CrowdsourceListComponent } from './crowdsource-gallery/crowdsource-list/crowdsource-list.component';
import { ViewCommentTabComponent } from './crowdsource-gallery/view-comment-tab/view-comment-tab.component';
import { BadgesEarnedComponent } from './dashboard/badges-earned/badges-earned.component';
import { ChallengesComponent } from './dashboard/challenges/challenges.component';
import { DashboardSchoolsUsersComponent } from './dashboard/dashboard-schools-users/dashboard-schools-users.component';
import { DashboardWidgetsSchoolComponent } from './dashboard/dashboard-widgets-school/dashboard-widgets-school.component';
import { DashboardWidgetsComponent } from './dashboard/dashboard-widgets/dashboard-widgets.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MonthlyRegistrationSchoolComponent } from './dashboard/monthly-registration-school/monthly-registration-school.component';
import { MonthlyRegistrationComponent } from './dashboard/monthly-registration/monthly-registration.component';
import { NotificationWidgetComponent } from './dashboard/notification-widget/notification-widget.component';
import { RewardsWidgetComponent } from './dashboard/rewards-widget/rewards-widget.component';
import { SchoolDashboardDataComponent } from './dashboard/school-dashboard/school-dashboard-data/school-dashboard-data.component';
import { SchoolDashboardComponent } from './dashboard/school-dashboard/school-dashboard.component';
import { SoucsDashboardComponent } from './dashboard/soucs-dashboard/soucs-dashboard.component';
import { HomeRoutingModule } from './home-routing.module';
import { AddStudentComponent } from './manage-user/add-student/add-student.component';
import { BulkUploadListComponent } from './manage-user/bulk-upload-list/bulk-upload-list.component';
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
import { FilterComponent } from './school-management/filter/filter.component';
import { AddAdminFormComponent } from './school-management/forms/add-admin-form/add-admin-form.component';
import { AddSchoolFormComponent } from './school-management/forms/add-school-form/add-school-form.component';
import { EditAdminFormComponent } from './school-management/forms/edit-admin-form/edit-admin-form.component';
import { EditSchoolFormComponent } from './school-management/forms/edit-school-form/edit-school-form.component';
import { SchoolAddComponent } from './school-management/school-add/school-add.component';
import { SchoolEditComponent } from './school-management/school-edit/school-edit.component';
import { SchoolListComponent } from './school-management/school-list/school-list.component';
import { SchoolManagementComponent } from './school-management/school-management.component';
import { SchoolViewComponent } from './school-management/school-view/school-view.component';
import { EditAppUserComponent } from './app-users/user-list/edit-app-user/edit-app-user.component';
import { BroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { AddBroadcastMessageComponent } from './broadcast-message/add-broadcast-message/add-broadcast-message.component';
import { EditBroadcastMessageComponent } from './broadcast-message/edit-broadcast-message/edit-broadcast-message.component';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';
import { ViewBroadcastMessageComponent } from './broadcast-message/view-broadcast-message/view-broadcast-message.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { AddEventComponent } from './event-calendar/add-event/add-event.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ParticipantsListComponent } from './event-calendar/participants-list/participants-list.component';
import { EditEventComponent } from './event-calendar/edit-event/edit-event.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { EventListComponent } from './event-calendar/event-list/event-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ContentManagementComponent,
    ManageUserComponent,
    PushNotificationComponent,
    SchoolManagementComponent,
    BulkUploadComponent,
    FilterComponent,
    SchoolListComponent,
    SchoolAddComponent,
    SchoolViewComponent,
    SchoolEditComponent,
    AddSchoolFormComponent,
    EditSchoolFormComponent,
    AddAdminFormComponent,
    EditAdminFormComponent,
    PhonePipe,
    ManageTagsComponent,
    AddTagsComponent,
    AddCategoriesComponent,
    AppUsersComponent,
    UserListComponent,
    ReportAbuseComponent,
    ViewAbuseComponent,
    ChallengeAbuseComponent,
    ChallengeAbuseViewDetailComponent,
    AdminListComponent,
    AdminRolesComponent,
    AddNewAdminUserComponent,
    SoucsDashboardComponent,
    DashboardWidgetsComponent,
    DashboardSchoolsUsersComponent,
    MonthlyRegistrationComponent,
    BadgesEarnedComponent,
    ChallengesComponent,
    AddNewAdminUserComponent,
    AdminRolesComponent,
    AddRolesComponent,
    ProfileComponent,
    EditAdminUserComponent,
    ReportDownloadComponent,
    StudentBulkUploadComponent,
    BulkUploadListComponent,
    EditStudentComponent,
    MonthlyRegistrationSchoolComponent,
    DashboardWidgetsSchoolComponent,
    DismissedStudentsComponent,
    ViewDismissedStudentsComponent,
    MonthlyRegistrationSchoolComponent,
    SchoolDashboardComponent,
    SchoolDashboardDataComponent,
    AddStudentComponent,
    NotificationWidgetComponent,
    RewardsListComponent,
    ViewRewardDetailsComponent,
    WinnerListComponent,
    RewardsWidgetComponent,
    ArchiveRewardsComponent,
    CrowdsourceGalleryComponent,
    CrowdsourceListComponent,
    ImagePreviewComponent,
    CrowdsourceGalleryDetailsComponent,
    CannedMessagesComponent,
    AddCannedMessagesComponent,
    ViewCommentTabComponent,
    ViewUserDetailsComponent,
    EditAppUserComponent,
    BroadcastMessageComponent,
    AddBroadcastMessageComponent,
    EditBroadcastMessageComponent,
    ConvertToLocalDatePipe,
    ViewBroadcastMessageComponent,
    EventCalendarComponent,
    AddEventComponent,
    ParticipantsListComponent,
    EditEventComponent,
    EventListComponent,
    ],
  imports: [
    CommonModule,
    ChartsModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    OktaAuthModule,
    MaterialModule,
    PopoverModule.forRoot(),
    MatChipsModule,
    MatIconModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AmazingTimePickerModule,
    NgbModule,
    MatButtonToggleModule
    
  ],
  providers: [
    SocketIoService,
    BsModalService,
    DatePipe
  ]
})
export class HomeModule { }