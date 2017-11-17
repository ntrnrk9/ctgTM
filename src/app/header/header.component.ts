import { Component,Input,Output,EventEmitter } from '@angular/core';
import { MasterServService } from '../service/master-serv.service';

declare var $: any;
import * as propConfig from '../configs/configs';
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
        this.toShowAdminScreen();
        this.user=this.masterServ.$sessionUser;
        // $('#user').popover({ 
        //     html : true,
        //     placement : "bottom",
        //     content: $('#dd').html()
        //  });
    }

    emit(event:any) {
        this.config.event=event; 
        this.configChange.emit(this.config);
        console.log(this.config);
    }

    toShowAdminScreen(){
        let user=this.masterServ.$sessionUserID;

        propConfig.adminList.forEach(element => {
            if(user.toUpperCase()==element.id.toUpperCase()){
                this.config.isAdmin=true;
            }
        });

        
    }

    logout(){
        this.config.isLoggedOut=true;
        this.emit("logout");
    }
    
    adminSettings(){
        this.config.isAdmin=true;
        this.emit("adminSetting");

    }

    home(){
        this.config.isAdmin=false;
        this.emit("home");

    }

}

// This code copy to app.module.ts
