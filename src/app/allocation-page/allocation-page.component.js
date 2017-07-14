"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AllocationPageComponent = (function () {
    function AllocationPageComponent() {
        this.name = 'AllocationPageComponent';
        this.data = {
            rows: [
                ["Available", "2343443", "05-20-2017 08:30", "Chattanooga ", "Walmart", "Atlanta,GA", "Buford,GA", "SOLO", "2342345", "SID", "all set",],
                ["Available", "2343444", "05-20-2017 09:30", "West depot", "Fedex", "Ontario OH", "Bufford,GA", "SOLO", "2342345", "SID", "all set",],
                ["Available", "2343445", "05-20-2017 10:30", "CTG ", "VH Transport", "Bentonville,AR", "Bufford,GA", "SOLO", "2342345", "SID", "all set",]
            ],
            column: ["Status", "Order#", "Order date", "Origin name", "Bill to name", "Origin city", "Destination city", "Service", "Ref#", "Ref type", "Order remark", "Action"]
        };
    }
    return AllocationPageComponent;
}());
AllocationPageComponent = __decorate([
    core_1.Component({
        selector: 'allocation-page',
        templateUrl: 'allocation-page.component.html',
        styleUrls: ['allocation-page.component.css'],
        moduleId: module.id
    })
], AllocationPageComponent);
exports.AllocationPageComponent = AllocationPageComponent;
// This code copy to app.module.ts
//# sourceMappingURL=allocation-page.component.js.map