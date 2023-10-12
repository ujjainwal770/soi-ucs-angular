import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { BulkUploadValidationsComponent } from 'src/app/modules/dialogs/bulk-upload-validations/bulk-upload-validations.component';
import { CancelEventDialogComponent } from 'src/app/modules/dialogs/cancel-event-dialog/cancel-event-dialog.component';
import { ChangeSchoolDialogComponent } from 'src/app/modules/dialogs/change-school-dialog/change-school-dialog.component';
import { ConfirmDialogComponent } from 'src/app/modules/dialogs/confirm-dialog/confirm-dialog.component';
import { DismissRequestDialogComponent } from 'src/app/modules/dialogs/dismiss-request-dialog/dismiss-request-dialog.component';
import { MassResendMailStatusDialogComponent } from 'src/app/modules/dialogs/mass-resend-mail-status-dialog/mass-resend-mail-status-dialog.component';
import { ReasonDialogComponent } from 'src/app/modules/dialogs/reason-dialog/reason-dialog.component';
import { ReportDownloadDialogComponent } from 'src/app/modules/dialogs/report-download-dialog/report-download-dialog.component';
import { VideoPlayerDialogComponent } from 'src/app/modules/dialogs/video-player-dialog/video-player-dialog.component';

@Injectable()
export class DialogsService {
    constructor(private dialog: MatDialog) { }

    public reasonDeclaration(pgtitle: string, reviewParm: any): Observable<any> {
        let dialogRef: MatDialogRef<ReasonDialogComponent>;

        dialogRef = this.dialog.open(ReasonDialogComponent);

        dialogRef.componentInstance.pgtitle = pgtitle;
        dialogRef.componentInstance.reviewParm = reviewParm;

        return dialogRef.afterClosed();
    }

    public confirmationDialogPopUp(pgtitle: string, message: string, dialogType = 'yesNo'): Observable<any> {
        let dialogRef: MatDialogRef<ConfirmDialogComponent>;
        dialogRef = this.dialog.open(ConfirmDialogComponent);
        dialogRef.componentInstance.pgtitle = pgtitle;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.dialogType = dialogType;
        return dialogRef.afterClosed();
    }
    public eventCancelDialogPopUp(pgtitle: string, message: string,icon:string, dialogType = 'yesNo'): Observable<any> {
        let dialogRef: MatDialogRef<CancelEventDialogComponent>;
        dialogRef = this.dialog.open(CancelEventDialogComponent);
        dialogRef.componentInstance.pgtitle = pgtitle;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.icon = icon;
        dialogRef.componentInstance.dialogType = dialogType;
        return dialogRef.afterClosed();
    }

    public reportDownloadPopUp(pgtitle: string, reportType: string): Observable<any> {
        let dialogRef: MatDialogRef<ReportDownloadDialogComponent>;
        dialogRef = this.dialog.open(ReportDownloadDialogComponent,{autoFocus: false});
        dialogRef.componentInstance.pgtitle = pgtitle;
        dialogRef.componentInstance.reportType = reportType;
        dialogRef.disableClose = true;
        return dialogRef.afterClosed();
    }

    public dismissRequestPopUp(pgtitle: string): Observable<any> {
        let dialogRef: MatDialogRef<DismissRequestDialogComponent>;
        dialogRef = this.dialog.open(DismissRequestDialogComponent);
        dialogRef.componentInstance.pgtitle = pgtitle;
        return dialogRef.afterClosed();
    }

    public changeSchoolPopUp(pgtitle: string): Observable<any> {
        let dialogRef: MatDialogRef<ChangeSchoolDialogComponent>;
        dialogRef = this.dialog.open(ChangeSchoolDialogComponent);
        dialogRef.componentInstance.pgtitle = pgtitle;
        return dialogRef.afterClosed();
    }

    public bulkUploadValidations(pgtitle: string, reviewParm: any): Observable<any> {
        let dialogRef: MatDialogRef<BulkUploadValidationsComponent>;

        dialogRef = this.dialog.open(BulkUploadValidationsComponent, {
            height: '50%',
            width: '50%'
        });

        dialogRef.componentInstance.pgtitle = pgtitle;
        dialogRef.componentInstance.reviewParm = reviewParm;

        return dialogRef.afterClosed();
    }

    public videoPlayerDialog(data: any): Observable<any> {
        let dialogRef: MatDialogRef<VideoPlayerDialogComponent>;
        dialogRef = this.dialog.open(VideoPlayerDialogComponent, {
            panelClass: 'dialog-panel'
        });
        dialogRef.componentInstance.videoData = data;
        return dialogRef.afterClosed();
    }

    public massResendMailStatusDialog(data: any): Observable<any> {
        let dialogRef: MatDialogRef<MassResendMailStatusDialogComponent>;
        dialogRef = this.dialog.open(MassResendMailStatusDialogComponent);
        dialogRef.componentInstance.data = data;
        return dialogRef.afterClosed();
    }

    public closeAllMatDialog() {
        this.dialog.closeAll();
    }
}
