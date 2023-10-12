import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { getRewardsDetail } from '../../../../core/query/rewards';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { UtilityService } from '../../../../core/services/utility.service';
import { _CONST } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-view-reward-details',
  templateUrl: './view-reward-details.component.html',
  styleUrls: ['./view-reward-details.component.scss']
})
export class ViewRewardDetailsComponent implements OnInit {

  displayedColumns: string[] = ['fullName', 'email', 'date_of_birth', 'ucs_status', 'schoolName', 'reportabusecount', 'actions'];
  dataSource: any = new MatTableDataSource<[]>();
  pageSizes: any = _CONST.defaultPageSizeArray;
  pageSizeCount: number;
  userId: any = 0;
  rewardId: any = 0;
  count = 0;
  currentPage = 0;
  nextPage: number;

  rewardsDetail: any;
  isWinnerSelected = false;
  daysLeft: number;
  isMarkAsWinnerApplicable = false;
  serverCurrentDate: number;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _toastr: ToastrService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _activateRouter: ActivatedRoute,
    private readonly _dialogsService: DialogsService,
    private readonly _utilityService: UtilityService
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this._activateRouter.params.subscribe(param => {
      this.rewardId = param.id;
    });
    this.fetchRewardsDetail();
  }

  /**
   * Fetch Rewards Details
   */
  fetchRewardsDetail() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: getRewardsDetail,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount,
          userId: parseFloat(this.userId),
          rewardId: parseFloat(this.rewardId)
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['rewardDetailsView'];
        this.rewardsDetail = dt['rewardDetails'];
        const revisedUserData = this.getRevisedUserData(dt['users']);
        this.serverCurrentDate = data['rewardDetailsView']['currentTime'];
        this.daysLeft = dt["rewardDetails"]["rewardEndingCount"];
        const markAsWinnerDateDiff = this._utilityService.getDateDiffInDays(this.rewardsDetail?.closingDate, this.serverCurrentDate);

        // Can mark as winner if closing date is exceeded. i.e. closing date - current date = -1 or less.
        if (markAsWinnerDateDiff < 0) {
          this.isMarkAsWinnerApplicable = true;
        }
        this.dataSource = new MatTableDataSource(revisedUserData);
        this.count = data['rewardDetailsView']['count'];
        this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error);
      });
  }

  // Pick the winning user and push them into the first position of the user list.
  getRevisedUserData(userData) {
    const revisedUserData = [];
    for (const user of userData) {
      if (user.winnerStatus > 0) {
        this.isWinnerSelected = true;
        revisedUserData.unshift(user);
      } else {
        revisedUserData.push(user);
      }
    }
    return revisedUserData;
  }

  /**
 * Paginator change event when next previous button click and size drop down change
 * @param e as PageEvent
 */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.fetchRewardsDetail();
  }


  markAsWinner(userId, name) {
    const pgtitle = 'Winner!';
    const message = `Are you sure you want to mark “${name}” as the winner?`;
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          if (userId) {
            this.userId = userId;
          }
          if (this.userId > 0) {
            this.fetchRewardsDetail();
          } else {
            this._toastr.error('User Id is missing. Please check.');
          }
        }
      });
  }

  back() {
    if (this.isWinnerSelected) {
      this._router.navigate(['/rewards/archive-rewards']);
    } else {
      this._router.navigate(['/rewards/rewards-list']);
    }
  }
}

