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
  loginConfig={isValid:false};
  login(){
    if(this.loginConfig.isValid){
      this.toShowTab=2;
    }
  }
}
