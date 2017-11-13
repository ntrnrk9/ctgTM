import { Component,Input,Output,EventEmitter } from '@angular/core';
import { MasterServService } from '../service/master-serv.service';

declare var $: any;
@Component({
    selector: 'header',
    templateUrl: 'header.component.html',
    styleUrls: [ 'header.component.css'],
    moduleId: module.id
})
export class HeaderComponent {
    @Input() config;
    @Output() configChange = new EventEmitter<any>();

    private name = 'HeaderComponent';
    private user:String="";

    constructor(private masterServ:MasterServService) {
    }

    ngOnInit() {
        this.user=this.masterServ.$sessionUser;
        $('#user').popover({ 
            html : true,
            placement : "bottom",
            content: $('#dd').html()
         });
    }

    emit(event:any) {
        this.config.event=event; 
        this.configChange.emit(this.config);
        console.log(this.config);
    }

    logout(){
        this.config.isLoggedOut=true;
        this.emit("logout");
    }
    
    adminSettings(){
        this.config.isAdminSetting=true;
        this.emit("adminSetting");

    }

    home(){
        this.config.isAdminSetting=false;
        this.emit("home");

    }

}

// This code copy to app.module.ts
