import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { schoolMonthlyRegQuery } from 'src/app/core/query/school-dashboard';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
@Component({
  selector: 'app-monthly-registration-school',
  templateUrl: './monthly-registration-school.component.html',
  styleUrls: ['./monthly-registration-school.component.scss']
})
export class MonthlyRegistrationSchoolComponent implements OnInit {
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
        fontSize: 10,
        fontFamily: 'Ubuntu-Regular',
        fontColor:'#757575',
        boxWidth:10,
        // fontStyle: 'bold',
      }
    },
    plugins: {
      datalabels: {
          anchor: 'end',
          align: 'end',
          font:{
            size:6
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
          fontSize: 12,
          fontStyle: 'bold',
        },
      //   gridLines: {
      //     color: 'black',
      // }
      }],
      xAxes: [{
        ticks: { 
          fontColor: 'black',
          fontSize: 11,
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
    
  ];

  public barChartColors: Color[] = [
    { backgroundColor: '#6A7E1B' },
    { backgroundColor: '#AC6206' },

  ]
  monthlyData: any;
  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    ) { }

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
        query: schoolMonthlyRegQuery,
        variables: {
          'input' : opt
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.monthlyData = data['monthalyRegistrationSchool']
        let ucsArray=[];
        this.monthlyData.forEach(element => {
          ucsArray.push(element.ucs);
        });
        
        this.barChartData = [
          { data: ucsArray, label: 'UCS User' },
        ];
        let maxValUCS = Math.max(...ucsArray);
        this.barChartOptions.scales.yAxes[0].ticks.max = maxValUCS;
        setTimeout(() => {
          this.mychart.refresh();
        }, 10);
        
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

}
