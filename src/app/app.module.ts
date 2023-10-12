import { LayoutModule } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OktaAuthModule } from '@okta/okta-angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { initializeApp } from 'firebase/app';
import { ChartsModule } from 'ng2-charts';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogsService } from './core/services/dialog-service';
import { HttpService } from './core/services/http.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { PushNotificationService } from './core/services/push-notification.service';
import { GraphQLModule } from './graphql.module';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';
import { BulkUploadValidationsComponent } from './modules/dialogs/bulk-upload-validations/bulk-upload-validations.component';
import { ChangeSchoolDialogComponent } from './modules/dialogs/change-school-dialog/change-school-dialog.component';
import { ConfirmDialogComponent } from './modules/dialogs/confirm-dialog/confirm-dialog.component';
import { DismissRequestDialogComponent } from './modules/dialogs/dismiss-request-dialog/dismiss-request-dialog.component';
import { MassResendMailStatusDialogComponent } from './modules/dialogs/mass-resend-mail-status-dialog/mass-resend-mail-status-dialog.component';
import { ReasonDialogComponent } from './modules/dialogs/reason-dialog/reason-dialog.component';
import { ReportDownloadDialogComponent } from './modules/dialogs/report-download-dialog/report-download-dialog.component';
import { VideoPlayerDialogComponent } from './modules/dialogs/video-player-dialog/video-player-dialog.component';
import { LoaderModule } from './shared/module/loader/loader.module';
import { MaterialModule } from './shared/module/material/material.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { CancelEventDialogComponent } from './modules/dialogs/cancel-event-dialog/cancel-event-dialog.component';

initializeApp(environment.FIREBASE_CONFIGURATION);

@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    ReasonDialogComponent,
    BulkUploadValidationsComponent,
    ConfirmDialogComponent,
    ReportDownloadDialogComponent,
    DismissRequestDialogComponent,
    VideoPlayerDialogComponent,
    ChangeSchoolDialogComponent,
    MassResendMailStatusDialogComponent,
    CancelEventDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    SharedModule,
    HttpClientModule,
    OktaAuthModule,
    MatSidenavModule,
    MatIconModule,
    LoaderModule,
    GraphQLModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    ChartsModule,
    // BackButtonDisableModule.forRoot(),
    ReactiveFormsModule,
    MaterialModule,
    PopoverModule.forRoot(),
    CommonModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AmazingTimePickerModule
  ],
  entryComponents: [
    ReasonDialogComponent,
    ConfirmDialogComponent,
    ReportDownloadDialogComponent,
    DismissRequestDialogComponent,
    VideoPlayerDialogComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    HttpService,
    LocalStorageService,
    BnNgIdleService,
    DialogsService,
    PushNotificationService,
    AsyncPipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
