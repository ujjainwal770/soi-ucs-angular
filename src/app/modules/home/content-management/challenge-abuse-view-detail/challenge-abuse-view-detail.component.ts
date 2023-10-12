import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { _CONST } from '../../../../core/constants/app.constants';
import { ChallengeAbuseReportData } from '../../../../core/model/challenge-abuse-model';
import { getChallengeByIdQuery, getChallengeReportAbuseDetails, getChallengeReportByIdQuery } from '../../../../core/query/challenge-abuse';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';


@Component({
  selector: 'app-challenge-abuse-view-detail',
  templateUrl: './challenge-abuse-view-detail.component.html',
  styleUrls: ['./challenge-abuse-view-detail.component.scss']
})
export class ChallengeAbuseViewDetailComponent implements OnInit {

  displayedColumns: string[] = ['creation_time', 'reportedBy', 'email', 'reason'];
  dataSource = new MatTableDataSource<ChallengeAbuseReportData>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;

  selectedChallengeId = '';
  selectedReportAbuseId: number;
  challengeReportData: any = [];
  challengeDetailFetchedById: any = [];
  abuseDetailFetchedById: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _activateRouter: ActivatedRoute) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit() {
    this._activateRouter.params.subscribe(params => {
      this.selectedChallengeId = params.id1;
      this.selectedReportAbuseId = parseFloat(params.id2);
      if (this.selectedChallengeId && this.selectedReportAbuseId) {
        this.getChallengeById(this.selectedChallengeId);
        this.getChallengeReportAbuseById(this.selectedReportAbuseId);
      } else {
        this.back();
      }
    });
    this.getChallengeReportList();
  }

  back() {
    this._router.navigateByUrl('/content-management/challenge-abuse');
  }
  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getChallengeReportList();
  }

  /**
   * Fetch challenge abuse list
   */
  getChallengeReportList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: getChallengeReportAbuseDetails,
        variables: {
          input: {
            challenge_id: this.selectedChallengeId,
            page: this.currentPage,
            limit: this.pageSizeCount,
          }
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.challengeReportData = data['challengeReportAbuseDetails'];
        const userListDataSource = this.initSelect(data['challengeReportAbuseDetails']['data']);
        this.dataSource = new MatTableDataSource(userListDataSource);
        this.count = this.challengeReportData['count'];
        this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  initSelect = data => {
    return data.map(item => ({
      ...item,
      reportedBy: this.extractUser(item.reported_by, 'reportedBy'),
      email: this.extractUser(item.reported_by, 'email'),
    }));
  };


  /**
   * Extract user detail object from the user_id (i.e. reportedBy)
   */
  extractUser(reportedBy, type) {
    let userData;
    if (this.challengeReportData && this.challengeReportData.users && this.challengeReportData.users.length > 0) {
      userData = this.challengeReportData['users'].find(element => element.user_id === reportedBy);
    }
    const firstName:string = userData?.first_name || '';
    const lastName:string = userData?.last_name || '';
    const fullName = `${firstName} ${lastName ? lastName : ''}`;
    return type === 'reportedBy' ? fullName : userData?.email;
  }


  getChallengeById(challengeId) {
    this._spinner.show();
    this._apollo
      .query({
        query: getChallengeByIdQuery,
        variables: {
          id: challengeId
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.challengeDetailFetchedById = data['getChallengeByIDBrightSpot'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  getChallengeReportAbuseById(reportAbuseId) {
    this._spinner.show();
    this._apollo
      .query({
        query: getChallengeReportByIdQuery,
        variables: {
          id: reportAbuseId
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.abuseDetailFetchedById = data['getChallengeReportAbuseById'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
}
