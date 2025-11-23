import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IAsset } from '../assets/asset.model';

@Component({
    selector: 'asset-component',
    templateUrl: './asset.component.html',
    standalone: false
})

export class AssetComponent implements OnInit, AfterViewInit {
  @Input() showDelete: boolean;
  @Input() showUpdate: boolean;
  @Input() showDetails: boolean;
  @Input() assets: IAsset[];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onGridReady() {
  }

  public RowDetails(cell) {
    this.router.navigate(['/asset/details'], { queryParams: { 'asset': cell.SravzId } });
  }




}
