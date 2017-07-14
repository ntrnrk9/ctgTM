import { Component } from '@angular/core';

@Component({
    selector: 'header',
    templateUrl: 'header.component.html',
    styleUrls: [ 'header.component.css'],
    moduleId: module.id
})
export class HeaderComponent {
    private name = 'HeaderComponent';
}

// This code copy to app.module.ts
