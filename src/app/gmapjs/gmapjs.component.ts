//import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var google: any;
declare var MarkerClusterer: any;
declare var $: any;

@Component({
    selector: 'gmapjs',
    templateUrl: 'gmapjs.component.html',
    styleUrls: ['gmapjs.component.css'],
    moduleId: module.id
})
export class GmapjsComponent {
    private name = 'GmapjsComponent';
    US_CENTER_LAT_LNG = { lat: 36.090240, lng: -95.712891 };
    markers: any = [];
    @Input() state: any = "Sydney, NSW";
    @Input() trailerList: any = [];
    @Output() selectedMarkerChange = new EventEmitter<any>();

    @Input() selectedMarker: any;



    ngOnChanges(changes: any) {
        console.log("parameters changed " + this.trailerList.length);
        //this.addTrailers(changes.trailerList.currentValue);
        this.ngOnInit();
    }

    constructor() { }

    map: any;
    geocoder: any = null;
    selectedState: any;
    markerList: any = {
        blueMark: '../../assets/images/markers/trailer-blue.png',
        redMark: '../../assets/images/markers/trailer-red.png',
        greenMark: '../../assets/images/markers/trailer-green.png',
    };
    selectedMark: any = { "trailerID": "25002", "trailerType": "UNK", "latitude": 33.86423, "longitude": -81.03682, "location": "Cayce,SC", "landmark": "Cayce", "trailerStatus": "Available", "idleDuration": 0.0, "lastMovementDate": "UNKNOWN", "dotDate": "UNKNOWN", "iotInfo": "INACTIVE", "compliance": "", "roadWorthiness": "" };

    citymap: any = [
        {
            center: { lat: 41.878, lng: -87.629 },
            population: 2714856,
            icon: '../../assets/images/markers/trailer-blue.png',
            title: 'AAA',
            label: 'A'
        },
        {
            center: { lat: 40.714, lng: -74.005 },
            population: 8405837,
            icon: '../../assets/images/markers/trailer-blue.png',
            title: 'BBBB',
            label: 'B'
        },
        {
            center: { lat: 34.052, lng: -118.243 },
            population: 3857799,
            icon: '../../assets/images/markers/trailer-blue.png',
            title: '<h4>CCCCC</h4',
            label: 'C'
        },
        {
            center: { lat: 49.25, lng: -123.1 },
            population: 603502,
            icon: '../../assets/images/markers/trailer-blue.png',
            title: 'DDDD',
            label: 'D'
        }
    ];
    infowindow: any;
    infoWinContent: String;

    ngOnInit() {
        this.geocoder = new google.maps.Geocoder();
        var bounds = new google.maps.LatLngBounds();
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
            navigationControl: true
        };
        this.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);


        var myCenter = new google.maps.LatLng(36.090240, -95.712891);
        var marker1 = new google.maps.Marker({ position: myCenter });

        // for geocoader autoComplete 
        var input = document.getElementById('ctgGeoCode');
        var autoCompOptions = {
            componentRestrictions: { country: 'us' }
        };
        var autocomplete = new google.maps.places.Autocomplete(input, autoCompOptions);
        var infowindow = new google.maps.InfoWindow({
            content: this.infoWinContent
        });
        //this.addTrailers(bounds);
        this.markers = [];
        for (var i = 0; i < this.trailerList.length; i++) {
            //var position = new google.maps.latlng(this.citymap[i].center.lat, this.citymap[i].center.lng);
            //bounds.extend(position);
            var tr = this.trailerList[i];
            var latLng = new google.maps.LatLng(this.trailerList[i].latitude,
                this.trailerList[i].longitude);
            let marker = new google.maps.Marker({
                position: latLng,
                icon: this.mapIcon(this.trailerList[i]),
            });

            var ob = this.createinfoWinContent(tr);
            this.bindInfoWindow(tr, marker, this.map, infowindow, this.createinfoWinContent(tr));


            this.markers.push(marker);
        }

        // for (var i = 0; i < this.boundList1.length; i++) {
        //     //var position = new google.maps.LatLng(this.citymap[i].center.lat, this.citymap[i].center.lng);
        //     //bounds.extend(position);
        //     let marker = new google.maps.Marker({
        //         position: this.boundList1[i].location,
        //         map: this.map,
        //         label: { text: '01234', color: '#000', fontSize: '11px' },
        //         icon: '../../assets/images/markers/state-pointer.png'
        //     });

        //     this.markers.push(marker);
        //     var ob = this;
        //     marker.addListener('click', function () {
        //         //alert("clicked");
        //         this.map.setZoom(6);
        //         this.map.setCenter(marker.getPosition());
        //         ob.addTrailers(bounds);
        //     });
        // }

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
    address = "United States";

    mapIcon(trailer: any) {
        if (trailer.trailerStatus == "AVL") {
            return this.markerList.greenMark;
        } else if (trailer.trailerStatus == "PLN") {
            return this.markerList.blueMark;
        } else {
            return this.markerList.redMark;
        }
    }

    addTrailers(bounds: any) {
        this.markers = [];
        for (var i = 0; i < this.trailerList.length; i++) {
            //var position = new google.maps.latlng(this.citymap[i].center.lat, this.citymap[i].center.lng);
            //bounds.extend(position);
            var latLng = new google.maps.LatLng(this.trailerList[i].latitude,
                this.trailerList[i].longitude);
            let marker = new google.maps.Marker({
                position: latLng,
                icon: this.mapIcon(this.trailerList[i]),
            });


            marker.addListener('click', function () {
                //alert("clicked");
                this.map.setZoom(10);
                this.map.setCenter(marker.getPosition());
                this.infowindow.open(this.map, marker);
            });
            this.markers.push(marker);
        }
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
        var content = '<div class="infowindow" style="width:200px;padding:0px;height:158px;overflow:hidden;">' +
            '<div class="row header" style="border-bottom: 2px solid gray;padding:0px 0px 0px 30px">' +
            '<div class="row head1" style="font-weight:bold;font-size:16px:color:black">Trailer #: ' + tr.trailerID + '</div>' +
            '<div class="row head2" style="font-weight:bold;font-size:14px:color:red">TR43</div>' +
            '<div class="row head3" style="font-weight:bold;font-size:12px:color:black">' + tr.trailerType + '</div>' +
            '</div>' +
            '<div class="row title" style="border-bottom:1px solid silver;height:30px;padding:0px 30px 0px 15px">' +
            '<span class="vehicle-date" style="font-size:10px;float:left;padding-top:5px">DOT Date:' + tr.dotDate + '</span>' +
            '<span class=" row vehicletype available" style="float:right;font-size:14px;margin-top:4px;font-weight:bold;color:' + color + '">' + status + '</span>' +
            '</div>' +
            '<div class="row content" style="padding:0px 30px 0px 15px">' +
            '<span><b>Location</b></span><br>' + tr.location +
            '<br><br><span><b>lat: </b>' + tr.latitude + '<b></span><br><span>lng: </b>' + tr.longitude + '</span>' +
            '</div>' +

            '</div>';
        return content;
    }

    geocodeAddress(addr: any) {
        this.state = addr;
        //alert(this.state);
        var ctrl = this;
        var geocoder = this.geocoder;
        var resultsMap = this.map;
        var address = addr;
        var bound: any = this.boundList;


        geocoder.geocode({ 'address': address }, function (results: any, status: any) {
            if (status === 'OK') {
                var markerBounds = new google.maps.LatLngBounds();
                resultsMap.setCenter(results[0].geometry.location);
                markerBounds.extend(results[0].geometry.location);
                let state = (results[0].address_components[0].long_name);
                let code = (results[0].address_components[0].short_name);
                let bounds = (results[0].geometry.bounds);
                let location = results[0].geometry.location;
                bound.push({ state: state, bounds: bounds, code: code, location: location });
                resultsMap.fitBounds(results[0].geometry.viewport);
                resultsMap.setZoom(10);
                this.map = resultsMap;
                //ctrl.test(results[0].geometry.bounds);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);

            }
        });

    }

    getAllgeocodeAddress() {
        //alert(this.state);
        var ctrl = this;
        var geocoder = this.geocoder;
        var resultsMap = this.map;
        var address = this.state;
        var bound: any = this.boundList;

        for (var i = 0; i < this.stateList.length; i++) {
            address = this.stateList[i].stateDesc;
            geocoder.geocode({ 'address': address }, function (results: any, status: any) {
                if (status === 'OK') {
                    var markerBounds = new google.maps.LatLngBounds();
                    resultsMap.setCenter(results[0].geometry.location);
                    markerBounds.extend(results[0].geometry.location);
                    let state = (results[0].address_components[0].long_name);
                    let code = (results[0].address_components[0].short_name);
                    let bounds = (results[0].geometry.bounds);
                    let location = results[0].geometry.location;
                    bound.push({ state: state, bounds: bounds, code: code, location: location });
                    resultsMap.fitBounds(results[0].geometry.viewport);
                    resultsMap.setZoom(6);
                    this.map = resultsMap;
                    //ctrl.test(results[0].geometry.bounds);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);

                }
            });
        }
    }

    reset() {
        this.map.setZoom(4);
        var myCenter = new google.maps.LatLng(36.090240, -95.712891);
        this.map.setCenter(myCenter);
    }

    test() {
        console.log(JSON.stringify(this.boundList));
        //let bounds= { "south": 32.528832, "west": -124.48200300000002, "north": 42.0095169, "east": -114.13121100000001 };
        //for (var i = 0; i < this.citymap.length; i++) {
        //    let result = this.contains(bounds, this.citymap[i].center.lat, this.citymap[i].center.lng);
        //    console.log("result: " + result);
        //}
    }
    contains(bound: any, lat: any, lng: any) {
        //let inBox = lat <= bound.north && lat >= bound.south && lng <= bound.west && lng >= bound.east;
        var currentLocation = new google.maps.LatLng(lat, lng);
        var view = google.maps.LatLngBounds({ lat: bound.south, lng: bound.west }, { lat: bound.north, lng: bound.east });
        //var res = google.maps.LatLngBounds({ lat: bound.south, lng: bound.west }, { lat: bound.north, lng: bound.east }).contains(currentLocation);
        var imageBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(bound.south, bound.west), //sw
            new google.maps.LatLng(bound.north, bound.east) //ne
        );
        let one = imageBounds.contains(currentLocation);
        //let inBox = view.contains(currentLocation);
        //console.log(res+" "+inBox+" "+one);
        console.log(one);
        return one;
    }
    selectMarker(item: any) {
        console.log("markerClicked: " + item.trailerID);
        this.selectedMarker = item;
        //this.markerClicked.emit(this.selectedMarker);
        this.selectedMarkerChange.emit(this.selectedMarker);
    }

    searchTrailer(item: any) {
        //alert("test");
        //this.map.panTo(this.markers[item].getPosition());
        var resultMap=this.map;
        if(this.infowindow){
        this.infowindow.close();
        }
        var bounds = new google.maps.LatLngBounds();

        resultMap.setCenter(this.trailerList[item].latitude,this.trailerList[item].longitude);
        //bounds.extend(this.markers[item].getPosition());
        //this.map.setZoom(7);
        // click on the marker
        //resultMap.fitBounds(bounds);
        this.map=resultMap;
        google.maps.event.trigger(this.markers[item], 'mouseover');
    }
    bindInfoWindow(item, marker, map, infowindow, html) {
        var ob = this;
        google.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.setContent(html);
            infowindow.open(map, marker);
            this.infowindow=infowindow;
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            //infowindow.close();
        });
        google.maps.event.addListener(marker, 'click', function () {
            //this.selectMarker(marker);
            ob.selectMarker(item);
            console.log(ob.selectedMarker);
            $('#historyModal').modal('show');
            this.map.setZoom(10);
            this.map.setCenter(marker.getPosition());
        });
    }

    boundList: any = []; //[{ "state": "Alaska", "bounds": { "south": 51.175092, "west": 172.34784609999997, "north": 71.441059, "east": -129.97951090000004 }, "code": "AK" }, { "state": "Alabama", "bounds": { "south": 30.144425, "west": -88.47322689999999, "north": 35.008028, "east": -84.88824599999998 }, "code": "AL" }, { "state": "Arkansas", "bounds": { "south": 33.0041059, "west": -94.61791900000003, "north": 36.4997491, "east": -89.64483790000003 }, "code": "AR" }, { "state": "California", "bounds": { "south": 32.528832, "west": -124.48200300000002, "north": 42.0095169, "east": -114.13121100000001 }, "code": "CA" }, { "state": "Arizona", "bounds": { "south": 31.3321771, "west": -114.8165909, "north": 37.0042599, "east": -109.04522309999999 }, "code": "AZ" }, { "state": "Colorado", "bounds": { "south": 36.992424, "west": -109.06025599999998, "north": 41.0034439, "east": -102.04087800000002 }, "code": "CO" }, { "state": "Connecticut", "bounds": { "south": 40.950943, "west": -73.72777500000001, "north": 42.050587, "east": -71.787239 }, "code": "CT" }, { "state": "Delaware", "bounds": { "south": 38.451018, "west": -75.78914789999999, "north": 39.8394839, "east": -74.98416499999996 }, "code": "DE" }, { "state": "Georgia", "bounds": { "south": 30.3555908, "west": -85.60516489999998, "north": 35.0006589, "east": -80.75142900000003 }, "code": "GA" }, { "state": "Florida", "bounds": { "south": 24.396308, "west": -87.63489600000003, "north": 31.000968, "east": -79.97430600000001 }, "code": "FL" }, { "state": "Idaho", "bounds": { "south": 41.9880051, "west": -117.24302699999998, "north": 49.0011461, "east": -111.04349500000001 }, "code": "ID" }, { "state": "Iowa", "bounds": { "south": 40.375437, "west": -96.63953500000002, "north": 43.5011961, "east": -90.14006089999998 }, "code": "IA" }, { "state": "Washington", "bounds": { "south": 38.7916449, "west": -77.11975899999999, "north": 38.995548, "east": -76.90939300000002 }, "code": "Washington" }, { "state": "Illinois", "bounds": { "south": 36.970298, "west": -91.51307889999998, "north": 42.5083379, "east": -87.01993499999998 }, "code": "IL" }, { "state": "Kansas", "bounds": { "south": 36.9930159, "west": -102.05176879999999, "north": 40.0045419, "east": -94.58838700000001 }, "code": "KS" }, { "state": "Louisiana", "bounds": { "south": 28.8551271, "west": -94.04335200000003, "north": 33.019544, "east": -88.75838799999997 }, "code": "LA" }, { "state": "Maine", "bounds": { "south": 42.91712589999999, "west": -71.08433409999998, "north": 47.459686, "east": -66.8850751 }, "code": "ME" }, { "state": "Mississippi", "bounds": { "south": 30.146096, "west": -91.65500889999998, "north": 34.9961091, "east": -88.09788800000001 }, "code": "MS" }, { "state": "Minnesota", "bounds": { "south": 43.499361, "west": -97.2391958, "north": 49.384358, "east": -89.48338509999996 }, "code": "MN" }, { "state": "North Carolina", "bounds": { "south": 33.7528778, "west": -84.32186899999999, "north": 36.5881568, "east": -75.40011900000002 }, "code": "NC" }, { "state": "Nebraska", "bounds": { "south": 39.999932, "west": -104.053514, "north": 43.00170689999999, "east": -95.30829 }, "code": "NE" }, { "state": "New Mexico", "bounds": { "south": 31.332172, "west": -109.05017299999997, "north": 37.0002931, "east": -103.00196399999999 }, "code": "NM" }, { "state": "New York", "bounds": { "south": 40.4773991, "west": -74.25908989999999, "north": 40.9175771, "east": -73.7002721 }, "code": "New York" }, { "state": "Oklahoma", "bounds": { "south": 33.615787, "west": -103.002455, "north": 37.0023119, "east": -94.43066199999998 }, "code": "OK" }, { "state": "South Carolina", "bounds": { "south": 32.033454, "west": -83.353928, "north": 35.2155401, "east": -78.49930089999998 }, "code": "SC" }, { "state": "Pennsylvania", "bounds": { "south": 39.7197989, "west": -80.51989500000002, "north": 42.516072, "east": -74.68950180000002 }, "code": "PA" }, { "state": "Texas", "bounds": { "south": 25.8371638, "west": -106.64564610000002, "north": 36.5007041, "east": -93.50803889999997 }, "code": "TX" }, { "state": "Virginia", "bounds": { "south": 36.5407589, "west": -83.67541499999999, "north": 39.466012, "east": -75.16643490000001 }, "code": "VA" }, { "state": "Washington", "bounds": { "south": 45.543541, "west": -124.848974, "north": 49.0024305, "east": -116.91557999999998 }, "code": "WA" }, { "state": "Wyoming", "bounds": { "south": 40.994746, "west": -111.05688900000001, "north": 45.005904, "east": -104.0522449 }, "code": "WY" }];
    stateList: any = [{ "stateDesc": "Alaska", "stateCode": "AK", "country": "USA" }, { "stateDesc": "Alabama", "stateCode": "AL", "country": "USA" }, { "stateDesc": "Arkansas", "stateCode": "AR", "country": "USA" }, { "stateDesc": "Arizona", "stateCode": "AZ", "country": "USA" }, { "stateDesc": "California", "stateCode": "CA", "country": "USA" }, { "stateDesc": "Colorado", "stateCode": "CO", "country": "USA" }, { "stateDesc": "Connecticut", "stateCode": "CT", "country": "USA" }, { "stateDesc": "District of Columbia", "stateCode": "DC", "country": "USA" }, { "stateDesc": "Delaware", "stateCode": "DE", "country": "USA" }, { "stateDesc": "Florida", "stateCode": "FL", "country": "USA" }, { "stateDesc": "Georgia", "stateCode": "GA", "country": "USA" }, { "stateDesc": "Hawaii", "stateCode": "HA", "country": "USA" }, { "stateDesc": "Iowa", "stateCode": "IA", "country": "USA" }, { "stateDesc": "Idaho", "stateCode": "ID", "country": "USA" }, { "stateDesc": "Illinois", "stateCode": "IL", "country": "USA" }, { "stateDesc": "Indiana", "stateCode": "IN", "country": "USA" }, { "stateDesc": "Kansas", "stateCode": "KS", "country": "USA" }, { "stateDesc": "Kentucky", "stateCode": "KY", "country": "USA" }, { "stateDesc": "Louisiana", "stateCode": "LA", "country": "USA" }, { "stateDesc": "Massachusetts", "stateCode": "MA", "country": "USA" }, { "stateDesc": "Maryland", "stateCode": "MD", "country": "USA" }, { "stateDesc": "Maine", "stateCode": "ME", "country": "USA" }, { "stateDesc": "Michigan", "stateCode": "MI", "country": "USA" }, { "stateDesc": "Minnesota", "stateCode": "MN", "country": "USA" }, { "stateDesc": "Missouri", "stateCode": "MO", "country": "USA" }, { "stateDesc": "Mississippi", "stateCode": "MS", "country": "USA" }, { "stateDesc": "Montana", "stateCode": "MT", "country": "USA" }, { "stateDesc": "North Carolina", "stateCode": "NC", "country": "USA" }, { "stateDesc": "North Dakota", "stateCode": "ND", "country": "USA" }, { "stateDesc": "Nebraska", "stateCode": "NE", "country": "USA" }, { "stateDesc": "New Hampshire", "stateCode": "NH", "country": "USA" }, { "stateDesc": "New Jersey", "stateCode": "NJ", "country": "USA" }, { "stateDesc": "New Mexico", "stateCode": "NM", "country": "USA" }, { "stateDesc": "Nevada", "stateCode": "NV", "country": "USA" }, { "stateDesc": "New York", "stateCode": "NY", "country": "USA" }, { "stateDesc": "Ohio", "stateCode": "OH", "country": "USA" }, { "stateDesc": "Oklahoma", "stateCode": "OK", "country": "USA" }, { "stateDesc": "Oregon", "stateCode": "OR", "country": "USA" }, { "stateDesc": "Pennsylvania", "stateCode": "PA", "country": "USA" }, { "stateDesc": "Rhode Island", "stateCode": "RI", "country": "USA" }, { "stateDesc": "South Carolina", "stateCode": "SC", "country": "USA" }, { "stateDesc": "South Dakota", "stateCode": "SD", "country": "USA" }, { "stateDesc": "Tennessee", "stateCode": "TN", "country": "USA" }, { "stateDesc": "Texas", "stateCode": "TX", "country": "USA" }, { "stateDesc": "Utah", "stateCode": "UT", "country": "USA" }, { "stateDesc": "Virginia", "stateCode": "VA", "country": "USA" }, { "stateDesc": "Vermont", "stateCode": "VT", "country": "USA" }, { "stateDesc": "Washington", "stateCode": "WA", "country": "USA" }, { "stateDesc": "Wisconsin", "stateCode": "WI", "country": "USA" }, { "stateDesc": "West Virginia", "stateCode": "WV", "country": "USA" }, { "stateDesc": "Wyoming", "stateCode": "WY", "country": "USA" }];
    boundList1 = [{ "state": "Alaska", "bounds": { "south": 51.175092, "west": 172.34784609999997, "north": 71.441059, "east": -129.97951090000004 }, "code": "AK", "location": { "lat": 64.2008413, "lng": -149.4936733 } }, { "state": "Arizona", "bounds": { "south": 31.3321771, "west": -114.8165909, "north": 37.0042599, "east": -109.04522309999999 }, "code": "AZ", "location": { "lat": 34.0489281, "lng": -111.09373110000001 } }, { "state": "Colorado", "bounds": { "south": 36.992424, "west": -109.06025599999998, "north": 41.0034439, "east": -102.04087800000002 }, "code": "CO", "location": { "lat": 39.5500507, "lng": -105.78206740000002 } }, { "state": "Arkansas", "bounds": { "south": 33.0041059, "west": -94.61791900000003, "north": 36.4997491, "east": -89.64483790000003 }, "code": "AR", "location": { "lat": 35.20105, "lng": -91.8318334 } }, { "state": "Alabama", "bounds": { "south": 30.144425, "west": -88.47322689999999, "north": 35.008028, "east": -84.88824599999998 }, "code": "AL", "location": { "lat": 32.3182314, "lng": -86.90229799999997 } }, { "state": "California", "bounds": { "south": 32.528832, "west": -124.48200300000002, "north": 42.0095169, "east": -114.13121100000001 }, "code": "CA", "location": { "lat": 36.778261, "lng": -119.41793239999998 } }, { "state": "Connecticut", "bounds": { "south": 40.950943, "west": -73.72777500000001, "north": 42.050587, "east": -71.787239 }, "code": "CT", "location": { "lat": 41.6032207, "lng": -73.08774900000003 } }, { "state": "Delaware", "bounds": { "south": 38.451018, "west": -75.78914789999999, "north": 39.8394839, "east": -74.98416499999996 }, "code": "DE", "location": { "lat": 38.9108325, "lng": -75.52766989999998 } }, { "state": "Florida", "bounds": { "south": 24.396308, "west": -87.63489600000003, "north": 31.000968, "east": -79.97430600000001 }, "code": "FL", "location": { "lat": 27.6648274, "lng": -81.51575350000002 } }, { "state": "Georgia", "bounds": { "south": 30.3555908, "west": -85.60516489999998, "north": 35.0006589, "east": -80.75142900000003 }, "code": "GA", "location": { "lat": 32.1656221, "lng": -82.90007509999998 } }, { "state": "Idaho", "bounds": { "south": 41.9880051, "west": -117.24302699999998, "north": 49.0011461, "east": -111.04349500000001 }, "code": "ID", "location": { "lat": 44.0682019, "lng": -114.74204079999998 } }, { "state": "Iowa", "bounds": { "south": 40.375437, "west": -96.63953500000002, "north": 43.5011961, "east": -90.14006089999998 }, "code": "IA", "location": { "lat": 41.8780025, "lng": -93.09770200000003 } }, { "state": "Indiana", "bounds": { "south": 37.7717419, "west": -88.097892, "north": 41.761368, "east": -84.78466200000003 }, "code": "IN", "location": { "lat": 40.2671941, "lng": -86.13490189999999 } }, { "state": "Kentucky", "bounds": { "south": 36.4971289, "west": -89.57150890000003, "north": 39.147458, "east": -81.9649708 }, "code": "KY", "location": { "lat": 37.8393332, "lng": -84.27001789999997 } }, { "state": "Maryland", "bounds": { "south": 37.8866049, "west": -79.4876511, "north": 39.723037, "east": -74.9862819 }, "code": "MD", "location": { "lat": 39.0457549, "lng": -76.6412712 } }, { "state": "Michigan", "bounds": { "south": 41.696118, "west": -90.41813580000002, "north": 48.3060628, "east": -82.12297089999998 }, "code": "MI", "location": { "lat": 44.3148443, "lng": -85.60236429999998 } }, { "state": "Missouri", "bounds": { "south": 35.9956829, "west": -95.77470399999999, "north": 40.61364, "east": -89.09949399999999 }, "code": "MO", "location": { "lat": 37.9642529, "lng": -91.8318334 } }, { "state": "North Carolina", "bounds": { "south": 33.7528778, "west": -84.32186899999999, "north": 36.5881568, "east": -75.40011900000002 }, "code": "NC", "location": { "lat": 35.7595731, "lng": -79.01929969999998 } }, { "state": "Nebraska", "bounds": { "south": 39.999932, "west": -104.053514, "north": 43.00170689999999, "east": -95.30829 }, "code": "NE", "location": { "lat": 41.4925374, "lng": -99.90181310000003 } }, { "state": "New York", "bounds": { "south": 40.4773991, "west": -74.25908989999999, "north": 40.9175771, "east": -73.7002721 }, "code": "New York", "location": { "lat": 40.7127837, "lng": -74.00594130000002 } }, { "state": "New Mexico", "bounds": { "south": 31.332172, "west": -109.05017299999997, "north": 37.0002931, "east": -103.00196399999999 }, "code": "NM", "location": { "lat": 34.5199402, "lng": -105.87009009999997 } }, { "state": "Oklahoma", "bounds": { "south": 33.615787, "west": -103.002455, "north": 37.0023119, "east": -94.43066199999998 }, "code": "OK", "location": { "lat": 35.0077519, "lng": -97.09287699999999 } }, { "state": "Rhode Island", "bounds": { "south": 41.095834, "west": -71.90725809999998, "north": 42.0188, "east": -71.08857089999998 }, "code": "RI", "location": { "lat": 41.5800945, "lng": -71.4774291 } }, { "state": "South Dakota", "bounds": { "south": 42.479686, "west": -104.05773909999999, "north": 45.945713, "east": -96.43658900000003 }, "code": "SD", "location": { "lat": 43.9695148, "lng": -99.90181310000003 } }, { "state": "Texas", "bounds": { "south": 25.8371638, "west": -106.64564610000002, "north": 36.5007041, "east": -93.50803889999997 }, "code": "TX", "location": { "lat": 31.9685988, "lng": -99.90181310000003 } }, { "state": "Vermont", "bounds": { "south": 42.7268499, "west": -73.437905, "north": 45.0166591, "east": -71.46503899999999 }, "code": "VT", "location": { "lat": 44.5588028, "lng": -72.57784149999998 } }, { "state": "Wisconsin", "bounds": { "south": 42.4917199, "west": -92.88943310000002, "north": 47.3098219, "east": -86.24954789999998 }, "code": "WI", "location": { "lat": 43.7844397, "lng": -88.78786780000001 } }, { "state": "Wyoming", "bounds": { "south": 40.994746, "west": -111.05688900000001, "north": 45.005904, "east": -104.0522449 }, "code": "WY", "location": { "lat": 43.0759678, "lng": -107.29028390000002 } }, { "state": "North Dakota", "bounds": { "south": 45.9350719, "west": -104.05003999999997, "north": 49.000692, "east": -96.55449099999998 }, "code": "ND", "location": { "lat": 47.5514926, "lng": -101.00201190000001 } }, { "state": "Nevada", "bounds": { "south": 35.001857, "west": -120.0064729, "north": 42.002207, "east": -114.03964789999998 }, "code": "NV", "location": { "lat": 38.8026097, "lng": -116.41938900000002 } }, { "state": "Oregon", "bounds": { "south": 41.9917941, "west": -124.7035411, "north": 46.299099, "east": -116.46326199999999 }, "code": "OR", "location": { "lat": 43.8041334, "lng": -120.55420119999997 } }, { "state": "Washington", "bounds": { "south": 45.543541, "west": -124.848974, "north": 49.0024305, "east": -116.91557999999998 }, "code": "WA", "location": { "lat": 47.7510741, "lng": -120.74013860000002 } }, { "state": "Montana", "bounds": { "south": 44.3582089, "west": -116.050003, "north": 49.00139, "east": -104.03956299999999 }, "code": "MT", "location": { "lat": 46.8796822, "lng": -110.36256579999997 } }, { "state": "Minnesota", "bounds": { "south": 43.499361, "west": -97.23919590000003, "north": 49.384358, "east": -89.48338509999996 }, "code": "MN", "location": { "lat": 46.729553, "lng": -94.68589980000002 } }, { "state": "Utah", "bounds": { "south": 36.99790309999999, "west": -114.05299789999998, "north": 42.001618, "east": -109.04105809999999 }, "code": "UT", "location": { "lat": 39.3209801, "lng": -111.09373110000001 } }, { "state": "Ohio", "bounds": { "south": 38.4034229, "west": -84.8203049, "north": 42.327132, "east": -80.51819999999998 }, "code": "OH", "location": { "lat": 40.4172871, "lng": -82.90712300000001 } }];
}

// This code copy to app.module.ts

