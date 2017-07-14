import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

@Component({
    selector: 'searchfilter',
    templateUrl: 'searchfilter.component.html',
    styleUrls: [ 'searchfilter.component.css'],
    moduleId: module.id
})
export class SearchfilterComponent {
    private search = '';
    @Input() items: any;
    @Input() selectedItem: any;
    @Input() key: any;

    @Output() selectedItemChange = new EventEmitter<any>();

    selectCompany(item: any) {
        console.log("searchFilter: "+JSON.stringify(item[this.key]));
        this.selectedItem = item[this.key];
        this.selectedItemChange.emit(this.selectedItem);
    }

    private resetSearch() {
        this.search = "";
        
    }
}

// This code copy to app.module.ts
