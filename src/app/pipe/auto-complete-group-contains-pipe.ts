import { Pipe, PipeTransform } from '@angular/core';
import { AutocompletePipeContains } from './auto-complete-contains-pipe';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'groupContains',
    standalone: false
})
export class AutocompleteGroupPipeContains extends AutocompletePipeContains {

  public transform = (towns: any[], term = '') => this.filterTowns(towns, term);

  private filterTowns = (towns: any[], term = '') =>
    towns.filter((town) => this.filterMovies(town.cinemas, term).length > 0)
}
