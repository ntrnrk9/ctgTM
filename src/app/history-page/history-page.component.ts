import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
//import { DateRange } from '.././date-range';

declare var $: any;
@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
  @Input() config: any;
  @Output() configChange = new EventEmitter<any>();

  newList = [];
  dayList = [];
  endDate = { date: { year: 2018, month: 10, day: 9 } };
  fromDate: any = { date: { year: 20018, month: 10, day: 9 } };
  pingList = [];
  allTrailers = [];
  allTraillerSubSet = [{ edate: 'asdf', lat: 'asdf', lng: 'asdf', location: 'asdf', landmark: 'asdf', idleDuration: 'asdf', moving: 'asdf', mStartDate: 'asdf' }];
  mgToggleFlag = false;

  ob = {
    column: [{ name: "Event Date", width: "12%" }, { name: "Latitude", width: "12%" }, { name: "Longitude", width: "12%" }, { name: "Location", width: "12%" }, { name: "Landmark", width: "12%" },
    { name: "Idle duration", width: "12%" }, { name: "Moving", width: "12%" }, { name: "Moving start date", width: "16%" }],
    groups: []
  };

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    disableUntil: this.endDate.date,

  };

  constructor() {
    let fdate = new Date();
    this.fromDate = {
      date: {
        year: fdate.getFullYear(),
        month: fdate.getMonth() + 1,
        day: fdate.getDate()
      }
    };
    let edate = new Date();
    edate.setDate(edate.getDate() - 30);
    this.endDate = {
      date: {
        year: edate.getFullYear(),
        month: edate.getMonth() + 1,
        day: edate.getDate()
      }
    };
    this.myDatePickerOptions.disableUntil = this.endDate.date;
    this.myDatePickerOptions.disableSince = this.fromDate.date;

  }

  filterByDate(item) {
    var fDate, eDate;
    if (this.fromDate) {
      fDate = new Date(this.fromDate.date.year, this.fromDate.date.month - 1, this.fromDate.date.day);
    } else {
      fDate = new Date();
    }
    if (this.endDate) {
      eDate = new Date(this.endDate.date.year, this.endDate.date.month - 1, this.endDate.date.day);
    } else {
      eDate = new Date();
      eDate.setDate(eDate.getDate() - 30);
    }
    var aDate = item.split('/');
    var newD = new Date(aDate[2], aDate[0] - 1, aDate[1]);
    if (newD <= fDate && newD >= eDate) {
      return true;
    }
    return false;
  }

  filter() {
    console.log("newList has " + this.config.backupDS.length);
    this.config.allTraillerSubSet = [];
    this.config.dataSet = [];
    for (var i = 0; i < this.config.backupATS.length; i++) {
      var obj = this.config.backupATS[i];
      if (this.filterByDate(obj.eDate)) {
        this.config.allTraillerSubSet.push(obj);
      }
    }
    for (var i = 0; i < this.config.backupDS.length; i++) {
      var obj = this.config.backupDS[i];
      if (this.filterByDate(obj.eventDate)) {
        this.config.dataSet.push(obj);
      }
    }
    if (this.config.dataSet.length > 0) {
      this.plotMap(this.config.dataSet[0]);
    } else {
      this.pingList = [];
    }

  }


  ngOnInit() {
    this.newList = JSON.parse(JSON.stringify(this.config.allTraillerSubSet));
    //this.filterByDate();
    //this.dayList=JSON.parse(JSON.stringify(this.config.dataSet));
  }

  ngOnChanges(changes: any) {
    this.ngOnInit();
  }

  toggleMG() {
    this.mgToggleFlag = !this.mgToggleFlag;
    if (this.config.dataSet.length > 0) {
      this.pingList = this.config.dataSet[0].eventDateValues;
    }
  }

  close() {
    this.config.showHistory = false;
    this.emit();
  }

  emit() {
    this.configChange.emit(this.config);
    console.log(this.config);
  }

  plotMap(con: any) {
    this.pingList = con.eventDateValues;

  }

}
