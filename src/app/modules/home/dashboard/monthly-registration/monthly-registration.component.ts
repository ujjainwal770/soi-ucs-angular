import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { soucsMonthlyRegQuery } from '../../../../core/query/soucs-dashboard'
@Component({
  selector: 'app-monthly-registration',
  templateUrl: './monthly-registration.component.html',
  styleUrls: ['./monthly-registration.component.scss']
})
export class MonthlyRegistrationComponent implements OnInit {
  years=[];
  blinkArry=[]  
  applicationRange:any=1000;
  selectedYearRange=new Date().getFullYear();

  @ViewChild(BaseChartDirective, { static: true }) private mychart;
  public barChartOptions: ChartOptions = {
    responsive: true,

    // legend: { display: false },
    legend: {
      position: 'top',
      align:'center',
      
      labels: {
        fontSize: 14,
        fontFamily: 'Ubuntu-Regular',
        fontColor:'#757575',
        boxWidth:18,
        // fontStyle: 'bold',
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
    },
    
    scales : {
      yAxes: [{
        gridLines: { display: false },
        ticks: { 
          fontColor: '#757575',
          beginAtZero: true,
          max : this.applicationRange,
          fontSize: 14,
          fontStyle: 'bold',
        },
      //   gridLines: {
      //     color: 'black',
      // }
      }],
      xAxes: [{
        ticks: { 
          fontColor: 'black',
          fontSize: 14,
          fontStyle: 'bold',
          // fontFamily: 'Ubuntu-Medium',
          padding: 0,
        },
        
      }],
      
    }
  };
  barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0,0], label: 'UCS User' },
    { data: [0, 0, 0, 0, 0, 0, 0], label: 'Public User' },
    
  ];

  public barChartColors: Color[] = [
    { backgroundColor: '#6A7E1B' },
    { backgroundColor: '#AC6206' },

  ]
  monthlyData: any;
  constructor(private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _localStorage: LocalStorageService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getYears()
    this.getAnalytics(this.selectedYearRange)
  }

  getYears() {
    let j = new Date().getFullYear();
    // let i= 2021;
    // this.selected= 2021;
    for (let i= 2021; i<=j; i++) {
      this.years.push(i)
    }

    
  }
  getAnalytics(opt) {
    this,this.selectedYearRange = opt
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: soucsMonthlyRegQuery,
        variables: {
          'input' : opt
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.monthlyData = data['monthalyRegistrationSoucs']
        let guestArray=[];
        let ucsArray=[];
        this.monthlyData.forEach(element => {
          ucsArray.push(element.ucs);
          guestArray.push(element.public)
        });
        
        this.barChartData = [
          { data: ucsArray, label: 'UCS User' },
          { data: guestArray, label: 'Public User' }
        ];
        let maxValUCS = Math.max(...ucsArray);
        let maxValGuest = Math.max(...guestArray);
        let maxValue = Math.max(maxValUCS,maxValGuest);
        this.applicationRange = Math.ceil(maxValue / Math.pow(10, Math.floor(Math.log10(maxValue)))) * Math.pow(10, Math.floor(Math.log10(maxValue)));        
        this.barChartOptions.scales.yAxes[0].ticks.max = this.applicationRange;
        setTimeout(() => {
          this.mychart.refresh();
        }, 10);
        
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

}
