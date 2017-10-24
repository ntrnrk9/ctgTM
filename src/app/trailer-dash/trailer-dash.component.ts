import { Component, OnInit, Input, ViewChild, NgZone, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import * as config from '../configs/configs';
declare let d3: any;
declare var $: any;

@Component({
  selector: 'app-trailer-dash',
  templateUrl: './trailer-dash.component.html',
  styleUrls: ['./trailer-dash.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TrailerDashComponent implements OnInit {

  @Input() trailers;
  @Input() config;

  gRowCount = 50;

  public pieChartLabels: string[] = ['Planned', 'Available', 'Inactive', 'Pool','Others'];
  public typeChartLabels: string[] = [];

  segData = {
    cven: { list: [], byStatus: { POOL:[],INACT: [], PLN: [], AVL: [], OTH: [] }, byType: [] },
    srt: { list: [], byStatus: { POOL:[],INACT: [], PLN: [], AVL: [], OTH: [] }, byType: [] },
    star: { list: [], byStatus: { POOL:[],INACT: [], PLN: [], AVL: [], OTH: [] }, byType: [] },
    all: { list: [], byStatus: { POOL:[],INACT: [], PLN: [], AVL: [], OTH: [] }, byType: [] }
  };

  segByCountryData = {
    usa: { list: [],cven:[],srt:[],star:[]},
    mexico: { list: [],cven:[],srt:[],star:[]},
    canada: { list: [],cven:[],srt:[],star:[]}
  };

  byCmpTotal={
    gTot:0,
    cven:0,
    srt:0,
    star:0
  };


  allStates = [];
  stateSelectConfig = {
    filter: true
  }
  cmpSelectConfig = {
    filter: false
  }
  countrySelectConfig = {
    filter: false
  }

  selectedState = { country: "", stateCode: "", stateDesc: "Select a state" };
  
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

  chartOptions = { legend: { position: 'right' } };

  cmpList: any = [{ lable: "ALL", value: "ALL" },{ lable: "Covenant", value: "CVEN" }, { lable: "SRT", value: "SRT" }, { lable: "STAR", value: "STAR" }];
  selectedCmp = { lable: "Covenant", value: "CVEN" };

  countryList: any = [{ lable: "USA", value: "USA" }, { lable: "Mexico", value: "MEXICO" }, { lable: "Canada", value: "CANADA" }];
  selectedCountry = { lable: "USA", value: "USA" };
  
  
  allTrailler = [];
  ob = {
    column: [{ name: "Trailer ID", width: "12%", key: 'trailerID' }, { name: "Make", width: "12%", key: 'trailerName' }, { name: "Model/Type", width: "12%", key: 'trailerType' }, { name: "Year", width: "12%", key: 'trailerYear' }, { name: "Location", width: "12%", key: 'location' },
    { name: "Allocation status", width: "12%", key: 'trailerStatus' }, { name: "Last DOT inspection date", width: "16%", key: 'dotDate' }, { name: "Last ping date", width: "12%", key: 'lastPingDate' }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };


  
  public selectedLable: string = '';
  totalTrailers = 0;
  lotSize = 0;
  emptyTrailers = 0;
  movingTrailers = 0;
  shedTrailers = 0;

  public toShowLegend = true;
  showGrid = false;
  trCountResp = false;
  toShowStateFilter=true;

  trStatusChartoptions = {
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
      x: function (d) { return d.key; },
      y: function (d) { return d.y; },
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

  trTypeChartoptions = {
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
      x: function (d) { return d.key; },
      y: function (d) { return d.y; },
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
          right: 60,
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
          bottom: 0,
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
      text: 'Type',
      className: 'h4'
    }
  };
  trStatusChartdata = [];
  trTypeChartData = [];


  constructor(private http: Http, private cdr: ChangeDetectorRef) {
    //this.getTrailerCountSummary();
    this.getAllStates();
  }

  ngOnChanges(changes: any) {
    this.ngOnInit();

  }

  ngOnInit() {
    $('[data-toggle="popover"]').popover(); 
    var ctrl = this;
    this.segData = {
      cven: { list: [], byStatus: { POOL:[],INACT: [], PLN: [], AVL: [], OTH: [] }, byType: [] },
      srt: { list: [], byStatus: { POOL:[],INACT: [], PLN: [], AVL: [], OTH: [] }, byType: [] },
      star: { list: [], byStatus: { POOL:[],INACT: [], PLN: [], AVL: [], OTH: [] }, byType: [] },
      all: { list: [], byStatus: { POOL:[],INACT: [], PLN: [], AVL: [], OTH: [] }, byType: [] }
    };
    this.segByCountryData = {
      usa: { list: [],cven:[],srt:[],star:[]},
      mexico: { list: [],cven:[],srt:[],star:[]},
      canada: { list: [],cven:[],srt:[],star:[]}
    };
    this.byCmpTotal={
      gTot:0,
      cven:0,
      srt:0,
      star:0
    };

    this.trStatusChartoptions.chart.pie.dispatch.elementClick = function (e) {
      //console.log('click-init ' + JSON.stringify(e));
      ctrl.nvd3chartClicked(e, 1);
    };
    this.trStatusChartoptions.chart['color'] = function (d, i) {
      return ctrl.nvd3Colors[i % ctrl.nvd3Colors.length]
    }

    this.trTypeChartoptions.chart.pie.dispatch.elementClick = function (e) {
      //console.log('click-init ' + JSON.stringify(e));
      ctrl.nvd3chartClicked(e, 2);
    };
    this.trTypeChartoptions.chart['color'] = function (d, i) {
      return ctrl.nvd3Colors[i % ctrl.nvd3Colors.length]
    }

    this.prepSegData();
    this.filterByCmpnState(0);
  }

  sortTrailers(list, key, asc) {
    var bag;
    if (key == "dotDate") {
      bag = this.sortTrailersByTime(list, key, asc);
    } else if (key == "lastPingDate") {
      bag = this.sortTrailersByTime(list, key, asc);
    } else {
      bag = list.sort((item1, item2) => {
        if (asc == 0) {
          if (item1[key] > item2[key]) {
            return 1;
          } else if (item1[key] < item2[key]) {
            return -1;
          } else {
            return 0;
          }
        } else {
          if (item1[key] < item2[key]) {
            return 1;
          } else if (item1[key] > item2[key]) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    }
    return bag;
  }

  sortTrailersByTime(list, key, asc) {
    var bag = list.sort((item1, item2) => {
      if (item1[key] == null || item1[key] == "") {
        return 1;
      }
      if (item2[key] == null || item2[key] == "") {
        return -1;
      }
      var ary1 = item1[key].split(' ');
      var date1 = ary1[0].split('-');
      var item1D = new Date(date1[0], date1[1] - 1, date1[2]);
      var tim1 = ary1[1].split('.');
      var time1 = tim1[0].split(':');
      item1D.setHours(time1[0], time1[1], time1[2]);

      var ary2 = item2[key].split(' ');
      var date2 = ary2[0].split('-');
      var item2D = new Date(date2[0], date2[1] - 1, date2[2]);
      var tim2 = ary2[1].split('.');
      var time2 = tim2[0].split(':');
      item2D.setHours(time2[0], time2[1], time2[2]);
      if (asc == 0) {
        if (item1D > item2D) {
          return 1;
        } else if (item1D < item2D) {
          return -1;
        } else {
          return 0;
        }
      } else {
        if (item1D < item2D) {
          return 1;
        } else if (item1D > item2D) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    return bag;
  }


  prepSegData() {
    let map = new Map();
    let trTypeMap = new Map();
    this.typeChartLabels = [];
    for (var i = 0; i < this.trailers.length; i++) {
      var item = this.trailers[i];
      if (!map.has(item.trailerStatus)) {
        map.set(item.trailerStatus, true);
      }
      if (!trTypeMap.has(item.trailerType)) {
        trTypeMap.set(item.trailerType, true);
        this.typeChartLabels.push(item.trailerType);
      }
      var cmp=item.company;
      if (cmp == 'UNKNOWN') {
        cmp = "CVEN";
      }
      if (cmp == 'CVEN') {
        this.segData.cven.list.push(item);
        var key = this.trStatus(item);
        this.segData.cven.byStatus[key].push(item);
      } else if (cmp == "SRT") {
        this.segData.srt.list.push(item);
        var key = this.trStatus(item);
        this.segData.srt.byStatus[key].push(item);
      } else if (cmp == "STAR") {
        this.segData.star.list.push(item);
        var key = this.trStatus(item);
        this.segData.star.byStatus[key].push(item);
      }

      if (item.country.toUpperCase() == 'USA') {
        this.segByCountryData.usa.list.push(item);
        this.segByCountryData.usa[cmp.toLowerCase()].push(item);
      } else if (item.country.toUpperCase() == 'MEXICO') {
        this.segByCountryData.mexico.list.push(item);
        this.segByCountryData.mexico[cmp.toLowerCase()].push(item);
      } else if (item.country.toUpperCase() == 'CANADA') {
        this.segByCountryData.canada.list.push(item);
        this.segByCountryData.canada[cmp.toLowerCase()].push(item);
      }
    }

    this.prepAllCmpData();

    this.segData.cven.byType = this.segrigateTrailerByType(this.segData.cven.list, 'CVEN');
    this.segData.srt.byType = this.segrigateTrailerByType(this.segData.srt.list, 'SRT');
    this.segData.star.byType = this.segrigateTrailerByType(this.segData.star.list, 'STAR');
    this.segData.all.byType = this.segrigateTrailerByType(this.segData.all.list, 'ALL');

    console.log("byType");
    console.log(this.segData.cven.byType);
    console.log("byStatus");
    console.log(this.segData.cven.byStatus);

  }

  prepAllCmpData(){
    var bag=[];
    bag=bag.concat(this.segData.cven.list);
    bag=bag.concat(this.segData.srt.list);
    bag=bag.concat(this.segData.star.list);
    this.segData.all.list=bag;

    bag=[];
    bag=bag.concat(this.segData.cven.byStatus.POOL);
    bag=bag.concat(this.segData.srt.byStatus.POOL);
    bag=bag.concat(this.segData.star.byStatus.POOL);
    this.segData.all.byStatus.POOL=bag;

    bag=[];
    bag=bag.concat(this.segData.cven.byStatus.INACT);
    bag=bag.concat(this.segData.srt.byStatus.INACT);
    bag=bag.concat(this.segData.star.byStatus.INACT);
    this.segData.all.byStatus.INACT=bag;

    bag=[];
    bag=bag.concat(this.segData.cven.byStatus.PLN);
    bag=bag.concat(this.segData.srt.byStatus.PLN);
    bag=bag.concat(this.segData.star.byStatus.PLN);
    this.segData.all.byStatus.PLN=bag;

    bag=[];
    bag=bag.concat(this.segData.cven.byStatus.AVL);
    bag=bag.concat(this.segData.srt.byStatus.AVL);
    bag=bag.concat(this.segData.star.byStatus.AVL);
    this.segData.all.byStatus.AVL=bag;

    bag=[];
    bag=bag.concat(this.segData.cven.byStatus.OTH);
    bag=bag.concat(this.segData.srt.byStatus.OTH);
    bag=bag.concat(this.segData.star.byStatus.OTH);
    this.segData.all.byStatus.OTH=bag;


  }

  checkStatusOfTrailer(item) {
    if (item.isPool==1) {
      return 'POOL';
    }else if (this.isInactive(item.lastPingDate)) {
      return 'INACT';
    } else if (item.trailerStatus == 'AVL') {
      return item.trailerStatus;
    } else if (item.trailerStatus == 'PLN') {
      return item.trailerStatus;
    } else {
      return 'OTH';
    }
  }

  trStatus(trailer: any) {
    let utilized = "STD,SPU";
    let planned = "PLN,PLNLD";
    //check for pool trailers
    if (trailer.isPool == 1) {
      return "POOL";
    }//check for inactive
    else if (this.isInactive(trailer.lastPingDate)) {
      return "INACT";

    }//check for utilized
    else if (utilized.includes(trailer.trailerStatus)) {
      return "POOL";
    }//check for planned
    else if (planned.includes(trailer.trailerStatus)) {
      return "PLN";
    }//check for available
    else if (trailer.trailerStatus == "AVL") {
      if (trailer.dOTDueDays <= 7 || trailer.isShedTrailer) {
        return "OTH";
      } else {
        return "AVL";
      }

    }//rest are others 
    else {
      return "OTH";
    }
  }

  filterByCmpnState(choice) {
    this.showGrid = false;
    this.gRowCount = 50;
    var lot = this.cloneObj(this.filterByCmp());
    lot=this.filterByCmpnCountry(lot);
    var lotSize = 0;
    if(choice==0){
      this.byCmpTotal.gTot=this.segByCountryData[this.selectedCountry.value.toLowerCase()].list.length;
      this.byCmpTotal.cven=this.segByCountryData[this.selectedCountry.value.toLowerCase()].cven.length;
      this.byCmpTotal.srt=this.segByCountryData[this.selectedCountry.value.toLowerCase()].srt.length;
      this.byCmpTotal.star=this.segByCountryData[this.selectedCountry.value.toLowerCase()].star.length;
    }
      
    this.trStatusChartdata = [];
    if (this.selectedState.country == "") {
      
      var item = { key: 'Planned', y: lot.byStatus.PLN.length, list: lot.byStatus.PLN };
      lotSize += lot.byStatus.PLN.length
      this.trStatusChartdata.push(item);
      var item = { key: 'Available', y: lot.byStatus.AVL.length, list: lot.byStatus.AVL };
      lotSize += lot.byStatus.AVL.length
      this.trStatusChartdata.push(item);
      var item = { key: 'Pool', y: lot.byStatus.POOL.length, list: lot.byStatus.POOL };
      lotSize += lot.byStatus.POOL.length
      this.trStatusChartdata.push(item);
      var item = { key: 'Inactive', y: lot.byStatus.INACT.length, list: lot.byStatus.INACT };
      lotSize += lot.byStatus.INACT.length
      this.trStatusChartdata.push(item);
      var item = { key: 'Others', y: lot.byStatus.OTH.length, list: lot.byStatus.OTH };
      lotSize += lot.byStatus.OTH.length
      this.trStatusChartdata.push(item);

      this.trTypeChartData = [];
      lot.byType.forEach(element => {
        var item = { key: element.label, y: element.length, list: element.list };
        this.trTypeChartData.push(item);
      });
      this.lotSize = lotSize;
    } else if (this.selectedState.country != "") {
      var bag = this.filterByState(lot.byStatus.PLN);
      var item1 = { key: 'Planned', y: bag.length, list: bag };
      lotSize += bag.length;
      this.trStatusChartdata.push(item1);

      bag = this.filterByState(lot.byStatus.AVL);
      item1 = { key: 'Available', y: bag.length, list: bag };
      lotSize += bag.length;
      this.trStatusChartdata.push(item1);

      bag = this.filterByState(lot.byStatus.POOL);
      item1 = { key: 'Pool', y: bag.length, list: bag };
      lotSize += bag.length;
      this.trStatusChartdata.push(item1);

      bag = this.filterByState(lot.byStatus.INACT);
      item1 = { key: 'Inactive', y: bag.length, list: bag };
      lotSize += bag.length;
      this.trStatusChartdata.push(item1);

      bag = this.filterByState(lot.byStatus.OTH);
      item1 = { key: 'Others', y: bag.length, list: bag };
      lotSize += bag.length;
      this.trStatusChartdata.push(item1);

      this.trTypeChartData = [];
      lot.byType.forEach(element => {
        bag = this.filterByState(element.list);
        var item = { key: element.label, y: bag.length, list: bag };
        this.trTypeChartData.push(item);
      });
      this.lotSize = lotSize;
    }
  }

  filterByCmpnCountry(lot) {
    this.showGrid = false;
    this.gRowCount = 50;
    var lotSize = 0;

    lot.byStatus.PLN = this.filterByCountry(lot.byStatus.PLN);
    lot.byStatus.AVL = this.filterByCountry(lot.byStatus.AVL);
    lot.byStatus.POOL = this.filterByCountry(lot.byStatus.POOL);
    lot.byStatus.INACT = this.filterByCountry(lot.byStatus.INACT);
    lot.byStatus.OTH = this.filterByCountry(lot.byStatus.OTH);

    this.trTypeChartData = [];
    lot.byType.forEach(element => {
      element.list = this.filterByCountry(element.list);
      element.length=element.list.length;
    });
    this.lotSize = lotSize;
    return lot;
  }

  filterByCmp() {
    return this.segData[this.selectedCmp.value.toLowerCase()];
  }

  filterByState(list) {
    var bag = [];
    list.forEach(element => {
      if (this.selectedState.stateCode == element.state) {
        bag.push(element);
      }
    });
    return bag;
  }

  filterByCountry(list) {
    var bag = [];
    list.forEach(element => {
      if (this.selectedCountry.value.toLowerCase() == element.country.toLowerCase()) {
        bag.push(element);
      }
    });
    return bag;
  }


  public testFunction(val: any) {
    console.log('val', val);
  }
  // events


  public chartHovered(e: any): void {
    console.log(e);
  }

  public nvd3chartClicked(e: any, type): void {
    //console.log(e);
    //console.log(e.active[0]._index);
    this.showGrid = true;
    this.gRowCount = 50;
    if (type == 1) {
      if (e.data.key == "Others") {
        this.selectedLable = "Other";
      } else {
        this.selectedLable = e.data.key;
      }
      this.allTrailler = this.sortTrailersByTime(e.data.list, 'lastPingDate', 0);
    } else if (type == 2) {
      //var ind=e.dataactive[0]._index;
      this.selectedLable = e.data.key;
      this.allTrailler = this.sortTrailersByTime(e.data.list, 'lastPingDate', 0);
    }
  }

  stateSelected(item) {
    this.showGrid = false;
    this.gRowCount = 50;
    this.selectedState = item;
  }

  cmpSelected(item) {
    this.showGrid = false;
    this.gRowCount = 50;
    this.selectedCmp = item;
  }

  countrySelected(item) {
    this.showGrid = false;
    this.gRowCount = 50;
    this.selectedCountry = item;
    if(item.value=="USA"){
      this.toShowStateFilter=true;
    }else{
      this.toShowStateFilter=false;
    }
  }


  segrigateTrailerByType(list, cmp) {
    let bag = [];
    this.typeChartLabels.forEach(obj => {
      var item = { length: 0, list: [], label: obj, percent: 0 };
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

  
  private getAllStates() {
    //alert("hi");
    var url = config.baseUrl + "/CommonService/api/State";
    this.selectedState = { country: "", stateCode: "", stateDesc: "Select a state" };
    this.allStates = [{ country: "", stateCode: "", stateDesc: "Select a state" }];
    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("getAllStates data recieved");
        this.allStates = this.allStates.concat(data);
      }, //For Success Response
      (err) => { console.log("getAllStates error recieved"); } //For Error Response
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

  formatDateTime(item: any, dt) {
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
        var time = tim[0].split(':');

        newD.setHours(time[0], time[1], time[2]);
        //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
        if (dt == 1) {
          var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + tim[0];
        } else {
          var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear();
        }
        return SDate;
      } else {
        return item;
      }
    } else {
      return item;
    }
  }

  getGridData(item) {
    this.gRowCount = 50;
    if (item.key == "Others") {
      this.selectedLable="Other";
    } else {
      this.selectedLable = item.key;
    }
    this.allTrailler = item.list;
    this.showGrid = true;
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
  
  saveToFile(data) {
    data = JSON.stringify(data, undefined, 4);
    var filename = "dow.txt";
    var blob = new Blob([data], { type: 'text/json' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)

  }
}
