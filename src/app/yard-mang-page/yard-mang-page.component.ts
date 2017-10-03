import { Component } from '@angular/core';

@Component({
    selector: 'yard-mang-page',
    templateUrl: 'yard-mang-page.component.html',
    styleUrls: [ 'yard-mang-page.component.css'],
    moduleId: module.id
})
export class YardMangPageComponent {
    private name = 'YardMang-pageComponent';
    toShowTab = 2;
}

// This code copy to app.module.ts
