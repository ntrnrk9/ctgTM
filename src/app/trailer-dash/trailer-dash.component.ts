import { Component, OnInit, Input,ViewChild, NgZone, ChangeDetectorRef,ViewEncapsulation } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import * as config from '../configs/configs';
declare let d3: any;

@Component({
  selector: 'app-trailer-dash',
  templateUrl: './trailer-dash.component.html',
  styleUrls: ['./trailer-dash.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TrailerDashComponent implements OnInit {

  @Input() trailers;

  gRowCount=50;

  public pieChartLabels: string[] = ['Planned', 'Available', 'Inactive', 'Others'];
  public typeChartLabels: string[] = [];
  segData={
    cven:{list:[],byStatus:{INACT:[],PLN:[],AVL:[],OTH:[]},byType:[]},
    srt:{list:[],byStatus:{INACT:[],PLN:[],AVL:[],OTH:[]},byType:[]},
    star:{list:[],byStatus:{INACT:[],PLN:[],AVL:[],OTH:[]},byType:[]}
  };
  public cvenChartData: number[] = [300, 500, 100, 200];
  public srtChartData: number[] = [300, 500, 100, 200];
  public starChartData: number[] = [300, 500, 100, 200];
  public statusChartData: number[] = [300, 500, 100, 200];
  public typeChartData: number[] = [300, 500, 100, 200];
  
  allStates=[];
  stateSelectConfig={
    filter:true
  }
  cmpSelectConfig={
    filter:false
  }
  
  selectedState={ country: "", stateCode:"", stateDesc:"Select a state"};
  public colors = [{
    backgroundColor: ['#00a0dc',
      '#8d6cab',
      '#dd5143',
      '#e68523',
      '#00aeb3',
      '#86888a',
      '#dc4b89',
      '#edb220',
      '#7cb82f',
      ]
  }];
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

  chartOptions={legend:{position:'right'}};
  
  cmpList: any = [{ lable: "Covenant", value: "CVEN" }, { lable: "SRT", value: "SRT" }, { lable: "STAR", value: "STAR" }];
  selectedCmp = { lable: "Covenant", value: "CVEN" };
  cvenList = { planned: [], available: [], inactive: [], others: [] };
  srtList = { planned: [], available: [], inactive: [], others: [] };
  starList = { planned: [], available: [], inactive: [], others: [] };
  cvenTrailers=[];
  srtTrailers=[];
  starTrailers=[];
  typeFilteredTrailers=[];
  allTrailler = [];
  ob = {
    column: [{ name: "Trailer ID", width: "12.5%" }, { name: "Make", width: "12.5%" }, { name: "Model/Type", width: "12.5%" },{ name: "Company", width: "12.5%" },{ name: "Location", width: "12.5%" },
    { name: "Allocation status", width: "12.5%" },{ name: "Last DOT inspection date", width: "12.5%" }, { name: "Last ping date", width: "12.5%" }],
    groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
  };


  public pieChartType: string = 'doughnut';
  public selectedLable: string = '';
  totalTrailers=0;
  lotSize=0;
  emptyTrailers=0;
  movingTrailers=0;
  shedTrailers=0;

  public toShowLegend = true;
  showGrid = false;
  trCountResp=false;

  trStatusChartoptions = {
    chart: {
      type: 'pieChart',
      height: 400,
      donut: true,
      labelType: 'percent',
      growOnHover: true,
      labelsOutside: false,
      donutLabelsOutside:false,
      showLegend:false,
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
        padding:50,
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
      height: 400,
      donut: true,
      labelType: 'percent',
      growOnHover: true,
      labelsOutside: false,
      donutLabelsOutside:false,
      showLegend:false,
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
        padding:50,
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
  trTypeChartData=[];

  
  constructor(private http: Http, private cdr: ChangeDetectorRef) {
    this.getTrailerCountSummary();
    this.getAllStates();
   }

  ngOnChanges(changes: any) {
    this.ngOnInit();

  }

  ngOnInit() {
    var ctrl=this;
    this.trStatusChartoptions.chart.pie.dispatch.elementClick=function(e){
      //console.log('click-init ' + JSON.stringify(e));
      ctrl.nvd3chartClicked(e,1);
    };
    this.trStatusChartoptions.chart['color']=function(d,i){
      return ctrl.nvd3Colors[i % ctrl.nvd3Colors.length]
    }

    this.trTypeChartoptions.chart.pie.dispatch.elementClick=function(e){
      //console.log('click-init ' + JSON.stringify(e));
      ctrl.nvd3chartClicked(e,2);
    };
    this.trTypeChartoptions.chart['color']=function(d,i){
      return ctrl.nvd3Colors[i % ctrl.nvd3Colors.length]
    }

    var pln = 0, avl = 0, inact = 0, oth = 0;
    var cvenChartData = [0, 0, 0, 0];
    var srtChartData = [0, 0, 0, 0];
    var starChartData = [0, 0, 0, 0];
    let map = new Map();
    let trTypeMap=new Map();
    this.typeChartLabels=[];
    // for (var i = 0; i < this.trailers.length; i++) {

    //   var item = this.trailers[i];
    //   if (!map.has(item.trailerStatus)) {
    //     map.set(item.trailerStatus, true);
    //   }
    //   if (!trTypeMap.has(item.trailerType)) {
    //     trTypeMap.set(item.trailerType, true);
    //     this.typeChartLabels.push(item.trailerType);
    //   }

    //   if (item.company == 'CVEN') {
    //     this.cvenTrailers.push(item);
    //     if (item.trailerStatus == 'PLN') {
    //       if (this.isInactive(item.lastPingDate)) {
    //         cvenChartData[2]++;
    //         this.cvenList.inactive.push(item);
    //       } else {
    //         cvenChartData[0]++;
    //         this.cvenList.planned.push(item);
    //       }
    //     } else if (item.trailerStatus == 'AVL') {
    //       if (this.isInactive(item.lastPingDate)) {
    //         cvenChartData[2]++;
    //         this.cvenList.inactive.push(item);
    //       } else {
    //         cvenChartData[1]++;
    //         this.cvenList.available.push(item);
    //       }
    //     } else {
    //       if (this.isInactive(item.lastPingDate)) {
    //         cvenChartData[2]++;
    //         this.cvenList.inactive.push(item);
    //       } else {
    //         cvenChartData[3]++;
    //         this.cvenList.others.push(item);
    //       }
    //     }

    //   } else if (item.company == "SRT") {
    //     this.srtTrailers.push(item);
    //     if (item.trailerStatus == 'PLN') {
    //       if (this.isInactive(item.lastPingDate)) {
    //         srtChartData[2]++;
    //         this.srtList.inactive.push(item);
    //       } else {
    //         srtChartData[0]++;
    //         this.srtList.planned.push(item);
    //       }
    //     } else if (item.trailerStatus == 'AVL') {
    //       if (this.isInactive(item.lastPingDate)) {
    //         srtChartData[2]++;
    //         this.srtList.inactive.push(item);
    //       } else {
    //         srtChartData[1]++;
    //         this.srtList.available.push(item);
    //       }
    //     } else {
    //       if (this.isInactive(item.lastPingDate)) {
    //         srtChartData[2]++;
    //         this.srtList.inactive.push(item);
    //       } else {
    //         srtChartData[3]++;
    //         this.srtList.others.push(item);
    //       }
    //     }

    //   } else if (item.company == "STAR") {
    //     this.starTrailers.push(item);
    //     if (item.trailerStatus == 'PLN') {
    //       if (this.isInactive(item.lastPingDate)) {
    //         starChartData[2]++;
    //         this.starList.inactive.push(item);
    //       } else {
    //         starChartData[0]++;
    //         this.starList.planned.push(item);
    //       }
    //     } else if (item.trailerStatus == 'AVL') {
    //       if (this.isInactive(item.lastPingDate)) {
    //         starChartData[2]++;
    //         this.starList.inactive.push(item);
    //       } else {
    //         starChartData[1]++;
    //         this.starList.available.push(item);
    //       }
    //     } else {
    //       if (this.isInactive(item.lastPingDate)) {
    //         starChartData[2]++;
    //         this.starList.inactive.push(item);
    //       } else {
    //         starChartData[3]++;
    //         this.starList.others.push(item);
    //       }
    //     }

    //   }
    // }
    //var bag = [pln, avl, 1000, oth];
    //this.pieChartData[0]=pln;
    //this.pieChartData[1]=avl;
    //this.cvenChartData = cvenChartData;
    //this.srtChartData = srtChartData;
    //this.starChartData = starChartData;
    //console.log(map);
    //console.log(trTypeMap);
    //this.cmpSelected(this.selectedCmp);
    this.prepSegData();
    this.filterByCmpnState();
  }

  prepSegData(){
    let map = new Map();
    let trTypeMap=new Map();
    this.typeChartLabels=[];
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
        this.segData.cven.list.push(item);
        var key=this.checkStatusOfTrailer(item);
        this.segData.cven.byStatus[key].push(item);
      } else if (item.company == "SRT") {
        this.segData.srt.list.push(item);
        var key=this.checkStatusOfTrailer(item);
        this.segData.srt.byStatus[key].push(item);
      } else if (item.company == "STAR") {
        this.segData.star.list.push(item);
        var key=this.checkStatusOfTrailer(item);
        this.segData.star.byStatus[key].push(item);
      }
    }
    
    this.segData.cven.byType=this.segrigateTrailerByType(this.segData.cven.list,'CVEN');
    this.segData.srt.byType=this.segrigateTrailerByType(this.segData.srt.list,'SRT');
    this.segData.star.byType=this.segrigateTrailerByType(this.segData.star.list,'STAR');

    console.log("byType");
    console.log(this.segData.cven.byType);
    console.log("byStatus");
    console.log(this.segData.cven.byStatus);
    
  }

  checkStatusOfTrailer(item){
    if (this.isInactive(item.lastPingDate)) {
      return 'INACT';
    }else if(item.trailerStatus=='AVL'){
      return item.trailerStatus;
    }else if(item.trailerStatus=='PLN'){
      return item.trailerStatus;
    }else{
      return 'OTH';
    }
  }

  filterByCmpnState(){
    var lot=this.filterByCmp();
    var lotSize=0;

    this.trStatusChartdata=[];
    if(this.selectedState.country==""){
      var item={key:'Planned',y:lot.byStatus.PLN.length,list:lot.byStatus.PLN};
      this.trStatusChartdata.push(item);
      var item={key:'Available',y:lot.byStatus.AVL.length,list:lot.byStatus.AVL};
      this.trStatusChartdata.push(item);
      var item={key:'Inactive',y:lot.byStatus.INACT.length,list:lot.byStatus.INACT};
      this.trStatusChartdata.push(item);
      var item={key:'Others',y:lot.byStatus.OTH.length,list:lot.byStatus.OTH};
      this.trStatusChartdata.push(item);
      
      this.trTypeChartData=[];
      lot.byType.forEach(element => {
        var item={key:element.label,y:element.length,list:element.list};
        this.trTypeChartData.push(item);
      });
      this.lotSize=lot.list.length;
    }else if(this.selectedState.country!=""){
      var bag=this.filterByState(lot.byStatus.PLN);
      var item1={key:'Planned',y:bag.length,list:bag};
      lotSize+=bag.length;
      this.trStatusChartdata.push(item1);

      bag=this.filterByState(lot.byStatus.AVL);
      item1={key:'Available',y:bag.length,list:bag};
      lotSize+=bag.length;
      this.trStatusChartdata.push(item1);

      bag=this.filterByState(lot.byStatus.INACT);
      item1={key:'Inactive',y:bag.length,list:bag};
      lotSize+=bag.length;
      this.trStatusChartdata.push(item1);
      
      bag=this.filterByState(lot.byStatus.OTH);
      item1={key:'Inactive',y:bag.length,list:bag};
      lotSize+=bag.length;
      this.trStatusChartdata.push(item1);
      
      this.trTypeChartData=[];
      lot.byType.forEach(element => {
        bag=this.filterByState(element.list);
        var item={key:element.label,y:bag.length,list:bag};
        this.trTypeChartData.push(item);
      });
      this.lotSize=lotSize;
    }
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


public testFunction(val:any){
console.log('val', val);
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
        this.allTrailler = this.cloneObj(this.cvenList.others);
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

  public nvd3chartClicked(e: any, type): void {
    //console.log(e);
    //console.log(e.active[0]._index);
    this.showGrid = true;
    if (type == 1) {
      this.selectedLable = e.data.key;
      this.allTrailler = e.data.list;
    } else if (type == 2) {
      //var ind=e.dataactive[0]._index;
      this.selectedLable = e.data.key;
      this.allTrailler = e.data.list;
    }

  }
  stateSelected(item){
    this.selectedState=item;
  }

  cmpSelected(item) {
    this.showGrid = false;
    this.selectedCmp = item;
    
    // var bag = [];
    // var list:any;
    // if (this.selectedCmp.value == "CVEN") {
    //   this.statusChartData = this.cloneObj(this.cvenChartData);
    //   list=this.cvenList;
    //   bag = this.segrigateTrailerByType(this.cvenTrailers, 'CVEN');
    //   this.totalTrailers=this.cvenTrailers.length;


    // } else if (this.selectedCmp.value == "SRT") {
    //   this.statusChartData = this.cloneObj(this.srtChartData);
    //   list=this.srtList;
    //   bag = this.segrigateTrailerByType(this.srtTrailers, 'SRT');
    //   this.totalTrailers=this.srtTrailers.length;

    // } else if (this.selectedCmp.value == "STAR") {
    //   this.statusChartData = this.cloneObj(this.starChartData);
    //   list=this.starList;
    //   bag = this.segrigateTrailerByType(this.starTrailers, 'STAR');
    //   this.totalTrailers=this.starTrailers.length;

    // }
    
    // this.trStatusChartdata=[];
    // if (this.selectedState.country != "") {
    //   for (var i = 0; i < this.statusChartData.length; i++) {
    //     var obj = { key: "", y: 0, list: [], percent: 0 };
    //     obj.key = this.pieChartLabels[i];
    //     obj.list = list[obj.key.toLowerCase()];
    //     var bag=[];
    //     for(var j=0;j<obj.list.length;j++){
    //       var ite=obj.list[j];
    //       if(ite.state==this.selectedState.stateCode){
    //         bag.push(ite);
    //       }
    //     }
    //     obj.list=bag;
    //     this.trStatusChartdata.push(obj);
    //   }
    // } else {
    //   for (var i = 0; i < this.statusChartData.length; i++) {
    //     var obj = { key: "", y: 0, list: [], percent: 0 };
    //     obj.key = this.pieChartLabels[i];
    //     obj.y = this.statusChartData[i];
    //     obj.list = list[obj.key.toLowerCase()];
    //     obj.percent = obj.percent;
    //     this.trStatusChartdata.push(obj);
    //   }
    // }

    // console.log(this.trStatusChartdata);
    // //this.saveToFile(this.trStatusChartdata);

    // this.typeChartData = [];
    // this.trTypeChartData = [];
    // bag.forEach(obj => {
    //   this.typeChartData.push(obj.length);
    //   var item={key:obj.label,y:obj.length,list:obj.list,percent:obj.percent};
    //   this.trTypeChartData.push(item);
    // });
    // //console.log(this.trTypeChartData);
    
    //this.typeFilteredTrailers=bag;
  }

  
  segrigateTrailerByType(list, cmp) {
    let bag=[];
    this.typeChartLabels.forEach(obj => {
      var item={ length: 0, list: [], label:obj,percent:0 };
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

  getTrailerCountSummary() {
    this.trCountResp=false;

    let url = 'https://ctgtest.com/HomeService/api/TrailerCountSummary?company='+this.selectedCmp.value;
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
  private getAllStates() {
    //alert("hi");
    var url = config.baseUrl + "/CommonService/api/State";
    this.selectedState={ country: "", stateCode:"", stateDesc:"Select a state"};
    this.allStates=[{ country: "", stateCode:"", stateDesc:"Select a state"}];
    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("getAllStates data recieved"); 
        this.allStates=this.allStates.concat(data); 
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

  getGridData(item){
    this.allTrailler = item.list;
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
    var filename="dow.txt";
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
