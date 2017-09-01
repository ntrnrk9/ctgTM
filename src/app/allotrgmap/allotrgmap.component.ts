import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

declare var google: any;
declare var MarkerClusterer: any;
declare var $: any;

import * as config from '../configs/configs';

@Component({
    selector: 'allotrgmap',
    templateUrl: 'allotrgmap.component.html',
    styleUrls: ['allotrgmap.component.css'],
    moduleId: module.id
})
export class AlloTrGmap {
    private search = '';
    
    @Input() selected: any;
    @Input() config: any;
    @Input() trailers: any = [];

    @Output() configChange = new EventEmitter<any>();
    @Output() selectedChange = new EventEmitter<any>();
    
    geocoder: any;
    markers: any;
    markerCluster:any;
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
    infoIsOpen=false;
    


    markerList: any = {
        yellowMark: '../../assets/images/markers/trailer-yellow.png',
        redMark: '../../assets/images/markers/trailer-red.png',
        greenMark: '../../assets/images/markers/trailer-green.png',
        truck:'../../assets/images/Truck.png',
        order:'../../assets/images/Order.png',
        selectedTr:'../../assets/images/selected-trailer.png',
        linkedTruck:'../../assets/images/Trailer-Link.png',
    };


    selectedMarker={marker:{},item:{}};
    selMarker:any;
    selItem:any;
    markerBounds;
    toggleM=false;
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
        this.selectedChange.emit(this.selected);
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
            if (tr.trailerID == this.selected.trailerID) {
                this.index = i;
                marker = new google.maps.Marker(
                    {
                        position: myLatLng,
                        map: this.map,
                        title: tr.trailerID,
                        icon: this.markerList.selectedTr
                    });
                var ob = this.createinfoWinContent(tr);
                this.markerBounds.extend(myLatLng);
                this.bindInfoWindow(tr, marker, this.map, this.infowindow, this.createinfoWinContent(tr));
                //this.markers.push(marker);
            } else {

                marker = new google.maps.Marker(
                    {
                        position: myLatLng,
                        //map: this.map,
                        title: tr.trailerID,
                        icon: this.mapIcon(tr)
                    });
                var ob = this.createinfoWinContent(tr);
                this.markerBounds.extend(myLatLng);
                this.bindInfoWindow(tr, marker, this.map, this.infowindow, this.createinfoWinContent(tr));
                this.markers.push(marker);
            }
        }
        
        if (this.config.truckLat) {
            var truckLatLng = new google.maps.LatLng(this.config.truckLat, this.config.truckLng);
            var trTitle = "Truck: " + this.config.truckLat + " " + this.config.truckLng;
            this.truckMaker = new google.maps.Marker(
                {
                    position: truckLatLng,
                    map: this.map,
                    title: trTitle,
                    icon: this.markerList.truck
                });
            this.markerBounds.extend(truckLatLng);
            this.truckinfowindow = new google.maps.InfoWindow({
                content: ""
            });
            this.truckinfowindow.setContent(this.truckinfoWinContent(this.config.selTruck));
            //truckinfowindow.open(this.map, truckMaker);
            //this.markers.push(truckMaker);
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
            this.orinfowindow = new google.maps.InfoWindow({
                content: ""
            });
            this.orinfowindow.setContent(this.orcreateinfoWinContent(this.config.selOrder));
            //this.orinfowindow.open(this.map, this.orderMaker);
            //this.markers.push(orderMaker);
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
            maxZoom: 18,
            //minimumClusterSize:5
        }
        var obj = this;

        this.markerCluster = new MarkerClusterer(this.map, this.markers,
            mcOptions);
        this.map.fitBounds(this.markerBounds);
        //if(this.config.trailerLat){
            this.directionsDisplay.setMap(this.map);
            this.calcRoute();
        //}
    }

    calcRoute() {

        var waypts = [];
        let start,end;

        end = new google.maps.LatLng(this.config.lat, this.config.lng);
        start = new google.maps.LatLng(this.config.truckLat, this.config.truckLng);
        
            
        if (this.config.trailerLat) {
            let orderStop = new google.maps.LatLng(this.config.trailerLat, this.config.trailerLng)
            waypts.push({
                location: orderStop,
                stopover: true
            });
        }
        
        let transitOptions;
        transitOptions={modes:[google.maps.TransitMode.BUS]}
        var request = {
            origin: start,
            destination: end,
            //waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            //transitOptions:transitOptions
        };

        var ctrl=this;
        this.directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                ctrl.directionsDisplay.setDirections(response);
                var route = response.routes[0];
                ctrl.reset();
            }
        });
    }

    calcRouteDist() {
                var waypts = [];
                let start,end;
        
                end = new google.maps.LatLng(this.config.lat, this.config.lng);
                start = new google.maps.LatLng(this.config.truckLat, this.config.truckLng);
                
                    
                if (this.config.trailerLat) {
                    let orderStop = new google.maps.LatLng(this.config.trailerLat, this.config.trailerLng)
                    waypts.push({
                        location: orderStop,
                        stopover: true
                    });
                }
                
                var request = {
                    origin: start,
                    destination: end,
                    waypoints: waypts,
                    optimizeWaypoints: true,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING,
                    //transitOptions:transitOptions
                };
        
                var ctrl=this;
                this.directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        //ctrl.directionsDisplay.setDirections(response);
                        var route = response.routes[0];
                        ctrl.selected['routeDist']=response.routes[0].legs[0].distance.text;
                        ctrl.emit();
                    }
                });
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
        var content = '<div class="infowindow" style="width:200px;padding:0px;height:73px;overflow:hidden;">' +
            '<div class="row header" style="border-bottom: 1px solid gray;padding:0px 0px 2px 30px">' +
            '<div class="row head1" style="font-size:14px;color:black">Trailer #: <b>' + tr.trailerID + ' (' + tr.company + ')</b></div>' +
            '<div class="row head2" style="font-size:13px;color:red">Name: <b>' + tr.trailerName + '</b></div>' 
            
             +'<div class="row head3" style="font-weight:bold;font-size:12px;padding-right:33px;color:black">'
             + '<span>'+tr.trailerType +'</span>'
             +'<span style="float:right;font-weight:bold;color:' + color + '">' + tr.trailerStatus + '</span>' 
             + '</div>' +
            '</div>' +
            '<div class="row content" style="padding:3px 30px 0px 15px">' +
            '<span>' + tr.latitude + ', ' + tr.longitude + '</span>' +
            '</div>' +

            '</div>';
        return content;
    }

    orcreateinfoWinContent(tr: any) {
        var content = '<div class="infowindow" style="width:200px;padding:0px;height:73px;overflow:hidden;">' +
            '<div class="row header" style="border-bottom: 1px solid gray;padding:0px 0px 2px 30px">' +
            '<div class="row head1" style="font-size:14px;color:black">Order #: <b>' + tr.orderNumber + '</b></div>' +
            '<div class="row head2" style="font-size:13px;color:red">Movement no.: <b>' + tr.movementNumber + '</b></div>' 
            
             +'<div class="row head3" style="font-weight:bold;font-size:12px;padding-right:33px;color:black">'
             +'<span></span>'
             +'<span></span>' 
             +'</div>'+
            '</div>' +
            '<div class="row content" style="padding:3px 30px 0px 15px">' +
            '<span><b>Origin: </b>'+tr.orderOrginCity+', '+tr.orderOrginState+'<br></span>'+
            '<span><b>Destination: </b>' + tr.orderDestCity+', '+tr.orderDestState + '</span>' +
            '</div>' +

            '</div>';
        return content;
    }

    truckinfoWinContent(tr: any) {
        var content = '<div class="infowindow" style="width:200px;padding:0px;height:73px;overflow:hidden;">' +
            '<div class="row header" style="border-bottom: 1px solid gray;padding:0px 0px 2px 30px">' +
            '<div class="row head1" style="font-weight:bold;font-size:14px;color:black">Truck #: ' + tr.number + ' (' + tr.company + ')</div>' +
            '<div class="row head2" style="font-weight:bold;font-size:13px;color:red">Company: ' + tr.make + '</div>' 
            
             +'<div class="row head3" style="font-weight:bold;font-size:12px;padding-right:33px;color:black">'
             + '<span>'+tr.model+'</span>'
             +'<span style="float:right;font-weight:bold;color:red">' + tr.type+' - '+tr.year+ '</span>' 
             + '</div>' +
            '</div>' +
            '<div class="row content" style="padding:3px 30px 0px 15px">' +
            '<span>Trailer attached: ' + tr.trailer + '</span>' +
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
            infowindow.close();
        });
        google.maps.event.addListener(marker, 'click', function () {
            //this.selectMarker(marker);

            ob.selectMarker(item,marker);
            //console.log(ob.selectedMarker);
            //$('#historyModal').modal('show');
            //this.map.setZoom(10);
            //this.map.setCenter(marker.getPosition());
        });
    }

    selectMarker(item,marker) {
        if(this.selected.trailerID==-1){
            this.addSelectiom(item,marker);
        }else if(this.selected.trailerID==item.trailerID){
            this.removeSelection(item,marker);
            this.selected = { trailerID: -1 };
            this.emit();
        }else{
            this.removeSelection(this.selected,this.selMarker);
            this.addSelectiom(item,marker);
            
        }   
    }

    removeSelection(item,marker){
        marker.setIcon(this.mapIcon(item));
        this.markerCluster.addMarker(marker,true);
    }

    addSelectiom(item,marker){
        this.selMarker = marker;
        this.selected = item;
        marker.setIcon(this.markerList.selectedTr);
        this.markerCluster.removeMarker(marker);
        marker.setMap(this.map);
        this.config.trailerLat = item.latitude;
        this.config.trailerLng = item.longitude;
        this.calcRouteDist();
        this.emit();
    }

    increment(item) {
        alert(this.map.getZoom());
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
                this.selected.trailerID = i;
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
        var ctrl=this;
        setTimeout(function () {
            ctrl.map.fitBounds(ctrl.markerBounds);            
        }, 700);
    }

    info(){
        if (!this.infoIsOpen) {
            this.orinfowindow.open(this.map, this.orderMaker);
            this.truckinfowindow.open(this.map, this.truckMaker);
            this.infoIsOpen = true;
        } else {
            this.orinfowindow.close();
            this.truckinfowindow.close();
            this.infoIsOpen = false;
        }
    }

}

// This code copy to app.module.ts
