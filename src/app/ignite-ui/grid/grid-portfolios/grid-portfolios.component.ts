import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    EventEmitter,
    Output
} from '@angular/core';
import {
    IgxGridComponent,
    IgxNumberSummaryOperand,
    IgxStringFilteringOperand,
    IgxSummaryResult
} from '@infragistics/igniteui-angular';
import { IPortfolio } from '../../../../app/quotes/quotes.model';

@Component({
    selector: 'grid-portfolios',
    styleUrls: ['./grid-portfolios.component.scss'],
    templateUrl: './grid-portfolios.component.html',
    standalone: false
})
export class GridPortfoliosComponent implements OnInit, OnDestroy {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() portfoliosEvents: IPortfolio[];
    @Input() isDeleteIcon: any;
    @Input() isDetailIcon: any;
    @Output() deleteEvent = new EventEmitter<string>();
    @Output() rowDetailEvent = new EventEmitter<string>();

    constructor(private zone: NgZone) { }

    public ngOnInit() {
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

    deleteParent(cell): void {
        this.deleteEvent.next(cell);
    }

    rowDetailParent(cell): void {
        this.rowDetailEvent.next(cell);
    }

    private backgroundClasses = (rowData: any, columnKey: string): boolean => {
        return rowData.pnlpercent > 0;
    }

    private backgroundClasssesPsPercentage = (rowData: any, columnKey: string): boolean => {
        return rowData.pnlpercent < 0;
    }

    // tslint:disable-next-line:member-ordering
    backgroundCell = {
        'showUp': this.backgroundClasses,
        'showDown': this.backgroundClasssesPsPercentage
    };
}
