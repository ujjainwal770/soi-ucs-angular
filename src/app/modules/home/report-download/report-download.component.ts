import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../core/services/auth.service';
import { DialogsService } from '../../../core/services/dialog-service';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.scss']
})
export class ReportDownloadComponent implements OnInit {

  displayedColumns: string[] = ['reportTitle', 'action'];
  dataSource = new MatTableDataSource([]);
  adminType = 'Soucs Admin';

  SoucsAdminReportList = [
    { 'reportTitle': 'Challenge Engagement', 'reportType': 'CHALLENGE_ENGAGEMENT' },
    { 'reportTitle': 'Users', 'reportType': 'USERS' },
    { 'reportTitle': 'Schools', 'reportType': 'SCHOOLS' },
    { 'reportTitle': 'School Change Audit', 'reportType': 'SCHOOL_CHANGE_AUDIT' },
    { 'reportTitle': 'User Abuse (All)', 'reportType': 'USER_ABUSE' },
    { 'reportTitle': 'Rewards Data', 'reportType': 'REWARDS_REPORT' },
    { 'reportTitle': 'Gallery Report Data', 'reportType': 'GALLERY_POST_REPORT' },
  ];

  SchoolAdminReportList = [
    { 'reportTitle': 'User Abuse', 'reportType': 'SCHOOL_ADMIN_USER_ABUSE_REPORT' }
  ];

  constructor(
    private readonly _authService: AuthService,
    private readonly _dialogsService: DialogsService
  ) { }

  ngOnInit(): void {
    this._authService.user.subscribe(res => {
      this.adminType = (res && res.usertype) ? 'School Admin' : '';
      if (this.adminType === 'School Admin') {
        this.dataSource = new MatTableDataSource(this.SchoolAdminReportList);
      } else {
        this.dataSource = new MatTableDataSource(this.SoucsAdminReportList);
      }
    });
  }

  onDownloadClicked(reportType) {
    const pgtitle = 'Download Report';
    this._dialogsService
      .reportDownloadPopUp(pgtitle, reportType)
      .subscribe();
  }
}
