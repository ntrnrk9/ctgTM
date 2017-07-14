"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GmapsComponent = (function () {
    function GmapsComponent() {
        this.name = 'GmapsComponent';
        this.title = 'My first angular2-google-maps project';
        this.lat = 36.090240;
        this.lng = -95.712891;
        this.US_CENTER_LAT_LNG = { lat: 36.090240, lng: -95.712891 };
        this.infoWindowOpened = null;
        this.fullscreenControl = true;
        this.streetViewControl = false;
        this.zoom = 4;
        this.citymap = [
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
    }
    GmapsComponent.prototype.clickedMarker = function (label, infoWindow, index) {
        console.log("clicked");
        if (this.infoWindowOpened === infoWindow) {
            return;
        }
        else if (this.infoWindowOpened !== null) {
            this.infoWindowOpened.close();
        }
        this.infoWindowOpened = infoWindow;
        //if (this.zoom == 15)
        //    this.zoom = 4;
        //else
        //    this.zoom = 15;
    };
    ;
    GmapsComponent.prototype.mapClicked = function () {
        if (this.infoWindowOpened == null) {
            //this.infoWindowOpened = item;
        }
        else {
            this.infoWindowOpened.close();
        }
    };
    GmapsComponent.prototype.toggleIW = function (item) {
        //alert("hi");
        console.log("hi");
        if (this.infoWindowOpened == null) {
            this.infoWindowOpened = item;
        }
        else {
            this.infoWindowOpened.close();
            this.infoWindowOpened = item;
        }
        item.open();
    };
    GmapsComponent.prototype.ngOnInit = function () {
    };
    return GmapsComponent;
}());
GmapsComponent = __decorate([
    core_1.Component({
        selector: 'gmaps',
        templateUrl: 'gmaps.component.html',
        styleUrls: ['gmaps.component.css'],
        moduleId: module.id
    }),
    __metadata("design:paramtypes", [])
], GmapsComponent);
exports.GmapsComponent = GmapsComponent;
// This code copy to app.module.ts
//# sourceMappingURL=gmaps.component.js.map