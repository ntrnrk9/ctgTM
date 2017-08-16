import { Component, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
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
    page=0;
    data = {
        rows: [
            ["Available", "2343443", "05-20-2017 08:30", "Chattanooga ", "Walmart", "Atlanta,GA", "Buford,GA", "SOLO", "2342345", "SID", "all set",],
            ["Available", "2343444", "05-20-2017 09:30", "West depot", "Fedex", "Ontario OH", "Bufford,GA", "SOLO", "2342345", "SID", "all set",],
            ["Available", "2343445", "05-20-2017 10:30", "CTG ", "VH Transport", "Bentonville,AR", "Bufford,GA", "SOLO", "2342345", "SID", "all set",]],
        column: ["Status", "Order#", "Order date", "Origin name", "Bill to name", "Origin city", "Destination city", "Service", "Ref#", "Ref type", "Order remark", "Action"]
    };


    selectedState: any = "alabama";
    selectedTrStatus: any = { status: "Available", value: 2 };
    selectedAvailability: number = -1;
    bylocation: String = "";
    selectedID: any;
    searchID: String = "";
    orderID:String="";
    trailHistory: any;
    test: Number = 9;
    selectedMarker: any = { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" };
    stateList: any = [{ "stateDesc": "Alaska", "stateCode": "AK", "country": "USA" }, { "stateDesc": "Alabama", "stateCode": "AL", "country": "USA" }, { "stateDesc": "Arkansas", "stateCode": "AR", "country": "USA" }, { "stateDesc": "Arizona", "stateCode": "AZ", "country": "USA" }, { "stateDesc": "California", "stateCode": "CA", "country": "USA" }, { "stateDesc": "Colorado", "stateCode": "CO", "country": "USA" }, { "stateDesc": "Connecticut", "stateCode": "CT", "country": "USA" }, { "stateDesc": "District of Columbia", "stateCode": "DC", "country": "USA" }, { "stateDesc": "Delaware", "stateCode": "DE", "country": "USA" }, { "stateDesc": "Florida", "stateCode": "FL", "country": "USA" }, { "stateDesc": "Georgia", "stateCode": "GA", "country": "USA" }, { "stateDesc": "Hawaii", "stateCode": "HA", "country": "USA" }, { "stateDesc": "Iowa", "stateCode": "IA", "country": "USA" }, { "stateDesc": "Idaho", "stateCode": "ID", "country": "USA" }, { "stateDesc": "Illinois", "stateCode": "IL", "country": "USA" }, { "stateDesc": "Indiana", "stateCode": "IN", "country": "USA" }, { "stateDesc": "Kansas", "stateCode": "KS", "country": "USA" }, { "stateDesc": "Kentucky", "stateCode": "KY", "country": "USA" }, { "stateDesc": "Louisiana", "stateCode": "LA", "country": "USA" }, { "stateDesc": "Massachusetts", "stateCode": "MA", "country": "USA" }, { "stateDesc": "Maryland", "stateCode": "MD", "country": "USA" }, { "stateDesc": "Maine", "stateCode": "ME", "country": "USA" }, { "stateDesc": "Michigan", "stateCode": "MI", "country": "USA" }, { "stateDesc": "Minnesota", "stateCode": "MN", "country": "USA" }, { "stateDesc": "Missouri", "stateCode": "MO", "country": "USA" }, { "stateDesc": "Mississippi", "stateCode": "MS", "country": "USA" }, { "stateDesc": "Montana", "stateCode": "MT", "country": "USA" }, { "stateDesc": "North Carolina", "stateCode": "NC", "country": "USA" }, { "stateDesc": "North Dakota", "stateCode": "ND", "country": "USA" }, { "stateDesc": "Nebraska", "stateCode": "NE", "country": "USA" }, { "stateDesc": "New Hampshire", "stateCode": "NH", "country": "USA" }, { "stateDesc": "New Jersey", "stateCode": "NJ", "country": "USA" }, { "stateDesc": "New Mexico", "stateCode": "NM", "country": "USA" }, { "stateDesc": "Nevada", "stateCode": "NV", "country": "USA" }, { "stateDesc": "New York", "stateCode": "NY", "country": "USA" }, { "stateDesc": "Ohio", "stateCode": "OH", "country": "USA" }, { "stateDesc": "Oklahoma", "stateCode": "OK", "country": "USA" }, { "stateDesc": "Oregon", "stateCode": "OR", "country": "USA" }, { "stateDesc": "Pennsylvania", "stateCode": "PA", "country": "USA" }, { "stateDesc": "Rhode Island", "stateCode": "RI", "country": "USA" }, { "stateDesc": "South Carolina", "stateCode": "SC", "country": "USA" }, { "stateDesc": "South Dakota", "stateCode": "SD", "country": "USA" }, { "stateDesc": "Tennessee", "stateCode": "TN", "country": "USA" }, { "stateDesc": "Texas", "stateCode": "TX", "country": "USA" }, { "stateDesc": "Utah", "stateCode": "UT", "country": "USA" }, { "stateDesc": "Virginia", "stateCode": "VA", "country": "USA" }, { "stateDesc": "Vermont", "stateCode": "VT", "country": "USA" }, { "stateDesc": "Washington", "stateCode": "WA", "country": "USA" }, { "stateDesc": "Wisconsin", "stateCode": "WI", "country": "USA" }, { "stateDesc": "West Virginia", "stateCode": "WV", "country": "USA" }, { "stateDesc": "Wyoming", "stateCode": "WY", "country": "USA" }];
    trStatusList: any = [{ status: "Select a status", value: -1 }, { status: "Confirmed", value: 0 }, { status: "Planned", value: 1 }, { status: "Available", value: 2 }]
    cmpList: any = [{ lable: "SVN", value: "SVN" }, { lable: "Covenant", value: "CVN" }, {lable: "Star", value: "STR" }];
    selectedCmp = { lable: "SVN", value: "SVN" };
    milesList: any = [{ lable: "50 Miles", value: 50 }, { lable: "100 Miles", value: 100 }, { lable: "150 Miles", value: 150 }];
    selectedMiles = { lable: "150 Miles", value: 150 };
    mgToggleFlag = true;
    OrderDetailsResp = false;
    historyRecv = false;
    disableTS = false;
    disableLoc = false;
    disableStatus = false;
    ifFirst = true;
    oRowCount = 100;
    geocoder = new google.maps.Geocoder();
    zone: NgZone;
    action: any = { heading: "", body: "" };
    mapConfig: any = { lat: 36.090240, lng: -95.712891, zoom: 4, mapType: 'roadmap', marker: -1 };
    historyConfig: any = { showHistory: false, allTraillerSubSet: [], dataSet: [], backupDS: [], backupATS: [] };
    
    orderList: any = [];
    

    orders = {
        column: [{ name: "Order ID", width: "10%" }, { name: "Origin name", width: "10%" },{ name: "Status", width: "10%" }, { name: "Origin city", width: "10%" }, { name: "Destination city", width: "10%" }, { name: "Service", width: "10%" },
        { name: "Order date & time", width: "10%" }, { name: "Ref. #", width: "10%" }, { name: "Ref. Type", width: "10%" }, { name: "Order remark", width: "10%" } ],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    trucks = {
        column: [{ name: "Truck ID", width: "10%" }, { name: "Company", width: "10%" }, { name: "Driver name", width: "10%" }, { name: "Driver2 name", width: "15%" },{ name: "Division", width: "10%" }, { name: "Last GPS location", width: "15%" },
        { name: "Available date & time", width: "15%" },{ name: "Status", width: "15%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };
    
    trailers = {
        column: [{ name: "Trailer ID", width: "10%" }, { name: "Trailer name", width: "10%" }, { name: "Trailer type", width: "10%" }, { name: "Location", width: "10%" }, { name: "Allocation status", width: "10%" },
        { name: "Compilance status", width: "10%" }, { name: "Road worthiness status", width: "10%" }, { name: "Last DOT inspection date ", width: "10%" },{ name: "Accessory/IOT information", width: "10%" },{ name: "Last movement date ", width: "10%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    ngOnInit() {
        
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

    goToTruck(){
        this.page=1;
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
            this.oRowCount = 100;
        }
    }

    toggleSearch(item: any) {
        if (item == 2) {
            this.searchID = "";

            this.selectedTrStatus = { status: "Select a status", value: -1 };
            //this.selectTrStatus(this.selectedTrStatus);
        } else if (item == 3) {
            this.searchID = "";
            this.bylocation = "";


        }
        else {
            this.bylocation = "";
            this.selectedTrStatus = { status: "Select a status", value: -1 };
            //this.selectTrStatus(this.selectedTrStatus);
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

    searchByOrderId() {
        this.orderList = [];
        for (let i = 0; i < this.orders.groups.length; i++) {
            var obj = this.orders.groups[i];
            if (this.orderID == obj['orderNumber']) {
                this.orderList.push(obj);
            }
        }
    }

    filterByCmpType() {
        this.orderList = [];
        for (let i = 0; i < this.orders.groups.length; i++) {
            var obj = this.orders.groups[i];
            if (this.selectedCmp.value == obj['orderCompany']) {
                this.orderList.push(obj);
            }
        }
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

            this.oRowCount += 100;
            if (this.oRowCount > this.orders.groups.length) {
                this.oRowCount = this.orders.groups.length;
            }
        }
    }

    getOrderDetails() {
        this.OrderDetailsResp = false;
        //let url="https://ctgtest.com/AllocationService/api/OrderDetails";
        let url = config.baseUrl + "/AllocationService/api/OrderDetails";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("StatesTrailerCounts data recieved");
                this.orders.groups=data.dataSet;
                this.orderList=data.dataSet;
                this.OrderDetailsResp = true;


            }, //For Success Response
            (err) => { console.log("StatesTrailerCounts error recieved"); this.OrderDetailsResp = true; } //For Error Response
            );
    }

    showHistory(item) {
        this.selectedMarker = item;
        //$('#historyModal').modal('show');
        setTimeout(function () {
            $('#historyModal').modal('show');
        }, 500);

    }

    showTrHistory(item) {
        this.historyConfig['trailer'] = item;
        this.historyConfig.showHistory = true;

    }
}
