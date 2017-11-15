import { Component, OnInit, Input ,Output,EventEmitter} from '@angular/core';
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
  
  csrTemplate='http://localhost:4200/assets/upload-templates/CSR.csv';
  plannerTemplate='http://localhost:4200/assets/upload-templates/Planner.csv';
  poolTemplate='http://localhost:4200/assets/upload-templates/Pools.csv';
  
  csrFileToUpLoad:File;
  plannerFileToUpLoad:File;
  poolFileToUpLoad:File;
  
  csrFUendURL="/AdminService/api/UploadCSR";
  plannerFUendURL="/AdminService/api/UploadPlanner";
  poolFUendURL="/AdminService/api/UploadPool";
  
  poolFileName:string="";
  csrFileName:string="";
  plannerFileName:string="";
  
  hideFileBut=true;
  path="";
  action: any = { heading: "", body: "",details: ""};
  
  constructor(private http: Http,private masterServ:MasterServService) { }

  ngOnInit() {
  }
  
  emit(event: any) {
    this.config.event = event;
    this.configChange.emit(this.config);
    console.log(this.config);
  }

  goToHome(){
    this.config.isAdminSetting=false;
    this.emit("closeAdmin");
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
      default:
        break;
    }

    fileinput.click();

    // const headers = new Headers();
    // const options = new RequestOptions({ headers: headers });
    // const formData = new FormData();
    // formData.append("name", name);
    // customImages.forEach(customImage=>{
    //   formData.append("files", customImage.file);
    //   formData.append("CustomImageType", customImage.typeName);
    // });
    // this.http.post(environment.customImageFileUrl + '/create/', formData, options)
    //     .do(_ => { this.invalidateCache(); })
    //     .map(response => response['_body'])
    //     .catch(throwErrorMessageForResponse);

    
  }

  getFileToUpload(event, config) {
    let aPath=$('#poolFileBut').val();
    let fileList: FileList = event.target.files;
    console.log(this.path);
    if (fileList.length > 0) {
      let file: File = fileList[0];
      switch (config) {
        case 1:
          this.poolFileToUpLoad = file;
          this.poolFileName=file.name;
          break;
        case 2:
          this.csrFileToUpLoad = file;
          this.csrFileName=file.name;
          break;
        case 3:
          this.plannerFileToUpLoad = file;
          this.plannerFileName=file.name;
          break;

        default:
          break;
      }
    }
  }

  uploadFile(event) {
    let file: File;
    let endUrl:string;
    switch (event) {
      case 1:
        file = this.poolFileToUpLoad;
        endUrl=this.poolFUendURL;
        break;
      case 2:
        file = this.csrFileToUpLoad;
        endUrl=this.csrFUendURL;
        break;
      case 3:
        file = this.plannerFileToUpLoad;
        endUrl=this.plannerFUendURL;
        break;
      default:
        break;
    }
    
    if (file) {
      let url = config.baseUrl + endUrl;
      let updatedBy=this.masterServ.$sessionUser;
      const headers = new Headers();
      // headers.append('Content-Type', undefined );
      const options = new RequestOptions({ headers: headers });
      const formData = new FormData();
      formData.append("updatedBy", updatedBy);
      formData.append("file", file);

      this.http.post(url, formData, options).map(res => res.json())
        .subscribe(
        (data) => {
          console.log("success data recieved");
          if (data.status == 1) {
            this.action.heading = "File Upload";
            this.action.body = "File uploaded successfully";
            this.action.details = '';
            $('#result').modal('show');
          } else if (data.status == 2) {
            this.action.heading = "File Upload";
            this.action.body = "Error in processing file .";
            this.action.details = data.description;
            $('#result').modal('show');
          } else if (data.status == 0) {
            this.action.heading = "File Upload";
            this.action.body = "Error in uploading file.";
            this.action.details = data.description;
            $('#result').modal('show');
          } 
        }, //For Success Response
        (err) => {
          console.log("failed error recieved");
          this.action.heading = "File Upload";
          this.action.body = "Error in uploading file.";
          this.action.details = 'File upload service failed<br>' + url + '<br>Status: ' + err.status;
          $('#result').modal('show');
        } //For Error Response
        );
    }

  }

}
