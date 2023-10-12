import { Component, OnInit,ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective, Label, SingleDataSet } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { soucsBadgesQuery } from '../../../../core/query/soucs-dashboard';
@Component({
  selector: 'app-badges-earned',
  templateUrl: './badges-earned.component.html',
  styleUrls: ['./badges-earned.component.scss']
})
export class BadgesEarnedComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: true }) private chart;
  public pieChartOptions:  ChartConfiguration['options'] = {
    responsive: true,
    legend: {
      display: true,
      position: 'right',
      align:'center',
      labels: {
        fontSize: 12,
        fontFamily: 'Ubuntu-Regular',
        fontColor:'#757575',
        boxWidth:14
      }

    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        font:{
          size:12
        }
      }
    }
  };

  public pieChartLabels: Label[] = ['Inclusion Rookie', 'Inclusion Pro','Inclusion Captain', 'Inclusion Champion','Inclusion Hall of Famer'];
  public pieChartData: SingleDataSet = [0, 0, 0,0,0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  pieChartPlugins=[]
  pieChartColor:any = [
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
  constructor(private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _localStorage: LocalStorageService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAnalytics()
  }
  getAnalytics() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: soucsBadgesQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.badgesCounts= data ['InclusionBadgeSoucsDashboard'];
        this.setBadgeData();        
        // setTimeout(() => {
        //   this.chart.refresh();
        // }, 10);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  setBadgeData() {
    this.badgesCounts.forEach(element => {
      if(element.badge === 'rookie') {
        this.rookieCount = element.percent
      } else if(element.badge === 'pro') {
        this.proCount = element.percent
      } else if(element.badge === 'captain') {
        this.captainCount = element.percent
      } else if(element.badge === 'champion') {
        this.championCount = element.percent
      } else if(element.badge === 'hall of famer') {
        this.famerCount = element.percent
      }

     });
    this.pieChartData = [this.rookieCount,this.proCount,this.captainCount,this.championCount,this.famerCount]
  }

}
