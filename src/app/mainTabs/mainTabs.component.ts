import { Component } from '@angular/core';

@Component({
    selector: 'mainTabs',
    templateUrl: 'mainTabs.component.html',
    styleUrls: [ 'mainTabs.component.css'],
    moduleId: module.id
})
export class MainTabsComponent {
    toShowTab = 3;
    allocateConfig={page:0};
    private name = 'MainTabsComponent';
}

// This code copy to app.module.ts
