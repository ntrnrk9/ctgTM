import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { AgmCoreModule } from '@agm/core';
import { AlertModule } from 'ngx-bootstrap';
import { NgxPaginationModule, PaginatePipe, PaginationService } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';


import { HeaderComponent } from './header/header.component';
import { MainTabsComponent } from './mainTabs/mainTabs.component';
import { TrackTrailerComponent } from './track-trailer/track-trailer.component';
import { GmapsComponent } from './gmaps/gmaps.component';
import { YardMangPageComponent } from './yard-mang-page/yard-mang-page.component';
import { TableComponent } from './table/table.component';
import { PoolMangPageComponent } from './pool-mang-page/pool-mang-page.component';
import { AllocationPageComponent } from './allocation-page/allocation-page.component';
import { Pool1MangPageComponent } from './pool1-mang-page/pool1-mang-page.component';
import { Footer1Component } from './footer1/footer1.component';
import { SearchfilterComponent } from './searchfilter/searchfilter.component';
import { GmapjsComponent } from './gmapjs/gmapjs.component';
//import { HttpInject } from './injectables/httpInject';
import { Gmaptest } from './gmaptest/gmaptest.component';
import { Gmtest } from './gmtest/gmtest.component';

import { FilterCPipe } from './Filters/filterC.pipe';
import { FilterArrayPipe } from './Filters/filterArray.pipe';
import { HistoryPageComponent } from './history-page/history-page.component';
import { MyDatePickerModule } from 'mydatepicker';
import { SingleselectComponent } from './singleselect/singleselect.component';
import { HomeMainComponent } from './home-main/home-main.component';
import { TrailerDashComponent } from './trailer-dash/trailer-dash.component';
import { OrderDashComponent } from './order-dash/order-dash.component';

@NgModule({
    imports: [BrowserModule, HttpModule, CommonModule, FormsModule,MyDatePickerModule, NgxPaginationModule,ChartsModule,
        AlertModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAafsMtGWbhgmfXU1TV-K-VUh8y1d8jZjI'
        })],
    declarations: [AppComponent,
        HeaderComponent, MainTabsComponent,
        TrackTrailerComponent, GmapsComponent,
        YardMangPageComponent, TableComponent,
        AllocationPageComponent, PoolMangPageComponent,
        Pool1MangPageComponent, Footer1Component,
        FilterCPipe, FilterArrayPipe,
        SearchfilterComponent, GmapjsComponent,Gmtest, HistoryPageComponent,SingleselectComponent
        , HomeMainComponent, TrailerDashComponent, 
        OrderDashComponent
    ],
    //providers:[{ provide: RequestOptions, useClass: HttpInject }],
    bootstrap: [AppComponent]
})
export class AppModule { }
