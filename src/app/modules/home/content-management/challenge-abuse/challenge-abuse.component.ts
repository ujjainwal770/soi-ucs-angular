import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChallengeAbuseListData } from '../../../../core/model/challenge-abuse-model';
import { getChallengeByOptionQuery, getChallengeReportAbuseQuery, searchByOptionQuery } from '../../../../core/query/challenge-abuse';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces } from '../../../../validators/custom.validator';
import { SharedService } from '../../../../core/services/shared.service';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { _CONST } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-challenge-abuse',
  templateUrl: './challenge-abuse.component.html',
  styleUrls: ['./challenge-abuse.component.scss']
})

export class ChallengeAbuseComponent implements OnInit, AfterViewInit {
  challengeAbuseForm: FormGroup;

  sorting = this._sharedService.getSortingData('challengeAbuseListing');

  displayedColumns: string[] = ['challengeName', 'email', 'reportedBy', 'creation_time', 'reason', 'status', 'actions'];
  dataSource = new MatTableDataSource<ChallengeAbuseListData>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  actionMenu: Array<{}> = [
    { name: 'View Details', path: 'view', icon: 'remove_red_eye' }
  ];

  count = 0;
  currentPage = 0;
  nextPage: number;

  searchOptions: any = [];
  challengeAbuseOptions: any = [];
  challengeAbuseDataList: any = [];
  searchbyTxt = 'Name';

  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  UserListDetails: any;

  constructor(
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _utilityService: UtilityService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.challengeAbuseForm = new FormGroup({
      'filterByChallengeId': new FormControl('all', [Validators.required]),
      'filterByStatus': new FormControl('All', [Validators.required]),
      'searchBy': new FormControl('all', [Validators.required]),
      'searchText': new FormControl('', [Validators.required, removeSpaces]),
    });
    this.getChallengeAbuseOptions();
    this.getSearchOptions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.searchUserText();
  }

  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getChallengeAbuseList();
  }

  /**
   * Fetch challenge abuse list
   */
  getChallengeAbuseList() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: getChallengeReportAbuseQuery,
        variables: {
          input: {
            challenge_id: this.challengeAbuseForm.value.filterByChallengeId,
            page: this.currentPage,
            limit: this.pageSizeCount,
            keyword: this.challengeAbuseForm.value.searchText,
            query: this.challengeAbuseForm.value.searchBy,
            status: this.challengeAbuseForm.value.filterByStatus,
            orderBy: this.sorting.sortingByColumn,
            order: this.sorting.sortingOrders[this.sorting.currentOrder]
          }
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.UserListDetails = data['challengeReportAbuseList']['users'];
        const userListDataSource = this.initSelect(data['challengeReportAbuseList']['data']);
        this.challengeAbuseDataList = data['challengeReportAbuseList'];
        this.dataSource = new MatTableDataSource(userListDataSource);
        this.count = this.challengeAbuseDataList['count'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  initSelect = data => {
    return data.map(item => ({
      ...item,
      reportedBy: this.getfiltered(item.reported_by, 'reportedBy'),
      email: this.getfiltered(item.reported_by, 'email'),
      challengeName: this.extractChallengeDetails(item.challenge_id, 'challenge-name'),
      status: this.extractChallengeDetails(item.challenge_id, 'status')
    }));
  };

  getfiltered(cId, type) {
    let res;
    if (this.UserListDetails?.length > 0) {
      res = this.UserListDetails.find(element => element.user_id === cId);
    }
    const firstName:string = res?.first_name;
    const lastName:string  = res?.last_name;
    const email:string = res?.email;
    return type === 'reportedBy' ? firstName + lastName : email;
  }


  /**
   * Fetch Challenge Abuse filter options
   */
  getChallengeAbuseOptions() {
    this._apollo
      .query({
        query: getChallengeByOptionQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.getChallengeAbuseList();
        this.challengeAbuseOptions = data['getChallengesFromBrightSpotOkta'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * Fetch search option list
   */
  getSearchOptions() {
    this._apollo
      .query({
        query: searchByOptionQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.searchOptions = data['getChallengeAbuseSearchByList']['options'];
        this.getFieldRef('searchBy').setValue('email');
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * Extract challenge details by its challenge Id
   */
  extractChallengeDetails(challengeId, whatToReturn) {
    const res = this.challengeAbuseOptions.find(element => element.challengeId === challengeId);
    if (whatToReturn === 'challenge-name') {
      return res?.title === undefined ? 'N/A' : res?.title;
    } else {
      return res?.trash === 'yes' ? 'Archived' : 'Active';
    }
  }

  /**
   *
   * @param field : input field name as string
   * @returns as field reference
   */
  getFieldRef(field: string) {
    return this.challengeAbuseForm.get(field);
  }

  /**
   * Reset search text on value change
   */
  getSearch() {
    if (this.challengeAbuseForm.value.searchText !== '') {
      this.challengeAbuseForm.value.searchText = '';
      this.searchTxtBox.nativeElement.value = '';
      this.getChallengeAbuseList();
    }
  }

  /**
   * Set search by text when option change
   * @returns value as string
   */
  getSearchTxt() {
    switch (this.getFieldRef('searchBy').value) {
      case 'reason':
        return 'Reason';
      case 'email':
        return 'Email Id';
      default:
        return '';
    }
  }

  /**
   * do search when user key in the text box
   */
  searchUserText() {
    const searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
    searchTerms.subscribe(res => {
      if (res && res.length > 0) {
        this.challengeAbuseForm.value.searchText = res;
        this.resetFilter();
      } else {
        this.resetFilter();
      }
    });
  }

  userAction(action: Object, selectedDetails: any) {
    if (action['path'] === 'view') {
      this._router.navigateByUrl(`/content-management/challenge-abuse-details/${selectedDetails.challenge_id}/${selectedDetails.id}`);
    }
  }

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.getChallengeAbuseList();
  }

  // Implementing custom sorting and fetch the sorted data though API.
  customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting.sortingByColumn !== sortingByColumn) {
      this.sorting.currentOrder = 1;
      this.sorting.sortingClickCounter = 0;
    }

    this.sorting.sortingClickCounter++;
    this.sorting.sortingByColumn = sortingByColumn;
    switch (this.sorting.sortingClickCounter) {

      //Ascending order
      case _CONST.one:
        this.sorting.currentOrder = 1;
        break;

      // Descending order
      case _CONST.two:
        this.sorting.currentOrder = 0;
        break;

      // Intial order i.e. descending
      case _CONST.three:
        this.sorting = { ...this._const.CHALLENGE_ABUSE_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('challengeAbuseListing', this.sorting);
    // Calling school list function
    this.getChallengeAbuseList();
  }

}
