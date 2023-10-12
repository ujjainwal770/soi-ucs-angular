import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { _CONST } from '../../../../../core/constants/app.constants';
import { userDismissDetailsQuery, userDismissInformationQuery } from '../../../../../core/query/dismiss-user';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';

@Component({
  selector: 'app-view-dismissed-students',
  templateUrl: './view-dismissed-students.component.html',
  styleUrls: ['./view-dismissed-students.component.scss']
})
export class ViewDismissedStudentsComponent implements OnInit {

  displayedColumns: string[] = ['creation_time', 'dismissed_by', /*'dismissal_type',*/ 'reason', 'description'];
  dataSource = new MatTableDataSource([]);
  originalListResp: any = [];
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;

  userInfo: any;
  schoolInfo: any;
  SchoolAdminInfo: any;
  userId: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _activateRouter: ActivatedRoute) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit() {
    this._activateRouter.params.subscribe(params => {
      this.userId = params.id;
    });
    this.getStudentDetails(this.userId);
    this.getUserDetailForList(this.userId);
  }

  getStudentDetails(id: string) {
    this._spinner.show();
    this._apollo
      .query({
        query: userDismissInformationQuery,
        variables: {
          user_id: parseFloat(id),
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['userDismissInformation'];
        this.userInfo = dt['user'];
        this.schoolInfo = dt['school'];
        this.SchoolAdminInfo = dt['schoolAdmin'];
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
    this.getStudentDetails(this.userId);
  }

  getUserDetailForList(id: string) {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: userDismissDetailsQuery,
        variables: {
          user_id: parseFloat(id),
          page: this.currentPage,
          limit: this.pageSizeCount
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.originalListResp = data['userDismissDetails'];
        this.dataSource = this.getFilteredDataSource();
        this.count = this.originalListResp?.count;
        this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  getFilteredDataSource() {
    const dataList = this.originalListResp?.data;
    const filteredList = dataList?.map(item => ({
      ...item,
      dismissal_type: this.getDismissalType(item?.mode),
      dismissed_by: this.getfilteredColumn(item?.school_admin_id, 'id', 'name', 'schoolAdmin')
    }));
    return new MatTableDataSource(filteredList);
  }

  getfilteredColumn(schoolAdminId, keyToCompare: string, keyToExtract: string, valueFromObject: string) {
    let res;
    if (this.originalListResp[valueFromObject]?.length > 0) {
      res = this.originalListResp[valueFromObject].find(element => element[keyToCompare] === schoolAdminId);
    }
    return res ? res[keyToExtract] : '';
  }

  getDismissalType(mode) {
    const dismissalType = {
      1: 'NEW_STUDENT_REQUEST',
      2: 'SCHOOL_CHANGE_REQUEST'
    };
    return dismissalType[mode]?.replace(/\_/g, ' ');
  }
}
