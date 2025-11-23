import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'contains',
    standalone: false
})
export class AutocompletePipeContains implements PipeTransform {

  public transform = (movies: string[], term = '') => this.filterMovies(movies, term);

  protected filterMovies = (movies: string[], term: string) =>
    movies.filter((movie: string) =>
      movie.toString().toLowerCase().indexOf(term.toString().toLowerCase()) > -1)
}
