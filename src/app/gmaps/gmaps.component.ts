import { Component, OnInit,Input } from '@angular/core';

@Component({
    selector: 'gmaps',
    templateUrl: 'gmaps.component.html',
    styleUrls: [ 'gmaps.component.css'],
    moduleId: module.id
})
export class GmapsComponent {

    @Input() config:any;
    private name = 'GmapsComponent';
    title: string = 'My first angular2-google-maps project';
    lat: number = 36.090240;
    lng: number = -95.712891;
    icon="../../assets/images/markers/h-map-pointer.png"
    US_CENTER_LAT_LNG = { lat: 36.090240, lng: -95.712891 };
    infoWindowOpened: any = null;
    fullscreenControl: Boolean = true;
    streetViewControl: Boolean = false;
    clickedMarker(label: string, infoWindow: any, index: number) {
        console.log("clicked");
        if (this.infoWindowOpened === infoWindow) {
            return;
        }else  if (this.infoWindowOpened !== null) {
            this.infoWindowOpened.close();
        }

        this.infoWindowOpened = infoWindow;
        //if (this.zoom == 15)
        //    this.zoom = 4;
        //else
        //    this.zoom = 15;
    };
    zoom: number = 4;
    citymap = [
        {
            center: { lat: 41.878, lng: -87.629 },
            population: 2714856,
            icon: '../../assets/images/markers/trailer-blue.png',
            title: 'AAA',
            label:'A'
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

    mapClicked() {

        if (this.infoWindowOpened == null) {
            //this.infoWindowOpened = item;
        } else {
            this.infoWindowOpened.close();
            
        }
    }

    toggleIW(item:any) {
        //alert("hi");
        console.log("hi");
        if (this.infoWindowOpened == null) {
            this.infoWindowOpened = item;
        } else {
            this.infoWindowOpened.close();
            this.infoWindowOpened = item;
        }
        item.open();
        
    }
    constructor() { }

    ngOnInit() {
        if(this.config.length>0){
            this.lat=this.config[0].latitude;
            this.lng=this.config[0].longitude;
            this.zoom=10;
        }
    }

    ngOnChanges(changes: any) {
        if(this.config.length>0){
            this.lat=this.config[0].latitude;
            this.lng=this.config[0].longitude;
            this.zoom=10;
        }

    }

}

// This code copy to app.module.ts
