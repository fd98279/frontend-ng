import { Component, OnInit } from '@angular/core';
import { IAsset } from '../assets/asset.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './crypto.component.html',
    standalone: false
})
export class CryptoComponent {

  public assets: IAsset[];
  public showDetails: boolean;

  constructor(private route: ActivatedRoute) {
    this.showDetails = true;
    this.assets = this.route.snapshot.data['assets'];
  }

}
