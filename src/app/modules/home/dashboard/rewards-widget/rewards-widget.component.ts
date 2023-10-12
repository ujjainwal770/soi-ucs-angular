import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { getSchoolTopRewardApplicants, getSchoolTopRewards, getSoucsTopRewardApplicants, getSoucsTopRewards } from 'src/app/core/query/rewards';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-rewards-widget',
  templateUrl: './rewards-widget.component.html',
  styleUrls: ['./rewards-widget.component.scss']
})
export class RewardsWidgetComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  top10RewardApplicants = {
    displayedColumns: ['userName', 'userType', 'totalRewardSubmitted', 'totalRewardsWon'],
    dataSource: new MatTableDataSource([]),
    challengeCategories: null
  };

  top10Rewards = {
    displayedColumns: ['rewardName', 'userSubmissionNo', 'winnerName', 'userType'],
    dataSource: new MatTableDataSource([]),
    challengeCategories: null
  };

  isSchoolAdmin: boolean;

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.isSchoolAdmin = this._localStorage.isSchoolAdmin();
    this.getTopRewardApplicants();
    this.getTopRewards();
  }
  // API to fetch top 10 reward applicants.
  getTopRewardApplicants() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: this.isSchoolAdmin ? getSchoolTopRewardApplicants : getSoucsTopRewardApplicants,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        let dt = this.isSchoolAdmin ? data['schoolRewardApplicantBoard'] : data['soucsRewardApplicantBoard'];
        this.top10RewardApplicants.dataSource = new MatTableDataSource(dt['rewardsApplicant']);
        this.top10RewardApplicants.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  // Fetch top 10 rewards
  getTopRewards() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: this.isSchoolAdmin ? getSchoolTopRewards : getSoucsTopRewards,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        let dt = this.isSchoolAdmin ? data['schoolRewardsLeaderboard'] : data['soucsRewardsLeaderboard'];
        this.top10Rewards.dataSource = new MatTableDataSource(dt['rewards']);
        this.top10Rewards.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
}
