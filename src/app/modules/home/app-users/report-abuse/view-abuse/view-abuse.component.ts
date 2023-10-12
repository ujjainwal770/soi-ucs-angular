import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { filter } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../../../core/constants/app.constants';
import { SchoolData } from '../../../../../core/model/school-model';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../../core/services/dialog-service';
import { AppUsersData, AppUsersReportAbuseInformationData, AppUsersSchoolReportAbuseInformationData } from '../../../../../core/model/app-users.model';
import { appUserActiveStatusQuery, userReportAbuseDetailQuery, userReportAbuseInformationQuery } from '../../../../../core/query/appuser';

@Component({
  selector: 'app-view-abuse',
  templateUrl: './view-abuse.component.html',
  styleUrls: ['./view-abuse.component.scss']
})
export class ViewAbuseComponent implements OnInit {

  displayedColumns: string[] = ['creation_time', 'reported_by', 'reason'];
  dataSource = new MatTableDataSource<AppUsersData>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;

  schoolList: SchoolData[] = [];
  selectedUserReportData: AppUsersReportAbuseInformationData = {
    account_status: '',
    date_of_birth: 0,
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    reportabusecount: 0,
    ucs_status: '',
    user_id: 0,
  };
  selectedSchoolReportData: AppUsersSchoolReportAbuseInformationData = {
    addressFirst: '',
    addressSecond: '',
    schoolName: ''
  };
  userId: string;
  schoolDetails = {};
  reportedByUser: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _dialogsService: DialogsService,
    private readonly _activateRouter: ActivatedRoute) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit() {
    this._activateRouter.params.subscribe(params => {
      this.userId = params.id;
    });
    this.getReportAbuseByID(this.userId);
    this.getReportedAbuseList(this.userId);
  }


  /**
   * get report abuse data by id receiced in url param
   * @param id as string
   */
  getReportAbuseByID(id: string) {
    this._spinner.show();
    this._apollo
      .query({
        query: userReportAbuseInformationQuery,
        variables: {
          user_id: parseFloat(id),
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.selectedUserReportData = data['reportAbuseUserInformation']['user'];
        this.selectedSchoolReportData = data['reportAbuseUserInformation']['school'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /**
  * Paginator change event when next previous button click and size drop down change
  * @param e as PageEvent
  */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getReportedAbuseList(this.userId);
  }

  /**
   * get Report abuse details table data
   * @param id : as string of user id
   */
  getReportedAbuseList(id: string) {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: userReportAbuseDetailQuery,
        variables: {
          user_id: parseFloat(id),
          page: this.currentPage,
          limit: this.pageSizeCount
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['userReportAbuseDetails'];
        this.dataSource = new MatTableDataSource(dt['data']);
        this.reportedByUser = dt['users'];

        this.count = dt['count'];
        this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * This method use for returning user name against user id
   * @param usreid as number
   * @returns name as string
   */
  getReportedByName(usreid: number) {
    let username = '';
    if (this.reportedByUser && this.reportedByUser.length) {
      filter(this.reportedByUser, item => {
        if (item.user_id === usreid) {
          username = `${item.first_name} ${item.last_name}`;
        }
      });
    }
    return username;
  }

  changeStatus(id, currentStatus) {
    const pgtitle = 'Confirm';
    const message = 'Are you sure want to change the status for this user ?';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this._spinner.show();
          this._apollo.mutate({
            mutation: appUserActiveStatusQuery,
            variables: {
              user_id: id,
              status: currentStatus
            }
          }).subscribe(({ data }) => {
            this._spinner.hide();
            this._toastr.success('User status changed successfully');
            this.getReportAbuseByID(this.userId);
          }, error => {
            this._spinner.hide();
            this._errorHandler.manageError(error, true);
          });
        }
      });
  }
}
