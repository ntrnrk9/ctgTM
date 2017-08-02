import { Component, ViewChild,NgZone,ChangeDetectorRef   } from '@angular/core';
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
    selector: 'home-page',
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.css'],
    moduleId: module.id
})
export class HomePageComponent {
    //@ViewChild(GmapjsComponent) gmapJs: any;
    @ViewChild(Gmtest) gmapJs: any;
    //gmapJs: any;
    private name = 'HomePageComponent';
    selectedState: any = "alabama";
    selectedTrStatus: any = { status: "Available", value: 2 };
    selectedAvailability: number = -1;
    bylocation: String="";
    selectedID: any;
    searchID: String="";
    trailHistory: any;
    test: Number = 9;
    selectedMarker: any = { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" };
    stateList: any = [{ "stateDesc": "Alaska", "stateCode": "AK", "country": "USA" }, { "stateDesc": "Alabama", "stateCode": "AL", "country": "USA" }, { "stateDesc": "Arkansas", "stateCode": "AR", "country": "USA" }, { "stateDesc": "Arizona", "stateCode": "AZ", "country": "USA" }, { "stateDesc": "California", "stateCode": "CA", "country": "USA" }, { "stateDesc": "Colorado", "stateCode": "CO", "country": "USA" }, { "stateDesc": "Connecticut", "stateCode": "CT", "country": "USA" }, { "stateDesc": "District of Columbia", "stateCode": "DC", "country": "USA" }, { "stateDesc": "Delaware", "stateCode": "DE", "country": "USA" }, { "stateDesc": "Florida", "stateCode": "FL", "country": "USA" }, { "stateDesc": "Georgia", "stateCode": "GA", "country": "USA" }, { "stateDesc": "Hawaii", "stateCode": "HA", "country": "USA" }, { "stateDesc": "Iowa", "stateCode": "IA", "country": "USA" }, { "stateDesc": "Idaho", "stateCode": "ID", "country": "USA" }, { "stateDesc": "Illinois", "stateCode": "IL", "country": "USA" }, { "stateDesc": "Indiana", "stateCode": "IN", "country": "USA" }, { "stateDesc": "Kansas", "stateCode": "KS", "country": "USA" }, { "stateDesc": "Kentucky", "stateCode": "KY", "country": "USA" }, { "stateDesc": "Louisiana", "stateCode": "LA", "country": "USA" }, { "stateDesc": "Massachusetts", "stateCode": "MA", "country": "USA" }, { "stateDesc": "Maryland", "stateCode": "MD", "country": "USA" }, { "stateDesc": "Maine", "stateCode": "ME", "country": "USA" }, { "stateDesc": "Michigan", "stateCode": "MI", "country": "USA" }, { "stateDesc": "Minnesota", "stateCode": "MN", "country": "USA" }, { "stateDesc": "Missouri", "stateCode": "MO", "country": "USA" }, { "stateDesc": "Mississippi", "stateCode": "MS", "country": "USA" }, { "stateDesc": "Montana", "stateCode": "MT", "country": "USA" }, { "stateDesc": "North Carolina", "stateCode": "NC", "country": "USA" }, { "stateDesc": "North Dakota", "stateCode": "ND", "country": "USA" }, { "stateDesc": "Nebraska", "stateCode": "NE", "country": "USA" }, { "stateDesc": "New Hampshire", "stateCode": "NH", "country": "USA" }, { "stateDesc": "New Jersey", "stateCode": "NJ", "country": "USA" }, { "stateDesc": "New Mexico", "stateCode": "NM", "country": "USA" }, { "stateDesc": "Nevada", "stateCode": "NV", "country": "USA" }, { "stateDesc": "New York", "stateCode": "NY", "country": "USA" }, { "stateDesc": "Ohio", "stateCode": "OH", "country": "USA" }, { "stateDesc": "Oklahoma", "stateCode": "OK", "country": "USA" }, { "stateDesc": "Oregon", "stateCode": "OR", "country": "USA" }, { "stateDesc": "Pennsylvania", "stateCode": "PA", "country": "USA" }, { "stateDesc": "Rhode Island", "stateCode": "RI", "country": "USA" }, { "stateDesc": "South Carolina", "stateCode": "SC", "country": "USA" }, { "stateDesc": "South Dakota", "stateCode": "SD", "country": "USA" }, { "stateDesc": "Tennessee", "stateCode": "TN", "country": "USA" }, { "stateDesc": "Texas", "stateCode": "TX", "country": "USA" }, { "stateDesc": "Utah", "stateCode": "UT", "country": "USA" }, { "stateDesc": "Virginia", "stateCode": "VA", "country": "USA" }, { "stateDesc": "Vermont", "stateCode": "VT", "country": "USA" }, { "stateDesc": "Washington", "stateCode": "WA", "country": "USA" }, { "stateDesc": "Wisconsin", "stateCode": "WI", "country": "USA" }, { "stateDesc": "West Virginia", "stateCode": "WV", "country": "USA" }, { "stateDesc": "Wyoming", "stateCode": "WY", "country": "USA" }];
    trStatusList: any = [{ status: "Select a status", value: -1 },{ status: "Confirmed", value: 0 }, { status: "Planned", value: 1 }, { status: "Available", value: 2 }]
    milesList: any = [{ lable: "50 Miles", value: 50 }, { lable: "100 Miles", value: 100 }, { lable: "150 Miles", value: 150 }];
    selectedMiles = { lable: "150 Miles", value: 150 };
    mgToggleFlag = true;
    trailerStatusResp = false;
    historyRecv = false;
    disableTS = false;
    disableLoc = false;
    disableStatus = false;
    gRowCount = 100;
    geocoder = new google.maps.Geocoder();
    zone:NgZone;
    action: any = { heading: "", body: "" };

    allTrailers: any = [
        { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "25007", "trailerType": "UNK", "latitude": 36.11857, "longitude": -86.41091, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "25010", "trailerType": "UNK", "latitude": 36.12121, "longitude": -86.41055, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "35531", "trailerType": "DRY", "latitude": 40.6008, "longitude": -75.56779, "location": "South Whitehall Twp, Lehigh Co,PA", "landmark": "Cov Terminal,CM-130238,Allentown TERM", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "37733", "trailerType": "DRY", "latitude": 28.42675, "longitude": -81.44616, "location": "Doctor Phillips,FL", "landmark": "Doctor Phillips", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" }
    ];
    allTraillerSubSet: any = [
        { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "25007", "trailerType": "UNK", "latitude": 36.11857, "longitude": -86.41091, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "25010", "trailerType": "UNK", "latitude": 36.12121, "longitude": -86.41055, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "35531", "trailerType": "DRY", "latitude": 40.6008, "longitude": -75.56779, "location": "South Whitehall Twp, Lehigh Co,PA", "landmark": "Cov Terminal,CM-130238,Allentown TERM", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "37733", "trailerType": "DRY", "latitude": 28.42675, "longitude": -81.44616, "location": "Doctor Phillips,FL", "landmark": "Doctor Phillips", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" }
    ];

    ob = {
        column: [{ name: "Trailer ID", width: "8%" }, { name: "Trailer name", width: "7%" }, { name: "Trailer type", width: "7%" }, { name: "Location", width: "9%" },{ name: "Distance in miles", width: "8%" },
        { name: "Allocation status", width: "8%" }, { name: "Compliance status", width: "9%" }, { name: "Road worthiness status", width: "9%" }, { name: "Last DOT inspection date", width: "9%" }, { name: "Accessory/IOT information", width: "9%" }, { name: "Last movement date", width: "9%" }, { name: "Location history", width: "8%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    history = {
        column: [{ name: "Date", width: "25%" }, { name: "Order ID", width: "25%" }, { name: "Start City", width: "25%" }, { name: "Destination City", width: "25%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    ngOnInit() {
        //var geocoder = new google.maps.Geocoder();

        var input = document.getElementById('ctgGeoCode');
        var autoCompOptions = {
            componentRestrictions: { country: 'us' }
        };
        var autocomplete = new google.maps.places.Autocomplete(input, autoCompOptions);
        var obj=this;
        autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            //window.alert("No details available for input: '" + place.name + "'");
            this.action.heading = "Geocode";
            this.action.body = "No details available for input: '" + place.name + "'";
            $('#result').modal('show');
            
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            
          } else {
            //map.setCenter(place.geometry.location);
            //map.setZoom(17);  // Why 17? Because it looks good.
          }
          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
            console.log(address);
            obj.setByLocation();

          }
        });
    }
    constructor(private http: Http,private cdr:ChangeDetectorRef ) {
        this.getStateTrailersStatus();
        //this.getStateTrailersStatus();
        // setTimeout(() => {
        //     this.getStateTrailersStatus();
        // }, 1000);
        // IntervalObservable.create(900000).subscribe((data) => { this.getStateTrailersStatus() });
    }

    ngOnChange(val: number) {
        // console.log(val);
        // //this.showHistory(val);
        // this.selectedMarker=val;
        // var obj=this;
        // setTimeout(function () {
        //     $('#historyModal').modal('show');
        // }, 500);
    }

    toggleMG() {
        this.mgToggleFlag = !this.mgToggleFlag;
        if (this.mgToggleFlag) {
            this.searchID = "";
            this.bylocation = "";
            this.disableLoc = false;
            //this.disableStatus = false;
            this.disableTS = false;
        } else {
            this.searchID = "";
            this.bylocation = "";
            this.disableLoc = true;
            this.disableStatus = false;
            this.disableTS = true;
            this.gRowCount=100;
        }
    }

    toggleSearch(item: any) {
        if (item == 2) {
            this.searchID = "";
            this.disableTS = true;
            this.disableLoc = false;
            this.disableStatus = true;
            this.selectedTrStatus = { status: "Select a status", value: -1 };
        } else if (item == 3) {
            this.searchID = "";
            this.bylocation = "";
            this.disableLoc = true;
            this.disableTS = true;
            this.disableStatus = false;

        }
        else {
            this.bylocation = "";
            this.disableLoc = true;
            this.disableTS = false;
            this.disableStatus = true;
            this.selectedTrStatus = { status: "Select a status", value: -1 };
        }

    }    
     search() {
        if (this.bylocation.length > 0)
            this.getvalue();
        else
            this.searchByID();
    }

    getLatLngByGeoCode(){
        var input = $('#ctgGeoCode').val();
        console.log(input);
        this.bylocation = input;
        var ctrl = this;
        var geocoder = this.geocoder;
        var combo = "";
        var address = this.bylocation;

         this.geocoder.geocode({ 'address': address }, function (results: any, status: any) {
            if (status === 'OK') {
                var lat=results[0].geometry.location.lat();
                var lng=results[0].geometry.location.lng();
                combo="latitude="+lat+"&longitude="+lng;
                ctrl.getTrailerStatusByFilter(combo);
            } else {
                //alert('Geocode was not successful for the following reason: ' + status);
                this.action.heading = "Geocode";
                this.action.body = 'Geocode was not successful for the following reason: ' + status;
                $('#result').modal('show');
                console.log("no location to search");
            }
        });
        
    }

    getvalue() {
        var input = $('#ctgGeoCode').val();
        console.log(input);
        this.bylocation = input;
        if (this.bylocation != "") {
            this.gmapJs.geocodeAddress(this.bylocation);
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
        if(this.mgToggleFlag){
        this.gmapJs.geocodeAddress(this.bylocation);
        }else{
            this.getLatLngByGeoCode();
        }
    }
    reset() {
        this.bylocation = "";
        this.searchID = "";
        this.selectedID = "";

        this.getStateTrailersStatus();
        if (this.mgToggleFlag) {
            this.gmapJs.reset();
            this.disableLoc = false;
            this.disableTS = false;
        } else {
            this.selectedTrStatus = { status: "Available", value: 2 };
            this.disableLoc = true;
            this.disableStatus = false;
            this.disableTS = true;
        }
    }
    tableScrolled(this: any) {
        console.log("scrolling");
        var raw = document.getElementById('tgBody');
        if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
            
            this.gRowCount += 100;
            if(this.gRowCount>this.allTrailers.length){
                this.gRowCount=this.allTrailers.length;
            }
        }
    }

    getStateTrailersStatus() {
        this.trailerStatusResp = false;
        //let url="http://61.16.133.244/HomeService/api/StatesTrailerCounts";
        let url = config.baseUrl + "/HomeService/api/TrailerStatus?trailerStatus=0&trailerId=0";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("StatesTrailerCounts data recieved");
                this.allTrailers = data;
                this.trailerStatusResp = true;
                this.selectTrStatus(this.selectedTrStatus);
            }, //For Success Response
            (err) => { console.log("StatesTrailerCounts error recieved"); this.trailerStatusResp = true; } //For Error Response
            );
    }

    getTrailerStatusByFilter(add:any) {
        this.trailerStatusResp = false;
        //let url="http://61.16.133.244/HomeService/api/StatesTrailerCounts";
        let url = config.baseUrl + "/HomeService/api/TrailerStatusByFilter?" + add;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                this.attachSubSet(data);
                
            }, //For Success Response
            (err) => { console.log("StatesTrailerCounts error recieved");
                this.trailerStatusResp = true; } //For Error Response
            );
    }

    attachSubSet(item: any) {
        //this.trailerStatusResp = true;
        console.log("StatesTrailerCounts data recieved");
        this.allTraillerSubSet = item;
        this.allTraillerSubSet1 = item;
        this.selectMiles(this.selectedMiles);
        var obj=this;
        this.cdr.detectChanges();
        setTimeout(function () {
            obj.trailerStatusResp = true;
            obj.cdr.detectChanges();
        }, 500);
    }

    getTrailerHistory() {
        this.historyRecv = false;
        let url = config.baseUrl + "/HomeService/api/TrailerHistory?trailerID=" + this.selectedMarker.trailerID;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("StatesTrailerCounts data recieved");
                this.history.groups = data;
                this.historyRecv = true;
            }, //For Success Response
            (err) => {
                console.log("StatesTrailerCounts error recieved");
                this.historyRecv = true;
            } //For Error Response
            );
    }

    searchByID() {
        this.selectedID = "";
        var index = -1;
        this.searchID=this.searchID.toUpperCase();
        if (this.searchID && this.searchID != "") {
            if (this.mgToggleFlag) {
                for (var i = 0; i < this.allTrailers.length; i++) {
                    let item = this.allTrailers[i];
                    if (item.trailerID == this.searchID) {
                        this.selectedID = item.latitude + "," + item.longitude;
                        index = i;
                    }
                }
                if (index != -1) {
                    // this.gmapJs.geocodeAddress(this.selectedID);}
                    //this.gmapJs.searchTrailer(index);
                    this.gmapJs.call(this.searchID);
                    console.log("search trailer index: " + index);
                }
                else {
                    //alert("Trailer id not found");
                    this.action.heading = "Trailer search";
                    this.action.body = 'Trailer id not found';
                    $('#result').modal('show');
                }
            } else {
                this.allTraillerSubSet = [];
                for (var i = 0; i < this.allTrailers.length; i++) {
                    let item = this.allTrailers[i];
                    if (item.trailerID == this.searchID) {

                        this.allTraillerSubSet.push(item);
                    }
                }
            }
        } else {
            //alert("Enter a trailer id");
            if (this.mgToggleFlag) {
                this.action.heading = "Trailer search";
                this.action.body = 'Please enter a trailer ID.';
                $('#result').modal('show');
            }
        }
    }

    //http://61.16.133.244/HomeService/api/TrailerStatus?trailerStatus=Available
    //http://61.16.133.244/HomeService/api/TrailerStatus?trailerStatus=Scheduled
    //http://61.16.133.244/HomeService/api/TrailerStatus?trailerStatus=NotAvailable

    markerClicked() {

        this.getTrailerHistory();
    }

    showHistory(item) {
        this.selectedMarker = item;
        //$('#historyModal').modal('show');
        setTimeout(function () {
             $('#historyModal').modal('show');
         }, 500);
        this.getTrailerHistory();
    }

    selectTrStatus(item: any) {
        this.allTraillerSubSet = [];
        this.selectedTrStatus = item;
        for (var i = 0; i < this.allTrailers.length; i++) {
            var obj = this.allTrailers[i];
            switch (this.selectedTrStatus.value) {
                case 1:
                    {
                        if (obj.trailerStatus == "PLN")
                            this.allTraillerSubSet.push(obj);
                    }
                    break;
                case 2:
                    {
                        if (obj.trailerStatus == "AVL")
                            this.allTraillerSubSet.push(obj);
                    }
                    break;
                case 0:
                    {
                        if (obj.trailerStatus != "PLN" && obj.trailerStatus != "AVL")
                            this.allTraillerSubSet.push(obj);
                    }
                    break;
            }
        }
    }

allTraillerSubSet1:any=[];
    selectMiles(item){
        this.allTraillerSubSet =[] ;
        this.selectedMiles = item;
        var plm=0;
        var avl=0;
        var com=0;
        for (var i = 0; i < this.allTraillerSubSet1.length; i++) {
            var obj = this.allTraillerSubSet1[i];
            switch (this.selectedMiles.value) {
                case 50:
                    {
                        if (obj.distance < 50){
                            this.allTraillerSubSet.push(obj);plm++;
                        }
                    }
                    break;
                case 100:
                    {
                        if (obj.distance < 100){
                            this.allTraillerSubSet.push(obj);plm++;
                        }
                    }
                    break;
                case 150:
                    {
                        if (obj.distance < 150){
                            this.allTraillerSubSet.push(obj);plm++;
                        }
                    }
                    break;
            }
        }
        console.log("pln "+plm+" avl "+avl+" com "+com+" total "+this.allTrailers.length);

    

    }
}

// This code copy to app.module.ts
