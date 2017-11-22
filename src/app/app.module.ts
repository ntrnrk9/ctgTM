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
import { NvD3Module } from 'ng2-nvd3';

import { AppComponent } from './app.component';

import { MasterServService } from './service/master-serv.service';

import { HeaderComponent } from './header/header.component';
import { MainTabsComponent } from './mainTabs/mainTabs.component';
import { TrackTrailerComponent } from './track-trailer/track-trailer.component';
import { GmapsComponent } from './gmaps/gmaps.component';
import { YardMangPageComponent } from './yard-mang-page/yard-mang-page.component';
import { TableComponent } from './table/table.component';
import { PoolMangPageComponent } from './pool-mang-page/pool-mang-page.component';
import { AllocationPageComponent } from './allocation-page/allocation-page.component';
import { FooterComponent } from './footer/footer.component';
import { SearchfilterComponent } from './searchfilter/searchfilter.component';
import { GmapjsComponent } from './gmapjs/gmapjs.component';
//import { HttpInject } from './injectables/httpInject';
import { AlloTrGmap } from './allotrgmap/allotrgmap.component';
import { Gmtest } from './gmtest/gmtest.component';

import { FilterCPipe } from './Filters/filterC.pipe';
import { FilterArrayPipe } from './Filters/filterArray.pipe';
import { HistoryPageComponent } from './history-page/history-page.component';
import { MyDatePickerModule } from 'mydatepicker';
import { SingleselectComponent } from './singleselect/singleselect.component';
import { HomeMainComponent } from './home-main/home-main.component';
import { TrailerDashComponent } from './trailer-dash/trailer-dash.component';
import { OrderDashComponent } from './order-dash/order-dash.component';

import 'd3';
import 'nvd3';
import { YardDashComponent } from './yard-dash/yard-dash.component';
import { YardCheckComponent } from './yard-check/yard-check.component';
import { LoginComponent } from './login/login.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

@NgModule({
    imports: [BrowserModule, HttpModule, CommonModule, FormsModule,MyDatePickerModule, NgxPaginationModule,ChartsModule,NvD3Module,
        AlertModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAafsMtGWbhgmfXU1TV-K-VUh8y1d8jZjI'
        })],
    declarations: [AppComponent,
        HeaderComponent, MainTabsComponent,
        TrackTrailerComponent, GmapsComponent,
        YardMangPageComponent, TableComponent,
        AllocationPageComponent, PoolMangPageComponent,
        FooterComponent,
        FilterCPipe, FilterArrayPipe,
        SearchfilterComponent, GmapjsComponent, AlloTrGmap, Gmtest, HistoryPageComponent, SingleselectComponent
        , HomeMainComponent, TrailerDashComponent,
        OrderDashComponent, YardDashComponent, YardCheckComponent, LoginComponent, AdminPageComponent
    ],
    providers: [MasterServService],
    bootstrap: [AppComponent]
})
export class AppModule { }
