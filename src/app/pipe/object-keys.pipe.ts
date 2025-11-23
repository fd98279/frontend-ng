import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'objectKeys',
    standalone: false
})
export class ObjectKeysPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return Object.keys(value);
    }
    return [];
  }
}
