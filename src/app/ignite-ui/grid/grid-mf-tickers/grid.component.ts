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
    IgxGridCell,
    IRowSelectionEventArgs
} from '@infragistics/igniteui-angular';
import { IMFTicker } from '../../../mutual-funds/mutual-funds';


@Component({
    selector: 'grid-mutualfund-tickers',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class MutualFundsGridComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('grid1', { read: IgxGridComponent, static: false })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() mfTickers: IMFTicker[];
    @Input() activeTabIndex: number = 0;
    @Output() mfTickerSelected: EventEmitter<IMFTicker[]> = new EventEmitter();
    public minDate: Date;
    public maxDate: Date;
    public range: DateRange;

    public get rowSelection(): string {
        return this.activeTabIndex === 1 ? 'multiple' : 'single';
    }

    public get maxRowSelectionCount(): number {
        return this.activeTabIndex === 1 ? 5 : 1;
    }

    constructor(private zone: NgZone) {

    }

    public ngOnInit() {
        if (this.grid1) {
            this.grid1.sortingExpressions = [
                {
                    dir: SortingDirection.Desc, fieldName: 'Code',
                    ignoreCase: true, strategy: DefaultSortingStrategy.instance()
                }
            ];
        }
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

    public cellSelection(evt) {
        const cell = evt.cell;
        if (this.activeTabIndex === 1) {
            const currentSelections = this.grid1.selectedRows;
            if (currentSelections.length < 5 || currentSelections.includes(cell.row.rowID)) {
                this.grid1.selectRows([cell.row.rowID], true);
            }
        } else {
            this.grid1.selectRows([cell.row.rowID], true);
        }
    }

    public handleRowSelectionChange(event: IRowSelectionEventArgs) {
        if (this.rowSelection === 'multiple') {
            const grid = event.owner;
            const currentSelection = this.grid1.selectedRows;
            const added = event.added || [];
            if (added.length + currentSelection.length > this.maxRowSelectionCount) {
                event.cancel = true;
            }
        }
        setTimeout(() => {
            this.mfTickerSelected.emit(event.newSelection);
        }, 1);
    }

    public ngAfterViewInit() {
    }

    /**
     * Unselect a ticker from the grid by SravzId
     */
    public unselectTicker(ticker: IMFTicker) {
        if (!this.grid1 || !ticker) return;
        const rowId = ticker.SravzId;
        this.grid1.deselectRows([rowId]);
        // this.grid1.getRowByKey(ticker.SravzId).delete();
    }
}
