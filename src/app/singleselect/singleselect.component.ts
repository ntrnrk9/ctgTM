import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-singleselect',
  templateUrl: './singleselect.component.html',
  styleUrls: ['./singleselect.component.css']
})
export class SingleselectComponent implements OnInit {

  @Input() items;
  @Input() config;
  @Input() selectedItem;
  @Input() key;

  @Output() selectedItemChange = new EventEmitter<any>();

  constructor() { }

  selectItem(item: any) {
    console.log("searchFilter: " + JSON.stringify(item[this.key]));
    this.selectedItem = item;
    this.emit();
  }

  multiSelect() {
    this.selectedItem = { lable: "" };
    let count = 0;
    if (this.config.multisel) {
      this.items.forEach(element => {
        if (element.selected) {
          count++;
        }

      });
      if (count == 0) {
        //this.selectedItem = { lable: "Company" };
        this.selectedItem[this.key] = this.config.singleSelLabel;
      } else if (count==1){
        this.items.forEach(element => {
          if(element.selected){
            this.selectedItem[this.key] = element[this.key];
          }
        });
      } else {
        //let value = count + " Company(s) selected";
        let value = count + " "+this.config.multiSelLabel;
        this.selectedItem[this.key] = value;
      }

    }

    this.emit();
  }

  emit() {
    this.selectedItemChange.emit(this.selectedItem);
  }

  ngOnInit() {
    if(this.config.multisel){
      this.multiSelect();
    }
  }

  ngOnChange() {
    this.ngOnInit()
  }

}
