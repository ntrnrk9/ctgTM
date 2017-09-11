import { Component, OnInit, Input,ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
  selector: 'app-trailer-dash',
  templateUrl: './trailer-dash.component.html',
  styleUrls: ['./trailer-dash.component.css']
})

export class TrailerDashComponent implements OnInit {

  @Input() trailers;

  gRowCount=50;

  public pieChartLabels: string[] = ['Planned', 'Available', 'Inactive', 'Other'];
  public typeChartLabels: string[] = [];
  public cvenChartData: number[] = [300, 500, 100, 200];
  public srtChartData: number[] = [300, 500, 100, 200];
  public starChartData: number[] = [300, 500, 100, 200];
  public statusChartData: number[] = [300, 500, 100, 200];
  public typeChartData: number[] = [300, 500, 100, 200];

  chartOptions={legend:{position:'right'}};
  
  cmpList: any = [{ lable: "Covenant", value: "CVEN" }, { lable: "SRT", value: "SRT" }, { lable: "STAR", value: "STAR" }];
  selectedCmp = { lable: "Covenant", value: "CVEN" };
  cvenList = { planned: [], available: [], inactive: [], other: [] };
  srtList = { planned: [], available: [], inactive: [], other: [] };
  starList = { planned: [], available: [], inactive: [], other: [] };
  cvenTrailers=[];
  srtTrailers=[];
  starTrailers=[];
  typeFilteredTrailers=[];
  allTrailler = [];
  ob = {
    column: [{ name: "Trailer ID", width: "8%" }, { name: "Trailer name", width: "7%" }, { name: "Trailer type", width: "7%" }, { name: "Location", width: "9%" }, { name: "Distance in miles", width: "8%" },
    { name: "Allocation status", width: "8%" }, { name: "Compliance status", width: "9%" }, { name: "Road worthiness status", width: "9%" }, { name: "Last DOT inspection date", width: "9%" }, { name: "Accessory/IOT information", width: "9%" }, { name: "Last movement date", width: "9%" }, { name: "Company", width: "8%" }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };


  public pieChartType: string = 'pie';
  public selectedLable: string = '';
  totalTrailers=0;
  emptyTrailers=0;
  movingTrailers=0;
  shedTrailers=0;

  public toShowLegend = true;
  showGrid = false;
  trCountResp=false;
  
  constructor(private http: Http, private cdr: ChangeDetectorRef) {
    this.callFlinAPITrailer();
   }

  ngOnChanges(changes: any) {
    this.ngOnInit();

  }

  ngOnInit() {
    var pln = 0, avl = 0, inact = 0, oth = 0;
    var cvenChartData = [0, 0, 0, 0];
    var srtChartData = [0, 0, 0, 0];
    var starChartData = [0, 0, 0, 0];
    let map = new Map();
    let trTypeMap=new Map();
    for (var i = 0; i < this.trailers.length; i++) {

      var item = this.trailers[i];
      if (!map.has(item.trailerStatus)) {
        map.set(item.trailerStatus, true);
      }
      if (!trTypeMap.has(item.trailerType)) {
        trTypeMap.set(item.trailerType, true);
        this.typeChartLabels.push(item.trailerType);
      }

      if (item.company == 'CVEN') {
        this.cvenTrailers.push(item);
        if (item.trailerStatus == 'PLN') {
          if (this.isInactive(item.lastPingDate)) {
            cvenChartData[2]++;
            this.cvenList.inactive.push(item);
          } else {
            cvenChartData[0]++;
            this.cvenList.planned.push(item);
          }
        } else if (item.trailerStatus == 'AVL') {
          if (this.isInactive(item.lastPingDate)) {
            cvenChartData[2]++;
            this.cvenList.inactive.push(item);
          } else {
            cvenChartData[1]++;
            this.cvenList.available.push(item);
          }
        } else {
          if (this.isInactive(item.lastPingDate)) {
            cvenChartData[2]++;
            this.cvenList.inactive.push(item);
          } else {
            cvenChartData[3]++;
            this.cvenList.other.push(item);
          }
        }

      } else if (item.company == "SRT") {
        this.srtTrailers.push(item);
        if (item.trailerStatus == 'PLN') {
          if (this.isInactive(item.lastPingDate)) {
            srtChartData[2]++;
            this.srtList.inactive.push(item);
          } else {
            srtChartData[0]++;
            this.srtList.planned.push(item);
          }
        } else if (item.trailerStatus == 'AVL') {
          if (this.isInactive(item.lastPingDate)) {
            srtChartData[2]++;
            this.srtList.inactive.push(item);
          } else {
            srtChartData[1]++;
            this.srtList.available.push(item);
          }
        } else {
          if (this.isInactive(item.lastPingDate)) {
            srtChartData[2]++;
            this.srtList.inactive.push(item);
          } else {
            srtChartData[3]++;
            this.srtList.other.push(item);
          }
        }

      } else if (item.company == "STAR") {
        this.starTrailers.push(item);
        if (item.trailerStatus == 'PLN') {
          if (this.isInactive(item.lastPingDate)) {
            starChartData[2]++;
            this.starList.inactive.push(item);
          } else {
            starChartData[0]++;
            this.starList.planned.push(item);
          }
        } else if (item.trailerStatus == 'AVL') {
          if (this.isInactive(item.lastPingDate)) {
            starChartData[2]++;
            this.starList.inactive.push(item);
          } else {
            starChartData[1]++;
            this.starList.available.push(item);
          }
        } else {
          if (this.isInactive(item.lastPingDate)) {
            starChartData[2]++;
            this.starList.inactive.push(item);
          } else {
            starChartData[3]++;
            this.starList.other.push(item);
          }
        }

      }
    }
    var bag = [pln, avl, 1000, oth];
    //this.pieChartData[0]=pln;
    //this.pieChartData[1]=avl;
    this.cvenChartData = cvenChartData;
    this.srtChartData = srtChartData;
    this.starChartData = starChartData;
    console.log(map);
    console.log(trTypeMap);
    this.cmpSelected(this.selectedCmp);
  }



  // events
  public chartClicked(e: any, type): void {
    console.log(e);
    console.log(e.active[0]._index);
    this.showGrid = true;
    if (type == 1) {
      if (e.active[0]._index == 0) {
        this.selectedLable = this.pieChartLabels[0];
        this.allTrailler = this.cloneObj(this.cvenList.planned);
      } else if (e.active[0]._index == 1) {
        this.selectedLable = this.pieChartLabels[1];
        this.allTrailler = this.cloneObj(this.cvenList.available);
      } else if (e.active[0]._index == 2) {
        this.selectedLable = this.pieChartLabels[2];
        this.allTrailler = this.cloneObj(this.cvenList.inactive);
      } else if (e.active[0]._index == 3) {
        this.selectedLable = this.pieChartLabels[3];
        this.allTrailler = this.cloneObj(this.cvenList.other);
      }
    } else if (type == 2) {
      var ind=e.active[0]._index;
      this.selectedLable = this.typeChartLabels[ind];
      this.allTrailler = this.cloneObj(this.typeFilteredTrailers[ind].list);
    }

  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  cmpSelected(item) {
    this.selectedCmp = item;
    var bag = [];
    if (this.selectedCmp.value == "CVEN") {
      this.statusChartData = this.cloneObj(this.cvenChartData);
      bag = this.segrigateTrailerByType(this.cvenTrailers, 'CVEN');


    } else if (this.selectedCmp.value == "SRT") {
      this.statusChartData = this.cloneObj(this.srtChartData);
      bag = this.segrigateTrailerByType(this.srtTrailers, 'SRT');

    } else if (this.selectedCmp.value == "STAR") {
      this.statusChartData = this.cloneObj(this.starChartData);
      bag = this.segrigateTrailerByType(this.starTrailers, 'STAR');

    }
    this.typeChartData = [];
    bag.forEach(obj => {
      this.typeChartData.push(obj.length);
    });
    this.typeFilteredTrailers=bag;
  }

  
  segrigateTrailerByType(list, cmp) {
    let bag=[];
    this.typeChartLabels.forEach(obj => {
      var item={ length: 0, list: [] };
      bag.push(item);
    });
    
    for (let i = 0; i < list.length; i++) {
      var item = list[i];
      var ind = this.typeChartLabels.indexOf(item.trailerType);
      if (ind != -1) {
        bag[ind].length++;
        bag[ind].list.push(item);
      }
    }
    return bag;
  }

  callFlinAPITrailer() {
    this.trCountResp=false;

    let url = 'https://ctgtest.com/HomeService/api/TrailerCountSummary';
    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("TrailerCountSummary data recieved");
        var obj=data.dataSet[0];
        this.totalTrailers=obj.totalTrailers;
        this.emptyTrailers=obj.emptyTrailers;
        this.movingTrailers=obj.movingTrailers;
        this.shedTrailers=obj.shedTrailers;
        this.trCountResp=true;
      }, //For Success Response
      
      (err) => {
        console.log("TrailerCountSummary error recieved");
        this.trCountResp=true;
      } //For Error Response
      );

  }

  cloneObj(list: any) {
    var clone = JSON.parse(JSON.stringify(list));
    return clone;
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

  formatDateTime(item: any) {
    if (item != "") {
      //var str=item.toUpperCase();
      if (item.toUpperCase() != "UNKNOWN") {
        var ary = item.split(' ');
        var date = ary[0].split('-');
        var newD = new Date(date[0], date[1] - 1, date[2]);
        //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
        var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + ary[1];
        return SDate;
      } else {
        return item;
      }
    }
  }

  public isInactive(item) {
    var date1: any = new Date();
    var date2: any = new Date();

    if (item != "") {
      if (item != "UNKNOWN") {
        var ary = item.split(' ');
        var date = ary[0].split('-');
        var time = ary[1].split(':');
        var secs = time[2].split('.');
        date2 = new Date(date[0], date[1] - 1, date[2]);
        date2.setHours(time[0], time[1], time[2]);
        var hours = Math.abs(date1 - date2) / 36e5;
        if (hours <= 72) {
          return false;
        }
      } else {
        return true;
      }
    }

    return true;
  }

}
