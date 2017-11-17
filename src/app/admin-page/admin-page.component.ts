import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MasterServService } from '../service/master-serv.service';

declare var $: any;
import * as config from '../configs/configs';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  @Input() config;
  @Output() configChange = new EventEmitter<any>();

  @ViewChild('poolFileBut') poolFileBut: ElementRef;
  @ViewChild('csrFileBut') csrFileBut: ElementRef;
  @ViewChild('plannerFileBut') plannerFileBut: ElementRef;
  @ViewChild('tradeInFileBut') tradeInFileBut: ElementRef;

  csrTemplate = config.baseUrl + '/assets/upload-templates/CSR.csv';
  plannerTemplate = config.baseUrl + '/assets/upload-templates/Planner.csv';
  poolTemplate = config.baseUrl + '/assets/upload-templates/Pools.csv';
  tradeInTemplate = config.baseUrl + '/assets/upload-templates/Pools.csv';

  csrFileToUpLoad: File;
  plannerFileToUpLoad: File;
  poolFileToUpLoad: File;
  tradeInFileToUpLoad: File;

  csrFUendURL = "/AdminService/api/UploadCSR";
  plannerFUendURL = "/AdminService/api/UploadPlanner";
  poolFUendURL = "/AdminService/api/UploadPool";
  tradeInFUendURL = "/AdminService/api/UploadPool";

  poolFileName: string = "";
  csrFileName: string = "";
  plannerFileName: string = "";
  tradeInFileName: string = "";

  resetPoolFileSelection = true;
  path = "";
  action: any = { heading: "", body: "", details: "", processed: false };

  constructor(private http: Http, private masterServ: MasterServService) { }

  ngOnInit() {
  }

  emit(event: any) {
    this.config.event = event;
    this.configChange.emit(this.config);
    console.log(this.config);
  }

  goToHome() {
    this.config.showAdminPanel = false;
    this.emit("closeAdmin");
  }


  readFile(file: File) {
    // use the 1st file from the list

    var reader = new FileReader();
    let obj = this;
    let data;
    // Closure to capture the file information.
    reader.onload = function (ev) {
      obj.path = reader.result;
      var text = reader.result;
      console.log(reader.result.substring(0, 200));
    };


    // Read in the image file as a data URL.
    reader.readAsText(file);
    let raw = reader.result;
    console.log(data);

  }

  download(config) {
    var link = document.createElement("a");
    // link.download = "ab";
    switch (config) {
      case 1:
        link.href = this.poolTemplate;
        link.download = "Pool.csv";
        break;
      case 2:
        link.href = this.csrTemplate;
        link.download = "CSR.csv";
        break;
      case 3:
        link.href = this.plannerTemplate;
        link.download = "Planner.csv";
        break;
      case 4:
        link.href = this.tradeInTemplate;
        link.download = "tradeIn.csv";
        break;
      default:
        break;
    }
    // link.href = this.template;
    document.body.appendChild(link);
    link.click();

  }

  triggerUpload(config) {
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
      case 4:
        fileinput = document.getElementById("tradeInFileBut");
        break;
      default:
        break;
    }

    fileinput.click();

  }

  getFileToUpload(event, config) {
    let aPath = $('#poolFileBut').val();
    let fileList: FileList = event.target.files;
    console.log(this.path);
    if (fileList.length > 0) {
      let file: File = fileList[0];
      switch (config) {
        case 1:
          this.poolFileToUpLoad = file;
          this.poolFileName = file.name;
          break;
        case 2:
          this.csrFileToUpLoad = file;
          this.csrFileName = file.name;
          break;
        case 3:
          this.plannerFileToUpLoad = file;
          this.plannerFileName = file.name;
          break;
        case 4:
          this.tradeInFileToUpLoad = file;
          this.tradeInFileName = file.name;
          break;
        default:
          break;
      }
      this.readFile(file);
    }

  }

  uploadFile(event) {
    let file: File;
    let endUrl: string;
    switch (event) {
      case 1:
        file = this.poolFileToUpLoad;
        endUrl = this.poolFUendURL;
        break;
      case 2:
        file = this.csrFileToUpLoad;
        endUrl = this.csrFUendURL;
        break;
      case 3:
        file = this.plannerFileToUpLoad;
        endUrl = this.plannerFUendURL;
        break;
      case 4:
        file = this.tradeInFileToUpLoad;
        endUrl = this.tradeInFUendURL;
        break;
      default:
        break;
    }

    if (file) {
      // let isValid = this.validateFile(this.path, event);
      // if (isValid == 0) {
      //   this.action.heading = "File Upload";
      //   this.action.body = "Valid template. but no data available.";
      //   this.action.processed = true;
      //   this.action.details = '';
      //   $('#result').modal('show');
      // } else if (isValid == 1 ||isValid == 3) {
      //   this.action.heading = "File Upload";
      //   this.action.body = "Invalid Template.";
      //   this.action.processed = true;
      //   this.action.details = '';
      //   $('#result').modal('show');
      // } else if (isValid == 2)
      {
        let url = config.baseUrl + endUrl;
        let updatedBy = this.masterServ.$sessionUser;
        const headers = new Headers();
        // headers.append('Content-Type', undefined );
        const options = new RequestOptions({ headers: headers });
        const formData = new FormData();
        formData.append("updatedBy", updatedBy);
        formData.append("file", file);

        this.action.heading = "Uploading";
        this.action.body = "File uploaded successfully";
        this.action.details = '';
        this.action.processed = false;
        $('#result').modal('show');

        this.http.post(url, formData, options).map(res => res.json())
          .subscribe(
          (data) => {
            console.log("success data recieved");
            if (data.status == 1) {
              this.action.heading = "File Upload";
              this.action.body = "File uploaded successfully.";
              this.action.processed = true;
              this.action.details = '';
              $('#result').modal('show');
            } else {
              this.action.heading = "File Upload";
              this.action.body = "Error in processing file.";
              this.action.processed = true;
              this.action.details = data.description;
              $('#result').modal('show');
            }
            // else if (data.status == 0) {
            //   this.action.heading = "File Upload";
            //   this.action.body = "Error in uploading file.";
            //   this.action.processed = true;
            //   this.action.details = data.description;
            //   $('#result').modal('show');
            // }
          }, //For Success Response
          (err) => {
            console.log("failed error recieved");
            this.action.heading = "File Upload";
            this.action.body = "Error in uploading file.";
            this.action.processed = true;
            this.action.details = 'File upload service failed<br>' + url + '<br>Status: ' + err.status;
            $('#result').modal('show');
          } //For Error Response
          );
      }

      this.poolFileToUpLoad = undefined;
      this.poolFileBut.nativeElement.value = '';
      this.poolFileName = "";
      this.plannerFileToUpLoad = undefined;
      this.plannerFileBut.nativeElement.value = ''
      this.plannerFileName = "";
      this.csrFileToUpLoad = undefined;
      this.csrFileBut.nativeElement.value = ''
      this.csrFileName = "";
      this.tradeInFileToUpLoad = undefined;
      this.tradeInFileBut.nativeElement.value = ''
      this.tradeInFileName = "";
      

    } else {
      this.action.heading = "File Upload";
      this.action.body = "Choose a file to upload.";
      this.action.processed = true;
      this.action.details = '';
      $('#result').modal('show');
    }

  }

  validateFile(data: string, config) {
    var lines = data.split("\n");
    console.log(lines.length);

    // check for empty files
    if (lines.length == 0) {
      console.log("Empty File");
    }
    // check for template
    else {
      // check for valid format
      console.log("has no data");
      let isValid;
      switch (config) {
        case 1:
          isValid = this.validatePoolFile(lines[0]);
          break;
        case 2:
          isValid = this.validateCSRFile(lines[0]);
          break;
        case 3:
          isValid = this.validatePlannerFile(lines[0]);
          break;
        default:
          break;
      }

      if (isValid == 1 && lines.length == 1) {
        console.log("Valid template. but no data to available");
        return 0;
      } else if (isValid == 0 && lines.length == 1) {
        console.log("Invalid Template");
        return 1;
      } else if (isValid == 1 && lines.length > 1) {
        console.log("Valid CSR File");
        return 2;
      } else if (isValid == 0 && lines.length > 1) {
        console.log("Invalid Template");
        return 3;
      }
    }
  }


  validateCSRFile(data: string) {
    let columns = data.split(",");
    if (columns.length == 2) {
      var a = columns[0].toLowerCase();
      var b = columns[1].toLowerCase();
      console.log(columns[0].toLowerCase());
      console.log(columns[1].toLowerCase());
      console.log(typeof columns[1]);
      console.log(a === 'csrcode');
      console.log(b === 'csr');
      let isval = false;
      let index = 0;
      columns.forEach((element, index) => {
        if (index == 0 && element.toLowerCase() == 'csrcode') {
          console.log(index + " " + true);
        } else if (index == 1 && element.toLowerCase() == 'csr') {
          console.log(index + " " + true);
        }
      });
      if ((columns[0].toLowerCase() == 'csrcode') && (columns[1].toLowerCase() == 'csr')) {
        console.log("Valid CSR File");
        return 1;

      } else {
        console.log("Invalid CSR File");
        return 0;
      }

    } else {
      console.log("Invalid CSR File");
      return 0;
    }

  }

  validatePoolFile(data: string) {
    // CmpID,Brand,Planner,Csr,ReqPoolCount,AvaiPoolCount,TrailerType,IsShipper,IsReceiver
    let columns = data.split(",");
    if (columns.length == 9) {
      if (columns[0].toLowerCase() == 'cmpid' && columns[1].toLowerCase() == 'brand' && columns[2].toLowerCase() == 'planner'
        || columns[3].toLowerCase() == 'csr' && columns[4].toLowerCase() == 'reqpoolcount'
        || columns[5].toLowerCase() == 'avaipoolcount' && columns[6].toLowerCase() == 'trailertype'
        || columns[7].toLowerCase() == 'isshipper' && columns[8].toLowerCase() == 'isreceiver') {
        console.log("Valid Planner File");
        return 1;

      } else {
        console.log("Invalid Planner File");
        return 0;
      }

    } else {
      console.log("Invalid Planner File");
      return 0;
    }
  }

  validatePlannerFile(data: string) {
    // PlannerCode,Planner,RegionID,SubRegionID
    let columns = data.split(",");
    if (columns.length == 4) {
      if (columns[0].toLowerCase() == 'plannercode' && columns[1].toLowerCase() == 'planner'
        || columns[2].toLowerCase() == 'regionid' && columns[3].toLowerCase() == 'subregionid') {
        console.log("Valid Planner File");
        return 1;

      } else {
        console.log("Invalid Planner File");
        return 0;
      }

    } else {
      console.log("Invalid Planner File");
      return 0;
    }
  }

}
