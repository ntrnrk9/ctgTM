import { Component,Input,Output, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { GmapjsComponent } from '../gmapjs/gmapjs.component';
import { Gmtest } from '../gmtest/gmtest.component';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';

declare var google: any;
declare var MarkerClusterer: any;
declare var $: any;

import * as config from '../configs/configs';
@Component({
    selector: 'allocation-page',
    templateUrl: 'allocation-page.component.html',
    styleUrls: ['allocation-page.component.css'],
    moduleId: module.id
})
export class AllocationPageComponent {
    private name = 'AllocationPageComponent';
    @Input() config:any;
    page=0;
    data = {
        rows: [
            ["Available", "2343443", "05-20-2017 08:30", "Chattanooga ", "Walmart", "Atlanta,GA", "Buford,GA", "SOLO", "2342345", "SID", "all set",],
            ["Available", "2343444", "05-20-2017 09:30", "West depot", "Fedex", "Ontario OH", "Bufford,GA", "SOLO", "2342345", "SID", "all set",],
            ["Available", "2343445", "05-20-2017 10:30", "CTG ", "VH Transport", "Bentonville,AR", "Bufford,GA", "SOLO", "2342345", "SID", "all set",]],
        column: ["Status", "Order#", "Order date", "Origin name", "Bill to party", "Origin city", "Destination city", "Service", "Ref#", "Ref type", "Order remark", "Action"]
    };


    selectedOrder: any = {number:-1};
    selectedTruck: any = {number:-1,type:"",make:"",company:"",model:"",distance:0,location:{landmark:""}};
    selectedTrailer: any = {trailerID:-1};
    selectedTrStatus: any = { status: "Available", value: 2 };
    selectedAvailability: number = -1;
    bylocation: String = "";
    orderBylocation: String = "";
    truckBylocation: String = "";
    trailerBylocation:String="";
    selectedID: any;
    searchID: String = "";
    omID:String="";
    truckID:String="";
    trailerID:String="";
    trailHistory: any;
    test: Number = 9;

    trMapConfig:any={lat:35.96494,lng:-83.95384,zoom:10,mapType:'roadmap',marker:-1};
    mappedOrderConfig:any={lat:35.96494,lng:-83.95384,zoom:10,mapType:'roadmap',marker:-1};
    
    orStatusList: any = [{ lable: "Available", value: "AVL" },{ lable: "Planned", value: "PLN" }];
    selectedOrStatus = { lable: "Available", value: "AVL" };
    cmpList: any = [{ lable: "Covenant", value: "CVEN" },{ lable: "SRT", value: "SRT" },{lable: "STAR", value: "STAR" }];
    selectedCmp = { lable: "Covenant", value: "CVEN" };
    milesList: any = [{ lable: "Select radius", value: 0 },{ lable: "50 Miles", value: 50 }, { lable: "100 Miles", value: 100 }, { lable: "150 Miles", value: 150 }];
    selectedMiles = { lable: "Select radius", value: 0 };
    trailerMileList: any = [{ lable: "50 Miles", value: 50 }, { lable: "100 Miles", value: 100 }, { lable: "150 Miles", value: 150 }];
    selectedTrailerMile = { lable: "50 Miles", value: 50 };
    action: any = { heading: "", body: "",details: ""};
    pingList=[];
    trResp=false;

    mgToggle = true;
    omgToggle = false;
    OrderDetailsResp = false;
    trucksDetailsResp = false;
    trailerDetailsResp=false;
    OrderLegsResp=false;
    yardDetailsResp=false;
    OrderTrailerTypeResp=false;
    historyRecv = false;
    disableTS = false;
    disableLoc = false;
    disableStatus = false;
    ifFirst = true;
    includeUNK=true;
    includeMT=true;
    trMapshowLoader=false;
    poolTrailers=false;
    allPoolTrailers=false;
    automatedMile=true;
    alloInProg=false;
    
    oRowCount = 50;
    truRowCount = 50;
    traRowCount = 50;
    geocoder = new google.maps.Geocoder();
    zone: NgZone;
    mapConfig: any = { lat: 36.090240, lng: -95.712891, zoom: 4, mapType: 'roadmap', marker: -1 };
    historyConfig: any = { showHistory: false, allTraillerSubSet: [], dataSet: [], backupDS: [], backupATS: [] };
    
    orderList: any = [];
    truckList: any = [];
    trailerList:any=[];
    mapTrailers:any=[];
    mappedTrailer:any=[];

    orders = {
        column: [{ name: "Order ID", width: "11%" },{ name: "Movement no.", width: "11%" },{ name: "Bill to party", width: "11%" }, { name: "Origin city", width: "11%" }, { name: "Destination city", width: "11%" }, { name: "Order origin point", width: "11%" },
        { name: "Order start date", width: "11%" }, { name: "Order end date", width: "11%" }, { name: "Order remark", width: "12%" } ],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    trucks = {
        column: [{ name: "Truck ID", width: "10%" }, { name: "Company", width: "10%" }, { name: "Make", width: "10%" }, { name: "Model", width: "10%" },
        { name: "Year", width: "10%" },{ name: "Type", width: "10%" },{ name: "Trailer", width: "10%" },{ name: "Distance (Approx. radius in miles)", width: "15%" },{ name: "Landmark", width: "15%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };
    
    trailers = {
        column: [{ name: "Trailer ID", width: "16%" }, { name: "Make", width: "14%" }, { name: "Model/type", width: "14%" }, { name: "Location", width: "14%" }, { name: "Distance (Approx. radius in miles)", width: "14%" },
        { name: "Available status", width: "14%" }, { name: "Last ping date", width: "14%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    endDate = { date: { year: 2018, month: 10, day: 9 } };
    fromDate: any = { date: { year: 20018, month: 10, day: 9 } };
    endDateBU = { date: { year: 2018, month: 10, day: 9 } };
    fromDateBU: any = { date: { year: 20018, month: 10, day: 9 } };
    private myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy',
        //disableUntil: this.endDate.date,
    
      };

    ngOnInit() {
        this.page=this.config.page;
    }

    constructor(private http: Http, private cdr: ChangeDetectorRef) {
        //this.getOrderDetails();
        this.initDateFilter();
        this.getOrderDetailsByFn(0);
        this.gettrailers();
    }

    ngOnChange(val: number) {
        console.log("values in allocation changed");
    }

    initDateFilter(){
        let edate = new Date();
        edate.setDate(edate.getDate() + 7 );
        this.endDate = {
          date: {
            year: edate.getFullYear(),
            month: edate.getMonth() + 1,
            day: edate.getDate()
          }
        };

        let fdate = new Date();
        fdate.setDate(fdate.getDate() - 3);
        this.fromDate = {
          date: {
            year: fdate.getFullYear(),
            month: fdate.getMonth() + 1,
            day: fdate.getDate()
          }
        };
    }

    selectCmp(item){
        this.selectedCmp = item;
    }
    selectMiles(item){
        this.selectedMiles = item;
    }

    selectOrStatus(item){
        this.selectedOrStatus = item;
    }
    selectTrailerMile(item){
        this.automatedMile=false;
        this.selectedTrailerMile = item;
    }


    goToTruck(){
        this.page=1;
        this.truckID="";
        this.getOrderTrailerType(0);
        this.getYardDetailes(0);
        this.getLegsOfOrder(0);
        this.getTractorsDetails(0);
        
    }

    goToOrder(){
        this.page=0;
        //this.getOrderDetails();
        this.getOrderDetailsByFn(0);
    }

    goToTrailer(){
        this.page=2;
        this.mgToggle=true;
        this.automatedMile=true;
        this.selectedTrailerMile = { lable: "50 Miles", value: 50 };
        this.poolTrailers=false;
        this.includeMT=true;
        this.includeUNK=true;
        this.trailerID="";
        this.selectedTrailer = {trailerID:-1};
        this.getOrderTruckTrailers(this.selectedOrder.orderOrginCityLat,this.selectedTruck.location.position.lat,this.selectedOrder.orderOrginCityLong,this.selectedTruck.location.position.lng,this.selectedTrailerMile.value,0);
        //this.getTrailersDetails(this.selectedTruck.location.position.lat,this.selectedTruck.location.position.lng,50);
        this.trMapConfig['selOrder']=this.selectedOrder;
        this.trMapConfig['selTruck']=this.selectedTruck;
        this.mapTrailers=this.cloneObje(this.trailerList);
    }
    
    goToSummary() {
        this.cdr.detectChanges();
        this.page = 3;
    }

    getSubmitConfirm(){
        $('#submitConfirm').modal('show');

    }

    isOrderDateFilterChanged(){
        var fromChanged=true;
        if(
            (this.fromDate.date.year==this.fromDateBU.date.year) &&
            (this.fromDate.date.month==this.fromDateBU.date.month) &&
            (this.fromDate.date.day==this.fromDateBU.date.day)
        ){
            fromChanged=false;
        }

        var endChanged=true;
        if(
            (this.endDate.date.year==this.endDateBU.date.year) &&
            (this.endDate.date.month==this.endDateBU.date.month) &&
            (this.endDate.date.day==this.endDateBU.date.day)
        ){
            endChanged=false;
        }

        if(fromChanged || endChanged){
            return true;
        }else{
            return false;
        }
    }

    orderSearch() {
        if(this.isOrderDateFilterChanged()){
            this.getOrderDetailsByFn(0);
        }
        if (this.omID.length > 0) {
            this.searchByomID();
        } else if (this.orderBylocation.length > 0) {
            this.filterOrderByLocation();
        }else{
            this.orderMasterAndFilter();
        }
    }

    truckSearch(){
        if(this.truckID.length>0){
            this.searchByTruckID();
        }else{
            this.searchByTruckID();
        }
        
    }

    unplan(){

    }

    trailerSearch(){
        if(this.trailerID.length>0){
            this.searchByTrailerID();
        }else{
            this.searchByTrailerID();
        }
    }

    showPlannedOrder(item){
        
        this.mappedTrailer=[];
        
        this.mappedOrderConfig.lat = item.orderOrginCityLat;
        this.mappedOrderConfig.lng = item.orderOrginCityLong;
        if(this.mappedOrderConfig.lng>0){
            this.mappedOrderConfig.lng=0-this.mappedOrderConfig.lng;
        }

        this.getPlannedOrderDetails(item.number);

        
    }
    
    closeOrderMap(){
        this.omgToggle=!this.omgToggle;
    }

    orderSelected(item: any) {
        if (this.selectedOrder.number != item.number) {
            this.selectedOrder = item;
            this.trMapConfig.lat = this.selectedOrder.orderOrginCityLat;
            this.trMapConfig.lng = this.selectedOrder.orderOrginCityLong;
            this.selectedTruck= {number:-1,type:"",make:"",company:"",model:"",distance:0,location:{landmark:""}};
            this.selectedTrailer = {trailerID:-1};
        } else {
            this.selectedOrder = { number: -1 };
            this.selectedTruck= {number:-1,type:"",make:"",company:"",model:"",distance:0,location:{landmark:""}};
            this.selectedTrailer = {trailerID:-1};
            this.trMapConfig.lat = undefined;
            this.trMapConfig.lng = undefined;
        }
    }

    truckSelected(item: any) {
        if (this.selectedTruck.number != item.number) {
            this.selectedTruck = item;
            this.selectedTrailer = {trailerID:-1};
            this.trMapConfig['truckLat'] = this.selectedTruck.location.position.lat;
            this.trMapConfig['truckLng'] = this.selectedTruck.location.position.lng;
        } else {
            this.selectedTruck = { number: -1, type: "", make: "", company: "", model: "", distance: 0, location: { landmark: "" } };
            this.selectedTrailer = {trailerID:-1};
            this.trMapConfig['truckLat'] = undefined;
            this.trMapConfig['truckLng'] = undefined;
        }
    }

    trSelectedFromMap(item){
        console.log("trailer is selected "+JSON.stringify(item));
        this.selectedTrailer=item;
        this.cdr.detectChanges();
    }

    trailerSelected(item: any) {
        if (this.selectedTrailer.trailerID != item.trailerID) {
            this.selectedTrailer = item;
            this.trMapConfig['trailerLat'] = this.selectedTrailer.latitude;
            this.trMapConfig['trailerLng'] = this.selectedTrailer.longitude;
            this.calcTotRouteDistance();
            this.mapTrailers=this.cloneObje(this.trailerList);

        } else {
            this.selectedTrailer = { trailerID: -1 };
            this.trMapConfig['trailerLat'] = undefined;
            this.trMapConfig['trailerLng'] = undefined;
            this.selectedTrailer['routeDistText'] = "";
            this.selectedTrailer['routeDist'] = "";
            this.mapTrailers=this.cloneObje(this.trailerList);

        }

    }

    calcTotRouteDistance() {
        var waypts = [];
        let start, end;
        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        end = new google.maps.LatLng(this.selectedOrder.orderOrginCityLat, this.selectedOrder.orderOrginCityLong);
        start = new google.maps.LatLng(this.selectedTruck.location.position.lat,this.selectedTruck.location.position.lng);

        if (this.selectedTrailer.latitude) {
            let orderStop = new google.maps.LatLng(this.selectedTrailer.latitude,this.selectedTrailer.longitude)
            waypts.push({
                location: orderStop,
                stopover: true
            });
        }

        var request = {
            origin: start,
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
        };

        var ctrl = this;
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var route = response.routes[0];
                var dist = 0;
                for (let i = 0; i < response.routes[0].legs.length; i++) {
                    var leg = response.routes[0].legs[i];
                    dist += leg.distance.value;

                }
                dist = Math.round(dist * 0.000621371192);
                ctrl.selectedTrailer['routeDistText'] = dist + "miles Approx. to reach order origin";
                ctrl.selectedTrailer['routeDist'] = dist + " miles";
            }
        });
    }

    resetOrderPage() {
        this.orderBylocation = "";
        this.omID = "";
        this.selectedCmp = { lable: "Covenant", value: "CVEN" };
        this.selectedOrStatus = { lable: "Available", value: "AVL" };
        this.selectedOrder= {number:-1};
        //this.getOrderDetails();
        this.initDateFilter();
        
        this.getOrderDetailsByFn(0);
    }

    resetTruckPage() {
        this.truckBylocation = "";
        this.truckID = "";
        this.selectedMiles = { lable: "Select radius", value: 0 };
        this.selectedTruck = {number:-1};
        this.getTractorsDetails(0);
    }

    resetTrailerPage() {
        this.trailerBylocation = "";
        this.trailerID = "";
        this.selectedTrailerMile = { lable: "50 Miles", value: 50 };
        this.selectedTrailer = {trailerID:-1};
        this.poolTrailers=false;
        this.includeMT=true;
        this.includeUNK=true;
        //this.getTrailersDetails(this.selectedOrder.orderOrginCityLat,this.selectedOrder.orderOrginCityLong,50);
        //this.trailers.groups=[];
        this.getOrderTruckTrailers(this.selectedOrder.orderOrginCityLat,this.selectedTruck.location.position.lat,this.selectedOrder.orderOrginCityLong,this.selectedTruck.location.position.lng,this.selectedTrailerMile.value,0);
    }



    toggleMG() {
        
        this.mgToggle = !this.mgToggle;
        this.trMapConfig['selOrder']=this.selectedOrder;
        this.trMapConfig['selTruck']=this.selectedTruck;
        if (this.selectedTrailer.trailerID != -1) {
            this.trMapConfig['trailerLat'] = this.selectedTrailer.latitude;
            this.trMapConfig['trailerLng'] = this.selectedTrailer.longitude;
            this.mapTrailers=this.cloneObje(this.trailerList);

        } else {
            this.trMapConfig['trailerLat'] = undefined;
            this.trMapConfig['trailerLng'] = undefined;
            this.mapTrailers=this.cloneObje(this.trailerList);
        }
        if (this.mgToggle) {
            this.trMapshowLoader=false;
            //this.searchID = "";
            //this.bylocation = "";
            //this.disableLoc = false;
            //this.disableStatus = false;
            //this.disableTS = false;
        } else {

            //this.searchID = "";
            //this.bylocation = "";
            //this.disableLoc = true;
            //this.disableStatus = false;
            //this.disableTS = true;
            this.traRowCount = 50;
        }
    }

    orderToggleSearch(item: any) {
        if (item == 1) {
            this.orderBylocation = "";
        } else if (item == 2) {
            this.omID = "";
            
        }
    }
    
    truckToggleSearch(item: any) {
        if (item == 1) {
            this.truckBylocation = "";
        } else if (item == 2) {
            this.truckID = "";
            
        }
    }
    
    trailerToggleSearch(item: any) {
        if (item == 1) {
            this.trailerBylocation = "";
        } else if (item == 2) {
            this.trailerID = "";
            
        }
    }

    formatDateTime(item: any) {
        if (item != "") {
            if (item != "UNKNOWN") {
                var ary = item.split('T');
                var date = ary[0].split('-');
                //var time = ary[1].split(':');
                //var secs = time[2].split('.');
                var newD = new Date(date[0], date[1] - 1, date[2]);
                //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
                var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + ary[1];
                return SDate;
            } else {
                return item;
            }
        }

    }

    formatTrDateTime(item: any) {
        if (item != "") {
            if (item != "UNKNOWN") {
                var ary = item.split(' ');
                var date = ary[0].split('-');
                var tim = ary[1].split('.');
                var time=tim[0].split(':');
                var newD = new Date(date[0], date[1] - 1, date[2]);
                //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
                var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + tim[0];
                return SDate;
            } else {
                return item;
            }
        }

    }

    

    searchByomID() {
        this.orderList = [];
        this.omID = this.omID.toUpperCase();
        for (let i = 0; i < this.orders.groups.length; i++) {
            var obj = this.orders.groups[i];
            if (this.omID == "") {
                if (this.selectedCmp.value == obj['company'] && this.selectedOrStatus.value == obj['status']) {
                    this.orderList.push(obj);
                }
            } else if (this.omID == obj['number'] || this.omID == obj['move']) {
                if (this.selectedCmp.value == obj['company'] && this.selectedOrStatus.value == obj['status']) {
                    this.orderList.push(obj);
                }
            }
        }
        //this.orderMasterAndFilter();
    }

    searchByTruckID() {
        this.truckList = [];
        this.truckID = this.truckID.toUpperCase();
        for (let i = 0; i < this.trucks.groups.length; i++) {
            var obj = this.trucks.groups[i];
            if (this.truckID == "") {
                if (this.selectedOrder.company == obj['company'] && obj['status'] == "AVL") {
                    this.truckList.push(obj);
                }

            } else if (this.truckID == obj['number'] && this.selectedOrder.company == obj['company'] && obj['status'] == "AVL") {
                this.truckList.push(obj);
            }
        }
        this.truckList=this.sortList('distance',this.truckList);
    }

    searchByTrailerID() {
        this.trailerList = [];
        this.trailerID=this.trailerID.toUpperCase();
        for (let i = 0; i < this.trailers.groups.length; i++) {
            var obj = this.trailers.groups[i];
            
            if (this.trailerID == "") {
                this.trailerList.push(obj);
            }else if (this.trailerID == obj['trailerID']) {
                this.trailerList.push(obj);
            }
        }
        //this.sortList('distance',this.trailerList);
        this.mapTrailers=this.cloneObje(this.trailerList);
    }

    filterOrderByLocation() {
        this.orderList = [];
        for (let i = 0; i < this.orders.groups.length; i++) {
            var obj = this.orders.groups[i];
             var conCity=obj['origin'].toLowerCase().includes(this.orderBylocation.toLowerCase())
            if (conCity) {
                if (this.selectedCmp.value == obj['company'] && this.selectedOrStatus.value == obj['status']) {
                    this.orderList.push(obj);
                }
            }
        }
        //this.orderMasterAndFilter();
    }

    cloneObje(list:any){
        var clone=JSON.parse(JSON.stringify(list));
        return clone;
    }

    filterByCmpType() {
        if (this.omID.length == 0 && this.orderBylocation.length == 0) {
            this.orderList = [];
            for (let i = 0; i < this.orders.groups.length; i++) {
                var obj = this.orders.groups[i];
                if (this.selectedCmp.value == obj['company']) {
                    this.orderList.push(obj);
                }
            }
        }else{
            var bag = [];
            for (let i = 0; i < this.orderList.length; i++) {
                var objt = this.orderList[i];
                if (this.selectedCmp.value == objt['company']) {
                    bag.push(objt);
                }
            }
            this.orderList=this.cloneObje(bag);
        }
    }

    filterByOrStatus() {
        if (this.omID.length == 0 && this.bylocation.length == 0) {
            this.orderList = [];
            for (let i = 0; i < this.orders.groups.length; i++) {
                var obj = this.orders.groups[i];
                if (this.selectedCmp.value == obj['company']) {
                    this.orderList.push(obj);
                }
            }
        }else{
            var bag = [];
            for (let i = 0; i < this.orderList.length; i++) {
                var objt = this.orderList[i];
                if (this.selectedCmp.value == objt['company']) {
                    bag.push(objt);
                }
            }
            this.orderList=this.cloneObje(bag);
        }
    }

    orderMasterAndFilter(){
        if (this.omID.length == 0 && this.orderBylocation.length == 0) {
            this.orderList = [];
            for (let i = 0; i < this.orders.groups.length; i++) {
                var obj = this.orders.groups[i];
                if (this.selectedCmp.value == obj['company'] && this.selectedOrStatus.value == obj['status']) {
                    this.orderList.push(obj);
                }
            }
        }else{
            if(this.omID.length>0){
                this.searchByomID();
            }else if(this.orderBylocation.length>0){
                this.filterOrderByLocation();
            }
            //var bag = [];
            // for (let i = 0; i < this.orderList.length; i++) {
            //     var objt = this.orderList[i];
            //     if (this.selectedCmp.value == objt['company'] && this.selectedOrStatus.value == objt['orderStatus']) {
            //         bag.push(objt);
            //     }
            // }
            // this.orderList=this.cloneObje(bag);
        }

    }

    filterTrucksByOrder() {
        this.truckList = [];
        for (let i = 0; i < this.trucks.groups.length; i++) {
            var obj = this.trucks.groups[i];
            if (this.selectedOrder.company == obj['company'] && obj['status'] == "AVL") {
                this.truckList.push(obj);
            }
        }
    }

    filterTrucksByDistance() {
        this.truckID="";
        this.truckList = [];
        for (let i = 0; i < this.trucks.groups.length; i++) {
            var obj = this.trucks.groups[i];
            if (this.selectedMiles.value == 0) {
                if (this.selectedOrder.company == obj['company'] && obj['status'] == "AVL") {
                    this.truckList.push(obj);
                }
            } else {
                if (this.selectedOrder.company == obj['company'] && obj['status'] == "AVL" && obj['distance'] <= this.selectedMiles.value) {
                    this.truckList.push(obj);
                }
            }
        }
        this.truckList=this.sortList('distance',this.truckList);
    }

    filterTrailerByMile(option:number){
        if(option==1){
            if(this.poolTrailers){
                this.allPoolTrailers=false;
            }
        }else if(option==2){
            if(this.allPoolTrailers){
                this.poolTrailers=false;
            }    
        }
        

        this.selectedTrailer = {trailerID:-1};
        this.getOrderTruckTrailers(this.selectedOrder.orderOrginCityLat,this.selectedTruck.location.position.lat,this.selectedOrder.orderOrginCityLong,this.selectedTruck.location.position.lng,this.selectedTrailerMile.value,0);
    }

    filterTrailerByType() {
        this.trailerList = [];
        for (let i = 0; i < this.trailers.groups.length; i++) {
            var obj = this.trailers.groups[i];
            if (this.includeUNK) {
                if (this.selectedOrder.company == obj['company']) {
                    if (this.trailerID == "") {
                        if (this.selectedOrder.orderTrailerType == "") {
                            if(this.includeMT){
                                this.trailerList.push(obj);
                            }else if(!this.includeMT && obj['isEmpty']!=1){
                                this.trailerList.push(obj);
                            }
                        } else if (this.selectedOrder.orderTrailerType == "REEDRY") {
                            if (obj['trailerType'] == "DRY" || obj['trailerType'] == "REEFER" || obj['trailerType'] == "UNK") {
                                if(this.includeMT){
                                    this.trailerList.push(obj);
                                }else if(!this.includeMT && obj['isEmpty']!=1){
                                    this.trailerList.push(obj);
                                }
                            }
                        } else if (this.selectedOrder.orderTrailerType == obj['trailerType'] || obj['trailerType'] == "UNK") {
                            if(this.includeMT){
                                this.trailerList.push(obj);
                            }else if(!this.includeMT && obj['isEmpty']!=1){
                                this.trailerList.push(obj);
                            }
                        }
                    } else if (this.trailerID == obj['trailerID']) {
                        if (this.selectedOrder.orderTrailerType == "") {
                            if(this.includeMT){
                                this.trailerList.push(obj);
                            }else if(!this.includeMT && obj['isEmpty']!=1){
                                this.trailerList.push(obj);
                            }
                        } else if (this.selectedOrder.orderTrailerType == "REEDRY") {
                            if (obj['trailerType'] == "DRY" || obj['trailerType'] == "REEFER" || obj['trailerType'] == "UNK") {
                                if(this.includeMT){
                                    this.trailerList.push(obj);
                                }else if(!this.includeMT && obj['isEmpty']!=1){
                                    this.trailerList.push(obj);
                                }
                            }
                        } else if (this.selectedOrder.orderTrailerType == obj['trailerType'] || obj['trailerType'] == "UNK") {
                            if(this.includeMT){
                                this.trailerList.push(obj);
                            }else if(!this.includeMT && obj['isEmpty']!=1){
                                this.trailerList.push(obj);
                            }
                        }

                    }
                }
            } else {
                if (this.selectedOrder.company == obj['company']) {
                    if (this.trailerID == "") {
                        if (this.selectedOrder.orderTrailerType == "") {
                            if(this.includeMT){
                                this.trailerList.push(obj);
                            }else if(!this.includeMT && obj['isEmpty']!=1){
                                this.trailerList.push(obj);
                            }
                        } else if (this.selectedOrder.orderTrailerType == "REEDRY") {
                            if (obj['trailerType'] == "DRY" || obj['trailerType'] == "REEFER") {
                                if(this.includeMT){
                                    this.trailerList.push(obj);
                                }else if(!this.includeMT && obj['isEmpty']!=1){
                                    this.trailerList.push(obj);
                                }
                            }
                        } else if (this.selectedOrder.orderTrailerType == obj['trailerType']) {
                            if(this.includeMT){
                                this.trailerList.push(obj);
                            }else if(!this.includeMT && obj['isEmpty']!=1){
                                this.trailerList.push(obj);
                            }
                        }
                    }else if(this.trailerID == obj['trailerID']){
                        if (this.selectedOrder.orderTrailerType == "") {
                            if(this.includeMT){
                                this.trailerList.push(obj);
                            }else if(!this.includeMT && obj['isEmpty']!=1){
                                this.trailerList.push(obj);
                            }
                        } else if (this.selectedOrder.orderTrailerType == "REEDRY") {
                            if (obj['trailerType'] == "DRY" || obj['trailerType'] == "REEFER") {
                                if(this.includeMT){
                                    this.trailerList.push(obj);
                                }else if(!this.includeMT && obj['isEmpty']!=1){
                                    this.trailerList.push(obj);
                                }
                            }
                        } else if (this.selectedOrder.orderTrailerType == obj['trailerType']) {
                            if(this.includeMT){
                                this.trailerList.push(obj);
                            }else if(!this.includeMT && obj['isEmpty']!=1){
                                this.trailerList.push(obj);
                            }
                        }
                    }
                }
            }
        }
        
        this.mapTrailers = this.cloneObje(this.trailerList);
    }

    
    

    
    calcTruckDistance(long1, lat1) {
        let erdRadius = 6371e3;
        let meineLatitude=this.selectedOrder.orderOrginCityLat;
        let meineLongitude=this.selectedOrder.orderOrginCityLong;
        
        let gLat1=this.selectedOrder.orderOrginCityLat;
        let gLng1=this.selectedOrder.orderOrginCityLong;

        let gLat2=lat1;
        let gLng2=long1;

        meineLongitude = meineLongitude * (Math.PI / 180);
        meineLatitude = meineLatitude * (Math.PI / 180);
        long1 = long1 * (Math.PI / 180);
        lat1 = lat1 * (Math.PI / 180);

        let x0 = meineLongitude * erdRadius * Math.cos(meineLatitude);
        let y0 = meineLatitude * erdRadius;

        let x1 = long1 * erdRadius * Math.cos(lat1);
        let y1 = lat1 * erdRadius;

        let dx = x0 - x1;
        let dy = y0 - y1;

        let d = Math.sqrt((dx * dx) + (dy * dy));
        
        if(this.isValidLatLng(gLat2,gLng2)){
            var latLngA = new google.maps.LatLng(gLat1,gLng1);
            var latLngB = new google.maps.LatLng(gLat2,gLng2);
            //var dis=google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);
            //return Math.round(dis*0.000621371192)+" -- "+Math.round(d*0.000621371192);
            //return Math.round(dis*0.000621371192);
            return Math.round(d*0.000621371192);
        }else{
            return -1;
        }
        
    }

    isValidLatLng(lat,lng){
        if(lat!=0 && lng !=0){
            return true;
        }
        return false;
    }

    googleDistCalc(lat,lng){
        let gLat1=this.selectedOrder.orderOrginCityLat;
        let gLng1=this.selectedOrder.orderOrginCityLong;
        
        let gLat2=lat;
        let gLng2=lng;

        var latLngA = new google.maps.LatLng(gLat1,gLng1);
        var latLngB = new google.maps.LatLng(gLat2,gLng2);
        
        var dis=google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);
        //return Math.round(dis*0.000621371192)+" -- "+Math.round(d*0.000621371192);
        return Math.round(dis*0.000621371192);
    }



    getLatLngByGeoCode(place) {    
        console.log(place);
        var ctrl = this;
        var geocoder = this.geocoder;
        var combo = "";
        this.geocoder.geocode({ 'address': place }, function (results: any, status: any) {
            if (status === 'OK') {
                
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                ctrl.selectedOrder.orderOrginCityLat = lat;
                ctrl.selectedOrder.orderOrginCityLong = lng;
                ctrl.trMapConfig.lat = lat;
                ctrl.trMapConfig.lng = lng;
            } else {
                //alert('Geocode was not successful for the following reason: ' + status);
                $('#yardunExpecError').modal('show');
                console.log("getLatLngByGeoCode:no location to search");
            }
        });

    }

    reset() {
        this.bylocation = "";
        this.searchID = "";
        this.selectedID = "";
        this.mapConfig = { lat: 36.090240, lng: -95.712891, zoom: 4, mapType: 'roadmap' };
        this.selectedCmp = { lable: "SVN", value: "SVN" };

        //this.getOrderDetails();
        this.getOrderDetailsByFn(0);
        if (this.mgToggle) {

            this.disableLoc = false;
            this.disableTS = false;
        } else {
            this.selectedTrStatus = { status: "Available", value: 2 };
            this.disableLoc = true;
            this.disableStatus = false;
            this.disableTS = true;
        }
    }
    
    orderTableScrolled(this: any) {
        console.log("scrolling");
        var raw = document.getElementById('tgBody');
        if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {

            this.oRowCount += 50;
            if (this.oRowCount > this.orderList.length) {
                this.oRowCount = this.orderList.length;
            }
        }
    }

    trucktableScrolled(this: any) {
        console.log("scrolling");
        var raw = document.getElementById('tgBody');
        if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {

            this.truRowCount += 50;
            if (this.truRowCount > this.truckList) {
                this.truRowCount = this.truckList;
            }
        }
    }
    
    trailertableScrolled(this: any) {
        console.log("scrolling");
        var raw = document.getElementById('tgBody');
        if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {

            this.traRowCount += 50;
            if (this.traRowCount > this.trailerList) {
                this.traRowCount = this.trailerList;
            }
        }
    }

    sortList(prop, list) {
        var sortedlist = list.sort((a: any, b: any) => {
            if (a[prop] < b[prop]) {
                return -1;
            } else if (a[prop] > b[prop]) {
                return 1;
            } else {
                return 0;
            }

        });
        return sortedlist;
    }

    filterInvalidData(list, key) {
        var bag = [];
        list.forEach(element => {
            var item = element[key];
            if (item != "") {
                if (item != "UNKNOWN") {
                    var ary = item.split('T');
                    var date = ary[0].split('-');
                    var time = ary[1].split(':');
                    if (time[1] == '01' || time[1] == '1') {

                    } else {
                        bag.push(element);
                    }
                } else {
                    bag.push(element);
                }
            } else {
                bag.push(element);
            }
        });
        return bag;
    }

    filterAvlOrders(list){
        var bag=[];
        var notbag=[];
        list.forEach(element => {
            if(element.trailer==null && element.status=="AVL"){
                bag.push(element);
            }else{
                notbag.push(element);
            }
            
        });
        console.log(notbag);
        console.log("not bag count "+notbag.length);
        return bag;

    }

    sortListByTime(list, key) {
        var bag = list.sort((item1, item2) => {
            var ary1 = item1[key].split('T');
            var date1 = ary1[0].split('-');
            var item1D = new Date(date1[0], date1[1] - 1, date1[2]);
            var tim1 = ary1[1].split('.');
            var time1 = tim1[0].split(':');
            item1D.setHours(time1[0], time1[1], time1[2]);

            var ary2 = item2[key].split('T');
            var date2 = ary2[0].split('-');
            var item2D = new Date(date2[0], date2[1] - 1, date2[2]);
            var tim2 = ary2[1].split('.');
            var time2 = tim2[0].split(':');
            item2D.setHours(time2[0], time2[1], time2[2]);

            if (item1D > item2D) {
                return 1;
            } else if (item1D < item2D) {
                return -1;
            } else {
                return 0;
            }
        });
        return bag;
    }

    getTractorsDetails(count: number) {
        this.trucksDetailsResp = false;
        var creds = "username=" + config.username + "&password=" + config.password;

        let authToken = "Basic";
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', 'Basic ' +
            btoa(config.username + ':' + config.password));


        let options = new RequestOptions({ headers: headers });
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        //let url=config.ctgApiUrl+"/assets/tractors";
        let url = config.baseUrl+"/AllocationService/api/TruckDetails";
        this.http.get(url, {
            headers: headers
        }).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("tractors data recieved");
                //this.trucks.groups = data.data;
                this.trucks.groups = data.dataSet;
                for (var i = 0; i < this.trucks.groups.length; i++) {
                    let obj = this.trucks.groups[i];
                    var dist = this.calcTruckDistance(obj['location']['position']['lng'], obj['location']['position']['lat']);
                    if (dist == -1) {
                        this.trucks.groups.splice(i, 1);
                        i--;
                    } else {
                        obj['distance'] = dist;
                        this.trucks.groups[i] = obj;
                        this.truckList[i] = obj;
                    }

                }
                this.trucks.groups = this.sortList('distance', this.trucks.groups);
                this.truckList = this.cloneObje(this.trucks.groups);
                this.filterTrucksByOrder();
                this.truckList = this.sortList('distance', this.truckList);
                this.trucksDetailsResp = true;
            }, //For Success Response
            (err) => {
                console.log("tractors error recieved with count= " + count);
                if (count < 3) {
                    this.getTractorsDetails(count+1);
                } else {
                    this.trucksDetailsResp = true;
                    this.action.heading = "Allocation";
                    this.action.body = "Unexpected Error occured. Please contact system administrator.";
                    this.action.details = 'tractors service failed<br>' + url + '<br>Status: ' + err.status;
                    $('#unExpecError').modal('show');
                }
            } //For Error Response
            );
    }

    getTrailersDetails(lat, lng, dist, count: number) {
        this.trailerDetailsResp = false;
        this.trMapshowLoader = false;
        //let lat=this.selectedOrder.orderOrginCityLat;
        //let lng=this.selectedOrder.orderOrginCityLong;
        if (lng > 0) {
            lng = 0 - lng;
        }
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        let url = config.baseUrl + "/AllocationService/api/OrderTrailers?latitude=" + lat
            + "&longitude=" + lng + "&distance=" + dist + "&company=" + this.selectedOrder.company + "&trailerId=" + this.selectedTruck.trailer;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("trailers data recieved");
                this.trailers.groups = this.trailers.groups.concat(data.dataSet);
                this.trailerList = this.trailerList.concat(data.dataSet);
                this.filterTrailerByType();
                this.trailers.groups = this.sortList('distance', this.trailers.groups);
                this.mapTrailers = this.cloneObje(this.trailerList);
                this.trailerDetailsResp = true;

            }, //For Success Response
            (err) => {
                console.log("trailers error recieved with count= " + count);
                if (count < 3) {
                    this.getTrailersDetails(lat, lng, dist, count + 1);
                } else {
                    this.trailerDetailsResp = true;
                    this.action.heading = "Allocation";
                    this.action.body = "Unexpected Error occured. Please contact system administrator.";
                    this.action.details = 'OrderTrailers service failed<br>' + url + '<br>Status: ' + err.status;
                    $('#unExpecError').modal('show');
                }
            } //For Error Response
            );
    }

    getOrderTruckTrailers(lat1, lat2, lng1, lng2, dist, count: number) {
        this.trailerDetailsResp = false;
        this.trMapshowLoader = false;
        //let lat=this.selectedOrder.orderOrginCityLat;
        //let lng=this.selectedOrder.orderOrginCityLong;
        if (lng1 > 0) {
            lng1 = 0 - lng1;
        }
        if (lng2 > 0) {
            lng2 = 0 - lng2;
        }

        var toShowPool;
        if (this.poolTrailers||this.allPoolTrailers) {
            toShowPool = 'yes';
        } else {
            toShowPool = 'no';
        }
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";

        let url = config.baseUrl + "/AllocationService/api/OrderTruckTrailers?latitude=" + lat2 + "&longitude=" + lng2 + "&distance=" + dist + "&company=" + this.selectedOrder.company + "&trailerId=" + this.selectedTruck.trailer + '&pooltrailers=' + toShowPool;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                var limit=0;
                if((this.selectedTruck.trailer=="" || this.selectedTruck.trailer==undefined)){
                    console.log("No pool trailers found for the chosen fitlers");
                    limit=0;
                }else if((this.selectedTruck.trailer!="" && this.selectedTruck.trailer )){
                    console.log("No pool trailers found for the chosen fitlers");
                    limit=1;
                }
                console.log("trailers data recieved");

                if (data.dataSet.length <= 1 && this.automatedMile && dist <= 100) {
                    this.getOrderTruckTrailers(lat1, lat2, lng1, lng2, dist + 50, count);

                } else {
                    if (dist == 50) {
                        this.selectedTrailerMile = { lable: "50 Miles", value: 50 };
                    } else if (dist == 100) {
                        this.selectedTrailerMile = { lable: "100 Miles", value: 100 };
                    } else if (dist == 150) {
                        this.selectedTrailerMile = { lable: "150 Miles", value: 150 };
                    }
                    this.automatedMile=false;
                    if(this.allPoolTrailers){
                        this.trailers.groups = data.dataSet;
                        this.trailerList = data.dataSet;
                    } else {
                        var bag = data.dataSet.filter(
                            item => item.trailerStatus === "AVL");
                        this.trailers.groups = bag;
                        this.trailerList = bag;
                        this.filterTrailerByType();
                    }
                    
                    this.trailers.groups = this.sortList('distance', this.trailers.groups);
                    this.mapTrailers = this.cloneObje(this.trailerList);
                    this.trailerDetailsResp = true;
                }

            }, //For Success Response
            (err) => {
                console.log("trailers error recieved with count= " + count);
                if (count < 3) {
                    this.getOrderTruckTrailers(lat1, lat2, lng1, lng2, dist, count + 1);
                } else {
                    this.trailerDetailsResp = true;
                    this.action.heading = "Allocation";
                    this.action.body = "Unexpected Error occured. Please contact system administrator.";
                    this.action.details = 'OrderTruckTrailers service failed<br>' + url + '<br>Status: ' + err.status;
                    $('#unExpecError').modal('show');
                }
            } //For Error Response
            );
    }


    getOrderDetails() {
        this.OrderDetailsResp = false;
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        let url = config.baseUrl + "/AllocationService/api/OrderDetails";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("OrderDetails data recieved");
                this.orders.groups = data.dataSet;
                this.orderList = data.dataSet;
                this.orderMasterAndFilter();
                this.OrderDetailsResp = true;


            }, //For Success Response
            (err) => {
                console.log("OrderDetails error recieved");
                this.OrderDetailsResp = true;
                $('#unExpecError').modal('show');
            } //For Error Response
            );
    }

    getOrderDetailsByFn(count: number) {
        this.OrderDetailsResp = false;
        //2017-09-26T10:00:00&end=2017-09-29T10:00:00
        let fDate=this.fromDate.date.year+"-"+this.fromDate.date.month+"-"+this.fromDate.date.day+"T00:00:00";
        let eDate=this.endDate.date.year+"-"+this.endDate.date.month+"-"+this.endDate.date.day+"T23:59:59";
        this.fromDateBU=this.cloneObje(this.fromDate);
        this.endDateBU=this.cloneObje(this.endDate);
        var creds = "username=" + config.username + "&password=" + config.password;

        let authToken = "Basic";
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', 'Basic ' +
            btoa(config.username + ':' + config.password));


        let options = new RequestOptions({ headers: headers });
        //let url = config.ctgApiUrl + "/assets/orders/AVL";
        let url = config.ctgApiUrl + "/assets/orders/avl?start="+fDate+"&end="+eDate;
        this.http.get(url, {
            headers: headers
        }).map(res => res.json())
            .subscribe(
            (data) => {
                
                console.log("OrderDetailsByFn data recieved");
                var bag = this.filterInvalidData(data.data, 'departure');
                bag = this.filterAvlOrders(bag);
                bag = this.sortListByTime(bag, 'departure');
                this.orders.groups = bag;
                this.orderList = bag;
                this.orderMasterAndFilter();
                this.OrderDetailsResp = true;

            }, //For Success Response
            (err) => {
                console.log("OrderDetailsByFn error recieved with count= " +count);
                if (count < 3) {
                    this.getOrderDetailsByFn(count+1);
                } else {
                    this.OrderDetailsResp = true;
                    this.action.heading = "Allocation";
                    this.action.body = "Unexpected Error occured. Please contact system administrator.";
                    this.action.details = 'orders service failed<br>' + url + '<br>Status: ' + err.status;
                    $('#unExpecError').modal('show');
                }
            } //For Error Response
            );
    }

    gettrailers() {
        this.trResp = false;
        var creds = "username=" + config.username + "&password=" + config.password;

        let authToken = "Basic";
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', 'Basic ' +
            btoa(config.username + ':' + config.password));


        let options = new RequestOptions({ headers: headers });
        let url = config.ctgApiUrl + "/assets/trailers";
        this.http.get(url, {
            headers: headers
        }).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("tr data recieved");
                var bag=[];
                data.data.forEach(element => {
                    var item={latitude:0,longitude:0,trailerID:0};
                    item.latitude=element.location.position.lat;
                    item.longitude=element.location.position.lng;
                    item.trailerID=element.number;
                    bag.push(item);
                });
                this.pingList=bag;

            }, //For Success Response
            (err) => {
                console.log("OrderDetailsByFn error recieved");
                this.OrderDetailsResp = true;
                this.action.heading="Allocation";
                this.action.body="Unexpected Error occured. Please contact system administrator.";
                this.action.details='orders service failed<br>'+url+'<br>Status: '+err.status;
                $('#unExpecError').modal('show');
            } //For Error Response
            );
    }

    getLegsOfOrder(count: number) {
        this.OrderLegsResp = false;
        var creds = "username=" + config.username + "&password=" + config.password;

        let authToken = "Basic";
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', 'Basic ' +
            btoa(config.username + ':' + config.password));


        let options = new RequestOptions({ headers: headers });
        //let url = config.ctgApiUrl + "/assets/order/"+this.selectedOrder.number+"/legs";
        let url = config.ctgApiUrl + "/assets/order/" + this.selectedOrder.number + "/legs";
        this.http.get(url, {
            headers: headers
        }).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("OrderLegsOfOrder data recieved");
                this.selectedOrder['legs'] = data;
                this.selectedOrder['legsC'] = data.join();
                this.OrderLegsResp = true;

            }, //For Success Response
            (err) => {
                console.log("OrderLegsOfOrder error recieved with count= " + count);
                if (count < 3) {
                    this.getLegsOfOrder(count + 1);
                } else {
                    this.OrderLegsResp = false;
                    this.action.heading = "Allocation";
                    this.action.body = "Unexpected Error occured. Please contact system administrator.";
                    this.action.details = 'Legs service failed<br>' + url + '<br>Status: ' + err.status;
                    $('#unExpecError').modal('show');
                }
            } //For Error Response
            );
    }
//////
    getOrderTrailerType(count: number) {
        this.OrderTrailerTypeResp = false;
        //let url = config.ctgApiUrl + "/assets/order/"+this.selectedOrder.number+"/legs";
        let url = config.baseUrl + "/AllocationService/api/OrderTrailerType?orderNumber=" + this.selectedOrder.number;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("OrderTrailerType data recieved");
                if (data.dataSet.length > 0) {
                    this.selectedOrder['orderTrailerType'] = data.dataSet[0].ordersTrailerType;
                } else {
                    this.selectedOrder['orderTrailerType'] = "";
                    console.log("No specific trailerType for order found");
                }
            }, //For Success Response
            (err) => {
                console.log("OrderTrailerType error recieved with count= "+count);
                if (count < 3) {
                    this.getOrderTrailerType(count + 1);
                } else {
                    this.OrderTrailerTypeResp = false;
                    this.action.heading = "Allocation";
                    this.action.body = "Unexpected Error occured. Please contact system administrator.";
                    this.action.details = 'OrderTrailerType service failed<br>' + url + '<br>Status: ' + err.status;
                    $('#unExpecError').modal('show');
                }
            } //For Error Response
            );
    }

    getYardDetailes(count: number) {
        this.yardDetailsResp = false;
        var creds = "username=" + config.username + "&password=" + config.password;

        let authToken = "Basic";
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', 'Basic ' +
            btoa(config.username + ':' + config.password));


        let options = new RequestOptions({ headers: headers });
        //let url = config.ctgApiUrl + "/assets/order/"+this.selectedOrder.number+"/legs";
        let url = config.ctgApiUrl + "/assets/yard/" + this.selectedOrder.shipper;
        this.http.get(url, {
            headers: headers
        }).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("yardDetails data recieved");
                this.selectedOrder.orderOrginCityLat = data.location.position.lat;
                this.selectedOrder.orderOrginCityLong = data.location.position.lng;
                this.trMapConfig.lat = this.selectedOrder.orderOrginCityLat;
                this.trMapConfig.lng = this.selectedOrder.orderOrginCityLong;
                this.yardDetailsResp = true;

            }, //For Success Response
            (err) => {
                console.log("yardDetails error recieved with count= "+count);
                if (count < 3) {
                    this.getYardDetailes(count + 1);
                } else {
                    this.yardDetailsResp = false;
                    this.getLatLngByGeoCode(this.selectedOrder.origin);
                }

            } //For Error Response
            );
    }

    

    getPlannedOrderDetails(item) {
        this.OrderDetailsResp = false;
        //let url="https://ctgtest.com/AllocationService/api/PlannedOrderDetail?orderID=2896133";
        let url = config.baseUrl + "/AllocationService/api/PlannedOrderDetail?orderID=" + item;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("PlannedOrderDetails data recieved");
                //this.orders.groups=data.dataSet;
                if (data.dataSet.length > 0) {
                    this.mappedOrderConfig['truckLat'] = data.dataSet[0].tractorLat;
                    this.mappedOrderConfig['truckLng'] = data.dataSet[0].tractorLong;

                    this.mappedOrderConfig['trailerLat'] = data.dataSet[0].trailerLat;
                    this.mappedOrderConfig['trailerLng'] = data.dataSet[0].trailerLong;

                    if (this.mappedOrderConfig.truckLng > 0) {
                        this.mappedOrderConfig.truckLng = 0 - this.mappedOrderConfig.truckLng;
                    }

                    if (this.mappedOrderConfig.trailerLng > 0) {
                        this.mappedOrderConfig.trailerLng = 0 - this.mappedOrderConfig.trailerLng;
                    }

                    this.omgToggle = !this.omgToggle;
                    this.OrderDetailsResp = true;
                } else {
                    this.OrderDetailsResp = true;
                    alert("no maping found");
                }


            }, //For Success Response
            (err) => {
                console.log("PlannedOrderDetails error recieved");
                this.OrderDetailsResp = true;
                this.action.heading="Allocation";
                this.action.body="Unexpected Error occured. Please contact system administrator.";
                this.action.details='PlannedOrderDetails service failed<br>'+url+'<br>Status: '+err.status;
                $('#unExpecError').modal('show');
            } //For Error Response
            );
    }

    toSubmit() {
        this.allocateInTMW();
        this.alloInProg=true;
        //$('#waiting').modal('show');
    }

    allocateInTMW(){    
        
        var creds = "username=" + config.username + "&password=" + config.password;

        let authToken = "Basic";
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', 'Basic ' +
            btoa(config.username + ':' + config.password));

        //let options = new RequestOptions({ headers: headers });
        let options={
            headers: headers
        };
        let postBody = {
            "order": this.selectedOrder.number,
            "trailer": this.selectedTrailer.trailerID,
            "legs": this.selectedOrder.legs
        };
        //let url = config.ctgApiUrl + "/assets/order/"+this.selectedOrder.number+"/legs";
        let url = config.ctgApiUrl + "/assets/order/assign_trailer";
        
        
        this.http.post(url,postBody,options ).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("allocateInTMW data recieved");
                if(data.trailer==this.selectedTrailer.trailerID){
                    console.log("TMS Trailers matches with TMW Trailer");
                    this.allocateInTMS(1);
                }else{
                    console.log("TMS Trailers do not match with TMW Trailer");
                    this.allocateInTMS(0);
                }
                //this.allocateInTMS();
            }, //For Success Response
            (err) => {
                console.log("allocateInTMW error recieved");
                this.allocateInTMS(0);
            } //For Error Response
            );
    }

    allocateInTMS(flag) {
        console.log("submit allocation");
        this.OrderDetailsResp = false;
        let headers = new Headers({ 'Content-Type': 'application/json;', 'Accept': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let bo = {
            order: this.selectedOrder,
            truck: this.selectedTruck,
            trailer: this.selectedTrailer
        }
        let body = {
            "orderID": this.selectedOrder.number,
            "OrderLegs": this.selectedOrder.legsC,
            "movementNumber": this.selectedOrder.move,
            "orderOriginCityState": this.selectedOrder.origin,
            "orderDestinationCityState": this.selectedOrder.destination,
            "orderStartDate": this.selectedOrder.departure,
            "orderCompletionDate": this.selectedOrder.arrival,
            "orderShipper": this.selectedOrder.shipper,
            "orderBillTo": this.selectedOrder.bill_to,
            "truckID": this.selectedTruck.number,
            "truckCompany": this.selectedOrder.company,
            "trailerID": this.selectedTrailer.trailerID,
            "trailerType": this.selectedTrailer.trailerType,
            "trailerName": this.selectedTrailer.trailerName,
        };
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        let url = config.baseUrl + "/AllocationService/api/InsertOrderAllocation";
        this.http.post(url, body, options).map(res => res.json())
            .subscribe(
            (data) => {
                this.alloInProg=false;
                //$('#waiting').modal('hide');
                console.log("OrderDetails data recieved");
                if (data.status == 1) {
                    
                    if(flag==0){
                        this.action.heading="Allocation status";
                        this.action.body="Trailer planned successfully in TMS. Mapping failed in TMW, please update TMW manually.";
                        $('#failedResult').modal('show');    
                    }else{
                        $('#successResult').modal('show');
                    }

                    //reset order page
                    this.orderBylocation = "";
                    this.omID = "";
                    this.selectedCmp = { lable: "Covenant", value: "CVEN" };
                    this.selectedOrStatus = { lable: "Available", value: "AVL" };
                    this.selectedOrder= {number:-1};
                    this.initDateFilter();
                    
                    //reset truck page
                    this.truckBylocation = "";
                    this.truckID = "";
                    this.selectedMiles = { lable: "Select radius", value: 0 };
                    this.selectedTruck = {number:-1};
                    
                    //reset trialer page
                    this.trailerBylocation = "";
                    this.trailerID = "";
                    this.selectedTrailerMile = { lable: "50 Miles", value: 50 };
                    this.selectedTrailer = {trailerID:-1};
                    this.poolTrailers=false;
                    this.includeMT=true;
                    this.includeUNK=true;
                    
                    // this.resetTruckPage();
                    // this.resetOrderPage();
                    // this.resetTrailerPage();
                    
                    this.goToOrder();
                } else {
                    //alert("failed");
                    this.action.heading="Allocation status";
                    this.action.body="Error in allocating order.";
                    $('#failedResult').modal('show');
                }
            }, //For Success Response
            (err) => {
                this.alloInProg=false;
                //$('#waiting').modal('hide');
                console.log("OrderDetails error recieved");
                this.OrderDetailsResp = true;
                this.action.heading="Allocation status";
                this.action.body="Error in allocating order.";
                $('#failedResult').modal('show');
            } //For Error Response
            );
    }

}
