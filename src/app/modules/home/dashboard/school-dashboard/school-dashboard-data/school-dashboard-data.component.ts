import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { schoolBadgesQuery, schoolChallengeIDQuery, schoolChallengeTitleQuery, schoolDashboardLeaderboardQuery } from 'src/app/core/query/school-dashboard';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';

@Component({
  selector: 'app-school-dashboard-data',
  templateUrl: './school-dashboard-data.component.html',
  styleUrls: ['./school-dashboard-data.component.scss']
})
export class SchoolDashboardDataComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  top10schools = {
    displayedColumns: ['sNo', 'schoolName', 'stateName', 'cityName', 'totalpoints'],
    dataSource: new MatTableDataSource([])
  };

  top10Students = {
    displayedColumns: ['full_name', 'email', 'totalpoints'],
    dataSource: new MatTableDataSource([])
  };

  top10Challengs = {
    displayedColumns: ['title', 'participants', 'category'],
    dataSource: new MatTableDataSource([]),
    challengeCategories: null
  };

  /**
   * Badge earned percentage
   * variable declaration start.
   */
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    legend: {
      display: true,
      position: 'right',
      align: 'center',
      labels: {
        fontSize: 12,
        fontFamily: 'Ubuntu-Regular',
        fontColor: '#757575',
        boxWidth: 14
      }

    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 12
        }
      }
    }
  };

  public pieChartLabels: Label[] = ['Inclusion Rookie', 'Inclusion Pro', 'Inclusion Captain', 'Inclusion Champion', 'Inclusion Hall of Famer'];
  public pieChartData: SingleDataSet = [0, 0, 0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  pieChartPlugins = []
  pieChartColor: any = [
    {
      backgroundColor: ['#6B6DE2',
        '#9F5DA6',
        '#FAA828',
        '#58C3B0',
        '#EE1755'
      ]
    }
  ]
  badgesCounts: any;
  rookieCount: any;
  proCount: any;
  captainCount: any;
  championCount: any;
  famerCount: any;
  /**
   * Badge earned percentage
   * variable declaration end.
   */

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.getTopSchoolsAndStudents();
    this.getTopChallenges();
    this.getAllChallenges();
    this.getBadgeEarnedData();
  }

  getTopSchoolsAndStudents() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: schoolDashboardLeaderboardQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        let dt = data['schoolAdminDashboardLeaderboard'];
        this.top10schools.dataSource = new MatTableDataSource(dt['topschool']?.schools);
        this.top10schools.dataSource.sort = this.sort;

        this.top10Students.dataSource = new MatTableDataSource(dt['topusers']);
        this.top10Students.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  getAllChallenges() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: schoolChallengeTitleQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        let dt = data['getChallengesFromBrightSpotOktaForSchool'];
        this.top10Challengs.challengeCategories = dt;
        this.getTopChallenges();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  getTopChallenges() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: schoolChallengeIDQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        let dt = data['topChallegesPlayedBySchool'];
        let Challengelist = this.initSelect(dt);
        let chList = [];
        Challengelist.forEach(element => {
          if (element.title && element.categoryname) {
            chList.push(element)
          }
        });
        this.top10Challengs.dataSource = new MatTableDataSource(chList);
        this.top10Challengs.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  initSelect = (data) => {
    return data.map(item => ({
      ...item,
      categoryname: this.getfilteredCategories(item.challenge_id, 'category'),
      title: this.getfilteredCategories(item.challenge_id, 'title'),
    }))
  }
  getfilteredCategories(cid, type) {
    let res = this.top10Challengs.challengeCategories?.find(element => element.challengeId === cid);
    return type === 'category' ? res?.badgeCategory : res?.title;
  }

  getBadgeEarnedData() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: schoolBadgesQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.badgesCounts = data['InclusionBadgeSchoolDashboard'];
        this.setBadgeData();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  setBadgeData() {
    this.badgesCounts.forEach(element => {
      if (element.badge === 'rookie') {
        this.rookieCount = element.percent
      } else if (element.badge === 'pro') {
        this.proCount = element.percent
      } else if (element.badge === 'captain') {
        this.captainCount = element.percent
      } else if (element.badge === 'champion') {
        this.championCount = element.percent
      } else if (element.badge === 'hall of famer') {
        this.famerCount = element.percent
      }

    });
    this.pieChartData = [this.rookieCount, this.proCount, this.captainCount, this.championCount, this.famerCount]
  }
}
