import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterArray',
    pure: false,
    standalone: false
})
export class FilterArrayPipe implements PipeTransform {
  transform(items: any[], key: string, value: any): any[] {
    if (!items || (!key && !value)) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: any) => this.applyFilter(item, key, value));
  }

  /**
   * Perform the filtering.
   */
  applyFilter(item: any, key: string, value: any): boolean {
      if (item[key].toLowerCase().indexOf(value[key].toLowerCase()) === -1) {
        return false;
      }
      return true;
    // for (const field in filter) {
    //   if (filter[field]) {
    //     if (typeof filter[field] === 'string') {
    //       if (book[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
    //         return false;
    //       }
    //     } else if (typeof filter[field] === 'number') {
    //       if (book[field] !== filter[field]) {
    //         return false;
    //       }
    //     }
    //   }
    // }
    // return true;
  }
}
