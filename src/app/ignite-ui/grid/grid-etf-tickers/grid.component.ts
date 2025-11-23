import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import {
    IgxGridComponent,
    DateRange,
    SortingDirection,
    DefaultSortingStrategy,
    IgxGridCell
} from '@infragistics/igniteui-angular';
import { IETFTicker } from '../../../etfs/etf';


@Component({
    selector: 'grid-etf-tickers',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class ETFTickersGridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() etfTickers: IETFTicker[];
    @Output() etfTickerSelected: EventEmitter<IETFTicker[]> = new EventEmitter();
    public minDate: Date;
    public maxDate: Date;
    public range: DateRange;
    public sentimentCellStyle: any;

    constructor(private zone: NgZone) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.maxDate.getDay() - 7);
        this.sentimentCellStyle =  {
            color: (rowData, columnKey, cellValue, rowIndex) => {
                if (cellValue) {
                    if (cellValue.compound > 0) {
                        return 'green';
                    } else if (cellValue.compound < 0)  {
                        return 'red';
                    }
                }
            }
        };
    }

    public ngOnInit() {
        this.grid1.sortingExpressions = [
            {
                dir: SortingDirection.Desc, fieldName: 'datetime',
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
    }

    public handleRowSelectionChange(args) {
        setTimeout(() =>  {
            this.etfTickerSelected.emit(args.newSelection);
        }, 1);
    }

    public ngAfterViewInit() {
        // const rowsData = this.grid1.dataRowList.toArray();
        // rowsData.forEach((row) => {
        //   const rowCells: IgxGridCell[] = row.cells.toArray();
        // //   if (rowCells[1].sentiment.compound < 0) {
        // //     row.nativeElement.classList.add('red-background');
        // //   } else if (rowCells[1].sentiment.compound > 0) {
        // //     row.nativeElement.classList.add('green-background');
        // //   }
        // });
      }
}
