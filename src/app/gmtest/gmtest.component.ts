import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
    @Input() trailers: any = [];

    @Output() itemChange = new EventEmitter<any>();
    geocoder: any;
    markers: any;
    map: any;
    infowindow: any;
    index:any;
    markerList: any = {
        blueMark: '../../assets/images/markers/trailer-blue.png',
        redMark: '../../assets/images/markers/trailer-red.png',
        greenMark: '../../assets/images/markers/trailer-green.png',
    };

    mapIcon(trailer: any) {
        if (trailer.trailerStatus == "AVL") {
            return this.markerList.greenMark;
        } else if (trailer.trailerStatus == "PLN") {
            return this.markerList.blueMark;
        } else {
            return this.markerList.redMark;
        }
    }

    ngOnChanges(changes: any) {
        console.log("parameters changed " + this.trailers.length);
        //this.addTrailers(changes.trailerList.currentValue);
        if (changes.hasOwnProperty('trailers')) {
            this.ngOnInit();
        }

    }

    ngOnInit() {
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
            navigationControl: true
        };
        this.map = new google.maps.Map(document.getElementById("gmMap"), mapProp);
        this.infowindow = new google.maps.InfoWindow({
            content: ""
        });

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
            this.map.setZoom(10);
            this.map.setCenter(marker.getPosition());
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

    selectMarker(item) {

        this.item=item;
        this.itemChange.emit(this.item);

        //this.increment(item);
    }

    call(item: any) {
        var obTemp = this;
        for (var i = 0; i < this.trailers.length; i++) {
            var obj = this.trailers[i];
            if (obj.trailerID == item) {
                console.log("id found");
                var pos = new google.maps.LatLng(obj.latitude, obj.longitude)
                this.map.setCenter(pos);
                this.map.setZoom(25);
                
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

}

// This code copy to app.module.ts
