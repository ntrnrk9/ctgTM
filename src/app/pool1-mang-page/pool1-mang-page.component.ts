import { Component } from '@angular/core';
import { FilterCPipe } from '../Filters/filterC.pipe';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as config from '../configs/configs';
declare var $: any;
@Component({
    selector: 'pool1-mang-page',
    templateUrl: 'pool1-mang-page.component.html',
    styleUrls: ['pool1-mang-page.component.css'],
    moduleId: module.id,
    //pipes: [FilterCPipe]
})
export class Pool1MangPageComponent {
    test=1;
    reqPoolQat: String;
    rowLimit: any = 10;
    pageNumber: any = 0;
    lLimit: any = this.pageNumber * 4;
    uLimit: any = (this.pageNumber + 1) * 4;
    stateSFlabel: any = "Select a state";
    citySFlabel: any = "Select a city";
    ccSFlabel: any = 'Company';
    selectedCmpLbl: any = "Select a company";
    plannerSFlabel: any = 'Planner';
    csrSFlabel: any = 'CSR';
    selectedCompany: any = "Select a company";
    selectedState: any = "Select a state";
    selectedCity: any = "Select a city";
    updateReqPool: any;
    selectedCsr: string = "Select a CSR";
    selectedPlanner: any = "Select a planner";
    toAddBrand: String = "";
    allCsrResp=false;
    asc = true;
    ttAsc=true;
    fieldvalidation = false;
    poolForAddRecieved=false;
    isValidFields: any = {};
    poolRecieved = false;
    allCcRecev=false;
    action: any = { heading: "", body: "" };
    //[name: string]: any;

    private name = 'Pool1Mang-pageComponent';
    cityFil: String = "";
    stateFil: String = "";
    accFil: String = "";
    ccFil: String = "";
    plannerFil: String = "";
    csrFil: String = "";
    selectedVarience: any = { lable: "Pools having variance", value: 1 };
    varianceList: any = [{ lable: "Pools having variance", value: 1 }, { lable: "Pools having no variance", value: 0 }, { lable: "All pools", value: -1 }]
    selectedSR: any = { lable: "Shipper", value: 0 };
    sRList: any = [{ lable: "Shipper", value: 0 }, { lable: "Receiver", value: 1 }]
    selectedBrand: any = { lable: "Covenant", value: "CVEN" };
    brandList: any = [{ lable: "Covenant", value: "CVEN" }, { lable: "SRT", value: "SRT" }, { lable: "Both", value: "ALL" }];
    brandListForAdd: any = [{ lable: "Covenant", value: "CVEN" }, { lable: "SRT", value: "SRT" }]
    data: any[] = [];
    result: any[] = [];
    pageNum: Number = 1;
    csrEditIndex=-1;
    plannerEditIndex=-1;

    countryList: any = [];
    cityList: any = [];
    ccList: any = [];
    allCities1: any = [];
    allStates1: any = [];
    allCC1: any = [];
    allPlanners1: any = [];
    allCsr1: any = [];
    allPlannersResp=false;
    allPools: any = [];
    allCCForAdd: any = [];
    plannerCrud={plannerId: -1, planner: "", plannerCode: ""};
    csrCrud={csrId: -1, csrCode: "", csr: ""};

    allCC = JSON.parse(JSON.stringify(this.allCC1));
    allStates = JSON.parse(JSON.stringify(this.allStates1));
    allCities = JSON.parse(JSON.stringify(this.allCities1));
    allPlanners = JSON.parse(JSON.stringify(this.allPlanners1));
    allCsr = JSON.parse(JSON.stringify(this.allCsr1));

    csrTable = {
        column: [{ name: "CSR code", width: "33%" }, { name: "CSR name", width: "33%" },{ name: "Action", width: "34%" }],
        groups: []
    };
    plannerTable = {
        column: [{ name: "Planner code", width: "33%" }, { name: "Planner name", width: "33%" },{ name: "Action", width: "34%" }],
        groups: []
    };

    stateCheckAll: any = false;
    cityCheckAll: any = false;
    ccCheckAll: any = false;
    showManageBox=false;
    poolToEdit: any = {
        state: "",
        city: "",
        csr: "",
        planner: "",
        company: "",
        reqPool: "",
        curr: "",
        variance: 0,
        twm: "",
        totReq: "",
        toShow: true,
        pool: ""
    };
    poolToAdd: any = {
        active: "",
        avaiPoolCount: 0,
        brand: "CVEN",
        cityName: "",
        cmpID: "",
        companyName: "",
        csr: "",
        isReceiver: "",
        isShipper: "",
        pID: 0,
        planner: "",
        poolID: "",
        reqPoolCount: 0,
        stateCode: "",
        stateName: "",
        variance: 0
    };
    poolToDel: any;

    restoreEdit: any;
    choosenState: any = [];
    choosenCity: any = [];
    choosenCC: any = [];
    choosenPlanner: any = [];
    choosenCsr: any = [];

    managecsrPlanner() {
        this.showManageBox = true;
    }
    backToPool(){
        this.showManageBox = false;
    }

    private sort(prop) {
        this.asc = !this.asc;
        //this.data = this.data.reverse();
        this.sortResults(prop,this.asc);
    }

    private sortByTT(prop) {
        this.ttAsc = !this.ttAsc;
        this.sortResults(prop,this.ttAsc);
    }

    sortResults(prop, asc) {
        this.data = this.data.sort((a: any, b: any) => {
            if (asc) {
                if (a[prop] < b[prop]) {
                    return -1;
                } else if (a[prop] > b[prop]) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (a[prop] > b[prop]) {
                    return -1;
                } else if (a[prop] < b[prop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
        console.log(JSON.stringify(this.data));
}

    private ccCheckAllFun() {
        this.ccCheckAll = true;
        this.choosenCC = [];
        for (var i = 0; i < this.allCC.length; i++) {
            this.choosenCC.push(this.allCC[i].cmpName);
            this.allCC[i].isSelected = true;
        }
    }

    private ccClearAllFun() {
        this.ccCheckAll = false;
        this.choosenCC = [];
        for (var i = 0; i < this.allCC.length; i++) {
            this.allCC[i].isSelected = false;
        }
    }

    private plannerCheckAllFun() {
        //this.ccCheckAll = true;
        this.choosenPlanner = [];
        for (var i = 0; i < this.allPlanners.length; i++) {
            this.choosenPlanner.push(this.allPlanners[i].planner);
            this.allPlanners[i].isSelected = true;
        }
    }

    private plannerClearAllFun() {
        //this.ccCheckAll = false;
        this.choosenPlanner = [];
        for (var i = 0; i < this.allPlanners.length; i++) {
            this.allPlanners[i].isSelected = false;
        }
    }

    private csrCheckAllFun() {
        //this.ccCheckAll = true;
        this.choosenCsr = [];
        for (var i = 0; i < this.allCsr.length; i++) {
            this.choosenCsr.push(this.allCsr[i].csr);
            this.allCsr[i].isSelected = true;
        }
    }

    private csrClearAllFun() {
        //this.ccCheckAll = false;
        this.choosenCsr = [];
        for (var i = 0; i < this.allCsr.length; i++) {
            this.allCsr[i].isSelected = false;
        }
    }

    private cityCheckAllFun() {
        this.cityCheckAll = true;
        this.choosenCity = [];
        for (var i = 0; i < this.allCities.length; i++) {
            this.choosenCity.push(this.allCities[i].cityName);
            this.allCities[i].isSelected = true;
        }
    }

    private cityClearAllFun() {
        this.cityCheckAll = false;
        this.choosenCity = [];
        for (var i = 0; i < this.allCities.length; i++) {
            this.allCities[i].isSelected = false;
        }
    }

    private stateCheckAllFun() {
        this.stateCheckAll = true;
        this.choosenState = [];
        for (var i = 0; i < this.allStates.length; i++) {
            this.choosenState.push(this.allStates[i].stateCode);
            this.allStates[i].isSelected = true;
        }
    }

    private stateClearAllFun() {
        this.stateCheckAll = false;
        this.choosenState = [];
        for (var i = 0; i < this.allStates.length; i++) {
            this.allStates[i].isSelected = false;
        }
    }

    private stateCheckEvent(item: any, value: any) {
        console.log(item);
        var index = this.inArray(this.choosenState, value);
        if (item) {
            console.log("selected");
            if (index != -1) { } else {
                this.choosenState.push(value);
            }
        } else {
            console.log("unselected");
            this.choosenState.splice(index, 1);
        }
        console.log(this.choosenState);
    }

    private cityCheckEvent(item: any, value: any) {
        console.log(item);
        var index = this.inArray(this.choosenCity, value);
        if (item) {
            console.log("selected");
            if (index != -1) { } else {
                this.choosenCity.push(value);
            }
        } else {
            console.log("unselected");
            this.choosenCity.splice(index, 1);
        }
        console.log(this.choosenCity);
    }

    private ccCheckEvent(item: any, value: any) {
        console.log(item);
        var index = this.inArray(this.choosenCC, value);
        if (item) {
            console.log("selected");
            if (index != -1) { } else {
                this.choosenCC.push(value);
            }
        } else {
            console.log("unselected");
            this.choosenCC.splice(index, 1);
        }
        console.log(this.choosenCC);
        console.log(this.allCC);
    }

    private plannerCheckEvent(item: any, value: any) {
        console.log(item);
        var index = this.inArray(this.choosenPlanner, value);
        if (item) {
            console.log("selected");
            if (index != -1) { } else {
                this.choosenPlanner.push(value);
            }
        } else {
            console.log("unselected");
            this.choosenPlanner.splice(index, 1);
        }
        console.log(this.choosenPlanner);
        console.log(this.allPlanners);
    }

    private csrCheckEvent(item: any, value: any) {
        console.log(item);
        var index = this.inArray(this.choosenCsr, value);
        if (item) {
            console.log("selected");
            if (index != -1) { } else {
                this.choosenCsr.push(value);
            }
        } else {
            console.log("unselected");
            this.choosenCsr.splice(index, 1);
        }
        console.log(this.choosenCsr);
        console.log(this.allCsr);
    }

    private masterFilter() {
        var temp = JSON.parse(JSON.stringify(this.result));
        temp = this.filterByState(temp);
        //temp = this.filterByCity(temp);
        temp = this.filterByCC(temp);
        temp = this.filterByPlanner(temp);
        temp = this.filterByCsr(temp);
        temp = this.filterBySR(temp);
        temp = this.filterByBrand(temp);

        this.data = JSON.parse(JSON.stringify(temp));
        this.resetPage();
    }

    private filterBySR(result: any) {
        var temp = JSON.parse(JSON.stringify(result));

        for (var i = 0; i < temp.length; i++) {
            var obj = temp[i];
            if ((this.selectedSR.value == 0)) {
                if (temp[i].isShipper == "Y") {

                } else {
                    temp.splice(i, 1); i--;
                }

            } else if ((this.selectedSR.value == 1)) {
                if ((temp[i].isReceiver == "Y")) {

                } else {
                    temp.splice(i, 1); i--;
                }

            } else if ((this.selectedSR.value == 2)) {
                if ((temp[i].isReceiver == "Y") && (temp[i].isShipper == "Y")) {

                } else {
                    temp.splice(i, 1); i--;
                }
            }
        }

        return temp;
    }

    private filterByBrand(result: any) {
        var temp = JSON.parse(JSON.stringify(result));

        for (var i = 0; i < temp.length; i++) {
            var obj = temp[i];
            if ((this.selectedBrand.value == "CVEN")) {
                if (temp[i].brand == "CVEN") {

                } else {
                    temp.splice(i, 1); i--;
                }

            } else if ((this.selectedBrand.value == "SRT")) {
                if ((temp[i].brand == "SRT")) {

                } else {
                    temp.splice(i, 1); i--;
                }

            } else if ((this.selectedBrand.value == "ALL")) {
                if ((temp[i].brand == "CVEN") || (temp[i].brand == "SRT")) {

                } else {
                    temp.splice(i, 1); i--;
                }
            }
        }

        return temp;
    }

    private filterByState(result: any) {
        var temp = JSON.parse(JSON.stringify(result));
        this.allStates1 = JSON.parse(JSON.stringify(this.allStates));
        if (this.choosenState.length == 0) {
            this.stateSFlabel = "Select a state";
            return result;
        } else {
            this.stateSFlabel = this.choosenState.length + " state(s) selected";
            for (var i = 0; i < temp.length; i++) {
                if (this.inArray(this.choosenState, temp[i].stateCode) != -1) {

                } else {
                    temp.splice(i, 1); i--;
                }
            }
            //this.data = JSON.parse(JSON.stringify(temp));
            //this.resetPage();
        }

        return temp;

    }

    private filterByCity(result: any) {
        console.log("filter by city");
        var temp = JSON.parse(JSON.stringify(result));
        this.allCities1 = JSON.parse(JSON.stringify(this.allCities));
        if (this.choosenCity.length == 0) {
            this.citySFlabel = "Select a city";
            return result;
        } else {
            this.citySFlabel = this.choosenCity.length + " city(s) selected";
            for (var i = 0; i < temp.length; i++) {
                if (this.inArray(this.choosenCity, temp[i].cityName) != -1) {

                } else {
                    temp.splice(i, 1); i--;
                }
            }
        }

        return temp;
        //this.data = JSON.parse(JSON.stringify(temp));
        //this.resetPage();
    }

    private filterByCC(result: any) {
        var temp = JSON.parse(JSON.stringify(result));
        this.allCC1 = JSON.parse(JSON.stringify(this.allCC));
        if (this.choosenCC.length == 0) {
            this.ccSFlabel = 'Customer';
            return result;
        } else {
            this.ccSFlabel = this.choosenCC.length + " customer(s) selected";
            for (var i = 0; i < temp.length; i++) {
                if (this.inArray(this.choosenCC, temp[i].companyName) != -1) {

                } else {
                    temp.splice(i, 1); i--;
                }
            }
        }

        //this.data = JSON.parse(JSON.stringify(temp));
        //this.resetPage();

        return temp
    }

    private filterByPlanner(result: any) {
        var temp = JSON.parse(JSON.stringify(result));
        this.allPlanners1 = JSON.parse(JSON.stringify(this.allPlanners));
        if (this.choosenPlanner.length == 0) {
            this.plannerSFlabel = 'Select a planner';
            return result;
        } else {
            this.plannerSFlabel = this.choosenPlanner.length + " planner(s) selected";
            for (var i = 0; i < temp.length; i++) {
                if (this.inArray(this.choosenPlanner, temp[i].planner) != -1) {

                } else {
                    temp.splice(i, 1); i--;
                }
            }
        }

        //this.data = JSON.parse(JSON.stringify(temp));
        //this.resetPage();

        return temp
    }

    private filterByCsr(result: any) {
        var temp = JSON.parse(JSON.stringify(result));
        this.allCsr1 = JSON.parse(JSON.stringify(this.allCsr));
        if (this.choosenCsr.length == 0) {
            this.csrSFlabel = 'Select a CSR';
            return result;
        } else {
            this.csrSFlabel = this.choosenCsr.length + " CSR(s) selected";
            for (var i = 0; i < temp.length; i++) {
                if (this.inArray(this.choosenCsr, temp[i].csr) != -1) {

                } else {
                    temp.splice(i, 1); i--;
                }
            }
        }

        //this.data = JSON.parse(JSON.stringify(temp));
        //this.resetPage();

        return temp
    }

    private inArray(items: any, value: any) {
        if (items == undefined || items.length == 0) {
            return -1;
        } else {
            for (var i = 0; i < items.length; i++) {
                if (items[i] === value)
                    return i;
            }
        }
        return -1;
    }

    selectSR(value: any) {
        this.selectedSR = value;
        this.masterFilter();

    }

    selectBrand(value: any) {
        this.selectedBrand = value;
        this.masterFilter();

    }

    selectVarience(value: Number) {
        this.result = [];
        console.log(this.selectedVarience);
        console.log(this.cityFil + " " + this.stateFil);
        this.selectedVarience = value;

        // ... do other stuff here ...
        for (var j of this.ob.groups) {
            if (this.selectedVarience.value == 0) {
                if (j.variance == 0) {
                    //j.toShow = true;
                    this.result.push(j);

                } else {
                    //j.toShow = false;
                }
            } else if (this.selectedVarience.value == 1) {
                if (j.variance > 0 || j.variance < 0) {
                    //j.toShow = true;
                    this.result.push(j);
                } else {
                    //j.toShow = false;
                }
            } else if (this.selectedVarience.value == -1) {
                //j.toShow = true;
                this.result.push(j);
            }
        }
        //this.data = [];
        this.data = JSON.parse(JSON.stringify(this.result));
        this.masterFilter();
        //this.data = JSON.parse(JSON.stringify(this.ob.groups));
        this.resetPage();
    }

    private resetPage() {
        //this.rowLimit = 4;
        this.pageNumber = 0;
        this.lLimit = this.pageNumber * this.rowLimit;
        this.uLimit = (this.pageNumber + 1) * this.rowLimit;
        if (this.data.length < this.uLimit) {
            this.uLimit = this.data.length;
        }
    }

    groups: [{
        stateCode: "AL",
        cityName: "Birmingham",
        csr: "Mike",
        planner: "Mike",
        companyName: "Valspar",
        reqPoolCount: 1,
        avaiPoolCount: 1,
        variance: 0,
        cmpID: "VALBIRG02",

        toShow: true,
        poolID: "WALBEN34"

    }, {
            stateCode: "AL",
            cityName: "Birmingham",
            csr: "Kevin",
            planner: "DANNY",
            companyName: "Averitt",
            reqPoolCount: 2,
            avaiPoolCount: 1,
            variance: -1,
            cmpID: "AVEBIR",

            toShow: true,
            poolID: "BROTYLI07"
        }, {

            stateCode: "AL",
            cityName: "Cullman",
            csr: "Sarah",
            planner: "DANNY",
            companyName: "Serta",
            reqPoolCount: 4,
            avaiPoolCount: 1,
            variance: 3,
            cmpID: "SERCUL02",

            toShow: true,
            poolID: "TOOCH98"
        }, {

            stateCode: "AL",
            cityName: "Gentry",
            csr: "David",
            planner: "Molly",
            companyName: "Walmart 6008",
            reqPoolCount: 6,
            avaiPoolCount: 2,
            variance: 4,
            cmpID: "MCK",


            poolID: "MARMAN06"
        }, {

            stateCode: "AR",
            cityName: "North Little Rock",
            csr: "Mike",
            planner: "Mike",
            companyName: "Valspar",
            reqPoolCount: 10,
            avaiPoolCount: 5,
            variance: 5,
            cmpID: "VALBIRG02",

            toShow: true,
            poolID: "FREGRA06"
        }, {

            stateCode: "AZ",
            cityName: "Phoenix",
            csr: "Mike",
            planner: "Mike",
            companyName: "Valspar",
            reqPoolCount: 13,
            avaiPoolCount: 1,
            variance: 12,
            cmpID: "VALBIRG02",

            toShow: true,
            poolID: "FORFORG6"
        }, {

            stateCode: "AL",
            cityName: "Birmingham",
            csr: "Mike",
            planner: "Mike",
            companyName: "Valspar",
            reqPoolCount: 11,
            avaiPoolCount: 2,
            variance: 9,
            cmpID: "VALBIRG02",

            toShow: true,
            poolID: "WALBEN34"
        }];

    ob = {
        column: [{ name: "Location", width: "8%" }, { name: "Trailer type", width: "11%" }, { name: "TMW", width: "5%" }, { name: "Customer", width: "20%" }, { name: "CSR", width: "10%" },
        { name: "Planner", width: "10%" }, { name: "Req Pool", width: "8%" }, { name: "Current", width: "8%" }, { name: "Variance", width: "8%" }, { name: "Action", width: "12%" }],
        groups: [{ "pID": 41, "poolID": "AMAJOL", "cmpID": "AMAJOL", "planner": "COOPER", "csr": "Jacob", "reqPoolCount": 16, "avaiPoolCount": 4, "variance": 12, "stateCode": "IL", "stateName": "Illinois", "companyName": "AMAZON - MDW2", "cityName": "Joliet", "isShipper": "Y", "active": "Y", "isReceiver": "N", "brand": "CVEN" }, { "pID": 42, "poolID": "AMAKEN02", "cmpID": "AMAKEN02", "planner": "WILL", "csr": "Ryan", "reqPoolCount": 15, "avaiPoolCount": 6, "variance": 9, "stateCode": "WI", "stateName": "Wisconsin", "companyName": "AMAZON - MKE1", "cityName": "Kenosha", "isShipper": "Y", "active": "Y", "isReceiver": "Y", "brand": "CVEN" }]
    };



    private getAllCities() {
        //alert("hi");
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let options = new RequestOptions({ headers: headers });
        let obj = { 'stateCode': "AR" };
        let url1 = "/CommonService/api/GetCityByState?stateCode='AR'";
        let url = config.baseUrl+"/CommonService/api/GetAllCities";
        this.http.get(url1).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllCities data recieved "); this.allCities = data; }, //For Success Response
            (err) => { console.log("getAllCities error recieved "); } //For Error Response
            );
        this.insertSelected(this.allCities);
        this.insertSelected(this.allCities1);
    }

    private getAllStates() {
        //alert("hi");
        var url=config.baseUrl+"/CommonService/api/State";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllStates data recieved"); this.allStates1 = data; this.allStates = JSON.parse(JSON.stringify(this.allStates1)); }, //For Success Response
            (err) => { console.log("getAllStates error recieved"); } //For Error Response
            );
        this.insertSelected(this.allStates);
        this.insertSelected(this.allStates1);
    }

    private getAllCompany() {
        //alert("hi");
        this.allCcRecev=false;
        let url = config.baseUrl+"/CommonService/api/CompanyForFilter"
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllCompany data recieved"); this.allCC1 = data; this.allCC = JSON.parse(JSON.stringify(this.allCC1));this.allCcRecev=true; }, //For Success Response
            (err) => { console.log("getAllCompany error recieved"); this.allCcRecev=true;} //For Error Response
            );
        this.insertSelected(this.allCC);
        this.insertSelected(this.allCC1);
    }

    private getAllCsr() {
        //alert("hi");
        this.allCsrResp=false;
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let options = new RequestOptions({ headers: headers });
        let obj = { 'csr': 0, 'csrCode': 0 };
        let url = config.baseUrl+"/CommonService/api/Csr?csr=0&csrCode=0";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllCsr data recieved"); this.allCsr1 = data; this.allCsr = JSON.parse(JSON.stringify(this.allCsr1));this.allCsrResp=true; }, //For Success Response
            (err) => { console.log("getAllCsr error recieved"); this.allCsrResp=true;} //For Error Response
            );
    }

    private getAllPlanner() {
        //alert("hi");
        this.allPlannersResp=false;
        let url = config.baseUrl+"/CommonService/api/Planner?planner=0&plannerCode=0";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("getAllPlanner data recieved"); this.allPlannersResp=true;this.allPlanners1 = data; this.allPlanners = JSON.parse(JSON.stringify(this.allPlanners1));
            }, //For Success Response
            (err) => { console.log("getAllPlanner error recieved");this.allPlannersResp=true; } //For Error Response
            );
        this.insertSelected(this.allPlanners);
        this.insertSelected(this.allPlanners1);
    }

    private getAllPool() {
        //alert("hi");
        this.poolRecieved = false;
        let url = config.baseUrl+"/PoolMGMTService/api/AllPools";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllPlools data recieved"); this.allPools = data; this.ob.groups = data; this.selectVarience(this.selectedVarience); this.masterFilter(); this.poolRecieved = true; }, //For Success Response
            (err) => { console.log("getAllPlools error recieved"); } //For Error Response
            );
    }

    private getAllCompanyForAddPool() {
        //alert("hi");
        
        if (this.accFil.length == 3) {
            this.poolForAddRecieved=false;
            //$('#cmpForAddPoolDD').find('[data-toggle=dropdown]').dropdown('toggle');
            $('#cmpForAddPoolDD').addClass('open');
            console.log($('#accFil').val());
            $("#accFil").focus();

            let url = config.baseUrl+"/CommonService/api/CompanyForAddPool?companyName=" + this.accFil;
            this.http.get(url).map(res => res.json())
                .subscribe(
                (data) => { console.log("getAllCompanyForAddPool data recieved"); this.allCCForAdd = data;this.poolForAddRecieved=true; }, //For Success Response
                (err) => { console.log("getAllCompanyForAddPool error recieved"); } //For Error Response
                );
        }
    }

    private resetccFil() {
        this.accFil = "";
        this.selectedCmpLbl = "";
    }

    private restoreccList() {
        this.ccFil = "";
        for (var i = 0; i < this.allCC1.length; i++)
            this.allCC[i].isSelected = this.allCC1[i].isSelected;
    }

    private restoreStateList() {
        this.stateFil = "";
        for (var i = 0; i < this.allStates1.length; i++)
            this.allStates[i].isSelected = this.allStates1[i].isSelected;
    }

    private restoreCityList() {
        this.cityFil = "";
        for (var i = 0; i < this.allCities1.length; i++)
            this.allCities[i].isSelected = this.allCities1[i].isSelected;
    }

    private restorePlannerList() {
        this.plannerFil = "";
        for (var i = 0; i < this.allPlanners1.length; i++)
            this.allPlanners[i]['isSelected'] = this.allPlanners1[i]['isSelected'];
    }

    private restoreCsrList() {
        this.csrFil = "";
        for (var i = 0; i < this.allCsr1.length; i++)
            this.allCsr[i]['isSelected'] = this.allCsr1[i]['isSelected'];
    }

    private insertSelected(items: any) {
        for (var i = 0; i < items.length; i++) {
            //items[i]["isSelected"]=false;
        }
        //console.log(JSON.stringify(items));
    }

    constructor(private http: Http) {
        //this.ob['groups'] = [];
        this.selectVarience(this.selectedVarience);
        //this.getAllCities();
        this.getAllStates();
        this.getAllCompany();
        this.getAllCsr();
        this.getAllPlanner();
        this.getAllPool();
        this.getAllCompanyForAddPool();
    }

    private toEditPlanner(item,index){
        this.isValidFields['isValidPlannerCode']=true;
        this.isValidFields['isValidPlannerName']=true;
        this.plannerCrud.planner=item.planner;
        this.plannerCrud.plannerCode=item.plannerCode;
        this.plannerCrud.plannerId=item.plannerId;
        this.plannerEditIndex=index;
        $('#editPlannerModal').modal('show');
    }

    private toEditCSR(item,index){
        this.isValidFields['isValidCSRCode']=true;
        this.isValidFields['isValidCSRName']=true;
        this.csrCrud.csr=item.csr;
        this.csrCrud.csrCode=item.csrCode;
        this.csrCrud.csrId=item.csrId;
        this.csrEditIndex=index;
        $('#editCSRModal').modal('show');
    }

    private toEdit(index: any) {
        console.log(index);
        //this.poolToEdit = this.data[index];
        this.restoreEdit = index;
        this.poolToEdit = JSON.parse(JSON.stringify(this.restoreEdit));
        this.poolToEdit['isShip'] = true;
        this.poolToEdit['isReciev'] = true;
        this.poolToEdit['isReef'] = false;
        this.poolToEdit['isDryvan'] = false;

        if (this.poolToEdit.isReceiver == "Y") {
            this.poolToEdit.isReciev = true;
        } else {
            this.poolToEdit.isReciev = false;
        }
        if (this.poolToEdit.isShipper == "Y") {
            this.poolToEdit.isShip = true;
        } else {
            this.poolToEdit.isShip = false;
        }

        if (this.poolToEdit.trailerType == 2) {
            this.poolToEdit.isReef = true;
        } else if(this.poolToEdit.trailerType == 1){
            this.poolToEdit.isDryvan =true ;
        } else if(this.poolToEdit.trailerType == 3){
            this.poolToEdit.isDryvan =true ;
            this.poolToEdit.isReef = true;
        }
        this.selectedPlanner = this.poolToEdit.planner;
        this.selectedCsr = this.poolToEdit.csr;
        this.updateReqPool = this.poolToEdit.reqPoolCount;
        this.fieldvalidation = true;
        this.isValidFields.isValidReqPool = false;
        this.isValidFields.isValidSR = false;
        this.isValidFields.isValidTT = false;
    }

    private updatePool() {
        this.fieldvalidation = true;
        this.isValidFields.isValidReqPool = false;
        this.isValidFields.isValidSR = false;
        this.isValidFields.isValidTT = false;
        
        if ((this.poolToEdit.isDryvan || this.poolToEdit.isReef)) {
            this.isValidFields.isValidTT = false;
        }else{
            this.fieldvalidation = false;
            this.isValidFields.isValidTT = true;
        }

        if ((this.poolToEdit.isShip || this.poolToEdit.isReciev)) {
            this.isValidFields.isValidSR = false;
        }else{
            this.fieldvalidation = false;
            this.isValidFields.isValidSR = true;
        }


        if (!isNaN(Number(this.updateReqPool)) && (Number(this.updateReqPool) > 0)) {
            this.isValidFields.isValidReqPool = false;
        }else{
            this.fieldvalidation = false;
            this.isValidFields.isValidReqPool = true;
        }

        if (this.fieldvalidation) {
            this.poolToEdit.csr = this.selectedCsr;
            this.poolToEdit.planner = this.selectedPlanner;
            this.poolToEdit.reqPoolCount = this.updateReqPool;
            this.poolToEdit.variance = this.poolToEdit.reqPoolCount - this.poolToEdit.avaiPoolCount;

            if (this.poolToEdit.isReciev) {
                this.poolToEdit.isReceiver = "Y";
            } else {
                this.poolToEdit.isReceiver = "N";
            }
            if (this.poolToEdit.isShip) {
                this.poolToEdit.isShipper = "Y";
            } else {
                this.poolToEdit.isShipper = "N";
            }

            if (this.poolToEdit.isDryvan && this.poolToEdit.isReef) {
                this.poolToEdit.trailerType = 3;
            } else if(this.poolToEdit.isDryvan) {
                this.poolToEdit.trailerType = "1";
            } else if(this.poolToEdit.isReef) {
                this.poolToEdit.trailerType = "2";
            }

            delete this.poolToEdit['isShip'];
            delete this.poolToEdit['isReciev'];
            delete this.poolToEdit['isReef'];
            delete this.poolToEdit['isDryvan'];

            let headers = new Headers({ 'Content-Type': 'application/json;', 'Accept': 'application/json' });
            let options = new RequestOptions({ headers: headers });

            console.log("add: " + this.selectedState);
            console.log("add: " + this.selectedCity);
            var data = { 'pool': this.poolToEdit };
            let url = config.baseUrl+"/PoolMGMTService/api/UpdatePool";
            this.http.post(url, this.poolToEdit, options).map(res => res.json())
                .subscribe(
                (data) => {
                    console.log("updatePool success msg recieved");
                    this.action.heading = "Update Pool";
                    this.action.body = "Pool updated successfully!";
                    $('#result').modal('show');
                    //this.restoreEdit.csr = this.poolToEdit.csr;
                    //this.restoreEdit.planner = this.poolToEdit.planner;
                    //this.restoreEdit.reqPoolCount = this.poolToEdit.reqPoolCount;
                    //this.updateMasterData(this.poolToEdit);
                    this.getAllPool();
                }, //For Success Response
                (err) => {
                    console.log("updatePool error recieved");
                    this.action.heading = "Update Pool";
                    this.action.body = "Error in updating pool.";
                    $('#result').modal('show');
                } //For Error Response
                );
            $('#editModal').modal('hide');
        } else {
            this.fieldvalidation = true;
        }

        

    }

    private updateMasterData(item: any) {
        for (var i = 0; i < this.ob.groups.length; i++) {
            if (this.ob.groups[i].pID == item.pID) {
                this.ob.groups[i].csr = item.csr;
                this.ob.groups[i].planner = item.planner;
                this.ob.groups[i].reqPoolCount = item.reqPoolCount;
                this.ob.groups[i].brand = item.brand;
                this.ob.groups[i].isReceiver = item.isReceiver;
                this.ob.groups[i].isShipper = item.isShipper;
                this.ob.groups[i].variance = item.variance;
            }

        }

    }

    private cancelUpdatePool() {
        this.selectedCsr = "";
        this.selectedPlanner = "";
        this.updateReqPool = 0;

    }

    selectCompany(item: any) {
        console.log(item);
        this.selectedCompany = item;
        this.selectedCmpLbl = this.selectedCompany.cmpName + " - " + this.selectedCompany.cmpID;
        this.accFil = "";

    }

    selectPlanner(item: any) {
        console.log(item);
        this.selectedPlanner = item;
    }

    selectCsr(item: any) {
        console.log(item);
        this.selectedCsr = item;
    }

    private nextPage() {
        console.log("nextPage");
        this.pageNumber += 1;
        this.lLimit = this.pageNumber * this.rowLimit;
        this.uLimit = (this.pageNumber + 1) * this.rowLimit;
        if (this.uLimit > this.data.length) {
            this.uLimit = this.data.length;
        }
        console.log("nextPage " + this.uLimit);
    }

    private prevPage() {
        this.pageNumber -= 1;
        console.log("prevPage");
        this.lLimit = this.pageNumber * this.rowLimit;
        this.uLimit = (this.pageNumber + 1) * this.rowLimit;
        if (this.lLimit <= 0) {
            this.lLimit = 0;
        }
    }

    add() {
        this.validateFileds();
        if (!this.fieldvalidation) {
            let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
            let options = new RequestOptions({ headers: headers });
            var data = {
                active: "Y",
                avaiPoolCount: 0,
                brand: "",
                cityName: "",
                cmpID: "",
                companyName: "",
                csr: "",
                isReceiver: "",
                isShipper: "",
                pID: 0,
                planner: "",
                poolID: "",
                reqPoolCount: 0,
                stateCode: "",
                stateName: "",
                variance: 0,
                trailerType:0
            };

            data.cmpID = this.selectedCompany.cmpID;
            data.csr = this.selectedCsr;
            data.planner = this.selectedPlanner;
            data.companyName = this.selectedCompany.cmpName;
            data.reqPoolCount = Number(this.reqPoolQat);
            data.variance = Number(this.reqPoolQat);
            data.cityName = this.selectedCompany.cmpCity;
            data.stateName = this.selectedCompany.cmpState;
            data.stateCode = this.selectedCompany.cmpState;
            data.brand = this.selectedCompany.cmpBrand;
            
            if (this.poolToAdd.isReceiver) {
                data.isReceiver = "Y";
            } else {
                data.isReceiver = "N";
            }
            if (this.poolToAdd.isShipper) {
                data.isShipper = "Y";
            } else {
                data.isShipper = "N";
            }

            if (this.poolToAdd.isReef && this.poolToAdd.isDryvan) {
                data.trailerType = 3;
            } else if(this.poolToAdd.isReef){
                data.trailerType = 2;
            }else if(this.poolToAdd.isDryvan){
                data.trailerType = 1;
            }

            console.log("add: " + this.selectedState);
            console.log("add: " + this.selectedCity);

            console.log("add: " + this.ob.groups);
            var payld = { pool: data };
            let url = config.baseUrl+"/PoolMGMTService/api/InsertPool";
            let object = this;
            this.http.post(url, data, options).map(res => res.json())
                .subscribe(
                (resp) => {
                    console.log("insertPool success recieved" + JSON.stringify(resp));
                    if (resp[0].status == 1) {
                        this.action.heading = "Add Pool";
                        this.action.body = "Pool added successfully!";
                        $('#result').modal('show');
                        object.getAllPool();
                        object.getAllCompanyForAddPool();
                        object.getAllCompany();
                    }
                    else {
                        console.log("insertPool error recieved");
                        this.action.heading = "Add Pool";
                        this.action.body = "Error in adding pool.";
                        $('#result').modal('show');
                    }
                }, //For Success Response
                (err) => {
                    console.log("insertPool error recieved");
                    this.action.heading = "Add Pool";
                    this.action.body = "Error in adding pool.";
                    $('#result').modal('show');
                } //For Error Response
                );
            this.cancelAdd();
            this.resetPage();
            $('#addModal').modal('hide');
        }

    }

    private cancelAdd() {
        this.reqPoolQat = "";
        this.selectedCmpLbl = "Select a customer";
        this.toAddBrand = "Covenant";
        this.ccFil = "Select a customer";
        this.selectedCompany = { cmpName: "Select a customer" };
        this.selectedCsr = "Select a CSR";
        this.selectedPlanner = "Select a planner";
        this.fieldvalidation = false;
        this.isValidFields["isValidCompany"] = false;
        this.isValidFields["isValidCsr"] = false;
        this.isValidFields["isValidPlanner"] = false;
        this.isValidFields["isValidReqPool"] = false;
        this.isValidFields["isValidSR"] = false;
        this.isValidFields["isValidTT"] = false;
        this.poolToAdd.brand = "CVEN";
        this.poolToAdd.isShipper = "";
        this.poolToAdd.isReceiver = "";
        this.accFil="";

    }

    private cancelAddCsr(){
        this.csrCrud={csrId: -1, csrCode: "", csr: ""};
    }

    private cancelAddPlanner(){
        this.plannerCrud={plannerId: -1, planner: "", plannerCode: ""};
    }

    addPlanner() {
        if (this.validatePlanner()) {
            let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
            let options = new RequestOptions({ headers: headers });
            this.plannerCrud.planner=this.plannerCrud.planner.toUpperCase();
            this.plannerCrud.plannerCode=this.plannerCrud.plannerCode.toUpperCase();

            let url = config.baseUrl + "/PoolMGMTService/api/InsertPlanner";
            let object = this;
            this.http.post(url, this.plannerCrud, options).map(res => res.json())
                .subscribe(
                (resp) => {
                    console.log("insert Planner success recieved" + JSON.stringify(resp));
                    if (resp.status == 1) {
                        this.action.heading = "Add Planner";
                        this.action.body = "Planner added successfully!";
                        $('#result').modal('show');
                        this.getAllPlanner();
                    }
                    else {
                        console.log("insert Planner error recieved");
                        this.action.heading = "Add Planner";
                        this.action.body = "Error in adding Planner.";
                        $('#result').modal('show');
                    }
                }, //For Success Response
                (err) => {
                    console.log("insert Planner error recieved");
                    this.action.heading = "Add Planner";
                    this.action.body = "Error in adding Planner.";
                    $('#result').modal('show');
                } //For Error Response
                );

            $('#addPlannerModal').modal('hide');
        }
    }

    updatePlanner() {
        var orPlanner=this.allPlanners1[this.plannerEditIndex].planner.toUpperCase();
        var orPlannerCode=this.allPlanners1[this.plannerEditIndex].plannerCode.toUpperCase();
        
        var newPlanner=this.plannerCrud.planner.toUpperCase();
        var newPlannerCode=this.plannerCrud.plannerCode.toUpperCase();
        
        this.plannerCrud.planner=this.plannerCrud.planner.toUpperCase();
        this.plannerCrud.plannerCode=this.plannerCrud.plannerCode.toUpperCase();
        // if(orPlanner==newPlanner && orPlannerCode==newPlannerCode){
        //     console.log("no edit made");
        //     $('#editPlannerModal').modal('hide');
        //     this.action.heading = "Update planner";
        //     this.action.body = "Planner updated successfully!";
        //     $('#result').modal('show');
            
        // }else
        if (this.validatePlanner()) {

            let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
            let options = new RequestOptions({ headers: headers });


            let url = config.baseUrl + "/PoolMGMTService/api/UpdatePlanner";
            let object = this;
            this.http.post(url, this.plannerCrud, options).map(res => res.json())
                .subscribe(
                (resp) => {
                    console.log("update planner success recieved" + JSON.stringify(resp));
                    if (resp.status == 1) {
                        this.action.heading = "Update Planner";
                        this.action.body = "Planner Updated successfully!";
                        $('#result').modal('show');
                        this.getAllPlanner();
                    }else if (resp.status == 2) {
                        this.action.heading = "Update Planner";
                        this.action.body = "No change to update.!";
                        $('#result').modal('show');
                        this.getAllPlanner();
                    }
                    else {
                        console.log("update Planner error recieved");
                        this.action.heading = "Update Planner";
                        this.action.body = "Error in updating Planner.";
                        $('#result').modal('show');
                    }
                }, //For Success Response
                (err) => {
                    console.log("update Planner error recieved");
                    this.action.heading = "Update Planner";
                    this.action.body = "Error in updating Planner.";
                    $('#result').modal('show');
                } //For Error Response
                );

            $('#editPlannerModal').modal('hide');
        }
    }

    validateCSR(){
        var isnameValid=false,isCodeValid=false;
        var isnamelenthy=false,isCodelenthy=false;
        var codeValidator=/^[a-zA-Z0-9]+$/;
        var nameValidatoe=/^[a-zA-Z\s\-']+$/;
        isnameValid=nameValidatoe.test(this.csrCrud.csr);
        isCodeValid=codeValidator.test(this.csrCrud.csrCode);
        isnamelenthy=(this.csrCrud.csr.length>70)?false:true;
        isCodelenthy=(this.csrCrud.csrCode.length>20)?false:true;
        this.isValidFields['isValidCSRCode']=(isCodeValid && isCodelenthy)?true:false;
        this.isValidFields['isValidCSRName']=(isnameValid && isnamelenthy)?true:false;
        if(this.isValidFields['isValidCSRCode'] && this.isValidFields['isValidCSRName']){
            return true;
        }
        return false;
    }

    validatePlanner(){
        var isnameValid=false,isCodeValid=false;
        var isnamelenthy=false,isCodelenthy=false;
        var codeValidator=/^[a-zA-Z0-9]+$/;
        var nameValidatoe=/^[a-zA-Z\s\-']+$/;
        isnameValid=nameValidatoe.test(this.plannerCrud.planner);
        isCodeValid=codeValidator.test(this.plannerCrud.plannerCode);
        
        isnamelenthy=(this.plannerCrud.planner.length>70)?false:true;
        isCodelenthy=(this.plannerCrud.plannerCode.length>20)?false:true;
        this.isValidFields['isValidPlannerCode']=(isCodeValid && isCodelenthy)?true:false;
        this.isValidFields['isValidPlannerName']=(isnameValid && isnamelenthy)?true:false;
        if(this.isValidFields['isValidPlannerCode'] && this.isValidFields['isValidPlannerName']){
            return true;
        }
        return false;
    }

    addCsr() {
        if (this.validateCSR()) {

            let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
            let options = new RequestOptions({ headers: headers });
            this.csrCrud.csr=this.csrCrud.csr.toUpperCase();
            this.csrCrud.csrCode=this.csrCrud.csrCode.toUpperCase();

            let url = config.baseUrl + "/PoolMGMTService/api/InsertCSR";
            let object = this;
            this.http.post(url, this.csrCrud, options).map(res => res.json())
                .subscribe(
                (resp) => {
                    console.log("insert CSR success recieved" + JSON.stringify(resp));
                    if (resp.status == 1) {
                        this.action.heading = "Add CSR";
                        this.action.body = "CSR added successfully!";
                        $('#result').modal('show');
                        this.getAllCsr();
                    }
                    else {
                        console.log("insert CSR error recieved");
                        this.action.heading = "Add CSR";
                        this.action.body = "Error in adding CSR.";
                        $('#result').modal('show');
                    }
                }, //For Success Response
                (err) => {
                    console.log("insert CSR error recieved");
                    this.action.heading = "Add CSR";
                    this.action.body = "Error in adding CSR.";
                    $('#result').modal('show');
                } //For Error Response
                );

            $('#addCSRModal').modal('hide');
        }

    }

    updateCsr() {

        var orCSR=this.allCsr[this.csrEditIndex].csr;
        var orCSRCode=this.allCsr[this.csrEditIndex].csrCode;
        
        var newCSR=this.csrCrud.csr.toUpperCase();
        var newCSRCode=this.csrCrud.csrCode.toUpperCase();

        this.csrCrud.csr=this.csrCrud.csr.toUpperCase();
        this.csrCrud.csrCode=this.csrCrud.csrCode.toUpperCase();
        
        // if(orCSR==newCSR && orCSRCode==newCSRCode){
        //     console.log("no edit made");
        //     $('#editCSRModal').modal('hide');
        //     this.action.heading = "Update CSR";
        //     this.action.body = "CSR updated successfully!";
        //     $('#result').modal('show');
            
        // }else
        if (this.validateCSR()) {
            
            let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
            let options = new RequestOptions({ headers: headers });
            var data = {
                csrCode: this.csrCrud.csrCode, csr: this.csrCrud.csr
            }

            let url = config.baseUrl + "/PoolMGMTService/api/UpdateCSR";
            let object = this;
            this.http.post(url, this.csrCrud, options).map(res => res.json())
                .subscribe(
                (resp) => {
                    console.log("update csr success recieved" + JSON.stringify(resp));
                    if (resp.status == 1) {
                        this.action.heading = "Update CSR";
                        this.action.body = "CSR updated successfully!";
                        $('#result').modal('show');
                        this.getAllCsr();
                    }else if (resp.status == 2) {
                        this.action.heading = "Update CSR";
                        this.action.body = "No change to update.!";
                        $('#result').modal('show');
                        this.getAllCsr();
                    }
                    else {
                        console.log("update csr error recieved");
                        this.action.heading = "Update Pool";
                        this.action.body = "Error in updating CSR.";
                        $('#result').modal('show');
                    }
                }, //For Success Response
                (err) => {
                    console.log("insertPool error recieved");
                    this.action.heading = "Add Pool";
                    this.action.body = "Error in adding pool.";
                    $('#result').modal('show');
                } //For Error Response
                );

            $('#editCSRModal').modal('hide');
        }
    }

    deleteCSR() {
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        //let url = "http://61.16.133.244/PoolMGMTService/api/DeletePool?pid="+item.pID+"&poolid="+item.poolID+"&cmpid="+item.cmpID;
        let url = config.baseUrl+"/PoolMGMTService/api/DeleteCSR";
        this.http.post(url, this.csrCrud, options).map(res => res.json())
            .subscribe(
            (resp) => {

                if (resp.status == 1) {
                    console.log("deletePool success recieved");
                    this.action.heading = "Delete CSR";
                    this.action.body = "CSR deleted successfully!";
                    $('#result').modal('show');
                    this.getAllCsr();
                }
                else {
                    console.log("delete CSR error recieved");
                    this.action.heading = "Delete CSR";
                    this.action.body = "Error in deleting CSR.";
                    $('#result').modal('show');
                }

            }, //For Success Response
            (err) => {
                console.log("delete CSR error recieved");
                this.action.heading = "Delete CSR";
                this.action.body = "Error in deleting CSR.";
                $('#result').modal('show');
            } //For Error Response
            );
    }

    deletePlanner() {
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        //let url = "http://61.16.133.244/PoolMGMTService/api/DeletePool?pid="+item.pID+"&poolid="+item.poolID+"&cmpid="+item.cmpID;
        let url = config.baseUrl+"/PoolMGMTService/api/DeletePlanner";
        this.http.post(url, this.plannerCrud, options).map(res => res.json())
            .subscribe(
            (resp) => {

                if (resp.status == 1) {
                    console.log("delete Planner success recieved");
                    this.action.heading = "Delete planner";
                    this.action.body = "Planner deleted successfully!";
                    $('#result').modal('show');
                    this.getAllPlanner();
                }
                else {
                    console.log("delete Planner error recieved");
                    this.action.heading = "Delete planner";
                    this.action.body = "Error in deleting planner.";
                    $('#result').modal('show');
                }

            }, //For Success Response
            (err) => {
                console.log("delete Planner error recieved");
                this.action.heading = "Delete planner";
                this.action.body = "Error in deleting planner.";
                $('#result').modal('show');
            } //For Error Response
            );
    }

    toDeleteCP(choice){
        if(choice=="Delete CSR"){
            console.log("delete csr");
            this.deleteCSR();
        }else if(choice=="Delete Planner"){
            console.log("delete planner");
            this.deletePlanner();
        }
    }

    private toAdd() {
        this.cancelAdd();
    }

    private toAddCSR() {
        this.isValidFields['isValidCSRCode']=true;
        this.isValidFields['isValidCSRName']=true;
        this.csrCrud={csrId: -1, csrCode: "", csr: ""};

    }

    private toAddPlanner() {
        this.isValidFields['isValidPlannerCode']=true;
        this.isValidFields['isValidPlannerName']=true;
        this.plannerCrud={plannerId: -1, planner: "", plannerCode: ""};
        
    }

    private validateFileds() {
        this.fieldvalidation = false;
        if (this.selectedCompany.cmpName == "Select a customer") {
            this.fieldvalidation = true;
            this.isValidFields["isValidCompany"] = true;
        } else {
            this.isValidFields["isValidCompany"] = false;
        }

        if (this.selectedCsr === "Select a CSR") {
            this.fieldvalidation = true;
            this.isValidFields["isValidCsr"] = true;
        } else {
            this.isValidFields["isValidCsr"] = false;
        }

        if (this.selectedPlanner === "Select a planner") {
            this.fieldvalidation = true;
            this.isValidFields["isValidPlanner"] = true;
        } else {
            this.isValidFields["isValidPlanner"] = false;
        }

        if (this.poolToAdd.isShipper || this.poolToAdd.isReceiver) {
            this.isValidFields["isValidSR"] = false;
        } else {
            this.fieldvalidation = true;
            this.isValidFields["isValidSR"] = true;
        }

        if (this.poolToAdd.isReef || this.poolToAdd.isDryvan) {
            this.isValidFields["isValidTT"] = false;
        } else {
            this.fieldvalidation = true;
            this.isValidFields["isValidTT"] = true;
        }

        console.log(Number(this.reqPoolQat));

        if (isNaN(Number(this.reqPoolQat))) {
            console.log("reqPoolQat is not number");
            this.fieldvalidation = true;
            this.isValidFields["isValidReqPool"] = true;
        } else if (Number(this.reqPoolQat) <= 0) {
            this.fieldvalidation = true;
            this.isValidFields["isValidReqPool"] = true;
        }
        else {
            this.isValidFields["isValidReqPool"] = false;
        }
    }

    getConfirmationToDelete(item: any) {
        $('#deleteConfirm').modal('show');
        this.poolToDel = item;
    }

    getConfirmationToDeleteCP(item: any,choice) {
        $('#deleteConfirmCP').modal('show');
        if(choice=="planner"){
            this.action.heading = "Delete Planner";
            this.plannerCrud=item;
        }else if(choice=="CSR"){
            this.action.heading = "Delete CSR";
            this.csrCrud=item;
        }
        this.action.body = "Are you sure you want to delete this "+choice+"?";
        
    }

    toDelete() {
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        //let url = "http://61.16.133.244/PoolMGMTService/api/DeletePool?pid="+item.pID+"&poolid="+item.poolID+"&cmpid="+item.cmpID;
        let url = config.baseUrl+"/PoolMGMTService/api/DeletePool";
        this.http.post(url, this.poolToDel, options).map(res => res.json())
            .subscribe(
            (resp) => {

                if (resp[0].status == 1) {
                    console.log("deletePool success recieved");
                    this.action.heading = "Delete Pool";
                    this.action.body = "Pool deleted successfully!";
                    $('#result').modal('show');
                    this.getAllPool();
                }
                else {
                    console.log("deletePool error recieved");
                    this.action.heading = "Delete Pool";
                    this.action.body = "Error in deleting pool.";
                    $('#result').modal('show');
                }

            }, //For Success Response
            (err) => {
                console.log("deletePool error recieved");
                this.action.heading = "Delete Pool";
                this.action.body = "Error in deleting pool.";
                $('#result').modal('show');
            } //For Error Response
            );
    }

    reset(){
        
        this.selectedVarience = { lable: "Pools having variance", value: 1 };
        this.choosenCC=[];
        this.choosenPlanner=[];
        this.choosenState=[];
        this.selectedSR = { lable: "Shipper", value: 0 };
        this.selectedBrand = { lable: "Covenant", value: "CVEN" };
        this.ccClearAllFun();
        this.stateClearAllFun();
        this.plannerClearAllFun();
        this.selectVarience(this.selectedVarience);
        this.masterFilter();
    }

}

// This code copy to app.module.ts
