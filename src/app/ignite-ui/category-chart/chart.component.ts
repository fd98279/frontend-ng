import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConnectedPositioningStrategy, IgxDropDownComponent, IgxInputGroupComponent, ISelectionEventArgs } from '@infragistics/igniteui-angular';
import { IndexComponent } from '../../fundamentals/fundamental';


@Component({
    selector: 'index-components-category-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    standalone: false
})
export class IndexComponentsCategoryChartComponent implements OnInit {
  @ViewChild(IgxDropDownComponent, { static: true }) public igxDropDown: IgxDropDownComponent;
  @ViewChild('inputGroup', { read: IgxInputGroupComponent, static: true }) public inputGroup: IgxInputGroupComponent;
  @Input() components: IndexComponent[];
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
    { field: 'Waterfall' },

];
  currentDate: Date = new Date();


  constructor() { }

  ngOnInit(): void {

    this.chartData = Array.from(new Set(this.components.map(s => s.Sector)))
      .map(params => {
        return {
          name: params,
          value: this.components.filter(opts => opts.Sector === params).length
        };
      });

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
