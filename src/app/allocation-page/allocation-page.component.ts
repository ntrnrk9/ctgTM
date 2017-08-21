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
    selectedTrStatus: any = { status: "Available", value: 2 };
    selectedAvailability: number = -1;
    bylocation: String = "";
    orderBylocation: String = "";
    truckBylocation: String = "";
    selectedID: any;
    searchID: String = "";
    omID:String="";
    truckID:String="";
    trailHistory: any;
    test: Number = 9;
    
    orStatusList: any = [{ lable: "Available", value: "AVL" },{ lable: "Planned", value: "PLN" }];
    selectedOrStatus = { lable: "Available", value: "AVL" };
    cmpList: any = [{ lable: "COVENANT", value: "CVEN" },{ lable: "SRT", value: "SRT" },{lable: "STAR", value: "STAR" }];
    selectedCmp = { lable: "COVENANT", value: "CVEN" };
    milesList: any = [{ lable: "50 Miles", value: 50 }, { lable: "100 Miles", value: 100 }, { lable: "150 Miles", value: 150 }];
    selectedMiles = { lable: "150 Miles", value: 150 };
    
    mgToggleFlag = true;
    OrderDetailsResp = false;
    trucksDetailsResp = false;
    historyRecv = false;
    disableTS = false;
    disableLoc = false;
    disableStatus = false;
    ifFirst = true;
    oRowCount = 50;
    truRowCount = 50;
    geocoder = new google.maps.Geocoder();
    zone: NgZone;
    action: any = { heading: "", body: "" };
    mapConfig: any = { lat: 36.090240, lng: -95.712891, zoom: 4, mapType: 'roadmap', marker: -1 };
    historyConfig: any = { showHistory: false, allTraillerSubSet: [], dataSet: [], backupDS: [], backupATS: [] };
    
    orderList: any = [];
    truckList: any = [];

    orders = {
        column: [{ name: "Order ID", width: "10%" },{ name: "Movement no.", width: "10%" }, { name: "Ref. no.", width: "10%" },{ name: "Bill to name", width: "10%" }, { name: "Origin city", width: "10%" }, { name: "Destination city", width: "10%" }, { name: "Service", width: "10%" },
        { name: "Order start date", width: "10%" }, { name: "Order end date", width: "10%" }, { name: "Order remark", width: "10%" } ],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    trucks = {
        column: [{ name: "Truck ID", width: "10%" }, { name: "Company", width: "10%" }, { name: "Make", width: "10%" }, { name: "Model", width: "10%" },
        { name: "Year", width: "15%" },{ name: "Type", width: "15%" },{ name: "Distance in miles", width: "15%" },{ name: "Landmark", width: "15%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };
    
    trailers = {
        column: [{ name: "Trailer ID", width: "10%" }, { name: "Trailer name", width: "10%" }, { name: "Trailer type", width: "10%" }, { name: "Location", width: "10%" }, { name: "Allocation status", width: "10%" },
        { name: "Compilance status", width: "10%" }, { name: "Road worthiness status", width: "10%" }, { name: "Last DOT inspection date ", width: "10%" },{ name: "Accessory/IOT information", width: "10%" },{ name: "Last movement date ", width: "10%" }],
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


    goToTruck(){
        this.page=1;
        this.getTractorsDetails();
    }

    goToOrder(){
        this.page=0;
    }

    goToTrailer(){
        this.page=2;
    }
    
    goToSummary() {
        this.page = 3;
    }

    orderSelected(item:any){
        this.selectedOrder=item;

    }

    resetOrderPage() {
        this.orderBylocation = "";
        this.omID = "";
        this.selectedCmp = { lable: "COVENANT", value: "CVEN" };
        this.getOrderDetails();
    }

    resetTruckPage() {
        this.truckBylocation = "";
        this.truckID = "";
        this.selectedMiles = { lable: "150 Miles", value: 150 };
        this.getTractorsDetails();
    }


    toggleMG() {
        
        this.mgToggleFlag = !this.mgToggleFlag;
        if (this.mgToggleFlag) {
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
            this.oRowCount = 50;
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

    formatDateTime(item: any) {
        if (item != "") {
            var ary = item.split(' ');
            var date = ary[0].split('-');
            var newD = new Date(date[0], date[1] - 1, date[2]);
            //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
            var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + ary[1];
            return SDate;
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
        for (let i = 0; i < this.orders.groups.length; i++) {
            var obj = this.orders.groups[i];
            if (this.omID == obj['orderNumber']||this.omID == obj['movementNumber']) {
                this.orderList.push(obj);
            }
        }
        this.orderMasterAndFilter();
    }

    searchByTruckID() {
        this.truckList = [];
        for (let i = 0; i < this.trucks.groups.length; i++) {
            var obj = this.trucks.groups[i];
            if (this.truckID == obj['number']) {
                this.truckList.push(obj);
            }
        }
    }

    filterOrderByLocation() {
        this.orderList = [];
        for (let i = 0; i < this.orders.groups.length; i++) {
            var obj = this.orders.groups[i];
             var conCity=obj['orderOrginCity'].toLowerCase().includes(this.orderBylocation.toLowerCase())
            if (conCity) {
                this.orderList.push(obj);
            }
        }
        this.orderMasterAndFilter();
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
            var bag = [];
            for (let i = 0; i < this.orderList.length; i++) {
                var objt = this.orderList[i];
                if (this.selectedCmp.value == objt['orderCompany'] && this.selectedOrStatus.value == obj['orderStatus']) {
                    bag.push(objt);
                }
            }
            this.orderList=this.cloneObje(bag);
        }

    }

    filterTrucksByOrder(){
        this.truckList=[];
        for(let i=0;i<this.trucks.groups.length;i++){
            var obj=this.trucks.groups[i];
            if(this.selectedOrder.orderCompany==obj['company'] && obj['status']=="AVL"){
                this.truckList.push(obj);
            }
        }
    }

    
    

    
    calcTruckDistance(long1, lat1) {
        let erdRadius = 6371e3;
        let meineLatitude=this.selectedOrder.orderOrginCityLat;
        let meineLongitude=0-this.selectedOrder.orderOrginCityLong;
        
        let gLat1=this.selectedOrder.orderOrginCityLat;
        let gLng1=0-this.selectedOrder.orderOrginCityLong;

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
         var dis=google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);
        //return Math.round(dis*0.000621371192)+" -- "+Math.round(d*0.000621371192);
        return Math.round(dis*0.000621371192);
        //return Math.round(d);
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
            if (this.mgToggleFlag) {

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
        if (this.mgToggleFlag) {

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
        if (this.mgToggleFlag) {

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

            this.oRowCount += 50;
            if (this.truRowCount > this.truckList) {
                this.truRowCount = this.truckList;
            }
        }
    }

    sortTrucks(prop) {
        this.truckList = this.truckList.sort((a: any, b: any) => {
            if (a[prop] < b[prop]) {
                return -1;
            } else if (a[prop] > b[prop]) {
                return 1;
            } else {
                return 0;
            }

        });
    }

    getTractorsDetails() {
        this.trucksDetailsResp = false;
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        let url = config.ctgApiUrl + "/assets/tractors";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("tractors data recieved");
                this.trucks.groups=data.data;
                this.truckList=data.data;
                this.trucksDetailsResp = true;
                for(var i=0;i<this.trucks.groups.length;i++){
                    let obj=this.trucks.groups[i];
                    obj['distance']=this.calcTruckDistance(obj['location']['position']['lng'],obj['location']['position']['lat']);
                    this.trucks.groups[i]=obj;
                    this.truckList[i]=obj;
                }
                this.filterTrucksByOrder();
                this.sortTrucks('distance');


            }, //For Success Response
            (err) => { console.log("tractors error recieved"); this.trucksDetailsResp = true; } //For Error Response
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

}
