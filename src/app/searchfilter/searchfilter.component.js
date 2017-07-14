"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SearchfilterComponent = (function () {
    function SearchfilterComponent() {
        this.search = '';
        this.selectedItemChange = new core_1.EventEmitter();
    }
    SearchfilterComponent.prototype.selectCompany = function (item) {
        console.log("searchFilter: " + JSON.stringify(item[this.key]));
        this.selectedItem = item[this.key];
        this.selectedItemChange.emit(this.selectedItem);
    };
    SearchfilterComponent.prototype.resetSearch = function () {
        this.search = "";
    };
    return SearchfilterComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SearchfilterComponent.prototype, "items", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SearchfilterComponent.prototype, "selectedItem", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SearchfilterComponent.prototype, "key", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SearchfilterComponent.prototype, "selectedItemChange", void 0);
SearchfilterComponent = __decorate([
    core_1.Component({
        selector: 'searchfilter',
        templateUrl: 'searchfilter.component.html',
        styleUrls: ['searchfilter.component.css'],
        moduleId: module.id
    })
], SearchfilterComponent);
exports.SearchfilterComponent = SearchfilterComponent;
// This code copy to app.module.ts
//# sourceMappingURL=searchfilter.component.js.map