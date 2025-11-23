import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'startsWith',
    standalone: false
})
export class AutocompletePipeStartsWith implements PipeTransform {
    public transform(collection: any[], term = '') {
        return collection.filter((item) => item.toString().toLowerCase().startsWith(term.toString().toLowerCase()));
    }
}
