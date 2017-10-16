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
    selector: 'track-trailer',
    templateUrl: 'track-trailer.component.html',
    styleUrls: ['track-trailer.component.css'],
    moduleId: module.id
})
export class TrackTrailerComponent {
    //@ViewChild(GmapjsComponent) gmapJs: any;
    @ViewChild(Gmtest) gmapJs: any;
    //gmapJs: any;
    private name = 'TrackTrailerComponent';
    selectedState: any = "alabama";
    selectedTrStatus: any = { status: "Available", value: 2 };
    selectedAvailability: number = -1;
    bylocation: String = "";
    selectedID: any;
    searchID: String = "";
    searchMake: String = "";
    searchTrYear: String = "";
    custID: String = "";
    trailHistory: any;
    test: Number = 9;

    selectedMarker: any = { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" };
    stateList: any = [{ "stateDesc": "Alaska", "stateCode": "AK", "country": "USA" }, { "stateDesc": "Alabama", "stateCode": "AL", "country": "USA" }, { "stateDesc": "Arkansas", "stateCode": "AR", "country": "USA" }, { "stateDesc": "Arizona", "stateCode": "AZ", "country": "USA" }, { "stateDesc": "California", "stateCode": "CA", "country": "USA" }, { "stateDesc": "Colorado", "stateCode": "CO", "country": "USA" }, { "stateDesc": "Connecticut", "stateCode": "CT", "country": "USA" }, { "stateDesc": "District of Columbia", "stateCode": "DC", "country": "USA" }, { "stateDesc": "Delaware", "stateCode": "DE", "country": "USA" }, { "stateDesc": "Florida", "stateCode": "FL", "country": "USA" }, { "stateDesc": "Georgia", "stateCode": "GA", "country": "USA" }, { "stateDesc": "Hawaii", "stateCode": "HA", "country": "USA" }, { "stateDesc": "Iowa", "stateCode": "IA", "country": "USA" }, { "stateDesc": "Idaho", "stateCode": "ID", "country": "USA" }, { "stateDesc": "Illinois", "stateCode": "IL", "country": "USA" }, { "stateDesc": "Indiana", "stateCode": "IN", "country": "USA" }, { "stateDesc": "Kansas", "stateCode": "KS", "country": "USA" }, { "stateDesc": "Kentucky", "stateCode": "KY", "country": "USA" }, { "stateDesc": "Louisiana", "stateCode": "LA", "country": "USA" }, { "stateDesc": "Massachusetts", "stateCode": "MA", "country": "USA" }, { "stateDesc": "Maryland", "stateCode": "MD", "country": "USA" }, { "stateDesc": "Maine", "stateCode": "ME", "country": "USA" }, { "stateDesc": "Michigan", "stateCode": "MI", "country": "USA" }, { "stateDesc": "Minnesota", "stateCode": "MN", "country": "USA" }, { "stateDesc": "Missouri", "stateCode": "MO", "country": "USA" }, { "stateDesc": "Mississippi", "stateCode": "MS", "country": "USA" }, { "stateDesc": "Montana", "stateCode": "MT", "country": "USA" }, { "stateDesc": "North Carolina", "stateCode": "NC", "country": "USA" }, { "stateDesc": "North Dakota", "stateCode": "ND", "country": "USA" }, { "stateDesc": "Nebraska", "stateCode": "NE", "country": "USA" }, { "stateDesc": "New Hampshire", "stateCode": "NH", "country": "USA" }, { "stateDesc": "New Jersey", "stateCode": "NJ", "country": "USA" }, { "stateDesc": "New Mexico", "stateCode": "NM", "country": "USA" }, { "stateDesc": "Nevada", "stateCode": "NV", "country": "USA" }, { "stateDesc": "New York", "stateCode": "NY", "country": "USA" }, { "stateDesc": "Ohio", "stateCode": "OH", "country": "USA" }, { "stateDesc": "Oklahoma", "stateCode": "OK", "country": "USA" }, { "stateDesc": "Oregon", "stateCode": "OR", "country": "USA" }, { "stateDesc": "Pennsylvania", "stateCode": "PA", "country": "USA" }, { "stateDesc": "Rhode Island", "stateCode": "RI", "country": "USA" }, { "stateDesc": "South Carolina", "stateCode": "SC", "country": "USA" }, { "stateDesc": "South Dakota", "stateCode": "SD", "country": "USA" }, { "stateDesc": "Tennessee", "stateCode": "TN", "country": "USA" }, { "stateDesc": "Texas", "stateCode": "TX", "country": "USA" }, { "stateDesc": "Utah", "stateCode": "UT", "country": "USA" }, { "stateDesc": "Virginia", "stateCode": "VA", "country": "USA" }, { "stateDesc": "Vermont", "stateCode": "VT", "country": "USA" }, { "stateDesc": "Washington", "stateCode": "WA", "country": "USA" }, { "stateDesc": "Wisconsin", "stateCode": "WI", "country": "USA" }, { "stateDesc": "West Virginia", "stateCode": "WV", "country": "USA" }, { "stateDesc": "Wyoming", "stateCode": "WY", "country": "USA" }];
    trStatusList: any = [{ status: "Select a status", value: -1 }, { status: "Available", value: 2 }, { status: "Planned", value: 1 }, { status: "Pool", value: 3 }, { status: "Others", value: 0 }]
    milesList: any = [{ lable: "50 Miles", value: 50 }, { lable: "100 Miles", value: 100 }, { lable: "150 Miles", value: 150 }];
    selectedMiles = { lable: "150 Miles", value: 150 };
    cmpList: any = [{ lable: "Covenant", value: "CVEN", selected: true }, { lable: "SRT", value: "SRT", selected: false }, { lable: "STAR", value: "STAR", selected: false }];
    selectedCmp = { lable: "Covenant", value: "CVEN", selected: true };
    modelList: any = [{ lable: "All types", value: "-1" }, { lable: "Reefer", value: "REEFER" }, { lable: "Dry", value: "DRY" }, { lable: "UNK", value: "UNK" }];
    selectedModel = { lable: "All types", value: "-1" };
    cmpSelectConfig = {
        filter: false,
        multisel: true,
        singleSelLabel:"Company",
        multiSelLabel:"company(s) selected"
    };
    modeSelectConfig = {
        filter: false
    }
    mgToggleFlag = true;
    trailerStatusResp = false;
    historyRecv = false;
    disableTS = false;
    disableLoc = false;
    disableStatus = false;
    ifFirst = true;
    asToggle = true;

    gRowCount = 100;
    geocoder = new google.maps.Geocoder();
    zone: NgZone;
    action: any = { heading: "", body: "" };
    mapConfig: any = { lat: 36.090240, lng: -95.712891, mapType: 'roadmap', marker: -1 };
    historyConfig: any = { showHistory: false, allTraillerSubSet: [], dataSet: [], backupDS: [], backupATS: [] };
    allTrailers_bu = [];
    //allTrailers: any=[];
    // allTrailers: any = [
    //     { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
    //     { "trailerID": "25007", "trailerType": "UNK", "latitude": 36.11857, "longitude": -86.41091, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
    //     { "trailerID": "25010", "trailerType": "UNK", "latitude": 36.12121, "longitude": -86.41055, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
    //     { "trailerID": "35531", "trailerType": "DRY", "latitude": 40.6008, "longitude": -75.56779, "location": "South Whitehall Twp, Lehigh Co,PA", "landmark": "Cov Terminal,CM-130238,Allentown TERM", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
    //     { "trailerID": "37733", "trailerType": "DRY", "latitude": 28.42675, "longitude": -81.44616, "location": "Doctor Phillips,FL", "landmark": "Doctor Phillips", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" }
    // ];
    allTraillerSubSet: any = [];
    // allTraillerSubSet: any = [
    //     { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
    //     { "trailerID": "25007", "trailerType": "UNK", "latitude": 36.11857, "longitude": -86.41091, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
    //     { "trailerID": "25010", "trailerType": "UNK", "latitude": 36.12121, "longitude": -86.41055, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
    //     { "trailerID": "35531", "trailerType": "DRY", "latitude": 40.6008, "longitude": -75.56779, "location": "South Whitehall Twp, Lehigh Co,PA", "landmark": "Cov Terminal,CM-130238,Allentown TERM", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
    //     { "trailerID": "37733", "trailerType": "DRY", "latitude": 28.42675, "longitude": -81.44616, "location": "Doctor Phillips,FL", "landmark": "Doctor Phillips", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" }
    // ];

    ob = {
        column: [
            { name: "Trailer ID", width: "9%" }, { name: "Make", width: "9%" }, { name: "Model/Type", width: "9%" },
            { name: "Company", width: "9%",toSort:true,key:'company' },{ name: "Location", width: "9%" }, { name: "Year", width: "9%" },
            { name: "Distance in miles", width: "9%" },{ name: "Allocation status", width: "9%" }, { name: "Last DOT inspection date", width: "9%" },
            { name: "Last ping date", width: "9%" },{ name: "History", width: "10%" }],
        groups: []
    };

    history = {
        column: [{ name: "Date", width: "25%" }, { name: "Order ID", width: "25%" }, { name: "Start City", width: "25%" }, { name: "Destination City", width: "25%" }],
        groups: []
    };

    ngOnInit() {
        //var geocoder = new google.maps.Geocoder();

        var input = document.getElementById('ctgGeoCode');
        var autoCompOptions = {
            componentRestrictions: { country: ['us', 'mx', 'ca'] }
        };
        var autocomplete = new google.maps.places.Autocomplete(input, autoCompOptions);
        var obj = this;
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                //window.alert("No details available for input: '" + place.name + "'");
                //obj.action.heading = "Trailer search";
                //obj.action.body = "Please enter a valid input!12";
                //$('#result').modal('show');

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
    constructor(private http: Http, private cdr: ChangeDetectorRef) {
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
        //console.log(JSON.stringify(this.mapConfig));
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
            this.gRowCount = 100;
        }
    }

    toggleSearch(item: any) {
        if (item == 2) {
            this.searchID = "";
            this.custID = "";
            this.selectedTrStatus = { status: "Select a status", value: -1 };
            //this.selectTrStatus(this.selectedTrStatus);
        } else if (item == 3) {
            this.searchID = "";
            this.bylocation = "";
            this.custID = "";

        } else if (item == 4) {
            this.searchID = "";
            this.bylocation = "";
            this.selectedTrStatus = { status: "Select a status", value: -1 };
        }
        else {
            this.bylocation = "";
            this.custID = "";
            this.selectedTrStatus = { status: "Select a status", value: -1 };
            //this.selectTrStatus(this.selectedTrStatus);
        }

    }
    search() {
        if (this.bylocation.length > 0) {
            this.getvalue();
        } else if (this.searchID.length > 0) {
            this.searchByID();
        } else if (this.custID.length > 0) {
            this.searchByCustID();
        } else {
            if (this.disableStatus) {
                this.action.heading = "Trailer search";
                this.action.body = 'Enter a valid input.';
                $('#result').modal('show');
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
        this.mapConfig.polygon = undefined;
        this.geocoder.geocode({ 'address': address }, function (results: any, status: any) {
            if (status === 'OK') {
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                combo = "latitude=" + lat + "&longitude=" + lng;
                if (!this.mgToggleFlag) {
                    ctrl.mapConfig.lat = lat;
                    ctrl.mapConfig.lng = lng;
                }
                //ctrl.mapConfig.zoom=10;
                ctrl.getTrailerStatusByFilter(combo);
            } else {
                //alert('Geocode was not successful for the following reason: ' + status);
                $('#inValidRes').modal('show');
                $('#ctgGeoCode').val("");
                console.log("getLatLngByGeoCode:no location to search");
            }
        });

    }



    getvalue() {
        this.mapConfig.marker = -1;
        var input = $('#ctgGeoCode').val();
        console.log(input);
        this.bylocation = input;
        if (this.bylocation != "") {
            if (this.mgToggleFlag) {
                this.gmapJs.geocodeAddress(this.bylocation);
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
        if (this.asToggle) {
            this.allTrailers = this.advanceSearchFilter(this.allTrailers);
            this.allTraillerSubSet = this.advanceSearchFilter(this.allTraillerSubSet);

        }
        //f.geocodeAddress(this.bylocation);
    }

    formatDateTime(item: any, choice) {
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
                //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
                if (choice == 0) {
                    var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear();
                }
                else if (choice == 1) {
                    var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + tim[0];
                }
                return SDate;
            } else {
                return item;
            }
        } else {
            return item;
        }

    }

    setByLocation() {
        var input = $('#ctgGeoCode').val();
        this.mapConfig.marker = -1;
        console.log(input);
        this.bylocation = input;
        if (this.mgToggleFlag) {
            this.gmapJs.geocodeAddress(this.bylocation);
            this.getLatLngByGeoCode();
        } else {
            this.getLatLngByGeoCode();
        }

        if (this.asToggle) {
            this.allTrailers = this.advanceSearchFilter(this.allTrailers);
            this.allTraillerSubSet = this.advanceSearchFilter(this.allTraillerSubSet);
        }
    }

    reset() {
        this.bylocation = "";
        this.searchID = "";
        this.selectedID = "";
        this.custID = "";
        this.searchMake = "";
        this.searchTrYear = "";
        this.selectedModel = { lable: "All types", value: "-1" };
        this.mapConfig = { lat: 36.090240, lng: -95.712891, mapType: 'roadmap' };
        this.selectedMiles = { lable: "150 Miles", value: 150 };
        //this.selectedCmp = { lable: "Covenant", value: "CVEN", selected: true };
        this.selectCmp(this.selectedCmp);

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
            if (this.gRowCount > this.allTrailers.length) {
                this.gRowCount = this.allTrailers.length;
            }
        }
    }

    cloneObj(list: any) {
        var clone = JSON.parse(JSON.stringify(list));
        return clone;
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
                this.allTrailers_bu = data;
                this.trailerStatusResp = true;
                //this.selectCmp(this.selectedCmp);
                this.filterMapByCmp();
                this.allTraillerSubSet1 = this.cloneObj(this.allTrailers);
                this.selectTrStatus(this.selectedTrStatus);
            }, //For Success Response
            (err) => { console.log("StatesTrailerCounts error recieved"); this.trailerStatusResp = true; } //For Error Response
            );
    }

    getTrailerStatusByFilter(add: any) {
        this.trailerStatusResp = false;
        //let url="http://61.16.133.244/HomeService/api/StatesTrailerCounts";
        let url = config.baseUrl + "/HomeService/api/TrailerStatusByFilter?" + add;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                this.attachSubSet(data);

            }, //For Success Response
            (err) => {
                console.log("StatesTrailerCounts error recieved");
                this.trailerStatusResp = true;
            } //For Error Response
            );
    }

    attachSubSet(item: any) {
        //this.trailerStatusResp = true;
        console.log("StatesTrailerCounts data recieved");
        this.allTraillerSubSet = item;
        this.allTraillerSubSet1 = item;
        this.selectMiles(this.selectedMiles);
        var obj = this;
        this.cdr.detectChanges();
        if (this.asToggle) {
            this.allTrailers = this.advanceSearchFilter(this.allTrailers);
            this.allTraillerSubSet = this.advanceSearchFilter(this.allTraillerSubSet);
        }
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

    getTrailerPingHistory(item: any) {
        this.historyConfig.allTraillerSubSet = [];
        this.historyConfig.dataSet = [];
        this.historyConfig.backupATS = [];
        this.historyConfig.backupDS = [];
        this.historyConfig.thResp = false;
        let url = config.baseUrl + "/HomeService/api/TrailerPingHistory?trailerID=" + item.trailerID;
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

                        if (item.eventDateValues.length > 0) {
                            for (let j = 0; j < item.eventDateValues.length; j++) {
                                var ent = item.eventDateValues[j];
                                ent['eDate'] = item.eventDate;
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


    getTrailerDetailsByCustomerId(custID: any) {
        //this.historyRecv = false;
        let url = config.baseUrl + "/HomeService/api/TrailerDetailsByCustomerId?customerId=" + custID;
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("StatesTrailerCounts data recieved");
                if (data.dataSet.length > 0) {
                    var poly = data.dataSet[0].yard;
                    var lat = data.dataSet[0].latitude;
                    var lng = data.dataSet[0].longitude;
                    if (this.mgToggleFlag) {
                        this.gmapJs.drawPoly(poly, lat, lng);
                        this.filterByBounds(poly, data.dataSet[0].trailers);
                    } else {
                        this.filterByBounds(poly, data.dataSet[0].trailers);
                        this.mapConfig.polygon = poly;
                        this.mapConfig.lat = lat;
                        this.mapConfig.lng = lng;
                    }

                } else {
                    $('#inValidCustID').modal('show');
                    this.custID = "";
                }
                //this.historyRecv = true;
            }, //For Success Response
            (err) => {
                console.log("StatesTrailerCounts error recieved");
                //this.historyRecv = true;
            } //For Error Response
            );
    }
    searchByID() {
        this.selectedID = "";
        var index = -1;
        this.searchID = this.searchID.toUpperCase();
        this.allTraillerSubSet = [];
        if (this.searchID && this.searchID != "") {

            for (var i = 0; i < this.allTrailers.length; i++) {
                let item = this.allTrailers[i];
                if (item.trailerID == this.searchID) {
                    this.selectedID = item.latitude + "," + item.longitude;
                    this.allTraillerSubSet.push(item);
                    this.mapConfig.lat = item.latitude;
                    this.mapConfig.lng = item.longitude;
                    this.mapConfig.zoom = 19;
                    this.mapConfig.mapType = 'satellite';
                    this.mapConfig.marker = i;
                    this.mapConfig.polygon = undefined;
                    index = i;
                }
            }
            if (this.mgToggleFlag) {
                if (index != -1) {
                    // this.gmapJs.geocodeAddress(this.selectedID);}
                    //this.gmapJs.searchTrailer(index);
                    this.gmapJs.call(this.searchID);
                    console.log("search trailer index: " + index);
                }
                else {
                    //alert("Trailer id not found");
                    this.action.heading = "Trailer search";
                    this.action.body = 'Trailer not found!';
                    // this.searchID="";
                    $('#result').modal('show');
                }
            }
            this.allTraillerSubSet = [];
            for (var i = 0; i < this.allTrailers.length; i++) {
                let item = this.allTrailers[i];
                if (item.trailerID == this.searchID) {
                    this.allTraillerSubSet.push(item);
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
        if (this.asToggle) {
            this.allTrailers = this.advanceSearchFilter(this.allTrailers);
            this.allTraillerSubSet = this.advanceSearchFilter(this.allTraillerSubSet);

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

    showTrHistory(item) {
        this.historyConfig['trailer'] = item;
        this.historyConfig.showHistory = true;
        this.getTrailerPingHistory(item);
    }


    searchByCustID() {

        //this.gmapJs.drawPoly();
        //this.allTraillerSubSet=[];
        //this.allTraillerSubSet=this.mapConfig.trailesInBound;
        this.mapConfig.marker = -1;
        this.custID = this.custID.toUpperCase();
        this.getTrailerDetailsByCustomerId(this.custID);


    }

    filterByBounds(multipolygonWKT: any, trList) {

        var polylines = [];
        var toReturn = [];
        //var multipolygonWKT="POLYGON ((-106.29151225090025 31.719999517096294, -106.28837943077087 31.719944759613266, -106.28841161727905 31.721541839581246, -106.29127621650696 31.721468830811506, -106.29151225090025 31.719999517096294))";
        var polyBound = new google.maps.LatLngBounds();


        var formattedValues = multipolygonWKT.replace("POLYGON", "");
        console.log(formattedValues);
        formattedValues = formattedValues.replace("))", "");
        console.log(formattedValues);
        formattedValues = formattedValues.replace("((", "");
        console.log(formattedValues);


        var linesCoords = formattedValues.split("),(");
        console.log(linesCoords);



        for (var i = 0; i < linesCoords.length; i++) {
            polylines[i] = [];
            var singleLine = linesCoords[i].split(",");
            console.log(singleLine);

            for (var j = 0; j < singleLine.length; j++) {
                var strCoordinates = singleLine[j].trim();
                var coordinates = strCoordinates.split(" ");
                console.log(coordinates);
                var latlng = new google.maps.LatLng(parseFloat(coordinates[1]), parseFloat(coordinates[0]));
                console.log("{lat:" + parseFloat(coordinates[1]) + ",lng:" + parseFloat(coordinates[0]) + "}");
                polyBound.extend(latlng);
                polylines[i].push(latlng);

            }
        }

        //by now you should have the polylines array filled with arrays that hold the coordinates of the polylines of the multipolyline
        //lets loop thru this array

        var trailesInBound = [];
        for (var i = 0; i < this.allTrailers.length; i++) {
            var tr = this.allTrailers[i];
            var latlng = new google.maps.LatLng(tr.latitude, tr.longitude);
            if (polyBound.contains(latlng)) {

                trailesInBound.push(tr);
            }
        }
        var bag = []
        this.allTrailers.forEach(element => {
            if (trList.includes(element.trailerID)) {
                bag.push(element);
            }
        });
        this.allTraillerSubSet = bag;
        //this.allTrailers = bag;
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
                case 3:
                    {
                        if (obj['isPool'] == 1)
                            this.allTraillerSubSet.push(obj);
                    }
                    break;
                case 0:
                    {
                        if (obj.trailerStatus != "PLN" && obj.trailerStatus != "AVL")
                            this.allTraillerSubSet.push(obj);
                    }
                    break;
                case -1:
                    {

                        this.allTraillerSubSet.push(obj);
                    }
                    break;

            }
        }
    }
    selectCmp(item) {
        this.selectedCmp = item;
        this.filterMapByCmp();
        if (this.bylocation.length == 0 && this.custID.length == 0 && this.searchID.length == 0) {
            this.selectTrStatus(this.selectedTrStatus);
            //this.allTraillerSubSet=this.filterGridByCmp(this.allTrailers);
        } else {
            if (this.bylocation.length > 0) {
                this.getvalue();
                this.selectMiles(this.selectedMiles);
            } else if (this.searchID.length > 0) {
                this.searchByID();
                this.allTraillerSubSet = this.filterGridByCmp(this.allTraillerSubSet);
            } else if (this.custID.length > 0) {
                this.searchByCustID();
                this.allTraillerSubSet = this.filterGridByCmp(this.allTraillerSubSet);
            }
        }

        if (this.asToggle) {
            this.allTrailers = this.advanceSearchFilter(this.allTrailers);
            this.allTraillerSubSet = this.advanceSearchFilter(this.allTraillerSubSet);

        }

    }

    filterMapByCmp() {
        this.allTrailers = [];
        this.cmpList;
        for (var i = 0; i < this.allTrailers_bu.length; i++) {
            var obj = this.allTrailers_bu[i];
            this.cmpList.forEach(element => {
                if (element.value == obj['company'] && element.selected) {
                    this.allTrailers.push(obj);
                }
            });

        }
    }

    filterGridByCmp(lists: any) {
        //this.selectTrStatus(this.selectedTrStatus);
        var bag = []
        for (var i = 0; i < lists.length; i++) {
            var obj = lists[i];
            this.cmpList.forEach(element => {
                if (element.value == obj['company'] && element.selected) {
                    bag.push(obj);
                }
            });

        }
        return bag;
    }

    allTraillerSubSet1: any = [];
    selectMiles(item) {
        this.allTraillerSubSet = [];
        this.selectedMiles = item;
        var plm = 0;
        var avl = 0;
        var com = 0;
        for (var i = 0; i < this.allTraillerSubSet1.length; i++) {
            var obj = this.allTraillerSubSet1[i];
            switch (this.selectedMiles.value) {
                case 50:
                    {
                        if (obj.distance < 50) {
                            this.allTraillerSubSet.push(obj); plm++;
                        }
                    }
                    break;
                case 100:
                    {
                        if (obj.distance < 100) {
                            this.allTraillerSubSet.push(obj); plm++;
                        }
                    }
                    break;
                case 150:
                    {
                        if (obj.distance < 150) {
                            this.allTraillerSubSet.push(obj); plm++;
                        }
                    }
                    break;
                default: {

                }
                    break;
            }
        }
        this.allTraillerSubSet = this.filterGridByCmp(this.allTraillerSubSet);
        console.log("pln " + plm + " avl " + avl + " com " + com + " total " + this.allTrailers.length);



    }

    advanceSearchFilter(bag) {
        var list = this.filterByMake(bag);
        list = this.filterByTrYear(list);
        list = this.filterByModel(list);
        //list=this.filterByIOT(list);
        //list=this.filterByLMD(list);
        //list=this.filterByDOT(list);
        return list;
    }

    filterByMake(list: any) {
        var bag = [];
        this.searchMake = this.searchMake.toUpperCase();
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (this.searchMake == "") {
                bag.push(item);
            } else
                if (item.trailerName == this.searchMake) {
                    bag.push(item);
                }
        }
        return bag;
    }
    filterByTrYear(list: any) {
        var bag = [];
        this.searchTrYear = this.searchTrYear.toUpperCase();
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (this.searchTrYear == "") {
                bag.push(item);
            } else
                if (item.trailerYear == this.searchTrYear) {
                    bag.push(item);
                }
        }
        return bag;
    }

    filterByModel(list: any) {
        var bag = [];
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (this.selectedModel.value == "-1") {
                bag.push(item);
            } else {
                if (this.selectedModel.value == item.trailerType) {
                    bag.push(item);
                }
            }

        }
        return bag;
    }

    sortTrailers(list, key, asc) {
        var bag;
        if (key == "dotDate") {
          //bag = this.sortTrailersByTime(list, key, asc);
        } else if (key == "lastPingDate") {
          //bag = this.sortTrailersByTime(list, key, asc);
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

    allTrailers = [{
        "trailerID": "42531",
        "trailerType": "DRY",
        "trailerName": "HYUND",
        "latitude": 34.0449685,
        "longitude": -117.3770988,
        "location": "Bloomington,CA",
        "landmark": "FEDEX Ground (FEDBLO) Bloomington, CA",
        "trailerStatus": "OUT",
        "idleDuration": 0.0,
        "lastMovementDate": "12/24/2016",
        "dotDate": "12/24/2016",
        "iotInfo": "INACTIVE",
        "compliance": "",
        "roadWorthiness": ""
    },
    {
        "trailerID": "42532",
        "trailerType": "DRY",
        "trailerName": "HYUND",
        "latitude": 39.7409019470215,
        "longitude": -86.2154922485352,
        "location": "Indianapolis city (balance),IN",
        "landmark": "Shop,McGlothlin & Son (MCGIND01) Indianapolis",
        "trailerStatus": "OUT",
        "idleDuration": 0.0,
        "lastMovementDate": "06/10/2016",
        "dotDate": "06/10/2016",
        "iotInfo": "INACTIVE",
        "compliance": "",
        "roadWorthiness": ""
    },
    {
        "trailerID": "42533",
        "trailerType": "DRY",
        "trailerName": "HYUND",
        "latitude": 34.0622706,
        "longitude": -117.5057201,
        "location": "Fontana,CA",
        "landmark": "DO NOT REMOVE - North American Trailer Fontana - Trade Trailer location (NORFON)",
        "trailerStatus": "PLN",
        "idleDuration": 0.0,
        "lastMovementDate": "06/23/2017",
        "dotDate": "06/23/2017",
        "iotInfo": "ACTIVE",
        "compliance": "",
        "roadWorthiness": ""
    },
    {
        "trailerID": "42534",
        "trailerType": "DRY",
        "trailerName": "HYUND",
        "latitude": 35.0055011,
        "longitude": -85.391794,
        "location": "Chattanooga,TN",
        "landmark": "Amazon Hill (BUFFET02) Chatt, TN TERM",
        "trailerStatus": "OUT",
        "idleDuration": 0.0,
        "lastMovementDate": "03/07/2016",
        "dotDate": "03/07/2016",
        "iotInfo": "INACTIVE",
        "compliance": "",
        "roadWorthiness": ""
    },
    {
        "trailerID": "42534",
        "trailerType": "UNK",
        "trailerName": "",
        "latitude": 35.0055011,
        "longitude": -85.391794,
        "location": "Chattanooga,TN",
        "landmark": "Amazon Hill (BUFFET02) Chatt, TN TERM",
        "trailerStatus": "AVL",
        "idleDuration": 0.0,
        "lastMovementDate": "03/07/2016",
        "dotDate": "03/07/2016",
        "iotInfo": "INACTIVE",
        "compliance": "",
        "roadWorthiness": ""
    },
    {
        "trailerID": "42536",
        "trailerType": "DRY",
        "trailerName": "HYUND",
        "latitude": 35.0014228820801,
        "longitude": -85.3906784057617,
        "location": "Chattanooga,TN",
        "landmark": "Chattanooga Body Shop TERM",
        "trailerStatus": "OUT",
        "idleDuration": 0.0,
        "lastMovementDate": "06/15/2016",
        "dotDate": "06/15/2016",
        "iotInfo": "INACTIVE",
        "compliance": "",
        "roadWorthiness": ""
    }];
}

// This code copy to app.module.ts
