import { Component, OnInit, Input, ViewChild, NgZone, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

declare var $: any;
import * as config from '../configs/configs';
declare let d3: any;

@Component({
  selector: 'app-yard-dash',
  templateUrl: './yard-dash.component.html',
  styleUrls: ['./yard-dash.component.css']
})
export class YardDashComponent implements OnInit {


  @Input() config;
  lotSize = 0;
  tableToShow = 0;
  action: any = { heading: "", body: "", details: "" };
  selectedLable = "";
  selectedCat="";
  mapTrailers = [];
  selectedOrder = {};
  trMapConfig: any = { lat: 35.96494, lng: -83.95384, zoom: 10, mapType: 'roadmap', marker: -1 };
  tDate=new Date();

  constructor(private http: Http, private cdr: ChangeDetectorRef) {
    this.getShedTrailers();
    this.getDOTDueTrailers();
    //this.getStateTrailersStatus();
  }

  ngOnInit() {
    let ctrl = this;
    this.futAvlOptions.chart.discretebar.dispatch.elementClick = function (e) {
      //console.log('click-init ' + JSON.stringify(e));
      ctrl.futAvlOrderchartClicked(e);
    };
    this.futAvlOptions.chart.yAxis['tickFormat'] = function (e) {
      //console.log('click-init ' + JSON.stringify(e));
      return parseFloat(e).toFixed(0);
    };
    this.plnVsActoptions.chart.pie.dispatch.elementClick = function (e) {
      //console.log('click-init ' + JSON.stringify(e));
      ctrl.plnVsActchartClicked(e);
    };

    this.plnVsActoptions.chart['color'] = function (d, i) {
      return ctrl.nvd3Colors[i % ctrl.nvd3Colors.length];
    }

    this.futAvlOptions.chart['color'] = function (d, i) {
      return '#00a0dc';
    }
  }

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
      xAxes: [{ barThickness: 20 }]
    }
  };
  nvd3Colors = [
    '#dd4b39',
    '#e68523',
    '#00a0dc',
    '#7cb82f',
    '#8d6cab',
    '#dd5143',
    
    '#00aeb3',
    '#86888a',
    '#dc4b89',
    '#edb220',
    '#7cb82f',
  ];

  OrderStatsResp = false;
  FutureAVLOrdersResp = false;
  toShowPlnVsActTable = false;
  toShowFutAvlTable = false;
  toShowPlnVsActNAPTable = false;
  doDataSyncResp = false;

  public barChartLabels: string[] = ['Moving as planned', 'DSP', 'Inconsistent - STD', 'Inconsistent - STD'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;
  gRowCount = 50;
  futAvlOrder = [];
  allTrailer = [];
  ob = {
    column: [{ name: "Order ID", width: "11%" }, { name: "Movement no.", width: "11%" }, { name: "TMW status", width: "11%" },
    { name: "Order start date.", width: "11%" }, { name: "Order end date", width: "11%" }, { name: "Order origin point", width: "11%" },
    { name: "Planned trailer", width: "11%" }, { name: "Trailer in TMW", width: "11%" }, { name: "Show in map", width: "12%" }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };

  orders = {
    column: [{ name: "Trailer ID", width: "10%" }, { name: "Make", width: "10%" }, { name: "Model/Type", width: "10%" }, 
    { name: "Year", width: "10%" }, { name: "Allocation status", width: "10%" }, { name: "Company", width: "10%" },
    { name: "location", width: "10%" }, { name: "Last ping date", width: "10%" }, { name: "Last DOT done", width: "10%" },
    { name: "Next DOT due", width: "10%" }
  ],
    groups: []
  };

  plnVsActGrid = {
    column: [
      { name: "Trailer ID", width: "10%" }, { name: "Make", width: "10%" }, { name: "Model/Type", width: "10%" }, 
      { name: "Year", width: "10%" }, { name: "Allocation status", width: "10%" }, { name: "Company", width: "10%" },
      { name: "location", width: "10%" }, { name: "Shed status", width: "10%" }, { name: "Last ping date", width: "10%" },
      { name: "Date opened", width: "10%" }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };

  // plnVsActGrid = {
  //   column: [{ name: "Order ID", width: "10%" }, { name: "Movement no.", width: "10%" },{ name: "TMW status", width: "10%" },
  //            { name: "Order start date.", width: "10%" }, { name: "Order end date", width: "10%" },{ name: "Order origin point", width: "10%" }, 
  //            { name: "Planned trailer", width: "10%" },{ name: "Sync data", width: "10%" }, { name: "Trailer in TMW", width: "10%" },  { name: "Show in map", width: "10%" }],
  //   groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  // };
  historyConfig: any = { showHistory: false, allTraillerSubSet: [], dataSet: [], backupDS: [], backupATS: [] };

  colorsOPs = ['red'];
  dataSet = [];
  pack = [];


  futAvlOrderchartClicked(e) {
    this.gRowCount = 50;
    this.allTrailer = e.data.list;
    this.tableToShow = 3;
    this.selectedLable = "DOT due - "+e.data.label;
    this.toShowPlnVsActTable = false;
    this.toShowFutAvlTable = true;
    this.toShowPlnVsActNAPTable = false;
    this.historyConfig.showHistory = false;
  }
  getGridData(item) {
    this.gRowCount = 50;
    this.allTrailer = item.list;
    this.tableToShow = 2;
    this.selectedLable = "Shed status - "+item.label;
    this.selectedCat = item.label;
    this.toShowFutAvlTable = false;
    this.toShowPlnVsActNAPTable = true;
    if (item.label == "OPEN") {
      this.plnVsActGrid.column[9].name="Date opened";
    } else if (item.label == "PENDING") {
      this.plnVsActGrid.column[9].name="Date opened";
    } else if (item.label == "COMPLETE") {
      this.plnVsActGrid.column[9].name="Date complete";
    } else if (item.label == "CLOSED") {
      this.plnVsActGrid.column[9].name="Date closed";      
    }
  }
  plnVsActchartClicked(e) {
    this.gRowCount = 50;
    this.allTrailer = e.data.list;
    this.tableToShow = 2;
    this.selectedLable = "Shed status - "+e.data.label;
    this.selectedCat = e.data.label;
    this.toShowFutAvlTable = false;
    this.toShowPlnVsActNAPTable = true;
    if (e.data.label == "OPEN") {
      this.plnVsActGrid.column[9].name="Date opened";
    } else if (e.data.label == "PENDING") {
      this.plnVsActGrid.column[9].name="Date opened";
    } else if (e.data.label == "COMPLETE") {
      this.plnVsActGrid.column[9].name="Date complete";
    } else if (e.data.label == "CLOSED") {
      this.plnVsActGrid.column[9].name="Date closed";      
    }  
  }

  public barChartData: any[] = [
    {
      data: [65, 59, 80, 90], label: 'Series A',
      backgroundColor: [
        '#22466f', '#22466f', '#22466f', '#22466f'
      ]
    }

  ];

  pieOption = {
    chart: {
      type: 'pieChart',
      height: 500,
      x: function (d) { return d.label; },
      y: function (d) { return d.value; },
      showLabels: true,
      duration: 500,
      labelThreshold: 0.01,
      labelSunbeamLayout: true,
      legend: {
        margin: {
          top: 5,
          right: 35,
          bottom: 5,
          left: 0
        }
      }
    }
  };


  plnVsActdata = [];

  plnVsActoptions = {
    chart: {
      type: 'pieChart',
      height: 340,
      donut: true,
      labelType: 'percent',
      growOnHover: true,
      labelsOutside: false,
      donutLabelsOutside: false,
      showLegend: false,
      legendPosition: 'bottom',
      x: function (d) { return d.label; },
      y: function (d) { return d.value; },
      showLabels: true,
      duration: 500,
      tooltip: {
        enabled: false
      },
      legend: {
        align: false,
        padding: 50,
        margin: {
          top: 5,
          right: 30,
          bottom: 0,
          left: 0
        }
      },
      dispatch: {
        tooltipShow: function (e) { console.log('tooltipShow') },
        tooltipHide: function (e) { console.log('tooltipHide') },
      },
      pie: {
        margin: {
          top: -20,
          right: 50,
          bottom: 10,
          left: 0
        },
        dispatch: {
          elementClick: function (e) {
            console.log('click ' + JSON.stringify(e));

          },
        }
      },
    },
    title: {
      enable: true,
      text: 'Status',
      className: 'h4'
    }
  };

  futAvlData = [];

  futAvlOptions = {
    chart: {
      type: 'discreteBarChart',
      height: 320,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      x: function (d) { return d.label; },
      y: function (d) { return d.value + (1e-10); },
      showValues: true,
      valueFormat: function (d) {
        return d3.format(',.0f')(d);
      },
      duration: 500,
      xAxis: {
        //axisLabel: 'Future 7 days'
      },
      yAxis: {
        //axisLabel: 'No. of trailers',
        axisLabelDistance: -10
      },
      discretebar: {
        dispatch: {
          elementClick: function (e) {
            console.log('click ' + JSON.stringify(e));

          },
        }
      }
    }
  };

  getShedTrailers() {
    let url = config.baseUrl + "/YardMGMTService/api/ShedTrailers";
    //let url = config.baseUrl + "/HomeService/api/OrderTrailerTrack";
    this.OrderStatsResp = false;
    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("orderStats data recieved");
        this.dataSet = data.dataSet;
        var bag = [
          {
            "label": "OPEN",
            "value": 0,
            "list": []
          },
          {
            "label": "PENDING",
            "value": 0,
            "list": []
          },
          {
            "label": "COMPLETE",
            "value": 0,
            "list": []
          },
          {
            "label": "CLOSED",
            "value": 0,
            "list": []
          }

        ];
        this.lotSize = 0;
        data.dataSet.forEach(element => {
          if (element.shedStatus == "OPEN") {
            bag[0].value++;
            bag[0].list.push(element);
            this.lotSize++;
          } else if (element.shedStatus == "CLOSED") {
            bag[3].value++;
            bag[3].list.push(element);
            this.lotSize++;
          } else if (element.shedStatus == "PENDING") {
            bag[1].value++;
            bag[1].list.push(element);
            this.lotSize++;
          } else if (element.shedStatus == "COMPLETE") {
            bag[2].value++;
            bag[2].list.push(element);
            this.lotSize++;
          }
           else { }
        });
        
        if (data.dataSet.length > 0) {
          //this.lotSize=data.dataSet.length;
          this.plnVsActdata = bag;
        } else {
          this.plnVsActdata = bag;
          this.lotSize = 0;
        }
        //}
        this.OrderStatsResp = true;

      }, //For Success Response
      (err) => {
        console.log("StatesTrailerCounts error recieved");
        this.OrderStatsResp = true;
      } //For Error Response
      );
  }

  getDOTDueTrailers() {
    let url=config.baseUrl + "/YardMGMTService/api/DOTDueTrailers"
    //let url = config.baseUrl + "/HomeService/api/FutureAVLOrders";
    this.FutureAVLOrdersResp = false;

    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("getFutureAVLOrders data recieved");
        var bag = { key: "", values: [] };
        
        for (let i = 0; i < 7; i++) {
          let date=new Date();
          date.setDate(date.getDate() + i );
          var str=(date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
          var obj = {
            "label": str,
            "value": 0,
            "list": []
          };
          bag.values.push(obj);
        }

        let dataExist=false;
     
        data.dataSet.forEach(element => {
          if(element.dOTDueDays<=7){
            dataExist=true;
            bag.values[element.dOTDueDays-1].list.push(element);
            bag.values[element.dOTDueDays-1].value++;
          }
        });
        this.futAvlData = [];
        this.futAvlOrder = data.dataSet;
        
        if (dataExist) {
          console.log(bag);  
          this.futAvlData.push(bag);
        }

        this.FutureAVLOrdersResp = true;

      }, //For Success Response
      (err) => {
        console.log("getFutureAVLOrders error recieved");
        this.FutureAVLOrdersResp = true;

      } //For Error Response
      );
  }

  tableScrolled(this: any) {
    console.log("scrolling");
    var raw = document.getElementById('tgBody');
    if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {

      this.gRowCount += 100;
      if (this.gRowCount > this.allTrailer.length) {
        this.gRowCount = this.allTrailer.length;
      }
    }
  }

  formatDateTime(item: any, choice) {
    if (!item) {
      return item;
    }
    else if (item != "") {
      //var str=item.toUpperCase();
      if (item.toUpperCase() != "UNKNOWN") {
        var ary = item.split(' ');
        var date = ary[0].split('-');
        var newD = new Date(date[0], date[1] - 1, date[2]);
        var tim = ary[1].split('.');
        //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
        if (choice == 0) {
          var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear();
        }
        else if (choice == 1) {
          var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + tim[0];
        }
        return SDate;
      } else {
        return item;
      }
    } else {
      return item;
    }

  }

}

