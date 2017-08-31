import { Component,Input,Output, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { GmapjsComponent } from '../gmapjs/gmapjs.component';
import { Gmtest } from '../gmtest/gmtest.component';

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
        column: ["Status", "Order#", "Order date", "Origin name", "Bill to name", "Origin city", "Destination city", "Service", "Ref#", "Ref type", "Order remark", "Action"]
    };


    selectedOrder: any = {orderNumber:-1};
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
    trailerTypeList: any = [{ lable: "Select a type", value: "" },{ lable: "Reefer", value: "REEFER" }, { lable: "Dry", value: "DRY" }];
    selectedTrailerType = { lable: "Select a type", value: "" };

    mgToggle = false;
    omgToggle = false;
    OrderDetailsResp = false;
    trucksDetailsResp = false;
    trailerDetailsResp=false;
    historyRecv = false;
    disableTS = false;
    disableLoc = false;
    disableStatus = false;
    ifFirst = true;
    oRowCount = 50;
    truRowCount = 50;
    traRowCount = 50;
    geocoder = new google.maps.Geocoder();
    zone: NgZone;
    action: any = { heading: "", body: "" };
    mapConfig: any = { lat: 36.090240, lng: -95.712891, zoom: 4, mapType: 'roadmap', marker: -1 };
    historyConfig: any = { showHistory: false, allTraillerSubSet: [], dataSet: [], backupDS: [], backupATS: [] };
    
    orderList: any = [];
    truckList: any = [];
    trailerList:any=[];
    mapTrailers:any=[];
    mappedTrailer:any=[];

    orders = {
        column: [{ name: "Order ID", width: "10%" },{ name: "Movement no.", width: "10%" }, { name: "Ref. no.", width: "10%" },{ name: "Bill to name", width: "10%" }, { name: "Origin city", width: "10%" }, { name: "Destination city", width: "10%" }, { name: "Order origin point", width: "10%" },
        { name: "Order start date", width: "10%" }, { name: "Order end date", width: "10%" }, { name: "Order remark", width: "10%" } ],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    trucks = {
        column: [{ name: "Truck ID", width: "10%" }, { name: "Company", width: "10%" }, { name: "Make", width: "10%" }, { name: "Model", width: "10%" },
        { name: "Year", width: "10%" },{ name: "Type", width: "10%" },{ name: "Trailer", width: "10%" },{ name: "Distance (Approx. radius in miles)", width: "15%" },{ name: "Landmark", width: "15%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };
    
    trailers = {
        column: [{ name: "Trailer ID", width: "16%" }, { name: "Trailer name", width: "14%" }, { name: "Trailer type", width: "14%" }, { name: "Location", width: "14%" }, { name: "Distance (Approx. radius in miles)", width: "14%" },
        { name: "Available status", width: "14%" }, { name: "Last trailer ping", width: "14%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    ngOnInit() {
        this.page=this.config.page;
    }

    constructor(private http: Http, private cdr: ChangeDetectorRef) {
        this.getOrderDetails();
    }

    ngOnChange(val: number) {
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
    selectTrailerType(item){
        this.selectedTrailerType = item;
    }


    goToTruck(){
        this.page=1;
        this.getTractorsDetails();
        
    }

    goToOrder(){
        this.page=0;
        this.getOrderDetails();
    }

    goToTrailer(){
        this.page=2;
        this.mgToggle=false;
        //this.trailers.groups=[];
        //this.getTrailersDetails(this.selectedOrder.orderOrginCityLat,this.selectedOrder.orderOrginCityLong,50);
        //this.getTrailersDetails(this.selectedTruck.location.position.lat,this.selectedTruck.location.position.lng,50);
        this.getOrderTruckTrailers(this.selectedOrder.orderOrginCityLat,this.selectedTruck.location.position.lat,this.selectedOrder.orderOrginCityLong,this.selectedTruck.location.position.lng,50);
    }
    
    goToSummary() {
        this.page = 3;
    }

    getSubmitConfirm(){
        $('#submitConfirm').modal('show');

    }

    orderSearch() {
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

        this.getPlannedOrderDetails(item.orderNumber);

        
    }
    
    closeOrderMap(){
        this.omgToggle=!this.omgToggle;
    }

    orderSelected(item: any) {
        if (this.selectedOrder.orderNumber != item.orderNumber) {
            this.selectedOrder = item;
            this.trMapConfig.lat = this.selectedOrder.orderOrginCityLat;
            this.trMapConfig.lng = this.selectedOrder.orderOrginCityLong;
        } else {
            this.selectedOrder = { orderNumber: -1 };
            this.trMapConfig.lat = undefined;
            this.trMapConfig.lng = undefined;
        }
    }

    truckSelected(item: any) {
        if (this.selectedTruck.number != item.number) {
            this.selectedTruck = item;
            this.trMapConfig['truckLat'] = this.selectedTruck.location.position.lat;
            this.trMapConfig['truckLng'] = this.selectedTruck.location.position.lng;
        } else {
            this.selectedTruck = { number: -1, type: "", make: "", company: "", model: "", distance: 0, location: { landmark: "" } };
            this.trMapConfig['truckLat'] = undefined;
            this.trMapConfig['truckLng'] = undefined;
        }
    }

    trailerSelected(item: any) {
        if (this.selectedTrailer.trailerID != item.trailerID) {
            this.selectedTrailer = item;
            this.trMapConfig['trailerLat'] = this.selectedTrailer.latitude;
            this.trMapConfig['trailerLng'] = this.selectedTrailer.longitude;
            this.mapTrailers=this.cloneObje(this.trailerList);

        } else {
            this.selectedTrailer = { trailerID: -1 };
            this.trMapConfig['trailerLat'] = undefined;
            this.trMapConfig['trailerLng'] = undefined;
            this.mapTrailers=this.cloneObje(this.trailerList);

        }

    }

    resetOrderPage() {
        this.orderBylocation = "";
        this.omID = "";
        this.selectedCmp = { lable: "Covenant", value: "CVEN" };
        this.selectedOrStatus = { lable: "Available", value: "AVL" };
        this.selectedOrder= {orderNumber:-1};
        this.getOrderDetails();
    }

    resetTruckPage() {
        this.truckBylocation = "";
        this.truckID = "";
        this.selectedMiles = { lable: "Select radius", value: 0 };
        this.selectedTruck = {number:-1};
        this.getTractorsDetails();
    }

    resetTrailerPage() {
        this.trailerBylocation = "";
        this.trailerID = "";
        this.selectedTrailerType = { lable: "Select a type", value: "" };
        this.selectedTrailer = {trailerID:-1};
        //this.getTrailersDetails(this.selectedOrder.orderOrginCityLat,this.selectedOrder.orderOrginCityLong,50);
        //this.trailers.groups=[];
        this.getOrderTruckTrailers(this.selectedOrder.orderOrginCityLat,this.selectedTruck.location.position.lat,this.selectedOrder.orderOrginCityLong,this.selectedTruck.location.position.lng,50);
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

    search() {
        if (this.bylocation.length > 0) {
            this.getvalue();
        } else if (this.searchID.length > 0) {
            //this.searchByID();
        } else {
            if (this.disableStatus) {
                this.action.heading = "Trailer search";
                this.action.body = 'Enter a valid input.';
                $('#result').modal('show');
            }
        }
    }

    searchByomID() {
        this.orderList = [];
        this.omID = this.omID.toUpperCase();
        for (let i = 0; i < this.orders.groups.length; i++) {
            var obj = this.orders.groups[i];
            if (this.omID == "") {
                if (this.selectedCmp.value == obj['orderCompany'] && this.selectedOrStatus.value == obj['orderStatus']) {
                    this.orderList.push(obj);
                }
            } else if (this.omID == obj['orderNumber'] || this.omID == obj['movementNumber']) {
                if (this.selectedCmp.value == obj['orderCompany'] && this.selectedOrStatus.value == obj['orderStatus']) {
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
                if (this.selectedOrder.orderCompany == obj['company'] && obj['status'] == "AVL") {
                    this.truckList.push(obj);
                }

            } else if (this.truckID == obj['number'] && this.selectedOrder.orderCompany == obj['company'] && obj['status'] == "AVL") {
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
             var conCity=obj['orderOrginCity'].toLowerCase().includes(this.orderBylocation.toLowerCase())
            if (conCity) {
                if (this.selectedCmp.value == obj['orderCompany'] && this.selectedOrStatus.value == obj['orderStatus']) {
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
                if (this.selectedCmp.value == obj['orderCompany']) {
                    this.orderList.push(obj);
                }
            }
        }else{
            var bag = [];
            for (let i = 0; i < this.orderList.length; i++) {
                var objt = this.orderList[i];
                if (this.selectedCmp.value == objt['orderCompany']) {
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
                if (this.selectedCmp.value == obj['orderCompany']) {
                    this.orderList.push(obj);
                }
            }
        }else{
            var bag = [];
            for (let i = 0; i < this.orderList.length; i++) {
                var objt = this.orderList[i];
                if (this.selectedCmp.value == objt['orderCompany']) {
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
                if (this.selectedCmp.value == obj['orderCompany'] && this.selectedOrStatus.value == obj['orderStatus']) {
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
            //     if (this.selectedCmp.value == objt['orderCompany'] && this.selectedOrStatus.value == objt['orderStatus']) {
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
            if (this.selectedOrder.orderCompany == obj['company'] && obj['status'] == "AVL") {
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
                if (this.selectedOrder.orderCompany == obj['company'] && obj['status'] == "AVL") {
                    this.truckList.push(obj);
                }
            } else {
                if (this.selectedOrder.orderCompany == obj['company'] && obj['status'] == "AVL" && obj['distance'] <= this.selectedMiles.value) {
                    this.truckList.push(obj);
                }
            }
        }
        this.truckList=this.sortList('distance',this.truckList);
    }

    filterTrailerByType(){
        if (this.trailerID.length == 0) {
            this.trailerList = [];
            for (let i = 0; i < this.trailers.groups.length; i++) {
                var obj = this.trailers.groups[i];
                if (this.selectedTrailerType.value == "") {
                    if (this.selectedOrder.orderCompany == obj['company']) {
                        this.trailerList.push(obj);
                    }

                } else {
                    if (this.selectedTrailerType.value == obj['trailerType'] && this.selectedOrder.orderCompany == obj['company']) {
                        this.trailerList.push(obj);
                    }
                }
            }
        } else {
            this.trailerList = [];
            this.trailerID=this.trailerID.toUpperCase();
            for (let i = 0; i < this.trailers.groups.length; i++) {
                var objt = this.trailers.groups[i];
                if (this.selectedTrailerType.value == "") {
                    if (this.selectedOrder.orderCompany == obj['company']) {
                        this.trailerList.push(obj);
                    }

                } else {
                    if (this.selectedTrailerType.value == objt['trailerType'] && this.selectedOrder.orderCompany == objt['company'] && this.trailerID == objt['trailerID']) {
                        this.trailerList.push(objt);
                    }
                }
            }
            //this.trailerList=this.cloneObje(bag);
        }
        this.mapTrailers=this.cloneObje(this.trailerList);
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
        var latLngA = new google.maps.LatLng(gLat1,gLng1);
        var latLngB = new google.maps.LatLng(gLat2,gLng2);
        //var dis=google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);
        //return Math.round(dis*0.000621371192)+" -- "+Math.round(d*0.000621371192);
        //return Math.round(dis*0.000621371192);
        return Math.round(d*0.000621371192);
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



    getLatLngByGeoCode() {
        var input = $('#ctgGeoCode').val();
        console.log(input);
        this.bylocation = input;
        var ctrl = this;
        var geocoder = this.geocoder;
        var combo = "";
        var address = this.bylocation;

        this.geocoder.geocode({ 'address': address }, function (results: any, status: any) {
            if (status === 'OK') {
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                combo = "latitude=" + lat + "&longitude=" + lng;
                ctrl.mapConfig.lat = lat;
                ctrl.mapConfig.lng = lng;
                ctrl.mapConfig.zoom = 10;

            } else {
                //alert('Geocode was not successful for the following reason: ' + status);
                $('#inValidRes').modal('show');
                console.log("getLatLngByGeoCode:no location to search");
            }
        });

    }



    getvalue() {
        var input = $('#ctgGeoCode').val();
        console.log(input);
        this.bylocation = input;
        if (this.bylocation != "") {
            if (this.mgToggle) {

                this.getLatLngByGeoCode();
            } else {
                this.getLatLngByGeoCode();
            }
        } else {
            //alert("Enter a location to search");
            this.action.heading = "Geocode";
            this.action.body = 'Please enter a location to search.';
            $('#result').modal('show');
        }
        //f.geocodeAddress(this.bylocation);
    }

    setByLocation() {
        var input = $('#ctgGeoCode').val();
        console.log(input);
        this.bylocation = input;
        if (this.mgToggle) {

            this.getLatLngByGeoCode();
        } else {
            this.getLatLngByGeoCode();
        }
    }
    reset() {
        this.bylocation = "";
        this.searchID = "";
        this.selectedID = "";
        this.mapConfig = { lat: 36.090240, lng: -95.712891, zoom: 4, mapType: 'roadmap' };
        this.selectedCmp = { lable: "SVN", value: "SVN" };

        this.getOrderDetails();
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

    trucktableScrolled(this:any){
console.log("scrolling");
        var raw = document.getElementById('tgBody');
        if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {

            this.truRowCount += 50;
            if (this.truRowCount > this.truckList) {
                this.truRowCount = this.truckList;
            }
        }
    }
    
    trailertableScrolled(this:any){
console.log("scrolling");
        var raw = document.getElementById('tgBody');
        if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {

            this.traRowCount += 50;
            if (this.traRowCount > this.trailerList) {
                this.traRowCount = this.trailerList;
            }
        }
    }

    sortList(prop,list) {
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

    getTractorsDetails() {
        this.trucksDetailsResp = false;
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        let url = config.ctgApiUrl + "/assets/tractors";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("tractors data recieved");
                this.trucksDetailsResp = true;
                this.trucks.groups=data.data;
                this.truckList=data.data;
                this.trucks.groups=this.sortList('distance',this.trucks.groups);
                for(var i=0;i<this.trucks.groups.length;i++){
                    let obj=this.trucks.groups[i];
                    obj['distance']=this.calcTruckDistance(obj['location']['position']['lng'],obj['location']['position']['lat']);
                    this.trucks.groups[i]=obj;
                    this.truckList[i]=obj;
                }
                this.filterTrucksByOrder();
                this.truckList=this.sortList('distance',this.truckList);


            }, //For Success Response
            (err) => { console.log("tractors error recieved"); this.trucksDetailsResp = true; } //For Error Response
            );
    }

    getTrailersDetails(lat,lng,dist) {
        this.trailerDetailsResp = false;
        //let lat=this.selectedOrder.orderOrginCityLat;
        //let lng=this.selectedOrder.orderOrginCityLong;
        if(lng>0){
            lng=0-lng;
        }
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        let url = config.baseUrl + "/AllocationService/api/OrderTrailers?latitude="+lat
        +"&longitude="+lng+"&distance="+dist+"&company="+this.selectedOrder.orderCompany+"&trailerId="+this.selectedTruck.trailer;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("trailers data recieved");
                this.trailers.groups=this.trailers.groups.concat(data.dataSet);
                this.trailerList=this.trailerList.concat(data.dataSet);
                this.filterTrailerByType();
                this.trailers.groups=this.sortList('distance',this.trailers.groups);
                this.mapTrailers=this.cloneObje(this.trailerList);
                this.trailerDetailsResp = true;
                
            }, //For Success Response
            (err) => { console.log("trailers error recieved"); this.trailerDetailsResp = true; } //For Error Response
            );
    }

    getOrderTruckTrailers(lat1,lat2,lng1,lng2,dist) {
        this.trailerDetailsResp = false;
        //let lat=this.selectedOrder.orderOrginCityLat;
        //let lng=this.selectedOrder.orderOrginCityLong;
        if(lng1>0){
            lng1=0-lng1;
        }
        if(lng2>0){
            lng2=0-lng2;
        }
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        
        let url = config.baseUrl + "/AllocationService/api/OrderTruckTrailers?latitude="+lat1+","+lat2
        +"&longitude="+lng1+","+lng2+"&distance="+dist+"&company="+this.selectedOrder.orderCompany+"&trailerId="+this.selectedTruck.trailer;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("trailers data recieved");
                if(data.dataSet.length<=1){
                    this.getOrderTruckTrailers(lat1,lat2,lng1,lng2,dist+50);

                }else{
                this.trailers.groups=data.dataSet;
                this.trailerList=data.dataSet;
                this.filterTrailerByType();
                this.trailers.groups=this.sortList('distance',this.trailers.groups);
                this.mapTrailers=this.cloneObje(this.trailerList);
                this.trailerDetailsResp = true;
                }
                
            }, //For Success Response
            (err) => { console.log("trailers error recieved"); this.trailerDetailsResp = true; } //For Error Response
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
                this.orders.groups=data.dataSet;
                this.orderList=data.dataSet;
                this.orderMasterAndFilter();
                this.OrderDetailsResp = true;


            }, //For Success Response
            (err) => { console.log("OrderDetails error recieved"); this.OrderDetailsResp = true; } //For Error Response
            );
    }

    getPlannedOrderDetails(item) {
        this.OrderDetailsResp = false;
        //let url="https://ctgtest.com/AllocationService/api/PlannedOrderDetail?orderID=2896133";
        let url = config.baseUrl + "/AllocationService/api/PlannedOrderDetail?orderID="+item;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("PlannedOrderDetails data recieved");
                //this.orders.groups=data.dataSet;
                if(data.dataSet.length>0){
                this.mappedOrderConfig['truckLat'] = data.dataSet[0].tractorLat;
                this.mappedOrderConfig['truckLng'] = data.dataSet[0].tractorLong;
        
                this.mappedOrderConfig['trailerLat'] = data.dataSet[0].trailerLat;
                this.mappedOrderConfig['trailerLng'] = data.dataSet[0].trailerLong;

                if(this.mappedOrderConfig.truckLng>0){
                    this.mappedOrderConfig.truckLng=0-this.mappedOrderConfig.truckLng;
                }

                if(this.mappedOrderConfig.trailerLng>0){
                    this.mappedOrderConfig.trailerLng=0-this.mappedOrderConfig.trailerLng;
                }
        
                this.omgToggle=!this.omgToggle;
                this.OrderDetailsResp = true;
                }else{
                    this.OrderDetailsResp = true;
                    alert("no maping found");
                }


            }, //For Success Response
            (err) => { console.log("PlannedOrderDetails error recieved"); this.OrderDetailsResp = true; } //For Error Response
            );
    }

    toSubmit() {
        console.log("submit allocation");
        this.OrderDetailsResp = false;
        let headers = new Headers({ 'Content-Type': 'application/json;', 'Accept': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let bo={
            order: this.selectedOrder,
            truck:this.selectedTruck,
            trailer:this.selectedTrailer
        }
        let body = {
            "orderID": this.selectedOrder.orderNumber,
            "movementNumber":this.selectedOrder.movementNumber,
            "orderName": this.selectedOrder.orderName, 
            "orderOriginCity": this.selectedOrder.orderOrginCity, 
            "orderDestinationCity": this.selectedOrder.orderDestCity,
            
            "truckID": this.selectedTruck.number, 
            "truckCompany": this.selectedOrder.orderCompany, 
            "trailerID": this.selectedTrailer.trailerID,
            "trailerType": this.selectedTrailer.trailerType, 
            "trailerName": this.selectedTrailer.trailerName,
            
        };
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        let url = config.baseUrl + "/AllocationService/api/InsertOrderAllocation";
        this.http.post(url,body,options).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("OrderDetails data recieved");
                if(data.status==1){
                    //alert("success");
                    $('#successResult').modal('show');
                    this.goToOrder();
                }else{
                    //alert("failed");
                    $('#failedResult').modal('show');
                }
            }, //For Success Response
            (err) => { console.log("OrderDetails error recieved"); this.OrderDetailsResp = true;$('#failedResult').modal('show'); } //For Error Response
            );
    }

    itemObj={
        "orderNumber": "1889405",
        "orderOrginCity": "West Chester",
        "orderOrginState": "PA",
        "orderOrginCityLat": 39.96,
        "orderOrginCityLong": 75.6,
        "orderOrginPoint": "ADUWES02",
        "orderDestCity": "West Chester",
        "orderDestState": "PA",
        "orderDestPoint": "ADUWES02",
        "orderStartDate": "2049-12-31 23:59:00.000",
        "orderCompleteDate": "2050-01-07 10:59:00.000",
        "orderCompany": "CVEN",
        "orderStatus": "AVL",
        "orderBillTo": "A DUIE PYLE INC-DEDICATED",
        "orderRefNumber": "",
        "orderRemark": "",
        "movementNumber": "2231740"
        };

}
