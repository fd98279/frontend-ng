import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    AfterViewInit
} from '@angular/core';
import {
    IgxGridComponent,
    IgxStringFilteringOperand,
    SortingDirection,
    DefaultSortingStrategy,
    IgxGridCell
} from '@infragistics/igniteui-angular';
import { IEarningDetails } from '../../../earnings/earnings';


@Component({
    selector: 'grid-earnings-details',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class EarningsDetailsGridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() earningsDetails: IEarningDetails;
    public sentimentCellStyle: any;

    constructor(private zone: NgZone) {
        this.sentimentCellStyle =  {
            color: (rowData, columnKey, cellValue, rowIndex) => {
                if (cellValue) {
                    if (cellValue.actual > 0) {
                        return 'green';
                    } else if (cellValue.actual < 0)  {
                        return 'red';
                    }
                }
            }
        };
    }

    public ngOnInit() {
        this.grid1.sortingExpressions = [
            {
                dir: SortingDirection.Desc, fieldName: 'date',
                ignoreCase: true, strategy: DefaultSortingStrategy.instance()
            }
        ];
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

    public filter(term, by) {
        if (by === 'code') {
            this.grid1.filter('code', term, IgxStringFilteringOperand.instance().condition('contains'));
        }
        this.grid1.markForCheck();
    }


    public ngAfterViewInit() {
        // const rowsData = this.grid1.dataRowList.toArray();
        // rowsData.forEach((row) => {
        //   const rowCells: IgxGridCell[] = row.cells.toArray();
        // });
      }
}
