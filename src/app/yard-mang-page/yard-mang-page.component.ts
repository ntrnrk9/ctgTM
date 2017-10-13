import { Component, OnInit, Input, ViewChild, NgZone, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

declare var $: any;
import * as config from '../configs/configs';
declare let d3: any;

@Component({
    selector: 'yard-mang-page',
    templateUrl: 'yard-mang-page.component.html',
    styleUrls: ['yard-mang-page.component.css'],
    moduleId: module.id
})
export class YardMangPageComponent {
    private name = 'YardMang-pageComponent';
    
    toShowTab = 1;
    ymConfig = {
        trailers: [],
        isAvail: false
    }
    ycConfig = {
        trailers: [],
        isAvail: false
    }
    
    trailers = [];


    constructor(private http: Http) {
        this.getYardTrailers();
    }

    getYardTrailers() {
        this.ymConfig.trailers = [];
        this.ymConfig.isAvail = false;
        this.ycConfig.trailers = [];
        this.ycConfig.isAvail = false;

        //let url="http://61.16.133.244/HomeService/api/StatesTrailerCounts";
        let url = config.baseUrl + "/YardMGMTService/api/YardTrailers";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("StatesTrailerCounts data recieved");
                this.trailers = data.dataSet;
                this.ymConfig.trailers = data.dataSet;
                this.ymConfig.isAvail = true;
                var bag = [];
                this.trailers.forEach(element => {
                    if (element.dOTDueDays <= 7) {
                        bag.push(element);
                    }
                });

            }, //For Success Response
            (err) => {
                console.log("StatesTrailerCounts error recieved");
                this.ymConfig.trailers = [];
                this.ymConfig.isAvail = true;
            } //For Error Response
            );
    }
}

// This code copy to app.module.ts
