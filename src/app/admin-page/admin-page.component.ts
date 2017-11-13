import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  csrTemplate='http://localhost:4200/assets/upload-templates/CSR.xlsx';
  plannerTemplate='http://localhost:4200/assets/upload-templates/Planner.xlsx';
  poolTemplate='http://localhost:4200/assets/upload-templates/Pools.xlsx';
  hideFileBut=true;
  constructor() { }

  ngOnInit() {
  }

  download(config) {
    var link = document.createElement("a");
    link.download = "a";
    switch (config) {
      case 1:
        link.href = this.poolTemplate;
        break;
      case 2:
        link.href = this.csrTemplate;
        break;
      case 3:
        link.href = this.plannerTemplate;
        break;
      default:
        break;
    }
    // link.href = this.template;
    document.body.appendChild(link);
    link.click();

  }

  upload(config) {
    var fileinput;
    switch (config) {
      case 1:
        fileinput = document.getElementById("poolFileBut");
        break;
      case 2:
        fileinput = document.getElementById("csrFileBut");
        break;
      case 3:
        fileinput = document.getElementById("plannerFileBut");
        break;
      default:
        break;
    }

    fileinput.click();
  }

}
