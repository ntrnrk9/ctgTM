import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
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
    @Input() config: any;
    @Input() trailers: any = [];

    @Output() configChange = new EventEmitter<any>();
    geocoder: any;
    markers: any;
    map: any;
    infowindow: any;
    index: any=-1;
    historyRecv: any = false;
    polyBound:any;
    
    markerList: any = {
        yellowMark: '../../assets/images/markers/trailer-yellow.png',
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
            return this.markerList.yellowMark;
        } else {
            return this.markerList.redMark;
        }
    }

    emit() {
        this.configChange.emit(this.config);
        console.log(this.config);
    }

    ngOnChanges(changes: any) {
        console.log("parameters changed " + this.trailers.length);
        //this.addTrailers(changes.trailerList.currentValue);
        if (changes.hasOwnProperty('trailers')) {
            this.ngOnInit();
        }

    }
    constructor(private http: Http) { }

    ngOnDestroy() {
        console.log("gmTest componant destroyed");
        this.config.lat = this.map.getCenter().lat();
        this.config.lng = this.map.getCenter().lng();
        this.config.zoom = this.map.getZoom();
        //console.log(JSON.stringify(this.config));
        this.emit();

    }
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
        if(!this.config.zoom){
            this.config['zoom']=4;
        }
        this.geocoder = new google.maps.Geocoder();
        this.markers = [];
        var mapProp = {
            center: new google.maps.LatLng(this.config.lat, this.config.lng),
            zoom: this.config.zoom,
            mapTypeId: this.config.mapType,
            mapTypeControl: true,
            panControl: true,
            zoomControl: true,
            mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
            scaleControl: true,
            streetViewControl: true,
            overviewMapControl: true,
            rotateControl: true,
            navigationControl: true,
            styles: styles,
        };
        this.map = new google.maps.Map(document.getElementById("gmMap"), mapProp);
        this.infowindow = new google.maps.InfoWindow({
            content: ""
        });

        this.restrictZoom();

        // var input = document.getElementById('ctgGeoCode');
        // var autoCompOptions = {
        //     componentRestrictions: { country: 'us' }
        // };
        // var autocomplete = new google.maps.places.Autocomplete(input, autoCompOptions);

        for (var i = 0; i < this.trailers.length; i++) {
            var tr = this.trailers[i];
            var myLatLng = new google.maps.LatLng(tr.latitude, tr.longitude);
            if (tr.trailerID == this.config.marker) {
                this.index = i;
            }
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
            }],
            maxZoom:18,
            //minimumClusterSize:5
        }
        var obj=this;

        var markerCluster = new MarkerClusterer(this.map, this.markers,
            mcOptions);
        if(this.config.marker>0){
        setTimeout(function () {
            google.maps.event.trigger(obj.markers[obj.config.marker], 'mouseover');
        }, 700);
        }
    if(this.config.polygon){
        this.drawPoly(this.config.polygon,this.config.lat,this.config.lng);
    }
        

    }

    restrictZoom() {
        var obj = this;
        google.maps.event.addListener(this.map, 'zoom_changed', function () {
            if (obj.map.getZoom() < 4) obj.map.setZoom(4);
        });
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
            '<div class="row head1" style="font-weight:bold;font-size:14px;color:black">Trailer #: ' + tr.trailerID + ' ('+tr.company+')</div>' +
            '<div class="row head2" style="font-weight:bold;font-size:13px;color:red">' + tr.trailerName + '</div>' +
            '<div class="row head3" style="font-weight:bold;font-size:12px;color:black">' + tr.trailerType + '</div>' +
            '</div>' +
            '<div class="row title" style="border-bottom:1px solid silver;height:35px;padding:0px 30px 0px 15px">' +
            '<span class="vehicle-date" style="font-size:10px;float:left;padding-top:5px"><b>DOT Date:</b><br>' + this.formatDateTime(tr.dotDate,0) + '</span>' +
            '<span class=" row vehicletype available" style="float:right;font-size:14px;margin-top:4px;font-weight:bold;color:' + color + '">' + tr.trailerStatus + '</span>' +
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
    increment(item) {
        alert(this.map.getZoom());
    }
    geocodeAddress(addr: any) {
        //this.state = addr;
        //alert(this.state);
        var ctrl = this;
        var geocoder = this.geocoder;
        var resultsMap = this.map;
        var address = addr;
        this.config.polygon=undefined;
        //var bound: any = this.boundList;


        geocoder.geocode({ 'address': address}, function (results: any, status: any) {
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
                    //resultsMap.setZoom(7);
                } else {
                    //resultsMap.setZoom(10);
                }
                this.map = resultsMap;
                ctrl.config.lat = this.map.getCenter().lat();
                ctrl.config.lng = this.map.getCenter().lng();
                ctrl.config.zoom = this.map.getZoom();
                //console.log(JSON.stringify(this.config));
                ctrl.emit();
                //ctrl.test(results[0].geometry.bounds);
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
                //ctrl.action.heading = "Geocode";
                //ctrl.action.body = 'Please enter a valid location.';
                //$('#gmResult').modal('show');

            }
        });

    }

    mapCenter(lat: any, lng: any, zoom: any) {
        this.config.lat = lat;
        this.config.lng = lng;
        this.config.zoom = zoom;
        this.emit();
    }
    call(item: any) {
        item = item.toUpperCase();
        for (var i = 0; i < this.trailers.length; i++) {
            var obj = this.trailers[i];
            if (obj.trailerID == item) {
                console.log("id found");
                var pos = new google.maps.LatLng(obj.latitude, obj.longitude)
                this.map.setCenter(pos);
                this.map.setZoom(19);
                this.map.setMapTypeId('satellite');
                var obTemp = this;
                this.index = i;
                this.config.marker=i;
                //this.markers[this.index].setAnimation(google.maps.Animation.BOUNCE);
                console.log(this.markers[this.index]);
                break;
            }
        }
        setTimeout(function () {
            console.log(obTemp.index);
            google.maps.event.trigger(obTemp.markers[obTemp.index], 'mouseover');
        }, 700);
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

    drawGeoFence() {
        // Define the LatLng coordinates for the polygon's path.
        var triangleCoords = [
            { lat: 25.774, lng: -80.190 },
            { lat: 18.466, lng: -66.118 },
            { lat: 32.321, lng: -64.757 },
            { lat: 25.774, lng: -80.190 }
        ];

        var poly = [{ lat: -87.3363893237851, lng: 37.9295343693131 },
        { lat: -87.336357727646828, lng: 37.929602093994617 },
        { lat: -87.336400642991066, lng: 37.929534398019314 },
        { lat: -87.3363893237851, lng: 37.9295343693131 }];
        

        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
            //paths: triangleCoords,
            paths: poly,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        bermudaTriangle.setMap(this.map);
        this.map.setCenter(poly[0].lat,poly[0].lng);
        this.map.setZoom(19);


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

    drawPoly(multipolygonWKT:any,lat:any,lng:any) {
        var polylines = [];
        var toReturn = [];
        //var multipolygonWKT="POLYGON ((-106.29151225090025 31.719999517096294, -106.28837943077087 31.719944759613266, -106.28841161727905 31.721541839581246, -106.29127621650696 31.721468830811506, -106.29151225090025 31.719999517096294))";
        this.polyBound = new google.maps.LatLngBounds();


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
                this.polyBound.extend(latlng);    
                polylines[i].push(latlng);

            }
        }

        //by now you should have the polylines array filled with arrays that hold the coordinates of the polylines of the multipolyline
        //lets loop thru this array

        for (var k = 0; k < polylines.length; k++) {
            var line = polylines[k];
            if (k > -1) {
                
                var poly=    new google.maps.Polygon({
                        paths: line,
                        strokeColor: 'red',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        zIndex: 1
                    });
                    poly.setMap(this.map);
                    this.config.polygon=multipolygonWKT;
            }
        }

        this.emit();
        var latlng = new google.maps.LatLng(lat,lng);
        this.map.setCenter(latlng);
        this.map.setZoom(15);
        return toReturn;
    }


}

// This code copy to app.module.ts
