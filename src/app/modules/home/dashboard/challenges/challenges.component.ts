import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { soucsChallengeIDQuery, soucsChallengeTitleQuery } from '../../../../core/query/soucs-dashboard';
export interface TopChallengeData {

  challengeId: number,
  title: string,
  badgeCategory: string,
  participants: number
}
@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss']
})
export class ChallengesComponent implements OnInit {
  datasource = new MatTableDataSource<TopChallengeData>();
  displayedColumns: string[] = ['title', 'participants', 'category'];
  @ViewChild(MatSort) sort: MatSort;
  challengeDetails: any;
  challengeCategories: any = [];
  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
  ) { }

  ngOnInit(): void {
    this.getChallengesTitle();
    //this.getAnalytics();

  }
  getAnalytics() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: soucsChallengeIDQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.challengeDetails = data['topChallegesPlayedByAll'];
        let Challengelist = this.initSelect(data['topChallegesPlayedByAll']);
        let chList = [];
        Challengelist.forEach(element => {
          if (element.title && element.categoryname) {
            chList.push(element)
          }
        });
        this.datasource = new MatTableDataSource(chList);
        this.datasource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /* fetch challenges title category*/

  getChallengesTitle() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: soucsChallengeTitleQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.challengeCategories = data['getChallengesFromBrightSpotOkta'];
        this.getAnalytics();
        // console.log(this.challengeCategories)
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
    let res = this.challengeCategories.find(element => element.challengeId === cid);
    return type === 'category' ? res?.badgeCategory : res?.title;
  }

}
