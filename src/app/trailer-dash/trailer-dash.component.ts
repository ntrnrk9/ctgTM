import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trailer-dash',
  templateUrl: './trailer-dash.component.html',
  styleUrls: ['./trailer-dash.component.css']
})

export class TrailerDashComponent implements OnInit {

  @Input() trailers;

  public pieChartLabels: string[] = ['Planned', 'Available', 'Inactive', 'Other'];
  public cvenChartData: number[] = [300, 500, 100, 200];
  public srtChartData: number[] = [300, 500, 100, 200];
  public starChartData: number[] = [300, 500, 100, 200];
  cvenList={planned:[],available:[],inactive:[],other:[]};
  srtList={planned:[],available:[],inactive:[],other:[]};
  starList={planned:[],available:[],inactive:[],other:[]};
  
  public pieChartType: string = 'pie';
  public toShowLegend=true;
  constructor() { }

  ngOnChanges(changes: any) {
    this.ngOnInit();

  }

  ngOnInit() {
    var pln = 0, avl = 0, inact = 0, oth = 0;
    var cvenChartData = [0, 0, 0, 0];
    var srtChartData = [0, 0, 0, 0];
    var starChartData = [0, 0, 0, 0];
let map=new Map();
    for (var i = 0; i < this.trailers.length; i++) {

      var item = this.trailers[i];
      if(!map.has(item.trailerStatus)){
        map.set(item.trailerStatus, true);
      }
      if (item.company == 'CVEN') {
        if (item.trailerStatus == 'PLN') {
          if (this.isInactive(item.lastPingDate)) {
            cvenChartData[2]++;
            this.cvenList.inactive.push(item);
          } else {
            cvenChartData[0]++;
            this.cvenList.planned.push(item);
          }
        } else if (item.trailerStatus == 'AVL') {
          if (this.isInactive(item.lastPingDate)) {
            cvenChartData[2]++;
            this.cvenList.inactive.push(item);
          } else {
            cvenChartData[1]++;
            this.cvenList.available.push(item);
          }
        } else {
          if (this.isInactive(item.lastPingDate)) {
            cvenChartData[2]++;
            this.cvenList.inactive.push(item);
          } else {
            cvenChartData[3]++;
            this.cvenList.other.push(item);
          }
        }

      } else if (item.company == "SRT") {
        if (item.trailerStatus == 'PLN') {
          if (this.isInactive(item.lastPingDate)) {
            srtChartData[2]++;
            this.srtList.inactive.push(item);
          } else {
            srtChartData[0]++;
            this.srtList.planned.push(item);
          }
        } else if (item.trailerStatus == 'AVL') {
          if (this.isInactive(item.lastPingDate)) {
            srtChartData[2]++;
            this.srtList.inactive.push(item);
          } else {
            srtChartData[1]++;
            this.srtList.available.push(item);
          }
        } else {
          if (this.isInactive(item.lastPingDate)) {
            srtChartData[2]++;
            this.srtList.inactive.push(item);
          } else {
            srtChartData[3]++;
            this.srtList.other.push(item);
          }
        }

      } else if (item.company == "STAR") {
        if (item.trailerStatus == 'PLN') {
          if (this.isInactive(item.lastPingDate)) {
            starChartData[2]++;
            this.starList.inactive.push(item);
          } else {
            starChartData[0]++;
            this.starList.planned.push(item);
          }
        } else if (item.trailerStatus == 'AVL') {
          if (this.isInactive(item.lastPingDate)) {
            starChartData[2]++;
            this.starList.inactive.push(item);
          } else {
            starChartData[1]++;
            this.starList.available.push(item);
          }
        } else {
          if (this.isInactive(item.lastPingDate)) {
            starChartData[2]++;
            this.starList.inactive.push(item);
          } else {
            starChartData[3]++;
            this.starList.other.push(item);
          }
        }

      }
    }
    var bag = [pln, avl, 1000, oth];
    //this.pieChartData[0]=pln;
    //this.pieChartData[1]=avl;
    this.cvenChartData = cvenChartData;
    this.srtChartData = srtChartData;
    this.starChartData = starChartData;
    console.log(map);
  }

  

  // events
  public chartClicked(e: any): void {
    console.log(e);
    
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public isInactive(item) {
    var date1:any=new Date();
    var date2:any=new Date();

    if (item != "") {
      if (item != "UNKNOWN") {
        var ary = item.split(' ');
        var date = ary[0].split('-');
        var time = ary[1].split(':');
        var secs = time[2].split('.');
        date2 = new Date(date[0], date[1] - 1, date[2]);
        date2.setHours(time[0],time[1],time[2]);
        var hours = Math.abs(date1 - date2) / 36e5;
        if(hours<=72){
          return false;
        }
      }else{
        return true;
      }
    }
    
    return true;
  }

}
