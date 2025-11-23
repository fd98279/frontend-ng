import { Component } from '@angular/core';


@Component({
    templateUrl: './careers.component.html',
    providers: [],
    standalone: false
})


export class CareersComponent {

  public CAREERS_URL: string;
  constructor() {
    this.CAREERS_URL =  'https://jobs.sravz.com'; // environment.HUGO_URL; // '/docs/index.html'; // environment.HUGO_URL
  }

}


