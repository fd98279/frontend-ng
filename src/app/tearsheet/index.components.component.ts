import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IAsset } from '../assets/asset.model';
import { DefaultSortingStrategy, IgxGridComponent, SortingDirection } from '@infragistics/igniteui-angular';

@Component({
    selector: 'index-components-component',
    templateUrl: './index.components.component.html',
    standalone: false
})

export class IndexComponentsComponent implements OnInit {
  @ViewChild('grid1', { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;
  private windowWidth: any;
  // TODO: After ag-grid removed
  @Input() showDelete: boolean;
  @Input() assets: IAsset[];

  constructor(private route: ActivatedRoute,
    private router: Router) {
  }

  public ngOnInit() {
    this.grid1.sortingExpressions = [
      {
        dir: SortingDirection.Desc, fieldName: 'SravzId',
        ignoreCase: true, strategy: DefaultSortingStrategy.instance()
      }
    ];
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: { target: { innerWidth: any; }; }) {
    this.windowWidth = event.target.innerWidth;
  }

  public handleRowSelectionChange(args: { newSelection: { SravzId: any; }[]; }) {
    if (args.newSelection) {
      this.router.navigate(['/asset/details'], { queryParams: { 'asset': args.newSelection[0].SravzId } });
    }
  }

}
