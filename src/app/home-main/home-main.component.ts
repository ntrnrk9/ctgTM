import { Component, ViewChild, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import * as config from '../configs/configs';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css']
})
export class HomeMainComponent implements OnInit {
  toShowTab = 1;
  allTrailers = [];

  trailerStatusResp = false;

  constructor(private http: Http, private cdr: ChangeDetectorRef) {
    this.getStateTrailersStatus()
   }

  ngOnInit() {
  }

  getStateTrailersStatus() {
    this.trailerStatusResp = false;

    let url = config.baseUrl + "/HomeService/api/TrailerStatus?trailerStatus=0&trailerId=0";
    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("StatesTrailerCounts data recieved");
        this.allTrailers = data;
        this.trailerStatusResp = true;

      }, //For Success Response
      (err) => {
        console.log("StatesTrailerCounts error recieved");
        this.trailerStatusResp = true;
      } //For Error Response
      );
  }

}
