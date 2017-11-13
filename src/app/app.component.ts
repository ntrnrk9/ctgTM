import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  toShowTab = 2;
  loginConfig = { isValid: false, };
  headConfig = { isLoggedOut: false,event:"",isAdminSetting:false };
  toShowAdmin=true;

  userMenuSelect() {
    if (this.headConfig.event == "logout") {
      this.logout();

    } else if (this.headConfig.event == "adminSetting") {
      this.adminSettings();
    }else if (this.headConfig.event == "home") {
      this.homePage();
    }
  }

  logout() {
    if (this.headConfig.isLoggedOut) {
      this.toShowTab = 1;
    }
  }

  adminSettings() {
    if (this.headConfig.isAdminSetting) {
      this.toShowAdmin = true;
    }
  }
  
  homePage() {
    if (!this.headConfig.isAdminSetting) {
      this.toShowAdmin = false;
    }
  }

  login() {
    if (this.loginConfig.isValid) {
      this.toShowTab = 2;
    }
  }
  
}
