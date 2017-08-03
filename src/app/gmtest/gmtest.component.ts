import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as config from '../configs/configs';

declare var google: any;
declare var MarkerClusterer: any;
declare var $: any;

@Component({
    selector: 'gmtest',
    templateUrl: 'gmtest.component.html',
    styleUrls: ['gmtest.component.css'],
    moduleId: module.id
})
export class Gmtest {
    private search = '';
    @Input() item: any;
    @Input() loc: any;
    @Input() trailers: any = [];

    @Output() itemChange = new EventEmitter<any>();
    geocoder: any;
    markers: any;
    map: any;
    infowindow: any;
    index: any;
    historyRecv:any=false;
    markerList: any = {
        blueMark: '../../assets/images/markers/trailer-blue.png',
        redMark: '../../assets/images/markers/trailer-red.png',
        greenMark: '../../assets/images/markers/trailer-green.png',
    };
    selectedMarker: any = { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Planned", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" };
    history = {
        column: [{ name: "Date", width: "25%" }, { name: "Order ID", width: "25%" }, { name: "Start City", width: "25%" }, { name: "Destination City", width: "25%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };

    action: any = { heading: "Geocode", body: "Please enter a valid location." };

    mapIcon(trailer: any) {
        if (trailer.trailerStatus == "AVL") {
            return this.markerList.greenMark;
        } else if (trailer.trailerStatus == "PLN") {
            return this.markerList.blueMark;
        } else {
            return this.markerList.redMark;
        }
    }

    emit() {
        this.itemChange.emit(this.item);
    }

    ngOnChanges(changes: any) {
        console.log("parameters changed " + this.trailers.length);
        //this.addTrailers(changes.trailerList.currentValue);
        if (changes.hasOwnProperty('trailers')) {
            this.ngOnInit();
        }

    }
    constructor(private http: Http) {}

    ngOnInit() {
        var styles = [
            {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "visibility": "on" }
                   
                ]
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    { "visibility": "on" }
                ]
            }, {
                "featureType": "administrative.locality",
                "stylers": [
                    { "visibility": "on" }
                ]
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "on" }
                ]
            }
        ];
        this.geocoder = new google.maps.Geocoder();
        this.markers = [];
        var mapProp = {
            center: new google.maps.LatLng(36.090240, -95.712891),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            panControl: true,
            zoomControl: true,
            mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
            scaleControl: true,
            streetViewControl: true,
            overviewMapControl: true,
            rotateControl: true,
            navigationControl: true,
            styles:styles,
        };
        this.map = new google.maps.Map(document.getElementById("gmMap"), mapProp);
        this.infowindow = new google.maps.InfoWindow({
            content: ""
        });

        // var input = document.getElementById('ctgGeoCode');
        // var autoCompOptions = {
        //     componentRestrictions: { country: 'us' }
        // };
        // var autocomplete = new google.maps.places.Autocomplete(input, autoCompOptions);

        for (var i = 0; i < this.trailers.length; i++) {
            var tr = this.trailers[i];
            var myLatLng = new google.maps.LatLng(tr.latitude, tr.longitude);
            var marker = new google.maps.Marker(
                {
                    position: myLatLng,
                    //map: this.map,
                    title: tr.trailerID,
                    icon: this.mapIcon(tr)
                });
            var ob = this.createinfoWinContent(tr);
            this.bindInfoWindow(tr, marker, this.map, this.infowindow, this.createinfoWinContent(tr));
            this.markers.push(marker);
        }
        var mcOptions = {
            styles: [{
                height: 53,
                url: "../../assets/images/markers/running1.png",
                width: 53,
                textColor: "white"
            },
            {
                height: 56,
                url: "../../assets/images/markers/running2.png",
                width: 56,
                textColor: "white"
            },
            {
                height: 66,
                url: "../../assets/images/markers/running3.png",
                width: 66,
                textColor: "white"
            },
            {
                height: 78,
                url: "../../assets/images/markers/running4.png",
                width: 78,
                textColor: "white"
            },
            {
                height: 90,
                url: "../../assets/images/markers/running5.png",
                width: 90,
                textColor: "white"
            }]
        }

        var markerCluster = new MarkerClusterer(this.map, this.markers,
            mcOptions);
    }

    createinfoWinContent(tr: any) {
        var color = ""; var status = ""
        if (tr.trailerStatus == 'AVL') {
            color = "#15c922";
            status = "AVAILABLE"
        } else if (tr.trailerStatus == 'PLN') {
            color = "#158cff";
            status = "PLANNED";
        } else {
            color = "#fb3447";
            status = "CONFIRMED"
        }
        var content = '<div class="infowindow" style="width:200px;padding:0px;height:170px;overflow:hidden;">' +
            '<div class="row header" style="border-bottom: 2px solid gray;padding:0px 0px 0px 30px">' +
            '<div class="row head1" style="font-weight:bold;font-size:14px;color:black">Trailer #: ' + tr.trailerID + '</div>' +
            '<div class="row head2" style="font-weight:bold;font-size:13px;color:red">'+tr.trailerName+'</div>' +
            '<div class="row head3" style="font-weight:bold;font-size:12px;color:black">' + tr.trailerType + '</div>' +
            '</div>' +
            '<div class="row title" style="border-bottom:1px solid silver;height:35px;padding:0px 30px 0px 15px">' +
            '<span class="vehicle-date" style="font-size:10px;float:left;padding-top:5px"><b>DOT Date:</b><br>' + tr.dotDate + '</span>' +
            '<span class=" row vehicletype available" style="float:right;font-size:14px;margin-top:4px;font-weight:bold;color:' + color + '">' + status + '</span>' +
            '</div>' +
            '<div class="row content" style="padding:3px 30px 0px 15px">' +
            '<span><b>Location</b></span><br>' + tr.location +
            '<br><br><span><b>lat: </b>' + tr.latitude + '<b></span><br><span>lng: </b>' + tr.longitude + '</span>' +
            '</div>' +

            '</div>';
        return content;
    }

    bindInfoWindow(item, marker, map, infowindow, html) {
        var ob = this;
        google.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.setContent(html);
            infowindow.open(map, marker);
            this.infowindow = infowindow;
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            //infowindow.close();
        });
        google.maps.event.addListener(marker, 'click', function () {
            //this.selectMarker(marker);

            ob.selectMarker(item);
            //console.log(ob.selectedMarker);
            //$('#historyModal').modal('show');
            //this.map.setZoom(10);
            this.map.setCenter(marker.getPosition());
        });
    }

    selectMarker(item) {

        this.selectedMarker = item;
        this.getTrailerHistory();
        $('#gmHistoryModal').modal('show');

        //this.selectedMarkerChange.emit(this.selectedMarker);

        //this.increment(item);
    }
increment(item){
    alert(this.map.getZoom());
}
    geocodeAddress(addr: any) {
        //this.state = addr;
        //alert(this.state);
        var ctrl = this;
        var geocoder = this.geocoder;
        var resultsMap = this.map;
        var address = addr;
        //var bound: any = this.boundList;


        geocoder.geocode({ 'address': address }, function (results: any, status: any) {
            if (status === 'OK') {
                var markerBounds = new google.maps.LatLngBounds();
                resultsMap.setCenter(results[0].geometry.location);
                markerBounds.extend(results[0].geometry.location);
                let state = (results[0].address_components[0].long_name);
                let code = (results[0].address_components[0].short_name);
                let bounds = (results[0].geometry.bounds);
                let location = results[0].geometry.location;
                //bound.push({ state: state, bounds: bounds, code: code, location: location });
                resultsMap.fitBounds(results[0].geometry.viewport);
                if (results[0].types[0] == "locality") {
                    resultsMap.setZoom(7);
                } else {
                    resultsMap.setZoom(10);
                }
                this.map = resultsMap;
                //ctrl.test(results[0].geometry.bounds);
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
                //ctrl.action.heading = "Geocode";
                //ctrl.action.body = 'Please enter a valid location.';
                //$('#gmResult').modal('show');

            }
        });

    }

    call(item: any) {
        item=item.toUpperCase();
        for (var i = 0; i < this.trailers.length; i++) {
            var obj = this.trailers[i];
            if (obj.trailerID == item) {
                console.log("id found");
                var pos = new google.maps.LatLng(obj.latitude, obj.longitude)
                this.map.setCenter(pos);
                this.map.setZoom(21);
                this.map.setMapTypeId('satellite');
                var obTemp = this;
                //this.infowindow.setContent(this.createinfoWinContent(obj));
                //this.infowindow.open(this.map, obTemp.markers[i]);
                this.index = i;
                console.log(this.markers[this.index]);
                break;
                //     setTimeout(() => {
                //      google.maps.event.trigger(obTemp.markers[i], 'mouseover');
                //  }, 50);
                //google.maps.event.trigger(this.markers[i], 'mouseover');
            }
        }
        setTimeout(function () {
            console.log(obTemp.index);
            google.maps.event.trigger(obTemp.markers[obTemp.index], 'mouseover');
        }, 500);
    }

    reset() {
        this.map.setZoom(4);
        var myCenter = new google.maps.LatLng(36.090240, -95.712891);
        this.map.setCenter(myCenter);
        this.map.setMapTypeId('roadmap');
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


}

// This code copy to app.module.ts
