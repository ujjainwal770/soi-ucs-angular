import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { soucsDashboardLeaderboardQuery } from '../../../../core/query/soucs-dashboard';

export interface TopSchoolData {

  id: Number,
  schoolName: String,
  stateName: String,
  cityName: String,
  totalpoints: Number
}
export interface TopUserData {

  id: Number,
  first_name: String,
  last_name: String,
  schoolName: String,
  stateName: String,
  totalpoints: Number
}
@Component({
  selector: 'app-dashboard-schools-users',
  templateUrl: './dashboard-schools-users.component.html',
  styleUrls: ['./dashboard-schools-users.component.scss']
})
export class DashboardSchoolsUsersComponent implements OnInit {
  top10SchooldataSource = new MatTableDataSource<TopSchoolData>();
  displayedColumns: string[] = ['No', 'schoolName', 'stateName', 'cityName', 'totalpoints'];
  top10UsersdataSource = new MatTableDataSource<TopUserData>();
  displayedColumns2: string[] = ['name', 'schoolName', 'totalpoints'];
  top10GuestdataSource = new MatTableDataSource<TopUserData>();
  displayedColumns3: string[] = ['name', 'cityName', 'stateName', 'totalpoints'];
  @ViewChild(MatSort) sort: MatSort;
  selected = 1
  schoolList: any;
  constructor(private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _localStorage: LocalStorageService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAnalytics();
  }
  /**
   * Fetch Count 
   */

  getAnalytics() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: soucsDashboardLeaderboardQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.top10SchooldataSource = new MatTableDataSource(data['soucsDashboardLeaderboard']['topschool']);
        this.top10SchooldataSource.sort = this.sort;

        this.top10GuestdataSource = new MatTableDataSource(data['soucsDashboardLeaderboard']['topguestusers']);
        this.top10GuestdataSource.sort = this.sort;

        this.schoolList = data['soucsDashboardLeaderboard']['ucsschools']
        let uscUserlist = this.initSelect(data['soucsDashboardLeaderboard']['topucsusers']);
        this.top10UsersdataSource = new MatTableDataSource(uscUserlist);
        this.top10UsersdataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  getfilteredSchools(schoolID) {
    let res = this.schoolList.find(element => element.id === schoolID);
    return res?.schoolName
  }
  initSelect = (data) => {
    return data.map(item => ({
      ...item,
      schoolName: this.getfilteredSchools(item.school_id)
    }))
  }
}
