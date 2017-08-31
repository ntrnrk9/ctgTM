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
    this.selectedItem = item[this.key];
    this.emit();
  }

  emit() {
    this.selectedItemChange.emit(this.selectedItem);
  }

  ngOnInit() {
  }

}
