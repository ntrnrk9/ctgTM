import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

declare var $: any;
@Component({
    selector: 'home-page',
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.css'],
    moduleId: module.id
})
export class HomePageComponent {
    private name = 'HomePageComponent';
    selectedState: any = "alabama";
    selectedAvailability: number = -1;
    bylocation: String;
    selectedID: any;
    searchID: any;
    stateList: any = [{ "stateDesc": "Alaska", "stateCode": "AK", "country": "USA" }, { "stateDesc": "Alabama", "stateCode": "AL", "country": "USA" }, { "stateDesc": "Arkansas", "stateCode": "AR", "country": "USA" }, { "stateDesc": "Arizona", "stateCode": "AZ", "country": "USA" }, { "stateDesc": "California", "stateCode": "CA", "country": "USA" }, { "stateDesc": "Colorado", "stateCode": "CO", "country": "USA" }, { "stateDesc": "Connecticut", "stateCode": "CT", "country": "USA" }, { "stateDesc": "District of Columbia", "stateCode": "DC", "country": "USA" }, { "stateDesc": "Delaware", "stateCode": "DE", "country": "USA" }, { "stateDesc": "Florida", "stateCode": "FL", "country": "USA" }, { "stateDesc": "Georgia", "stateCode": "GA", "country": "USA" }, { "stateDesc": "Hawaii", "stateCode": "HA", "country": "USA" }, { "stateDesc": "Iowa", "stateCode": "IA", "country": "USA" }, { "stateDesc": "Idaho", "stateCode": "ID", "country": "USA" }, { "stateDesc": "Illinois", "stateCode": "IL", "country": "USA" }, { "stateDesc": "Indiana", "stateCode": "IN", "country": "USA" }, { "stateDesc": "Kansas", "stateCode": "KS", "country": "USA" }, { "stateDesc": "Kentucky", "stateCode": "KY", "country": "USA" }, { "stateDesc": "Louisiana", "stateCode": "LA", "country": "USA" }, { "stateDesc": "Massachusetts", "stateCode": "MA", "country": "USA" }, { "stateDesc": "Maryland", "stateCode": "MD", "country": "USA" }, { "stateDesc": "Maine", "stateCode": "ME", "country": "USA" }, { "stateDesc": "Michigan", "stateCode": "MI", "country": "USA" }, { "stateDesc": "Minnesota", "stateCode": "MN", "country": "USA" }, { "stateDesc": "Missouri", "stateCode": "MO", "country": "USA" }, { "stateDesc": "Mississippi", "stateCode": "MS", "country": "USA" }, { "stateDesc": "Montana", "stateCode": "MT", "country": "USA" }, { "stateDesc": "North Carolina", "stateCode": "NC", "country": "USA" }, { "stateDesc": "North Dakota", "stateCode": "ND", "country": "USA" }, { "stateDesc": "Nebraska", "stateCode": "NE", "country": "USA" }, { "stateDesc": "New Hampshire", "stateCode": "NH", "country": "USA" }, { "stateDesc": "New Jersey", "stateCode": "NJ", "country": "USA" }, { "stateDesc": "New Mexico", "stateCode": "NM", "country": "USA" }, { "stateDesc": "Nevada", "stateCode": "NV", "country": "USA" }, { "stateDesc": "New York", "stateCode": "NY", "country": "USA" }, { "stateDesc": "Ohio", "stateCode": "OH", "country": "USA" }, { "stateDesc": "Oklahoma", "stateCode": "OK", "country": "USA" }, { "stateDesc": "Oregon", "stateCode": "OR", "country": "USA" }, { "stateDesc": "Pennsylvania", "stateCode": "PA", "country": "USA" }, { "stateDesc": "Rhode Island", "stateCode": "RI", "country": "USA" }, { "stateDesc": "South Carolina", "stateCode": "SC", "country": "USA" }, { "stateDesc": "South Dakota", "stateCode": "SD", "country": "USA" }, { "stateDesc": "Tennessee", "stateCode": "TN", "country": "USA" }, { "stateDesc": "Texas", "stateCode": "TX", "country": "USA" }, { "stateDesc": "Utah", "stateCode": "UT", "country": "USA" }, { "stateDesc": "Virginia", "stateCode": "VA", "country": "USA" }, { "stateDesc": "Vermont", "stateCode": "VT", "country": "USA" }, { "stateDesc": "Washington", "stateCode": "WA", "country": "USA" }, { "stateDesc": "Wisconsin", "stateCode": "WI", "country": "USA" }, { "stateDesc": "West Virginia", "stateCode": "WV", "country": "USA" }, { "stateDesc": "Wyoming", "stateCode": "WY", "country": "USA" }];
    mgToggleFlag = true;

    allTrailers: any = [
        { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "25007", "trailerType": "UNK", "latitude": 36.11857, "longitude": -86.41091, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "25010", "trailerType": "UNK", "latitude": 36.12121, "longitude": -86.41055, "location": "Mount Juliet,TN", "landmark": "Amazon.com (AMALEB04) Lebanon, TN", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "35531", "trailerType": "DRY", "latitude": 40.6008, "longitude": -75.56779, "location": "South Whitehall Twp, Lehigh Co,PA", "landmark": "Cov Terminal,CM-130238,Allentown TERM", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" },
        { "trailerID": "37733", "trailerType": "DRY", "latitude": 28.42675, "longitude": -81.44616, "location": "Doctor Phillips,FL", "landmark": "Doctor Phillips", "trailerStatus": "Not Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" }
    ];

    ob = {
        column: [{ name: "Trailer ID", width: "9%" }, { name: "Trailer name", width: "9%" }, { name: "Trailer type", width: "9%" }, { name: "Location", width: "9%" }, { name: "Location history", width: "9%" },
        { name: "Allocation status", width: "9%" }, { name: "Compilance status", width: "9%" }, { name: "Road worthiness status", width: "9%" }, { name: "Last DOT inspection date", width: "9%" }, { name: "Accessory/IOT information", width: "9%" },{ name: "Last movement date", width: "10%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    constructor(private http: Http) {
        //this.getStateTrailersStatus();
        setTimeout(() => {
            this.getStateTrailersStatus();
        }, 1000);
        IntervalObservable.create(900000).subscribe((data)=>{this.getStateTrailersStatus()});
    }
    toggleMG() {
        this.mgToggleFlag = !this.mgToggleFlag;
    }

    getvalue() {
        var input = $('#ctgGeoCode').val();
        console.log(input);
        this.bylocation = input;
        //f.geocodeAddress(this.bylocation);
    }
    reset() {
        this.bylocation = "";
        this.searchID = "";
        this.selectedID = "";
        this.getStateTrailersStatus();
    }

    getStateTrailersStatus() {
        //let url="http://61.16.133.244/HomeService/api/StatesTrailerCounts";
        let url = "http://61.16.133.244/HomeService/api/TrailerStatus?trailerStatus=0&trailerId=0";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("StatesTrailerCounts data recieved"); //this.allTrailers = data;
            }, //For Success Response
            (err) => { console.log("StatesTrailerCounts error recieved"); } //For Error Response
            );
    }

    searchByID() {
        for (var i = 0; i < this.allTrailers.length; i++) {
            let item = this.allTrailers[i];
            if (item.trailerID == this.searchID) {
                this.selectedID = item.latitude + "," + item.longitude;
            }
        }
    }

    //http://61.16.133.244/HomeService/api/TrailerStatus?trailerStatus=Available
    //http://61.16.133.244/HomeService/api/TrailerStatus?trailerStatus=Scheduled
    //http://61.16.133.244/HomeService/api/TrailerStatus?trailerStatus=NotAvailable
}

// This code copy to app.module.ts
