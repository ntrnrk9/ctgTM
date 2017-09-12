import { Component, OnInit, Input,ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import * as config from '../configs/configs';

@Component({
  selector: 'app-order-dash',
  templateUrl: './order-dash.component.html',
  styleUrls: ['./order-dash.component.css']
})
export class OrderDashComponent implements OnInit {

  constructor(private http: Http, private cdr: ChangeDetectorRef) {
    this.getOrderStats();
   }

  ngOnInit() {
  }

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
       xAxes: [{ barThickness : 20}]
      }
  };
  public barChartLabels: string[] = ['Moving as planned', 'Not started', 'Not as per plan','Not as per plan'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;
  colorsOPs=['red'];
  dataSet=[];
  pack=[];

  public barChartData: any[] = [
    {
      data: [65, 59, 80, 90], label: 'Series A',
      backgroundColor: [
        '#22466f','#22466f','#22466f','#22466f'
      ]
    }

  ];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  getOrderStats() {
    let url = config.baseUrl + "/HomeService/api/OrderTrailerTrack";
    
    this.http.get(url).map(res => res.json())
      .subscribe(
      (data) => {
        console.log("orderStats data recieved");
        this.dataSet=data.dataSet;
        this.readyDdata();

      }, //For Success Response
      (err) => {
        console.log("StatesTrailerCounts error recieved");

      } //For Error Response
      );
  }
  
  readyDdata(){
    var one={length:0,list:[]};
    var two={length:0,list:[]};
    var three={length:0,list:[]};
    var four={length:0,list:[]};
    for(let i=0;i<this.dataSet.length;i++){
      var item=this.dataSet[i];
      if (item.isMovingAsPlanned == 1) {
        one.length++;
        one.list.push(item);
      } else if (item.isMovingAsPlanned == 2) {
        two.length++;
        two.list.push(item);
      } else if (item.isMovingAsPlanned == 3) {
        three.length++;
        three.list.push(item);
      } else if (item.isMovingAsPlanned == 4) {
        four.length++;
        four.list.push(item);
      }

      this.pack.push(one);
      this.pack.push(two);
      this.pack.push(three);
      this.pack.push(four);
      this.barChartData[0].data=[one.length,two.length,three.length,four.length]
    }
  }
}
