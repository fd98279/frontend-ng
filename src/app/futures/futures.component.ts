import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectedPositioningStrategy, IgxDropDownComponent, IgxInputGroupComponent, ISelectionEventArgs } from '@infragistics/igniteui-angular';
import { IFutureStat } from './futures.model';

@Component({
    templateUrl: './futures.component.html',
    standalone: false
})
export class FuturesComponent {
  @ViewChild(IgxDropDownComponent, { static: true }) public igxDropDown: IgxDropDownComponent;
  @ViewChild('inputGroup', { read: IgxInputGroupComponent, static: true }) public inputGroup: IgxInputGroupComponent;
  public futureStats: IFutureStat[];
  chartData: any[] = [];
  type = 'Column';
  public items: { field: string }[] = [
    { field: 'Area' },
    { field: 'Auto' },
    { field: 'Column' },
    { field: 'Line' },
    { field: 'Point' },
    { field: 'Spline' },
    { field: 'SplineArea' },
    { field: 'StepArea' },
    { field: 'StepLine' },
    { field: 'Waterfall' }
];
  brushes: any[];

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.futureStats = this.route.snapshot.data['futureStats'];
    this.chartData = this.futureStats.map(params => {
        return {
          SravzId: params.Name,
          AdjustedCloseVsMinPercent: params.AdjustedCloseVsMinPercent,
          AdjustedCloseVsMeanPercent: params.AdjustedCloseVsMeanPercent,
          AdjustedCloseVsMaxPercent: params.AdjustedCloseVsMaxPercent,
        };
      });
    this.brushes = ["red", "orange", "green"]
  }

  public openDropDown() {
    if (this.igxDropDown.collapsed) {
      this.igxDropDown.open({
        target: this.inputGroup.element.nativeElement,
        modal: false,
        positionStrategy: new ConnectedPositioningStrategy()
      });
    }
  }

  public onDDLSelection(eventArgs: ISelectionEventArgs) {
    this.type = eventArgs.newSelection.value;
  }

}
