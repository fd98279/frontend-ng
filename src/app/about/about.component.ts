import { Component } from '@angular/core';
import { socialMedia, logos } from '@igniteui/material-icons-extended';
import { IgxIconService } from '@infragistics/igniteui-angular';

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    providers: [],
    standalone: false
})


export class AboutComponent {

  addIcons() {
    for (let icon of [...socialMedia, ...logos]) {
      this.iconService.addSvgIconFromText(icon.name, icon.value, 'imx-icons');
    }
  }

  public todayDate: any;
  constructor(private iconService: IgxIconService) {
    this.todayDate = Date.now();
  }

  ngOnInit(): void {
    this.addIcons();
  }

}


