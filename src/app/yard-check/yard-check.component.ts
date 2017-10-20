import { OnInit,Component, ViewChild,NgZone,ChangeDetectorRef   } from '@angular/core';
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
  selector: 'app-yard-check',
  templateUrl: './yard-check.component.html',
  styleUrls: ['./yard-check.component.css']
})
export class YardCheckComponent implements OnInit {

    //@ViewChild(GmapjsComponent) gmapJs: any;
    @ViewChild(Gmtest) gmapJs: any;
    //gmapJs: any;
    private name = 'TrackTrailerComponent';
    selectedState: any = "alabama";
    selectedTrStatus: any = { status: "Available", value: 2 };
    selectedAvailability: number = -1;
    bylocation: String="";
    selectedID: any;
    searchID: String="";
    searchMake: String="";
    searchTrYear:String="";
    custID:String="";
    trailHistory: any;
    test: Number = 9;
    
    selectedMarker: any = { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" };
    stateList: any = [{ "stateDesc": "Alaska", "stateCode": "AK", "country": "USA" }, { "stateDesc": "Alabama", "stateCode": "AL", "country": "USA" }, { "stateDesc": "Arkansas", "stateCode": "AR", "country": "USA" }, { "stateDesc": "Arizona", "stateCode": "AZ", "country": "USA" }, { "stateDesc": "California", "stateCode": "CA", "country": "USA" }, { "stateDesc": "Colorado", "stateCode": "CO", "country": "USA" }, { "stateDesc": "Connecticut", "stateCode": "CT", "country": "USA" }, { "stateDesc": "District of Columbia", "stateCode": "DC", "country": "USA" }, { "stateDesc": "Delaware", "stateCode": "DE", "country": "USA" }, { "stateDesc": "Florida", "stateCode": "FL", "country": "USA" }, { "stateDesc": "Georgia", "stateCode": "GA", "country": "USA" }, { "stateDesc": "Hawaii", "stateCode": "HA", "country": "USA" }, { "stateDesc": "Iowa", "stateCode": "IA", "country": "USA" }, { "stateDesc": "Idaho", "stateCode": "ID", "country": "USA" }, { "stateDesc": "Illinois", "stateCode": "IL", "country": "USA" }, { "stateDesc": "Indiana", "stateCode": "IN", "country": "USA" }, { "stateDesc": "Kansas", "stateCode": "KS", "country": "USA" }, { "stateDesc": "Kentucky", "stateCode": "KY", "country": "USA" }, { "stateDesc": "Louisiana", "stateCode": "LA", "country": "USA" }, { "stateDesc": "Massachusetts", "stateCode": "MA", "country": "USA" }, { "stateDesc": "Maryland", "stateCode": "MD", "country": "USA" }, { "stateDesc": "Maine", "stateCode": "ME", "country": "USA" }, { "stateDesc": "Michigan", "stateCode": "MI", "country": "USA" }, { "stateDesc": "Minnesota", "stateCode": "MN", "country": "USA" }, { "stateDesc": "Missouri", "stateCode": "MO", "country": "USA" }, { "stateDesc": "Mississippi", "stateCode": "MS", "country": "USA" }, { "stateDesc": "Montana", "stateCode": "MT", "country": "USA" }, { "stateDesc": "North Carolina", "stateCode": "NC", "country": "USA" }, { "stateDesc": "North Dakota", "stateCode": "ND", "country": "USA" }, { "stateDesc": "Nebraska", "stateCode": "NE", "country": "USA" }, { "stateDesc": "New Hampshire", "stateCode": "NH", "country": "USA" }, { "stateDesc": "New Jersey", "stateCode": "NJ", "country": "USA" }, { "stateDesc": "New Mexico", "stateCode": "NM", "country": "USA" }, { "stateDesc": "Nevada", "stateCode": "NV", "country": "USA" }, { "stateDesc": "New York", "stateCode": "NY", "country": "USA" }, { "stateDesc": "Ohio", "stateCode": "OH", "country": "USA" }, { "stateDesc": "Oklahoma", "stateCode": "OK", "country": "USA" }, { "stateDesc": "Oregon", "stateCode": "OR", "country": "USA" }, { "stateDesc": "Pennsylvania", "stateCode": "PA", "country": "USA" }, { "stateDesc": "Rhode Island", "stateCode": "RI", "country": "USA" }, { "stateDesc": "South Carolina", "stateCode": "SC", "country": "USA" }, { "stateDesc": "South Dakota", "stateCode": "SD", "country": "USA" }, { "stateDesc": "Tennessee", "stateCode": "TN", "country": "USA" }, { "stateDesc": "Texas", "stateCode": "TX", "country": "USA" }, { "stateDesc": "Utah", "stateCode": "UT", "country": "USA" }, { "stateDesc": "Virginia", "stateCode": "VA", "country": "USA" }, { "stateDesc": "Vermont", "stateCode": "VT", "country": "USA" }, { "stateDesc": "Washington", "stateCode": "WA", "country": "USA" }, { "stateDesc": "Wisconsin", "stateCode": "WI", "country": "USA" }, { "stateDesc": "West Virginia", "stateCode": "WV", "country": "USA" }, { "stateDesc": "Wyoming", "stateCode": "WY", "country": "USA" }];
    trStatusList: any = [{ status: "Select a status", value: -1 },{ status: "Available", value: 2 }, { status: "Planned", value: 1 },{ status: "Pool", value: 3 },{ status: "Others", value: 0 }]
    milesList: any = [{ lable: "50 Miles", value: 50 }, { lable: "100 Miles", value: 100 }, { lable: "150 Miles", value: 150 }];
    selectedMiles = { lable: "150 Miles", value: 150 };
    cmpList: any = [{ lable: "Covenant", value: "CVEN" }, { lable: "SRT", value: "SRT" }, { lable: "STAR", value: "STAR" }];
    selectedCmp = { lable: "Covenant", value: "CVEN" };
    modelList: any = [{ lable: "All types", value: "-1" },{ lable: "Reefer", value: "REEFER" }, { lable: "Dry", value: "DRY" },{ lable: "UNK", value: "UNK" }];
    selectedModel = { lable: "All types", value: "-1" };
    cmpSelectConfig={
        filter:true
    };
    modeSelectConfig={
        filter:true
    }
    mgToggleFlag = true;
    trailerStatusResp = false;
    historyRecv = false;
    disableTS = false;
    disableLoc = false;
    disableStatus = false;
    ifFirst=true;
    asToggle=true;

    gRowCount = 100;
    geocoder = new google.maps.Geocoder();
    zone:NgZone;
    action: any = { heading: "", body: "" };
    mapConfig:any={lat:36.090240,lng:-95.712891,mapType:'roadmap',marker:-1};
    historyConfig:any={showHistory:false,allTraillerSubSet:[],dataSet:[],backupDS:[],backupATS:[]};
    
    allTrailers_bu=[];
    allTraillerSubSet: any = [];
    

    // ob = {
    //     column: [{ name: "Trailer ID", width: "9%" },{ name: "Yard ID", width: "9%" }, { name: "Make", width: "9%" }, { name: "Model/Type", width: "9%" }, { name: "Location", width: "9%" },{ name: "Year", width: "9%" },
    //     { name: "Yard status", width: "9%" },{ name: "Yard check date", width: "9%" },{ name: "Last DOT inspection date", width: "9%" }, { name: "Last ping date", width: "9%" }, { name: "Actions", width: "10%" }],
    //     groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    // };

    ob = {
        column: [{ name: "Trailer ID", width: "10%" },{ name: "Yard ID", width: "10%" }, { name: "Make", width: "10%" }, { name: "Model/Type", width: "10%" }, { name: "Location", width: "10%" },{ name: "Year", width: "10%" },
        { name: "Yard status", width: "10%" },{ name: "Yard check date", width: "10%" },{ name: "Last DOT inspection date", width: "10%" }, { name: "Last ping date", width: "10%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    history = {
        column: [{ name: "Date", width: "25%" }, { name: "Order ID", width: "25%" }, { name: "Start City", width: "25%" }, { name: "Destination City", width: "25%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    ngOnInit() {}

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
            this.gRowCount=100;
        }
    }

    toggleSearch(item: any) {
        if (item == 2) {
            this.searchID = "";
            this.custID="";
            this.selectedTrStatus = { status: "Select a status", value: -1 };
            //this.selectTrStatus(this.selectedTrStatus);
        } else if (item == 3) {
            this.searchID = "";
            this.bylocation = "";
            this.custID="";

        }else if(item==4){
            this.searchID = "";
            this.bylocation = "";
            this.selectedTrStatus = { status: "Select a status", value: -1 };
        }
        else {
            this.bylocation = "";
            this.custID="";
            this.selectedTrStatus = { status: "Select a status", value: -1 };
            //this.selectTrStatus(this.selectedTrStatus);
        }

    }

    search() {
        if (this.searchID.length > 0) {
            this.searchByID();
        }else if(this.custID.length>0){
            this.searchByCustID();
        } else {
            if (this.disableStatus) {
                this.action.heading = "Trailer search";
                this.action.body = 'Enter a valid input.';
                $('#result').modal('show');
            }
        }
    }

    openHistory() {
        if (this.mapConfig.selectedMarker && this.mapConfig.event=="markerSelected") {
            this.showTrHistory(this.mapConfig.selectedMarker);
        }
        // showTrHistory(mapConfig.selectedMarker);
    }

   
    formatDateTime(item: any,choice) {
        if(!item){
            return item;
        }
        else if (item != "") {
            //var str=item.toUpperCase();
            if (item.toUpperCase() != "UNKNOWN") {
                var ary = item.split(' ');
                var date = ary[0].split('-');
                var newD = new Date(date[0], date[1] - 1, date[2]);
                var tim=ary[1].split('.');
                //var SDate=newD.getMonth()+"/"+newD.getDay()+"/"+newD.getFullYear();      
                if (choice == 0) {
                    var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear();
                }
                else if (choice == 1) {
                    var SDate = (newD.getMonth() + 1) + '/' + newD.getDate() + '/' + newD.getFullYear() + " " + tim[0];
                }
                return SDate;
            }else{
                return item;
            }
        }else{
            return item;
        }

    }

    

    reset() {
        this.bylocation = "";
        this.searchID = "";
        this.selectedID = "";
        this.custID="";
        this.searchMake="";
        this.searchTrYear="";
        this.selectedModel={lable: "All types", value: "-1" };
        this.mapConfig={lat:36.090240,lng:-95.712891,mapType:'roadmap'};
        this.selectedMiles = { lable: "150 Miles", value: 150 };
        this.selectedCmp = { lable: "Covenant", value: "CVEN" };
        this.allTrailers=[];
        // this.selectCmp(this.selectedCmp);

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

    cloneObj(list:any){
        var clone=JSON.parse(JSON.stringify(list));
        return clone;
    }

    getStateTrailersStatus() {
        this.trailerStatusResp = false;
        //let url="http://61.16.133.244/HomeService/api/StatesTrailerCounts";
        let url = config.baseUrl + "/YardMGMTService/api/YardTrailers";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("StatesTrailerCounts data recieved");
                //this.allTrailers = data.dataSet;
                this.allTrailers_bu = data.dataSet;
                this.trailerStatusResp = true;
                //this.selectCmp(this.selectedCmp);
                // this.filterMapByCmp();
                this.allTraillerSubSet1=this.cloneObj(this.allTrailers);
                // this.selectTrStatus(this.selectedTrStatus);
            }, //For Success Response
            (err) => { console.log("StatesTrailerCounts error recieved"); this.trailerStatusResp = true; } //For Error Response
            );
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

    getTrailerPingHistory(item:any) {
        this.historyConfig.allTraillerSubSet=[];
        this.historyConfig.dataSet = [];
        this.historyConfig.backupATS = [];
        this.historyConfig.backupDS = [];
        this.historyConfig.thResp = false;
        let url = config.baseUrl + "/HomeService/api/TrailerPingHistory?trailerID="+item.trailerID;
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
                        
                        if(item.eventDateValues.length>0){
                            for (let j = 0; j < item.eventDateValues.length; j++) {
                                var ent=item.eventDateValues[j];
                                ent['eDate']=item.eventDate;
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
      var creds = "username=" + config.username + "&password=" + config.password;

      let authToken = "Basic";
      let headers = new Headers({ 'Accept': 'application/json' });
      headers.append('Authorization', 'Basic ' +
        btoa(config.username + ':' + config.password));


      let options = {
        headers: headers
      };
    //   let url = config.ctgApiUrl + "/assets/yard/" + custID;
    let url = config.baseUrl + "/HomeService/api/TrailerDetailsByCustomerId?customerId="+custID;
      this.http.get(url,options).map(res => res.json())
        .subscribe(
        (data) => {
            console.log("StatesTrailerCounts data recieved");
            if (data.dataSet.length > 0) {
                var poly = data.dataSet[0].yard;
                var lat = data.dataSet[0].latitude;
                var lng = data.dataSet[0].longitude;
                if (this.mgToggleFlag) {
                    this.mapConfig.showOnly=data.dataSet[0].trailers;
                    this.mapConfig.polygon = poly;
                    this.mapConfig.lat = lat;
                    this.mapConfig.lng = lng;
                    //this.gmapJs.drawPoly(poly, lat, lng);
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

            for (var i = 0; i < this.allTrailers_bu.length; i++) {
                let item = this.allTrailers_bu[i];
                if (item.trailerID == this.searchID) {
                    this.selectedID = item.latitude + "," + item.longitude;
                    this.allTraillerSubSet.push(item);
                    this.mapConfig.lat = item.latitude;
                    this.mapConfig.lng = item.longitude;
                    this.mapConfig.zoom = 19;
                    this.mapConfig.mapType = 'satellite';
                    this.mapConfig.marker=i;
                    this.mapConfig.polygon=undefined;
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
            for (var i = 0; i < this.allTrailers_bu.length; i++) {
                let item = this.allTrailers_bu[i];
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
        if(this.asToggle){
            //this.allTrailers=this.advanceSearchFilter(this.allTrailers);
            //this.allTraillerSubSet=this.advanceSearchFilter(this.allTraillerSubSet);

        }
    }

    

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

    showTrHistory(item){
        this.historyConfig['trailer']=item;
        this.historyConfig.showHistory=true;
        this.getTrailerPingHistory(item);
    }


    searchByCustID(){
        
            //this.gmapJs.drawPoly();
            //this.allTraillerSubSet=[];
            //this.allTraillerSubSet=this.mapConfig.trailesInBound;
            this.mapConfig.marker=-1;
            this.custID=this.custID.toUpperCase();
            this.getTrailerDetailsByCustomerId(this.custID);
            
        
    }

    filterByBounds(multipolygonWKT:any,trList){
        
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
                console.log("{lat:"+parseFloat(coordinates[1])+",lng:"+ parseFloat(coordinates[0])+"}");
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
        this.allTrailers_bu.forEach(element => {
            if(element.trailerID=="R3003"){
                console.log("ro");
            }
            if (trList.includes(element.trailerID)) {
                bag.push(element);
            }
        });
        this.allTraillerSubSet = bag;
        this.allTrailers = bag;
    }
    
    

    

    

    allTraillerSubSet1: any = [];
    

    

    
   

    

    allTrailers=[];
}


