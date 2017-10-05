import { Component, OnInit, Input, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

declare var $: any;
import * as config from '../configs/configs';

@Component({
  selector: 'app-order-dash',
  templateUrl: './order-dash.component.html',
  styleUrls: ['./order-dash.component.css']
})
export class OrderDashComponent implements OnInit {
  
  lotSize=0;
  tableToShow=0;
  action: any = { heading: "", body: "",details: ""};

  constructor(private http: Http, private cdr: ChangeDetectorRef) {
    this.getOrderStats();
    this.getFutureAVLOrders();
    //this.getStateTrailersStatus();
  }

  ngOnInit() {
    let ctrl=this;
    this.futAvlOptions.chart.discretebar.dispatch.elementClick=function(e){
      //console.log('click-init ' + JSON.stringify(e));
      ctrl.futAvlOrderchartClicked(e);
    };
    this.plnVsActoptions.chart.pie.dispatch.elementClick=function(e){
      //console.log('click-init ' + JSON.stringify(e));
      ctrl.plnVsActchartClicked(e);
    };
    
    this.futAvlOptions.chart['color'] = function (d, i) {
      return ctrl.nvd3Colors[i % ctrl.nvd3Colors.length];
    }

    this.futAvlOptions.chart['color'] = function (d, i) {
      return ctrl.nvd3Colors[0];
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
    '#00a0dc',
    '#8d6cab',
    '#dd5143',
    '#e68523',
    '#00aeb3',
    '#86888a',
    '#dc4b89',
    '#edb220',
    '#7cb82f',
  ];

  OrderStatsResp=false;
  FutureAVLOrdersResp=false;
  toShowPlnVsActTable=false;
  toShowFutAvlTable=false;
  toShowPlnVsActNAPTable=false;
  doDataSyncResp=false;

  public barChartLabels: string[] = ['Moving as planned', 'Not dispatched', 'Not as per plan', 'Not as per plan'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;
  gRowCount = 50;
  futAvlOrder=[];
  allTrailer = [];
  ob = {
    column: [{ name: "Order ID", width: "11%" }, { name: "Movement no.", width: "11%" },{ name: "TMW status", width: "11%" },
    { name: "Order start date.", width: "11%" }, { name: "Order end date", width: "11%" },{ name: "Order origin point", width: "11%" },
    { name: "Planned trailer", width: "11%" }, { name: "Trailer in TMW", width: "11%" },{ name: "Status in TMW", width: "12%" }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };

  orders = {
    column: [{ name: "Order ID", width: "11%" }, { name: "Movement no.", width: "11%" }, { name: "Bill to name", width: "11%" }, { name: "Origin city", width: "11%" }, { name: "Destination city", width: "11%" }, { name: "Order origin point", width: "11%" },
    { name: "Order start date", width: "11%" }, { name: "Order end date", width: "11%" }, { name: "Order remark", width: "12%" }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };

  plnVsActGrid = {
    column: [{ name: "Order ID", width: "10%" }, { name: "Movement no.", width: "10%" },{ name: "TMW status", width: "10%" },
             { name: "Order start date.", width: "10%" }, { name: "Order end date", width: "10%" },{ name: "Order origin point", width: "10%" }, 
             { name: "Planned trailer", width: "10%" }, { name: "Trailer in TMW", width: "10%" }, { name: "Status in TMW", width: "10%" }, { name: "Sync. with TMW", width: "10%" }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };
  historyConfig:any={showHistory:false,allTraillerSubSet:[],dataSet:[],backupDS:[],backupATS:[]};

  colorsOPs = ['red'];
  dataSet = [];
  pack = [];
  

  futAvlOrderchartClicked(e){
    this.gRowCount=50;
    this.allTrailer=e.data.list;
    this.tableToShow=3;
    this.toShowPlnVsActTable=false;
    this.toShowFutAvlTable=true;
    this.toShowPlnVsActNAPTable=false;
    this.historyConfig.showHistory = false;
  }
  getGridData(item){
    this.gRowCount=50;
    this.allTrailer=item.list;
    if(item.label=="Not as per plan"){
      this.tableToShow=2;
      this.toShowFutAvlTable=false;
      this.toShowPlnVsActTable=false;
      this.toShowPlnVsActNAPTable=true;
      this.historyConfig.showHistory =false;
    } else {
      this.tableToShow=1;
      this.toShowFutAvlTable = false;
      this.toShowPlnVsActTable = true;
      this.toShowPlnVsActNAPTable=false;
      this.historyConfig.showHistory = false;
    }
  }
  plnVsActchartClicked(e){
    this.gRowCount=50;
    this.allTrailer=e.data.list;
    if(e.data.label=="Not as per plan"){
      this.tableToShow=2;
      this.toShowFutAvlTable=false;
      this.toShowPlnVsActTable=false;
      this.toShowPlnVsActNAPTable=true;
      this.historyConfig.showHistory = false;
    } else {
      this.tableToShow=1;
      this.toShowFutAvlTable = false;
      this.toShowPlnVsActTable = true;
      this.toShowPlnVsActNAPTable=false;
      this.historyConfig.showHistory = false;
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

  pieOption= {
    chart: {
        type: 'pieChart',
        height: 500,
        x: function(d){return d.label;},
        y: function(d){return d.value;},
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
        axisLabel: 'Future 7 days'
      },
      yAxis: {
        axisLabel: 'No. of orders',
        axisLabelDistance: -10
      },
      discretebar:{
        dispatch: {
          elementClick: function (e) {
            console.log('click ' + JSON.stringify(e));
            
          },
        }
      }
    }
  };

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  closeHistory(){
    if(this.tableToShow==1){
      this.toShowPlnVsActTable = true;
    }else if(this.tableToShow==2){
      this.toShowPlnVsActNAPTable=true;
    }else if(this.tableToShow==3){
      this.toShowFutAvlTable = true;
    }
  }

  showTrHistory(item) {
    this.toShowFutAvlTable = false;
    this.toShowPlnVsActTable = false;
    this.toShowPlnVsActNAPTable=false;
    this.historyConfig['trailer'] = item;
    this.historyConfig.showHistory = true;
    this.getTrailerPingHistory(item);
  }

  getTrailerPingHistory(item:any) {
    this.historyConfig.allTraillerSubSet=[];
    this.historyConfig.dataSet = [];
    this.historyConfig.backupATS = [];
    this.historyConfig.backupDS = [];
    this.historyConfig.thResp = false;
    let url = config.baseUrl + "/HomeService/api/TrailerPingHistory?trailerID="+item;
    //let url = config.baseUrl + "/HomeService/api/TrailerHistory?trailerID=" + this.selectedMarker.trailerID;
    this.http.get(url).map(res => res.json())
        .subscribe(
        (data) => {
            console.log("StatesTrailerCounts data recieved");
            this.historyConfig.dataSet = data.dataSet;
            this.historyConfig.backupDS = data.dataSet;
            if (data.dataSet.length > 0) {
                
                for (let i = 0; i < data.dataSet.length; i++) {
                    var item = data.dataSet[i];
                    
                    if(item.eventDateValues.length>0){
                        for (let j = 0; j < item.eventDateValues.length; j++) {
                            var ent=item.eventDateValues[j];
                            ent['eDate']=item.eventDate;
                            this.historyConfig.allTraillerSubSet.push(ent);
                            this.historyConfig.backupATS.push(ent);

                        }
                    }
                    
                }
            }
            console.log(this.historyConfig);
            this.historyConfig.thResp = true;
        }, //For Success Response
        (err) => {
            console.log("StatesTrailerCounts error recieved");
            this.historyConfig.thResp = true;
        } //For Error Response
        );
}

  getOrderStats() {
    let url = config.baseUrl + "/HomeService/api/OrderTrailerTrack";
    this.OrderStatsResp=false;
    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("orderStats data recieved");
        this.dataSet = data.dataSet;
        var bag= [
            {
              "label": "Moving as planned",
              "value": 0,
              "list": []
            },
            {
              "label": "Not dispatched",
              "value": 0,
              "list": []
            },
            {
              "label": "Not as per plan",
              "value": 0,
              "list": []
            }
            
          ];
        
        data.dataSet.forEach(element => {
          if (element.isMovingAsPlanned == 1) {
            bag[2].value++;
            bag[2].list.push(element);
          } else if (element.isMovingAsPlanned == 2) {
            bag[1].value++;
            bag[1].list.push(element);
          } else if (element.isMovingAsPlanned == 3) {
            bag[2].value++;
            bag[2].list.push(element);
          } else if (element.isMovingAsPlanned == 4) {
            bag[0].value++;
            bag[0].list.push(element);
          } else if (element.isMovingAsPlanned == 5) {
            bag[2].value++;
            bag[2].list.push(element);
          }else { }
        });
        if(data.dataSet.length>0){
          this.lotSize=data.dataSet.length;
          this.plnVsActdata=bag;
        }else{
        this.plnVsActdata=bag;
        this.lotSize=0;
        }
        //}
        this.OrderStatsResp=true;

      }, //For Success Response
      (err) => {
        console.log("StatesTrailerCounts error recieved");
        this.OrderStatsResp=true;
      } //For Error Response
      );
  }

  getFutureAVLOrders() {
    let url = config.baseUrl + "/HomeService/api/FutureAVLOrders";
    this.FutureAVLOrdersResp=false;

    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("getFutureAVLOrders data recieved");
        this.futAvlOrder = data.dataSet;
        var bag={key:"",values:[]}
        this.futAvlOrder.forEach(element => {
          var obj={
            "label": "",
            "value": 0,
            "list":[]
          };
          obj.label=element.orderStartDate;
          obj.value=element.orderStartDateValues.length;
          obj.list=element.orderStartDateValues;
          bag.values.push(obj);
        });
        this.futAvlData=[];
        this.futAvlData.push(bag);
        this.FutureAVLOrdersResp=true;

      }, //For Success Response
      (err) => {
        console.log("getFutureAVLOrders error recieved");
        this.FutureAVLOrdersResp=true;

      } //For Error Response
      );
  }

  doDataSync(item) {
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
    let options = new RequestOptions({ headers: headers });
    let url = config.baseUrl + "/HomeService/api/UpdateTMWTrailerInOrderAllocation";
    this.doDataSyncResp=false;
    var body={"OAID":item.oAID,"tMSTrailerID":item.tMSTrailerID,"tMWOrderTrailerID":item.tMWOrderTrailerID};

    this.http.post(url, body, options).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("doDataSync data recieved");
        this.doDataSyncResp=true;
        if(data.status==1){
          this.action.heading="Data Sync.";
          this.action.body="Successfully synchronized data in TMS";
          $('#result').modal('show');
          this.toShowFutAvlTable = false;
          this.toShowPlnVsActTable = false;
          this.toShowPlnVsActNAPTable=false;
          this.historyConfig.showHistory = false;
          this.getOrderStats();
        }else{
          this.action.heading="Data Sync.";
          this.action.body="Error in synchronizing data in TMS";
          $('#result').modal('show');
        }

      }, //For Success Response
      (err) => {
        console.log("doDataSync error recieved");
        this.doDataSyncResp=true;
        this.action.heading="Data Sync.";
        this.action.body="Error in synchronizing data";
        $('result').modal('show');
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

  readyDdata() {
    var one = { length: 0, list: [] };
    var two = { length: 0, list: [] };
    var three = { length: 0, list: [] };
    var four = { length: 0, list: [] };
    for (let i = 0; i < this.dataSet.length; i++) {
      var item = this.dataSet[i];
      if (item.isMovingAsPlanned == 1) {
        one.length++;
        one.list.push(item);
      } else if (item.isMovingAsPlanned == 2) {
        two.length++;
        two.list.push(item);
      } else if (item.isMovingAsPlanned == 3) {
        three.length++;
        three.list.push(item);
      } else if (item.isMovingAsPlanned == 4) {
        four.length++;
        four.list.push(item);
      }

      this.pack.push(one);
      this.pack.push(two);
      this.pack.push(three);
      this.pack.push(four);
      this.barChartData[0].data = [one.length, two.length, three.length, four.length]
    }
  }

  formatDateTime(item: any) {
    if (item != "") {
        if (item != "UNKNOWN") {
            var ary = item.split(' ');
            var date = ary[0].split('-');
            var time = ary[1].split(':');
            var secs = time[2].split('.');
            var newD = new Date(date[0], date[1] - 1, date[2]);
            //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
            var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + time[0] + ":" + time[1] + ":" + secs[0];
            return SDate;
        } else {
            return item;
        }
    }

}

}
