import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {
    transform(objects: any, param?: any): any {
        //check if search term is undef
        if (param === undefined) {
            return objects;
        }
        return objects.filter(function (item: any) {
            //console.log(key + " " + item[key]);
            var check = item;
            return check.toLowerCase().includes(param.toLowerCase());
        })
    }
}

// This code copy to app.module.ts
//