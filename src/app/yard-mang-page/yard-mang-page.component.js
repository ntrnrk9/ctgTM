"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var YardMangPageComponent = (function () {
    function YardMangPageComponent() {
        this.name = 'YardMang-pageComponent';
        this.config = {
            rows: [[
                    "45833",
                    "TRS",
                    "Chattanooga West yard",
                    "05/16/2017  10:52:00",
                    "5 Days, 12 hrs 32 min",
                    "05/17/2017  11:52:00"
                ], [
                    "44422",
                    "TRS",
                    "Nashville",
                    "05/18/2017  09:32:01",
                    "3 Days, 07 hrs 32 min",
                    "05/19/2017  02:32:01"
                ], [
                    "45833",
                    "TR3",
                    "Nashville",
                    "05/16/2017  10:52:00",
                    "5 Days, 12 hrs 32 min",
                    "05/17/2017  11:52:00"
                ], [
                    "44742",
                    "TR1",
                    "Atlanta",
                    "05/20/2017  12:56:03",
                    "2 Days, 09 hrs 32 min",
                    "05/21/2017  12:56:03"
                ], [
                    "R3371",
                    "TR7",
                    "Atlanta",
                    "05/21/2017  07:48:04",
                    "1 Days, 06 hrs 32 min",
                    "05/16/2017  07:48:04"
                ], [
                    "44561",
                    "TR9",
                    "Atlanta",
                    "05/21/2017  02:18:05",
                    "1 Days, 01 hrs 32 min",
                    "05/16/2017  04:48:05"
                ]],
            column: ["Trailer id", "Trailer name", "Trailer location", "Timestamp time at yard", "Idle time at yard", "Last inspection timestamp", "Action"]
        };
    }
    return YardMangPageComponent;
}());
YardMangPageComponent = __decorate([
    core_1.Component({
        selector: 'yard-mang-page',
        templateUrl: 'yard-mang-page.component.html',
        styleUrls: ['yard-mang-page.component.css'],
        moduleId: module.id
    })
], YardMangPageComponent);
exports.YardMangPageComponent = YardMangPageComponent;
// This code copy to app.module.ts
//# sourceMappingURL=yard-mang-page.component.js.map