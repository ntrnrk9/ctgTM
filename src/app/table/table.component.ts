import { Component,Input } from '@angular/core';

@Component({
    selector: 'app-table',
    templateUrl: 'table.component.html',
    styleUrls: [ 'table.component.css'],
    moduleId: module.id
})
export class TableComponent {
    private name = 'TableComponent';
    @Input('master') master: string;
    @Input() user: string;
    @Input() config: JSON;
}

// This code copy to app.module.ts
