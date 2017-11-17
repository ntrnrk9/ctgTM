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
  toShowTab = 1;
  loginConfig = { isValid: false, };
  headConfig = { isLoggedOut: false,event:"",isAdmin:false };
  adminConfig={event:"", showAdminPanel:false};
  toShowAdmin=false;

  userMenuSelect() {
    if (this.headConfig.event == "logout") {
      this.logout();

    } else if (this.headConfig.event == "adminSetting") {
      this.goToAdminPanel();
    }
  }

  adminEvent() {
    if (this.adminConfig.event == "closeAdmin") {
      this.goToHomePage();
    }
  }

  logout() {
    if (this.headConfig.isLoggedOut) {
      this.toShowTab = 1;
    }
  }

  goToAdminPanel() {
      this.toShowAdmin = true;
      this.headConfig.isAdmin=false;
  }
  
  goToHomePage() {
    this.toShowAdmin = false;
    this.headConfig.isAdmin=true;
  }

  login() {
    if (this.loginConfig.isValid) {
      this.toShowTab = 2;
    }
  }
  
}
