import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { soucsUserCountQuery } from '../../../../core/query/soucs-dashboard';
@Component({
  selector: 'app-dashboard-widgets',
  templateUrl: './dashboard-widgets.component.html',
  styleUrls: ['./dashboard-widgets.component.scss']
})

export class DashboardWidgetsComponent implements OnInit {

  card1Content = '0';
  card2contentValue1 = '0';
  card2contentValue2 = '0'
  card3Content = '0';
  countDetails: any;
  studentCount: any=0;
  studentPendingCount: any;
  constructor(private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    public _localStorage: LocalStorageService,
    private readonly _toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getAnalytics() 
  }

  /**
   * Fetch Count 
   */

  getAnalytics() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: soucsUserCountQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.countDetails = data['SoucsUserCountAnalytics'];
        this.card1Content = this.countDetails['totalactiveschools']
        this.card2contentValue1 = this.countDetails['totalucsusers']
        this.card2contentValue2 = this.countDetails['totalguestusers']

      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

}
