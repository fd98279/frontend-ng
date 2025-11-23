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
    SortingDirection,
    DefaultSortingStrategy,
    IgxGridCell
} from '@infragistics/igniteui-angular';
import { Fundamental } from '../../../etfs/etf';


@Component({
    selector: 'grid-etf',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class ETFGridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() fundamentals: Fundamental;

    constructor(private zone: NgZone) {
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


    public cellSelection(evt) {
        const cell = evt.cell;
        // this.grid1.selectRows([cell.row.rowID], true);
    }

    public handleRowSelectionChange(args) {
        // this.fundamentalsSelected.emit(args.newSelection);
    }

    public ngAfterViewInit() {
        // const rowsData = this.grid1.dataRowList.toArray();
        // rowsData.forEach((row) => {
        //     const rowCells: IgxGridCell[] = row.cells.toArray();
        // });
    }

    public isArray(obj: any) {
        return Array.isArray(obj);
    }
}
