import { Component } from '@angular/core';
import { FilterCPipe } from '../Filters/filterC.pipe';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'pool1-mang-page',
    templateUrl: 'pool1-mang-page.component.html',
    styleUrls: ['pool1-mang-page.component.css'],
    moduleId: module.id,
    //pipes: [FilterCPipe]
})
export class Pool1MangPageComponent {
    reqPoolQat: any = "";
    rowLimit: any = 10;
    pageNumber: any = 0;
    lLimit: any = this.pageNumber * 4;
    uLimit: any = (this.pageNumber + 1) * 4;
    stateSFlabel: any = "Select a state";
    citySFlabel: any = "Select a city";
    ccSFlabel: any = 'Customer\\Company';
    plannerSFlabel: any = 'Planner';
    selectedCompany: any = "Select a company";
    selectedState: any = "Select a state";
    selectedCity: any = "Select a city";
    updateReqPool: any;
    selectedCsr: any = "Select a CSR";
    selectedPlanner: any = "Select a planner";
    allCsr: any;
    asc = true;
    poolRecieved = false;
    //[name: string]: any;

    private name = 'Pool1Mang-pageComponent';
    cityFil: String = "";
    stateFil: String = "";
    ccFil: String = "";
    plannerFil: String = "";
    selectedVarience: Number = 1;
    selectedSR: Number = 0;
    data: any[] = [];
    result: any[] = [];
    pageNum: Number = 1;
    //allCities: any = [];
    //allStates: any = [];
    //allCC: any = [];
    //countryList: any = ["AL", "AZ", "AR"];
    //cityList: any = ["Birmingham", "Cullman", "Gentry", "North Little Rock", "Phoenix"];
    //ccList: any = ["Averitt", "Serta", "Walmart 6008", "Valspar"];
    //allCities1: any = [{ "cityName": "Birmingham", "cityState": "WY", "cityZip": "82639", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "43.70000", "cityLongtitude": "106.29000" }, { "cityName": "Cullman", "cityState": "WY", "cityZip": "82442", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "44.03000", "cityLongtitude": "107.45000" }, { "cityName": "Gentry", "cityState": "WY", "cityZip": "83127", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "42.92000", "cityLongtitude": "111.00000" }, { "cityName": "Tower Junction", "cityState": "WY", "cityZip": "82190", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "44.92000", "cityLongtitude": "110.42000" }, { "cityName": "Verona", "cityState": "WY", "cityZip": "82845", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "44.74000", "cityLongtitude": "106.67000" }, { "cityName": "Veteran", "cityState": "WY", "cityZip": "82243", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "41.96000", "cityLongtitude": "104.38000" }, { "cityName": "Valley", "cityState": "WY", "cityZip": "82414", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "44.16000", "cityLongtitude": "109.60000" }, { "cityName": "West Laramie", "cityState": "WY", "cityZip": "82070", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "41.31000", "cityLongtitude": "105.62000" }, { "cityName": "Willwood", "cityState": "WY", "cityZip": "82435", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "44.69000", "cityLongtitude": "108.76000" }, { "cityName": "Wilson", "cityState": "WY", "cityZip": "83014", "cityCountry": 3, "cityRegion": "WEST", "cityLatitude": "43.50000", "cityLongtitude": "110.87000" }, { "cityName": "McGraws", "cityState": "WV", "cityZip": "25875", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.67000", "cityLongtitude": "81.46000" }, { "cityName": "McKendree", "cityState": "WV", "cityZip": "25907", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.89000", "cityLongtitude": "81.06000" }, { "cityName": "McKinleyville", "cityState": "WV", "cityZip": "26070", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "40.24000", "cityLongtitude": "80.60000" }, { "cityName": "Meadowdale", "cityState": "WV", "cityZip": "26554", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.90000", "cityLongtitude": "81.60000" }, { "cityName": "Melissa", "cityState": "WV", "cityZip": "25504", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.38000", "cityLongtitude": "82.33000" }, { "cityName": "Mellin", "cityState": "WV", "cityZip": "26362", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.12000", "cityLongtitude": "81.17000" }, { "cityName": "Merrimac", "cityState": "WV", "cityZip": "25661", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.64000", "cityLongtitude": "82.22000" }, { "cityName": "Midway", "cityState": "WV", "cityZip": "25168", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.56000", "cityLongtitude": "81.96000" }, { "cityName": "Miletus", "cityState": "WV", "cityZip": "26456", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.23000", "cityLongtitude": "80.59000" }, { "cityName": "Milroy", "cityState": "WV", "cityZip": "26616", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.73000", "cityLongtitude": "80.50000" }, { "cityName": "Mineralwells", "cityState": "WV", "cityZip": "26150", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.19000", "cityLongtitude": "81.53000" }, { "cityName": "Mink Shoals", "cityState": "WV", "cityZip": "25302", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.40000", "cityLongtitude": "81.59000" }, { "cityName": "Minnie", "cityState": "WV", "cityZip": "26155", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.59000", "cityLongtitude": "80.81000" }, { "cityName": "Mitchell Branch", "cityState": "WV", "cityZip": "25692", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.64000", "cityLongtitude": "82.12000" }, { "cityName": "Mill Creek", "cityState": "WV", "cityZip": "26280", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.73000", "cityLongtitude": "79.97000" }, { "cityName": "Mill Point", "cityState": "WV", "cityZip": "24946", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.16000", "cityLongtitude": "80.18000" }, { "cityName": "Monclo", "cityState": "WV", "cityZip": "25183", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.91000", "cityLongtitude": "81.84000" }, { "cityName": "Monterville", "cityState": "WV", "cityZip": "26282", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.56000", "cityLongtitude": "80.11000" }, { "cityName": "Montgomery", "cityState": "WV", "cityZip": "25301", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.18000", "cityLongtitude": "81.31000" }, { "cityName": "Montrose", "cityState": "WV", "cityZip": "26283", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.07000", "cityLongtitude": "79.81000" }, { "cityName": "Morgan Heights", "cityState": "WV", "cityZip": "26505", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.63000", "cityLongtitude": "79.99000" }, { "cityName": "Morgansville", "cityState": "WV", "cityZip": "26456", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.28000", "cityLongtitude": "80.70000" }, { "cityName": "Moyers", "cityState": "WV", "cityZip": "26813", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.52000", "cityLongtitude": "79.36000" }, { "cityName": "Mount Alto", "cityState": "WV", "cityZip": "25264", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.86000", "cityLongtitude": "81.88000" }, { "cityName": "Mount Carbon", "cityState": "WV", "cityZip": "25139", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.14000", "cityLongtitude": "81.29000" }, { "cityName": "Mount Nebo", "cityState": "WV", "cityZip": "26537", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.60000", "cityLongtitude": "79.71000" }, { "cityName": "Mount Pleasant", "cityState": "WV", "cityZip": "25446", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.26000", "cityLongtitude": "77.95000" }, { "cityName": "Myra", "cityState": "WV", "cityZip": "25544", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.22000", "cityLongtitude": "82.11000" }, { "cityName": "North Berkeley", "cityState": "WV", "cityZip": "25411", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.63000", "cityLongtitude": "78.22000" }, { "cityName": "North Caldwell", "cityState": "WV", "cityZip": "24925", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.78000", "cityLongtitude": "80.40000" }, { "cityName": "North Parkersburg", "cityState": "WV", "cityZip": "26104", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.29000", "cityLongtitude": "81.53000" }, { "cityName": "Naoma", "cityState": "WV", "cityZip": "25140", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.87000", "cityLongtitude": "81.49000" }, { "cityName": "Napier", "cityState": "WV", "cityZip": "26631", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.79000", "cityLongtitude": "80.59000" }, { "cityName": "National", "cityState": "WV", "cityZip": "26505", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.58000", "cityLongtitude": "80.04000" }, { "cityName": "Neal", "cityState": "WV", "cityZip": "25530", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.36000", "cityLongtitude": "82.59000" }, { "cityName": "Nelson", "cityState": "WV", "cityZip": "25163", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.07000", "cityLongtitude": "81.62000" }, { "cityName": "Nestlow", "cityState": "WV", "cityZip": "25512", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.18000", "cityLongtitude": "82.28000" }, { "cityName": "Neville", "cityState": "WV", "cityZip": "25801", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.78000", "cityLongtitude": "81.19000" }, { "cityName": "New Hamlin", "cityState": "WV", "cityZip": "25523", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.28000", "cityLongtitude": "82.11000" }, { "cityName": "New Hope", "cityState": "WV", "cityZip": "24740", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.34000", "cityLongtitude": "81.17000" }, { "cityName": "Newburg", "cityState": "WV", "cityZip": "26410", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.39000", "cityLongtitude": "79.85000" }, { "cityName": "Newell", "cityState": "WV", "cityZip": "26050", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "40.62000", "cityLongtitude": "80.60000" }, { "cityName": "Nicolette", "cityState": "WV", "cityZip": "26101", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.21000", "cityLongtitude": "81.51000" }, { "cityName": "Nimitz", "cityState": "WV", "cityZip": "25978", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.65000", "cityLongtitude": "80.96000" }, { "cityName": "Nobe", "cityState": "WV", "cityZip": "26137", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.99000", "cityLongtitude": "81.03000" }, { "cityName": "Nolan", "cityState": "WV", "cityZip": "25687", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.74000", "cityLongtitude": "82.33000" }, { "cityName": "Nollville", "cityState": "WV", "cityZip": "25401", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.46000", "cityLongtitude": "78.02000" }, { "cityName": "Northfork", "cityState": "WV", "cityZip": "24868", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.42000", "cityLongtitude": "81.44000" }, { "cityName": "Oakwood", "cityState": "WV", "cityZip": "25301", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.34000", "cityLongtitude": "81.66000" }, { "cityName": "Ogden", "cityState": "WV", "cityZip": "26101", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.30000", "cityLongtitude": "81.40000" }, { "cityName": "Ohley", "cityState": "WV", "cityZip": "25147", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.11000", "cityLongtitude": "81.45000" }, { "cityName": "Oakland", "cityState": "WV", "cityZip": "25411", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.48000", "cityLongtitude": "78.25000" }, { "cityName": "Old Arthur", "cityState": "WV", "cityZip": "26816", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.10000", "cityLongtitude": "79.10000" }, { "cityName": "Omar", "cityState": "WV", "cityZip": "25638", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.76000", "cityLongtitude": "82.00000" }, { "cityName": "Orient Hill", "cityState": "WV", "cityZip": "25958", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.03000", "cityLongtitude": "80.73000" }, { "cityName": "Otsego", "cityState": "WV", "cityZip": "25882", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.61000", "cityLongtitude": "81.38000" }, { "cityName": "Otto", "cityState": "WV", "cityZip": "25276", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.75000", "cityLongtitude": "81.22000" }, { "cityName": "Overfield", "cityState": "WV", "cityZip": "26416", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.17000", "cityLongtitude": "80.20000" }, { "cityName": "Owings", "cityState": "WV", "cityZip": "26431", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.38000", "cityLongtitude": "80.26000" }, { "cityName": "Packsville", "cityState": "WV", "cityZip": "25209", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.95000", "cityLongtitude": "81.53000" }, { "cityName": "Pad", "cityState": "WV", "cityZip": "25286", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.64000", "cityLongtitude": "81.33000" }, { "cityName": "Parkersburg", "cityState": "WV", "cityZip": "26101", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.27000", "cityLongtitude": "81.56000" }, { "cityName": "Pennsboro", "cityState": "WV", "cityZip": "26415", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.29000", "cityLongtitude": "80.97000" }, { "cityName": "Pentress", "cityState": "WV", "cityZip": "26544", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.71000", "cityLongtitude": "80.16000" }, { "cityName": "Pepper", "cityState": "WV", "cityZip": "26330", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "39.19000", "cityLongtitude": "80.16000" }, { "cityName": "Persinger", "cityState": "WV", "cityZip": "26651", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.32000", "cityLongtitude": "80.75000" }, { "cityName": "Petersburg", "cityState": "WV", "cityZip": "26847", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.99000", "cityLongtitude": "79.12000" }, { "cityName": "Peterson", "cityState": "WV", "cityZip": "26423", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "38.89000", "cityLongtitude": "80.54000" }, { "cityName": "Pettry", "cityState": "WV", "cityZip": "24712", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.44000", "cityLongtitude": "80.96000" }, { "cityName": "Pettus", "cityState": "WV", "cityZip": "25209", "cityCountry": 3, "cityRegion": "MID", "cityLatitude": "37.96000", "cityLongtitude": "81.54000" }, { "cityName": "Tony", "cityState": "WI", "cityZip": "54563", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "45.48000", "cityLongtitude": "90.99000" }, { "cityName": "Towerville", "cityState": "WI", "cityZip": "54655", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "43.41000", "cityLongtitude": "90.89000" }, { "cityName": "Townsend", "cityState": "WI", "cityZip": "54175", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "45.33000", "cityLongtitude": "88.59000" }, { "cityName": "Trego", "cityState": "WI", "cityZip": "54888", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "45.90000", "cityLongtitude": "91.82000" }, { "cityName": "Trevino", "cityState": "WI", "cityZip": "54756", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "44.43000", "cityLongtitude": "92.07000" }, { "cityName": "Trimbelle", "cityState": "WI", "cityZip": "54011", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "44.73000", "cityLongtitude": "92.58000" }, { "cityName": "Trippville", "cityState": "WI", "cityZip": "54665", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "43.71000", "cityLongtitude": "90.40000" }, { "cityName": "Troy Center", "cityState": "WI", "cityZip": "53120", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "42.81000", "cityLongtitude": "88.47000" }, { "cityName": "Tustin", "cityState": "WI", "cityZip": "54940", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "44.16000", "cityLongtitude": "88.89000" }, { "cityName": "Burnett", "cityState": "WI", "cityZip": "53922", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "43.50000", "cityLongtitude": "88.71000" }, { "cityName": "Busseyville", "cityState": "WI", "cityZip": "53534", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "42.90000", "cityLongtitude": "88.99000" }, { "cityName": "Byrds Creek", "cityState": "WI", "cityZip": "53518", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "43.22000", "cityLongtitude": "90.55000" }, { "cityName": "Calamine", "cityState": "WI", "cityZip": "53565", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "42.74000", "cityLongtitude": "90.16000" }, { "cityName": "Calvert", "cityState": "WI", "cityZip": "54601", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "43.75000", "cityLongtitude": "91.21000" }, { "cityName": "Carlsville", "cityState": "WI", "cityZip": "54235", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "44.95000", "cityLongtitude": "87.34000" }, { "cityName": "Casco", "cityState": "WI", "cityZip": "54205", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "44.56000", "cityLongtitude": "87.62000" }, { "cityName": "Cayuga", "cityState": "WI", "cityZip": "54546", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "46.24000", "cityLongtitude": "90.68000" }, { "cityName": "Cazenovia", "cityState": "WI", "cityZip": "53924", "cityCountry": 3, "cityRegion": "UPMID", "cityLatitude": "43.52000", "cityLongtitude": "90.20000" }];
    //allStates1: any = [{ "stateName": "Alberta", "stateCode": "AB", "countryId": 1 }, { "stateName": "British Columbia", "stateCode": "BC", "countryId": 1 }, { "stateName": "Manitoba", "stateCode": "MB", "countryId": 1 }, { "stateName": "New Brunswick", "stateCode": "NB", "countryId": 1 }, { "stateName": "Newfoundland", "stateCode": "NL", "countryId": 1 }, { "stateName": "Nova Scotia", "stateCode": "NS", "countryId": 1 }, { "stateName": "Northwest Territories", "stateCode": "NT", "countryId": 1 }, { "stateName": "Nunavut", "stateCode": "NU", "countryId": 1 }, { "stateName": "Ontario", "stateCode": "ON", "countryId": 1 }, { "stateName": "Prince Edward Island", "stateCode": "PE", "countryId": 1 }, { "stateName": "Quebec", "stateCode": "QC", "countryId": 1 }, { "stateName": "Saskatchewan", "stateCode": "SK", "countryId": 1 }, { "stateName": "Yukon Territory", "stateCode": "YT", "countryId": 1 }, { "stateName": "Aquascalientes", "stateCode": "AG", "countryId": 2 }, { "stateName": "Baja California-N", "stateCode": "BJ", "countryId": 2 }, { "stateName": "Baja California-S", "stateCode": "BS", "countryId": 2 }, { "stateName": "Chiapas", "stateCode": "CH", "countryId": 2 }, { "stateName": "Chihuahua", "stateCode": "CI", "countryId": 2 }, { "stateName": "Colioma", "stateCode": "CL", "countryId": 2 }, { "stateName": "Campeche", "stateCode": "CP", "countryId": 2 }, { "stateName": "Coahuila Zargoza", "stateCode": "CU", "countryId": 2 }, { "stateName": "Distrito Federal", "stateCode": "DF", "countryId": 2 }, { "stateName": "Durango", "stateCode": "DG", "countryId": 2 }, { "stateName": "Estado", "stateCode": "EM", "countryId": 2 }, { "stateName": "Guanajuato", "stateCode": "GJ", "countryId": 2 }, { "stateName": "Guerrero", "stateCode": "GR", "countryId": 2 }, { "stateName": "Hidalgo", "stateCode": "HG", "countryId": 2 }, { "stateName": "Jalisco", "stateCode": "JA", "countryId": 2 }, { "stateName": "Michoacan de O", "stateCode": "MH", "countryId": 2 }, { "stateName": "Morelos", "stateCode": "MR", "countryId": 2 }, { "stateName": "Mexico", "stateCode": "MX", "countryId": 2 }, { "stateName": "Nayarit", "stateCode": "NA", "countryId": 2 }, { "stateName": "Nuevo Leon", "stateCode": "NX", "countryId": 2 }, { "stateName": "Oaxaca", "stateCode": "OA", "countryId": 2 }, { "stateName": "Puebla", "stateCode": "PU", "countryId": 2 }, { "stateName": "Querataro de A", "stateCode": "QA", "countryId": 2 }, { "stateName": "Quintana Roo", "stateCode": "QR", "countryId": 2 }, { "stateName": "Sinaloa", "stateCode": "SI", "countryId": 2 }, { "stateName": "San Luis Potosi", "stateCode": "SL", "countryId": 2 }, { "stateName": "Sonora", "stateCode": "SO", "countryId": 2 }, { "stateName": "Tabasco", "stateCode": "TA", "countryId": 2 }, { "stateName": "Tlaxcala", "stateCode": "TL", "countryId": 2 }, { "stateName": "Tamaulipas", "stateCode": "TM", "countryId": 2 }, { "stateName": "Veracruz-Llave", "stateCode": "VZ", "countryId": 2 }, { "stateName": "Yucatan", "stateCode": "YC", "countryId": 2 }, { "stateName": "Zacatecas", "stateCode": "ZT", "countryId": 2 }, { "stateName": "Alaska", "stateCode": "AK", "countryId": 3 }, { "stateName": "Alabama", "stateCode": "AL", "countryId": 3 }, { "stateName": "Arkansas", "stateCode": "AR", "countryId": 3 }, { "stateName": "Arizona", "stateCode": "AZ", "countryId": 3 }, { "stateName": "California", "stateCode": "CA", "countryId": 3 }, { "stateName": "Colorado", "stateCode": "CO", "countryId": 3 }, { "stateName": "Connecticut", "stateCode": "CT", "countryId": 3 }, { "stateName": "District of Columbia", "stateCode": "DC", "countryId": 3 }, { "stateName": "Delaware", "stateCode": "DE", "countryId": 3 }, { "stateName": "Florida", "stateCode": "FL", "countryId": 3 }, { "stateName": "Georgia", "stateCode": "GA", "countryId": 3 }, { "stateName": "Hawaii", "stateCode": "HA", "countryId": 3 }, { "stateName": "Iowa", "stateCode": "IA", "countryId": 3 }, { "stateName": "Idaho", "stateCode": "ID", "countryId": 3 }, { "stateName": "Illinois", "stateCode": "IL", "countryId": 3 }, { "stateName": "Indiana", "stateCode": "IN", "countryId": 3 }, { "stateName": "Kansas", "stateCode": "KS", "countryId": 3 }, { "stateName": "Kentucky", "stateCode": "KY", "countryId": 3 }, { "stateName": "Louisiana", "stateCode": "LA", "countryId": 3 }, { "stateName": "Massachusetts", "stateCode": "MA", "countryId": 3 }, { "stateName": "Maryland", "stateCode": "MD", "countryId": 3 }, { "stateName": "Maine", "stateCode": "ME", "countryId": 3 }, { "stateName": "Michigan", "stateCode": "MI", "countryId": 3 }, { "stateName": "Minnesota", "stateCode": "MN", "countryId": 3 }, { "stateName": "Missouri", "stateCode": "MO", "countryId": 3 }, { "stateName": "Mississippi", "stateCode": "MS", "countryId": 3 }, { "stateName": "Montana", "stateCode": "MT", "countryId": 3 }, { "stateName": "North Carolina", "stateCode": "NC", "countryId": 3 }, { "stateName": "North Dakota", "stateCode": "ND", "countryId": 3 }, { "stateName": "Nebraska", "stateCode": "NE", "countryId": 3 }, { "stateName": "New Hampshire", "stateCode": "NH", "countryId": 3 }, { "stateName": "New Jersey", "stateCode": "NJ", "countryId": 3 }, { "stateName": "New Mexico", "stateCode": "NM", "countryId": 2 }, { "stateName": "Nevada", "stateCode": "NV", "countryId": 3 }, { "stateName": "New York", "stateCode": "NY", "countryId": 3 }, { "stateName": "Ohio", "stateCode": "OH", "countryId": 3 }, { "stateName": "Oklahoma", "stateCode": "OK", "countryId": 3 }, { "stateName": "Oregon", "stateCode": "OR", "countryId": 3 }, { "stateName": "Pennsylvania", "stateCode": "PA", "countryId": 3 }, { "stateName": "Rhode Island", "stateCode": "RI", "countryId": 3 }, { "stateName": "South Carolina", "stateCode": "SC", "countryId": 3 }, { "stateName": "South Dakota", "stateCode": "SD", "countryId": 3 }, { "stateName": "Tennessee", "stateCode": "TN", "countryId": 3 }, { "stateName": "Texas", "stateCode": "TX", "countryId": 3 }, { "stateName": "Utah", "stateCode": "UT", "countryId": 3 }, { "stateName": "Virginia", "stateCode": "VA", "countryId": 3 }, { "stateName": "Vermont", "stateCode": "VT", "countryId": 3 }, { "stateName": "Washington", "stateCode": "WA", "countryId": 3 }, { "stateName": "Wisconsin", "stateCode": "WI", "countryId": 3 }, { "stateName": "West Virginia", "stateCode": "WV", "countryId": 3 }, { "stateName": "Wyoming", "stateCode": "WY", "countryId": 3 }];
    //allCC1: any = [{ "cmpName": "Averitt", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Serta", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "AAFES *NO TRLR DROP*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF FREIGHT SYSTEM INC.", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF FREIGHT SYSTEM INC.", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ABF Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Advanced Distribution", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Advanced Delivery *DO NOT REMOVE*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "AGC Flat Glass", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "A/I / OHL", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "AIE US Calvert", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "AJM Packaging", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Alaskan Express / Drop Yard", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ALCATEL c/o Genco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "All Fleet Services", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Alpine Cartage", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon ABE2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon FTW1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon XUSK", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon ABE8", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon.com", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon AVP3", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon CVG5", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon.com", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon SDF8", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon MDW2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon TPA2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon LEX2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon ONT8", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon LAS2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "AMAZON PHX3", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon - Ont2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon ATL7", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Abercrombie", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart / Americold *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "American Tire", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "American Nutrition", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Anderson", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Apll Triangle", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Lonza/Arch Chemicals", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Argix Direct", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Argix Direct", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Armstrong", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "AST/Ryder Logistics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "American Standard", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Trailco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ATLANTA BONDED", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Atlanta OTR", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Averitt", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Averitt", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Averitt", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Averitt", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Averitt Express *Reefer Only*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Averitt Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Zanesville, OH Distribution", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Azko *REEFER ONLY!", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Bayer / Merck", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "BeBe", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Best Buy", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Bestway", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Best Buy", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon BFI4", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Blair", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Blue Planet Foods", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Blue Bird ", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Bluestem", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Bluestem", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Brauns Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Bright Wood Corporation", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "BX Solutions", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Calcartage Norfolk", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Carrier Transicold", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Case Stack *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Cascade Tissue", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Case Stack *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Case Stack *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Cascade Wood", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Central Transport", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Central Transport", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Central Transport", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Certifit Auto Body Parts", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Certifit Auto Body Parts", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Certifit Auto Body Parts", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva FM", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "CEVA", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva FM", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Chattem *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Charming Charlies", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Chicos", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Clorox - Ad Hoc", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Clorox - Ad Hoc", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon CMH1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "CMI", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Coca Cola Bottling", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Coca Cola Bottling", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Conway", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Conway", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Conway *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Conway *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Continental Tire", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Conway", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Conagra", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Continental Tire", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Conway *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Conway", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Allentown *AMAZON POOL*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Cambridge", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Transport Terminal", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Columbus", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Pasadena", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Transport Terminal", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Indy Drop Yard *AMAZON POOL*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Jacksonville", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Lathrop", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Orlando", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Phoenix", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Transport Terminal", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Salt Lake City", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Sumner", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard / Room for Rent", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "COVENANT TRANS SRV-T/L", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "C\u0026S Wholesale", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "CTE (Nordstrom/Saks)", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon CVG2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ceva", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SGD Glass / Diasaka", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Daimler/Formerly Freightliner", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dallas IFC", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dal Tile", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Damco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Damco/Macy", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Damco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dayton Freight *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Daylight Transport", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "FedEx", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Daylight Transport", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Daylight Transport", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Denver Mattress", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon Direct", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP/Diamondback Trailer Repair", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dillards", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dillards", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dillards", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dillards", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Transplace", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "DMG Logistics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dole Fresh Vegetables *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dow", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dunn Paper/Clearwater Paper", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "DuPont", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Duval", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Dynamic", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "East Penn", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "East Penn", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ecolab", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Forwarding", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Enkei", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Erie Logistics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Express *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Express *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Estes Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Excel", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Exel Logistics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Daimler/Exel", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Daimler/Exel", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Exim Forwarding", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Expeditors", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Expeditors", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Expeditors - Nordstrom", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Expeditors", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Expeditors", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Farmland Foods *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Smartpost", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "FedEx Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "FedEx", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "FedEx", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Ground", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Finelite", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Flint Hill", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "FMC / Lithium Division", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Footlocker", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Forward Air", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Forward Air", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Forward Air", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Cargill", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Forward Air", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "NULL", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fresh Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fresh Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Freight Force", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fresh Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "FTW4 - Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fuji", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fuji", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Furniture Row", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Gap", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Gap", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Gap", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Gap", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Gap Inc", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Garden City", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Port Authority", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Gerber Scientific International", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Gilbert Logistics East", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Goodman Mfg", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Goodman Mfg", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Graphic Packaging", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "GSI", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "GSI (TP2)", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Guardian", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Gulf Shores Assemblies / Honda", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Hello Fresh ***Reefer Only****", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Hershey", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Hessen Forwarding", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Hewlett Packard", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Menlo Worldwide ", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Hewlett Packard", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Hiwassee", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Hobby Lobby", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Homegoods", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Home Depot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Home Depot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Home Depot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Home Depot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Home Depot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Home Depot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Home Depot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "IND1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ingram Micro", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "InterAmerica Forwarding", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Interglobal Solutions", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "IRDC", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "BASF *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Jameson Warehouse", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "JC Penney Five Star Outlet", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "JC Penney", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "JC Penney", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "JC Penney", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "JC Penney", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "JC Penney", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Jeld Wen", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart Jewelry", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Johns Manville", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Jspaluch/Fry", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "JTM FOODS *REEFER OR DRY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "JTS Animal Bedding", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Kenworth Truck", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "King Solutions", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP/K\u0026L Trailer", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Kohl", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "US dc midwest/kraft", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Kuehne \u0026 Nagel", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Las Vegas LA Express", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Levis", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amaozn LGA6", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Liberty Safe", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Limited Brands", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Limited Brands", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Lumirror - Toray Plastics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Lumber Liquidators", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Maax Corp", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Maax US Corporation", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mach 1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mach 1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Macy", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Macy", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mach 1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mach 1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mach 1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Macy", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Macy", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mach 1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mars", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX / Marshall", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX / Marshall", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX / Marshall", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mars", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mars", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX / Marshall", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX / Marshall", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Covenant Drop Yard/Market Trans", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Masonite", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "McKee Foods", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "McKee Foods *DRY VAN ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "McKee Foods", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "McKee Foods", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "MCMaster", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Melaleuca", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Melaleuca", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Menasha Paper", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Merck", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Michaels", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Michael Kors", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mittal", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "MKE5 - Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mohawk", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mohawk *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mohawk", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Goodman Mfg / Morrison Products", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mountain Valley", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "MXD", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Mytox Mfg", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nestle Purina", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "New Penn", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "New England Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "New Deal Logistics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "America Chung Nam", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nexus", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "NFI Warehouse", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nike", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nike", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nike", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nike", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nintendo of America", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nissan", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nissan", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nissan", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nordstrom", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "NRS Savannah", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "NSD-DC-KELLOG", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Oak Harbor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Oak Harbor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Oak Harbor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "OHL Warehouse", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "OHL", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "On Time Forwarding", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "ONT9", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Owens Corning", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Owens Corning", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Owens Corning", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Owens Corning", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Armstrong", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Pactiv", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Payless Shoe Source", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon PCA1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Pepsi", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Performance Team/Neiman Marcus", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Performance Team/Neiman Marcus", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Petsmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Petsmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "PGH Consolidation Pitt Ohio", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Phillips Van Heusen", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Pepsi", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Pilot Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Pilot Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Pilot Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Pitt Ohio *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon POH1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Lord \u0026 Taylor", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Fedex Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Exel Logistics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Port Logistics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Post / CFM", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Post / CFM", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Post", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "PPG Huron", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "PPG Oakwood", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Pyramid", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "QCM", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Quaker/Pepsi", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "QVC Returns", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "QVC", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "QVC", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Lonza/Resolute", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Resolute Forest Product", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Restoration Hardware *NO REEFER*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Resolute Forest Product", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Reynolds", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Rheem Manufacturing", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R\u0026L Carriers *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "R \u0026 L Carriers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Roadrunner *4 Reefer/4 Dry*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Roadrunner *REEFER ONLY!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Roadrunner *4 REEFER-1 DRY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Roadrunner", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Roadrunner *3 Reefer/3Dry*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Roadrunner", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Georgia Pacific", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Roadrunner", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ross Stores", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "RR Donnelley", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "RR Donnelley", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "RR Donnelley", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "RR Donnelley", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "RTV / Black \u0026 Decker / DeWalt", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia *REEFER ONLY!!!**DO NOT REMOVE*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight *REEFER*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saia Motor Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saks", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saks Fifth Avenue", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "GAP", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Sams", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Samsung", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Sams Club", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Saputo", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Schwarz Supply Source", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Schreiber Foods *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Schreiber Foods", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "West Bend/Schreiber", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Amazon SDF1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Sears", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Seco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SGD Glass / Annex", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SGD Glass", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SGD Glass", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant DL", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant NB/LG", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant DK", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant UV", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 78", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant D4/D5", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant D7", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant WF", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant D6", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant DW", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 15/42/1C", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 12", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 13", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 62", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 11", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 97", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant YZ", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Chatsworth", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 3P", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 84", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant WP", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant SI", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant NC", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Industries", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 48", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 34 (Same as Plant IT aka SHADALB2)", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 52", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant MU", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 30", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Dalton", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant UC", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant SR", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Dalton", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant WH", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant WM", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 23", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 02", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 63", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 1", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 81", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 26", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 21", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant WD", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant DJ/LS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant LT", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 6", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 80", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 28", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 41", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 4", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 3", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 18", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 19", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 54", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 61", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 66", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 68", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 69", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant R2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 20", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 35", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 71", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 72", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant UA", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 50", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant EW", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 09", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant LD", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 83", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Garden City", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant NG", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 43", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 67", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant DH", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant PX", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 47/L2", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Rugs/Plant 37", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant LB/LE/8R", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant LM", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 64", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 44", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 3S", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 5S", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 22", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant 45", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SIMPSON DOOR", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Southeastern *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Southwest Motor", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Southwire", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Southeastern Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Star Drop Yard / LaVergne", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Star Drop Yard / Lenoir City", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Star Drop Yard / Nashville *DO NOT USE*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Starcrest", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Star Distributions", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Stein Mart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Steinmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Stein Mart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Target", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Target", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Taylor Farms *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Technicolor ", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Thermo Fisher Scientific *REEFER ONLY*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "The Expediting Company - CVG", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Thermo King", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Home Depot", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX / Marshalls", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX / Marshalls", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX / Marshalls", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX ", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TJX ", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Tomra North America - Farmington", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Tootsie Roll", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Tootsie Roll", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Toray Plastics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Toro", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Trailco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Trailco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Trailco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Transamerican", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Trailco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Trailco Drop Yard", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Trailco", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Trinity", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Trinity Packaging", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Triangle Transportation", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Trinity Packaging - Dedicated", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Trinity Plastics", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "TRI-CAP INTERNATIONAL", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Trinity Packaging - Dedicated (1 reefer)", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Trinidad", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Shaw Plant H6/Tyger River", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UFL4 Amazon", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Ulta Distribution", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight - NO REEFER", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Hub", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Air", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Warehouse", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Midfield", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Hub", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Hub", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Hub", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Hub", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS-SCS", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Hub", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "UPS Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Urban Outfitters", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "USF", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "USF", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "USF", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "USF *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "US Magnesium", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nestle Purina", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Nestle Purina", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "USP Trans", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Utility Trailer", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP / Utility Trailer", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Valspar", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Vitacost", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Volvo Parts", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP/Wabash Trailers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "SHOP/Wabash Trailers", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart 6008", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart 6901", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "WAL-MART DC 6094G-GENERAL", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Wal-Mart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart 6066", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Wal-Mart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Wausau Paper", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "WCC - Colton *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "WD Aspers Main", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Warehouse 37", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Walmart", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Williams Sonoma", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Williams Sonoma", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Williams Sonoma", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Williams Sonoma", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Williams Sonoma", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Williams Sonoma", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Williams Sonoma", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Wrigley ", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "Xpress Global", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "xpress global", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight *KEEP A REEFER*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight / The Expo Group", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YrC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "YRC Freight", "companyId": "", "companyCity": "Mason", "companyState": null }, { "cmpName": "CL Services / Zep *REEFER ONLY!!!*", "companyId": "", "companyCity": "Mason", "companyState": null }];
    //allPlanners1: any = [{"planner":"DANNY"}, {"planner":"Mike"}];

    countryList: any = [];
    cityList: any = [];
    ccList: any = [];
    allCities1: any = [];
    allStates1: any = [];
    allCC1: any = [];
    allPlanners1: any = [];
    allPools: any = [];
    allCCForAdd: any = [];

    allCC = JSON.parse(JSON.stringify(this.allCC1));
    allStates = JSON.parse(JSON.stringify(this.allStates1));
    allCities = JSON.parse(JSON.stringify(this.allCities1));
    allPlanners = JSON.parse(JSON.stringify(this.allPlanners1));

    stateCheckAll: any = false;
    cityCheckAll: any = false;
    ccCheckAll: any = false;
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
    choosenState: any = [];
    choosenCity: any = [];
    choosenCC: any = [];
    choosenPlanner: any = [];

    private sort() {
        this.asc = !this.asc;
        this.data = this.data.reverse();
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

    private masterFilter() {
        var temp = JSON.parse(JSON.stringify(this.result));
        temp = this.filterByState(temp);
        //temp = this.filterByCity(temp);
        temp = this.filterByCC(temp);
        temp = this.filterByPlanner(temp);

        this.data = JSON.parse(JSON.stringify(temp));
        this.resetPage();
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
            this.ccSFlabel = 'Customer\\Company';
            return result;
        } else {
            this.ccSFlabel = this.choosenCC.length + " company(s) selected";
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

    selectVarience(value: Number) {
        this.result = [];
        console.log(this.selectedVarience);
        console.log(this.cityFil + " " + this.stateFil);
        this.selectedVarience = value;
        // ... do other stuff here ...
        for (var j of this.ob.groups) {
            if (value == 0) {
                if (j.variance == 0) {
                    //j.toShow = true;
                    this.result.push(j);

                } else {
                    //j.toShow = false;
                }
            } else if (value == 1) {
                if (j.variance > 0 || j.variance < 0) {
                    //j.toShow = true;
                    this.result.push(j);
                } else {
                    //j.toShow = false;
                }
            } else if (value == -1) {
                //j.toShow = true;
                this.result.push(j);
            }
        }
        //this.data = [];
        this.data = JSON.parse(JSON.stringify(this.result));
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
        column: ["State", "City", "TMW", "Company", "CSR", "Planner", "Req Pool", "Current", "Variance", "Action"],
        groups: [{'variance':0}]
    };

    

    private getAllCities() {
        //alert("hi");
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let options = new RequestOptions({ headers: headers });
        let obj = { 'stateCode': "AR" };
        let url1 = "http://192.168.1.86:81/TrailersCheck.asmx/GetCityByState?stateCode='AR'";
        let url = "http://192.168.1.86:81/TrailersCheck.asmx/GetAllCities";
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
        this.http.get("http://192.168.1.86:81/TrailersCheck.asmx/GetAllStates").map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllStates data recieved"); this.allStates1 = data; this.allStates = JSON.parse(JSON.stringify(this.allStates1)); }, //For Success Response
            (err) => { console.log("getAllStates error recieved"); } //For Error Response
            );
        this.insertSelected(this.allStates);
        this.insertSelected(this.allStates1);
    }

    private getAllCompany() {
        //alert("hi");
        let url = "http://192.168.1.86:81/TrailersCheck.asmx/GetCompanyForFilter"
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllCompany data recieved"); this.allCC1 = data; this.allCC = JSON.parse(JSON.stringify(this.allCC1)); }, //For Success Response
            (err) => { console.log("getAllCompany error recieved"); } //For Error Response
            );
        this.insertSelected(this.allCC);
        this.insertSelected(this.allCC1);
    }

    private getAllCsr() {
        //alert("hi");
        let headers = new Headers({ 'Content-Type': 'text/plain' });
        let options = new RequestOptions({ headers: headers });
        let obj = { 'csr': 0, 'csrCode': 0 };
        let url = "http://192.168.1.86:81/TrailersCheck.asmx/GetAllCsr?csr=0&csrCode=0";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllCsr data recieved"); this.allCsr = data; }, //For Success Response
            (err) => { console.log("getAllCsr error recieved"); } //For Error Response
            );
    }

    private getAllPlanner() {
        //alert("hi");
        let url = "http://192.168.1.86:81/TrailersCheck.asmx/GetAllPlanners?planner=0&plannerCode=0";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("getAllPlanner data recieved"); this.allPlanners1 = data; this.allPlanners = JSON.parse(JSON.stringify(this.allPlanners1));
            }, //For Success Response
            (err) => { console.log("getAllPlanner error recieved"); } //For Error Response
            );
        this.insertSelected(this.allPlanners);
        this.insertSelected(this.allPlanners1);
    }

    private getAllPool() {
        //alert("hi");
        let url = "http://192.168.1.86:81/TrailersCheck.asmx/GetAllPools";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllPlools data recieved"); this.allPools = data; this.ob.groups = data; this.selectVarience(1); this.poolRecieved = true; }, //For Success Response
            (err) => { console.log("getAllPlools error recieved"); } //For Error Response
            );
    }

    private getAllCompanyForAddPool() {
        //alert("hi");
        let url = "http://192.168.1.86:81/TrailersCheck.asmx/GetCompanyForAddPool";
        this.http.get(url).map(res => res.json())
            .subscribe(
            (data) => { console.log("getAllPlools data recieved"); this.allCCForAdd = data; }, //For Success Response
            (err) => { console.log("getAllPlools error recieved"); } //For Error Response
            );
    }

    private resetccFil() {
        this.ccFil = "";
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

    private insertSelected(items: any) {
        for (var i = 0; i < items.length; i++) {
            //items[i]["isSelected"]=false;
        }
        //console.log(JSON.stringify(items));
    }

    constructor(private http: Http) {
        this.ob['groups'] = [];
        this.selectVarience(1);
        //this.getAllCities();
        this.getAllStates();
        this.getAllCompany();
        this.getAllCsr();
        this.getAllPlanner();
        this.getAllPool();
        this.getAllCompanyForAddPool();
    }

    private toEdit(index: any) {
        console.log(index);
        //this.poolToEdit = this.data[index];
        this.poolToEdit = index;
        this.selectedPlanner = this.poolToEdit.planner;
        this.selectedCsr = this.poolToEdit.csr;
        this.updateReqPool = this.poolToEdit.reqPoolCount;
    }

    private updatePool() {
        this.poolToEdit.csr = this.selectedCsr;
        this.poolToEdit.planner = this.selectedPlanner;
        this.poolToEdit.reqPoolCount = this.updateReqPool;
        this.poolToEdit.variance = this.poolToEdit.reqPoolCount - this.poolToEdit.avaiPoolCount

        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        console.log("add: " + this.selectedState);
        console.log("add: " + this.selectedCity);
        var data = { 'pool': this.poolToEdit };
        let url = "http://192.168.1.86:81/TrailersCheck.asmx/updatePool";
        this.http.post(url, data, options).map(res => res.json())
            .subscribe(
            (data) => { console.log("updatePool success msg recieved"); alert("Pool is updated") }, //For Success Response
            (err) => { console.log("getAllPlanner error recieved"); } //For Error Response
            );

    }

    private cancelUpdatePool() {
        this.selectedCsr;
        this.selectedPlanner;
        this.updateReqPool = 0;

    }

    selectCompany(item: any) {
        console.log(item);
        this.selectedCompany = item;
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

        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers });
        var data = {
            'poolID': '',
            'cmpID': '',
            'planner': '',
            'csr': '',
            'reqPoolCount': 0,
            'stateCode': '',
            'stateName': '',
            'companyName': '',
            'cityName': '',
            'avaiPoolCount': 0,
            'variance': 0
        };

        data.cmpID = this.selectedCompany.cmpID;
        data.csr = this.selectedCsr;
        data.planner = this.selectedPlanner;
        data.companyName = this.selectedCompany.cmpName;
        data.reqPoolCount = this.reqPoolQat;
        data.variance = this.reqPoolQat;
        data.cityName = this.selectedCompany.cityName;
        data.stateName = this.selectedCompany.stateName;
        data.stateCode = this.selectedCompany.stateCode;

        console.log("add: " + this.selectedState);
        console.log("add: " + this.selectedCity);

        console.log("add: " + this.ob.groups);
        var payld = {pool:data};
        let url = "http://192.168.1.86:81/TrailersCheck.asmx/insertPool";
        this.http.post(url, payld, options).map(res => res.json())
            .subscribe(
            (data) => {
                console.log("insertPool success recieved");
                alert("New pool inserted");
                this.ob.groups.push(data);
                if (this.selectedVarience == 1 || this.selectedVarience == -1) {
                    this.data.push(data);
                }
            }, //For Success Response
            (err) => { console.log("insertPool error recieved"); alert("Error in adding pool") } //For Error Response
            );
        this.cancelAdd();
        this.resetPage();

    }

    private cancelAdd() {
        this.reqPoolQat = 0;
        this.selectedCompany = { cmpName: "Select a company"};
        this.selectedCsr = "Select a CSR";
        this.selectedPlanner = "Select a planner";

    }

    private toAdd() {
        this.cancelAdd();
    }
}

// This code copy to app.module.ts
