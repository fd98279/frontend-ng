import { Component } from '@angular/core';
import { environment } from '../../environments/environment';


@Component({
    templateUrl: './training.component.html',
    providers: [],
    standalone: false
})


export class TrainingComponent {

  public HUGO_URL: string;
  constructor() {
    this.HUGO_URL = environment.HUGO_URL; // '/docs/index.html'; // environment.HUGO_URL
  }

}


