import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

declare var google: any;
declare var MarkerClusterer: any;
declare var $: any;

import * as config from '../configs/configs';

@Component({
    selector: 'gmapjs',
    templateUrl: 'gmapjs.component.html',
    styleUrls: ['gmapjs.component.css'],
    moduleId: module.id
})
export class GmapjsComponent {

    private search = '';

   
    @Input() config: any;
    @Input() trailers: any = [];

    @Output() configChange = new EventEmitter<any>();
    @Output() selectedChange = new EventEmitter<any>();

    geocoder: any;
    markers: any;
    markerCluster: any;
    map: any;
    infowindow: any;
    index: any = -1;
    historyRecv: any = false;
    polyBound: any;
    directionsDisplay;
    directionsService;
    orinfowindow;
    truckinfowindow;
    orderMaker;
    truckMaker;
    infoIsOpen = false;



    markerList: any = {
        yellowMark: '../../assets/images/markers/trailer-yellow.png',
        redMark: '../../assets/images/markers/trailer-red.png',
        greenMark: '../../assets/images/markers/trailer-green.png',
        truck: '../../assets/images/Truck.png',
        order: '../../assets/images/Order.png',
        selectedTr: '../../assets/images/trailer-selected.png',
        linkedTruck: '../../assets/images/Trailer-Linked.png',
    };


    selectedMarker = { marker: {}, item: {} };
    selMarker: any;
    selItem: any;
    markerBounds;
    toggleM = false;
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
    constructor(private http: Http, private cdr: ChangeDetectorRef) { }

    ngOnDestroy() {
        console.log("gmTest componant destroyed");
        //this.config.lat = this.map.getCenter().lat();
        //this.config.lng = this.map.getCenter().lng();
        //this.config.zoom = this.map.getZoom();
        //console.log(JSON.stringify(this.config));
        //this.emit();

    }
    ngOnInit() {

        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });

        this.geocoder = new google.maps.Geocoder();
        this.markers = [];
        this.markerBounds = new google.maps.LatLngBounds();
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
        };
        this.map = new google.maps.Map(document.getElementById("gmMap"), mapProp);
        this.infowindow = new google.maps.InfoWindow({
            content: ""
        });

        this.restrictZoom();

        for (var i = 0; i < this.trailers.length; i++) {
            var tr = this.trailers[i];
            var myLatLng = new google.maps.LatLng(tr.latitude, tr.longitude);
            var marker;

                marker = new google.maps.Marker(
                    {
                        position: myLatLng,
                        map: this.map,
                        title: tr.trailerID,
                        icon: this.mapIcon(tr)
                    });
                //var ob = this.createinfoWinContent(tr);
                this.markerBounds.extend(myLatLng);
                //this.bindInfoWindow(tr, marker, this.map, this.infowindow, this.createinfoWinContent(tr));
                this.markers.push(marker);
            
        }


        if (this.config.lat) {
            var orderLatLng = new google.maps.LatLng(this.config.lat, this.config.lng);
            var orTitle = "Order: " + this.config.lat + " " + this.config.lng;
            console.log(orTitle);
            this.orderMaker = new google.maps.Marker(
                {
                    position: orderLatLng,
                    map: this.map,
                    title: orTitle,
                    icon: this.markerList.order
                    //icon: '../../assets/images/Order.png'
                });
            this.markerBounds.extend(orderLatLng);
            // this.orinfowindow = new google.maps.InfoWindow({
            //     content: ""
            // });
            // this.orinfowindow.setContent(this.orcreateinfoWinContent(this.config.selOrder));
            //this.orinfowindow.open(this.map, this.orderMaker);
            //this.markers.push(orderMaker);
        }

        var obj = this;

        this.map.fitBounds(this.markerBounds);

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
            //color = "#fb3447";
            color = "#15c922";
            status = "CONFIRMED"
        }
        var isEmpty = (tr.isEmpty == 1) ? "Yes" : "No";
        var custID = "";
        if (tr.isPool == 1) {
            if (tr.poolVariance > 0) {
                custID = '<span><b>' + tr.customerId + ' | +' + tr.poolVariance + '</b></span><br>';
            } else if (tr.poolVariance < 0) {
                custID = '<span><b>' + tr.customerId + ' | </b></span><span style="color:#fb3447"><b>' + tr.poolVariance + '</b></span><br>';
            } else {
                custID = '<span><b>' + tr.customerId + ' | ' + tr.poolVariance + '</b></span><br>';
            }
        } else {
            custID = '<span><b>' + tr.customerId + '</b></span><br>';
        }

        var content = '<div class="infowindow" style="width:200px;padding:0px;height:130px;overflow:hidden;">' +
            '<div class="row header" style="border-bottom: 1px solid gray;padding:0px 0px 2px 30px">' +
            '<div class="row head1" style="font-size:14px;color:black">Trailer #: <b>' + tr.trailerID + ' (' + tr.company + ')</b></div>' +
            '<div class="row head2" style="font-size:13px;color:red"><b>' + tr.trailerName + '</b></div>'

            + '<div class="row head3" style="font-weight:bold;font-size:12px;padding-right:33px;color:black">'
            + '<span>' + tr.trailerType + '</span>'
            + '<span style="float:right;font-weight:bold;color:' + color + '">' + tr.trailerStatus + '</span>'
            + '</div>' +
            '</div>' +
            '<div class="row content" style="padding:3px 30px 0px 15px">' +
            custID +
            '<span>Idle time: ' + tr.idlehours + '</span><br>' +
            '<span>Is Empty: ' + isEmpty + '</span><br>' +
            '<span>' + tr.latitude + ', ' + tr.longitude + '</span><br>' +
            '<span>' + tr.location + '</span><br>' +
            '</div>' +

            '</div>';
        return content;
    }

    orcreateinfoWinContent(tr: any) {
        var content = '<div class="infowindow" style="width:200px;padding:0px;height:73px;overflow:hidden;">' +
            '<div class="row header" style="border-bottom: 1px solid gray;padding:0px 0px 2px 30px">' +
            '<div class="row head1" style="font-size:14px;color:black">Order #: <b>' + tr.number + '</b></div>' +
            '<div class="row head2" style="font-size:13px;color:red">Movement no.: <b>' + tr.move + '</b></div>'

            + '<div class="row head3" style="font-weight:bold;font-size:12px;padding-right:33px;color:black">'
            + '<span></span>'
            + '<span></span>'
            + '</div>' +
            '</div>' +
            '<div class="row content" style="padding:3px 30px 0px 15px">' +
            '<span><b>Origin: </b>' + tr.origin + '<br></span>' +
            '<span><b>Destination: </b>' + tr.destination + '</span>' +
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

    }
}
