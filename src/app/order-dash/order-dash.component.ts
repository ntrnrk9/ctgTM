import { Component, OnInit, Input, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import * as config from '../configs/configs';

@Component({
  selector: 'app-order-dash',
  templateUrl: './order-dash.component.html',
  styleUrls: ['./order-dash.component.css']
})
export class OrderDashComponent implements OnInit {

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

  public barChartLabels: string[] = ['Moving as planned', 'Not started', 'Not as per plan', 'Not as per plan'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;
  gRowCount = 50;
  futAvlOrder=[];
  allTrailler = [];
  ob = {
    column: [{ name: "Trailer ID", width: "12.5%" }, { name: "Make", width: "12.5%" }, { name: "Model/Type", width: "12.5%" }, { name: "Year", width: "12.5%" }, { name: "Location", width: "12.5%" },
    { name: "Allocation status", width: "12.5%" }, { name: "Last DOT inspection date", width: "12.5%" }, { name: "Last ping date", width: "12.5%" }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };

  orders = {
    column: [{ name: "Order ID", width: "10%" },{ name: "Movement no.", width: "10%" }, { name: "Ref. no.", width: "10%" },{ name: "Bill to name", width: "10%" }, { name: "Origin city", width: "10%" }, { name: "Destination city", width: "10%" }, { name: "Order origin point", width: "10%" },
    { name: "Order start date", width: "10%" }, { name: "Order end date", width: "10%" }, { name: "Order remark", width: "10%" } ],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
};

  colorsOPs = ['red'];
  dataSet = [];
  pack = [];

  futAvlOrderchartClicked(e){
    this.allTrailler=e.data.list;
  }

  public barChartData: any[] = [
    {
      data: [65, 59, 80, 90], label: 'Series A',
      backgroundColor: [
        '#22466f', '#22466f', '#22466f', '#22466f'
      ]
    }

  ];

  plnVsActdata = [
    {
      key: "Planned Vs Actual",
      values: [
        {
          "label": "Moving as planned",
          "value": 29.0
        },
        {
          "label": "Not started",
          "value": 90.0
        },
        {
          "label": "Not as per plan",
          "value": 32.0
        },
        {
          "label": "Not as per planA",
          "value": 196.0
        }
      ]
    }
  ];

  plnVsActoptions = {
    chart: {
      type: 'discreteBarChart',
      height: 450,
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
        return d3.format(',.4f')(d);
      },
      duration: 500,
      xAxis: {
        axisLabel: 'X Axis'
      },
      yAxis: {
        axisLabel: 'Y Axis',
        axisLabelDistance: -10
      }
    }
  };

  futAvlData = [];

  futAvlOptions = {
    chart: {
      type: 'discreteBarChart',
      height: 450,
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
        return d3.format(',.4f')(d);
      },
      duration: 500,
      xAxis: {
        axisLabel: 'X Axis'
      },
      yAxis: {
        axisLabel: 'Y Axis',
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

  getOrderStats() {
    let url = config.baseUrl + "/HomeService/api/OrderTrailerTrack";
    this.OrderStatsResp=false;
    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("orderStats data recieved");
        this.dataSet = data.dataSet;
        var bag={
          key: "Planned Vs Actual",
          values: [
            {
              "label": "Moving as planned",
              "value": 0,
              "list": []
            },
            {
              "label": "Not started",
              "value": 0,
              "list": []
            },
            {
              "label": "Not as per plan and started",
              "value": 0,
              "list": []
            },
            {
              "label": "Not as per plan and not started",
              "value": 0,
              "list": []
            }
          ]
        }
        data.dataSet.forEach(element => {
          if (element.isMovingAsPlanned == 1) {
            bag.values[3].value++;
            bag.values[3].list.push(element);
          } else if (element.isMovingAsPlanned == 2) {
            bag.values[1].value++;
            bag.values[1].list.push(element);
          } else if (element.isMovingAsPlanned == 3) {
            bag.values[2].value++;
            bag.values[2].list.push(element);
          } else if (element.isMovingAsPlanned == 4) {
            bag.values[0].value++;
            bag.values[0].list.push(element);

          } else { }
        });
        this.plnVsActdata=[];
        this.plnVsActdata.push(bag); 
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
