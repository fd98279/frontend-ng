import { Component } from '@angular/core';

@Component({
    template: `
    <h1 class="errorMessage">404: Unauthorized</h1>
  `,
    styles: [`
    .errorMessage {
      margin-top:150px;
      font-size: 170px;
      text-align: center;
    }`],
    selector: "Error401Component",
    standalone: false
})
export class Error401Component {
  constructor() {

  }

}
