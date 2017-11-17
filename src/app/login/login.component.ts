import { Component, Input, Output, ViewChild, NgZone, ChangeDetectorRef, OnInit, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MasterServService } from '../service/master-serv.service';
import 'rxjs/add/operator/map';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { GmapjsComponent } from '../gmapjs/gmapjs.component';
import { Gmtest } from '../gmtest/gmtest.component';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
declare var $: any;
import * as config from '../configs/configs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() config: any;
  @Output() configChange = new EventEmitter<any>();
  username = "";
  password = "";
  authToken = ""
  user = "";
  invalidCred=false;
  loggedIn=false;
  action: any = { heading: "", body: "",details: ""};
  ;

  constructor(private http: Http,private masterServ:MasterServService) { }

  ngOnInit() {}

  emit() {
    this.configChange.emit(this.config);
    console.log(this.config);
  }

  login() {
    console.log(this.username);
    console.log(this.password);
    this.getAuthToken();
  }

  getAuthToken() {
    this.loggedIn=true;

    var creds = "username=" + config.username + "&password=" + config.password;

    let authToken = "Basic";
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', 'Basic ' +
      btoa(config.username + ':' + config.password));

    //let options = new RequestOptions({ headers: headers });
    let options = {
      headers: headers
    };
    let postBody = { "username": this.username, "password": this.password };

    let url = "https://api.drivenanalyticsolutions.com/ctg/auth/token";
    // let url = config.ctgApiUrl + "/auth/token";

    this.http.post(url, postBody, options).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("getAuthToken data recieved");
        if (data) {
          console.log("Login-success: got auth token");
          console.log(data.Token);
          console.log(data.ADUser.cn);
          this.authToken = (data.Token);
          this.user = (data.ADUser.cn);
          this.masterServ.$sessionUser=(this.user);
          this.masterServ.$authToken=(this.authToken);
          this.masterServ.$sessionUserID=(this.username);
          this.verifyToken();

        } else {
          console.log("getAuthToken recieved invalid data");
          this.loggedIn=false;
        }

      }, //For Success Response
      (err) => {
        console.log("getAuthToken error recieved");
        this.invalidCred=true;
        this.loggedIn=false;
        // var result={};
        // this.action.heading = "Authentication";
        // this.action.body = "Unexpected Error occured. Please contact system administrator.";
        // this.action.details = 'Authentication service failed<br>' + url + '<br>Status: ' + err.status;
        // $('#unExpecError').modal('show');
        
      } //For Error Response
      );
  }


  verifyToken() {

    var creds = "username=" + config.username + "&password=" + config.password;

    let authToken = "Basic";
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', 'Basic ' +
      btoa(config.username + ':' + config.password));
    headers.append("X-Auth-Token", this.authToken);
    //let options = new RequestOptions({ headers: headers }); 
    let options = {
      headers: headers
    };
    let postBody = { "username": this.username, "password": this.password };

    let url = "https://api.drivenanalyticsolutions.com/ctg/auth/verify";
    // let url = config.ctgApiUrl + "/assets/order/assign_trailer";

    this.http.get(url, options).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("allocateInTMW data recieved");
        if (data) {
          console.log("TMS Trailers matches with TMW Trailer");
          if (data.is_valid) {
            this.config.isValid = true;
            this.invalidCred=false;
            this.loggedIn=false;
            this.emit();
          }else{
            this.loggedIn=false;
            this.action.heading = "Authentication";
            this.action.body = "Invalid token. Please login again.";
            this.action.details = "";
            $('#unExpecError').modal('show');
          }

        } else {
          console.log("TMS Trailers do not match with TMW Trailer");
          this.loggedIn=false;
          this.action.heading = "Authentication";
          this.action.body = "Unexpected Error occured. Please contact system administrator.";
          this.action.details = 'Token validation service recieved invalid data<br>' + url;
          $('#unExpecError').modal('show');
        }

      }, //For Success Response
      (err) => {
        console.log("allocateInTMW error recieved");
        this.loggedIn=false;
        this.action.heading = "Authentication";
        this.action.body = "Unexpected Error occured. Please contact system administrator.";
        this.action.details = 'Token validation service failed<br>' + url + '<br>Status: ' + err.status;
        $('#unExpecError').modal('show');
      } //For Error Response
      );
  }
}