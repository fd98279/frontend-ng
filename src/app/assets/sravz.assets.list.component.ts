import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IAsset } from './asset.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'sravz-asset-list-component',
    templateUrl: './sravz.assets.list.component.html',
    standalone: false
})


export class SravzAssetListComponent {
  public assets: IAsset[];
  public showDetails: boolean;

  constructor(private route: ActivatedRoute) {
    this.showDetails = true;
    this.assets = this.route.snapshot.data['assets'];

  }
}
