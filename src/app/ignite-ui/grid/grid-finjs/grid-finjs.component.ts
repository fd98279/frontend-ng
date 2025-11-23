/* eslint-disable max-len */
import { ElementRef, Inject, Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild, AfterViewInit, ChangeDetectorRef, DOCUMENT } from '@angular/core';

import {
    IgxGridComponent,
    SortingDirection,
    DefaultSortingStrategy,
    IGridKeydownEventArgs,
    OverlaySettings,
    IgxOverlayOutletDirective
} from '@infragistics/igniteui-angular';
import { SignalRService } from './services/signal-r.service';
import { AnalyticsService } from '../../../analytics.service';
import { SocketPortfolio } from '../../../app.module';
import { IRealtimeQuote } from '../../../analytics.model';

@Component({
    selector: 'app-finjs-grid',
    templateUrl: './grid-finjs.component.html',
    styleUrls: ['./grid-finjs.component.scss'],
    standalone: false
})
export class GridFinJSComponent implements AfterViewInit, OnDestroy {

    constructor(private el: ElementRef, @Inject(DOCUMENT) private document: Document,
        public dataService: SignalRService, public analyticsSerivce: AnalyticsService,
        private socketService: SocketPortfolio, private ref: ChangeDetectorRef) { }

    public options = {
        /**
        * Decimal representation options, specified by a string in the following format:
        * `{minIntegerDigits}`.`{minFractionDigits}`-`{maxFractionDigits}`.
        * `minIntegerDigits`: The minimum number of integer digits before the decimal point. Default is 1.
        * `minFractionDigits`: The minimum number of digits after the decimal point. Default is 0.
        * `maxFractionDigits`: The maximum number of digits after the decimal point. Default is 3.
        */
        digitsInfo: '2.2-3'
    };
    public formatPercentOptions = this.options;

    get gridWrapper(): HTMLElement {
        return this.el.nativeElement.querySelector('.grid__wrapper') as HTMLElement;
    }

    get controlsWrapper(): HTMLElement {
        return this.document.body.querySelector('.controls-wrapper') as HTMLElement;
    }
    @ViewChild('grid1', { static: true }) public grid: IgxGridComponent;
    @ViewChild(IgxOverlayOutletDirective, { static: true }) public outlet: IgxOverlayOutletDirective;
    @Output() public selectedDataChanged = new EventEmitter<any>();
    @Output() public keyDown = new EventEmitter<any>();
    @Output() public chartColumnKeyDown = new EventEmitter<any>();

    public selectionMode = 'multiple';
    public volume = 1000;
    public frequency = 500;
    public data$: any;
    public data: IRealtimeQuote[];
    public columnFormat = { digitsInfo: '1.3-3' };
    public columnFormatChangeP = { digitsInfo: '3.3-3' };
    public showToolbar = true;
    public isLoading = true;
    public overlaySettings: OverlaySettings = {
        modal: false
    };
    /** Grid CellStyles and CellClasses */
    private negative = (rowData: any): boolean => rowData['dc'] < 0;
    private positive = (rowData: any): boolean => rowData['dc'] > 0;
    private changeNegative = (rowData: any): boolean => rowData['dc'] < 0 && rowData['dc'] > -1;
    private changePositive = (rowData: any): boolean => rowData['dc'] > 0 && rowData['dc'] < 1;
    private strongPositive = (rowData: any): boolean => rowData['dc'] >= 1;
    private strongNegative = (rowData: any, key: string): boolean => rowData['dc'] <= -1;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    // tslint:disable-next-line:member-ordering
    public trends = {
        changeNeg: this.changeNegative,
        changePos: this.changePositive,
        negative: this.negative,
        positive: this.positive,
        strongNegative: this.strongNegative,
        strongPositive: this.strongPositive
    };

    // eslint-disable-next-line @typescript-eslint/member-ordering
    public trendsChange = {
        changeNeg2: this.changeNegative,
        changePos2: this.changePositive,
        strongNegative2: this.strongNegative,
        strongPositive2: this.strongPositive
    };


    public subscribeToSocket() {
        setTimeout(() => {
            this.analyticsSerivce.subscribeToRealTimeQuote();
        }, 1);
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.analyticsSerivce.subscribeToRealTimeQuote();
            this.socketService.on('connect', this.analyticsSerivce.subscribeToRealTimeQuote);
        }, 1);
        // this.dataService.getData(this.volume);
        this.overlaySettings.outlet = this.outlet;
        // this.data$ = this.dataService.data;
        this.data$ = this.analyticsSerivce.realtimeQuotesData;
        this.data$.subscribe((data) => {
            switch (data.type) {
                case "insert":
                    this.isLoading = false;
                    // break;
                    this.grid.addRow(data.quote)
                    break;
                case "update":
                    this.grid.updateRow(data.quote, data.quote.id);
                    break;
                default:
                    break;
            }
        });
        // Since the view is updated after change detection, request another change detection
        this.ref.detectChanges();
        // Set initially grouped columns
        // this.grid.groupingExpressions = [
        // {
        //     dir: SortingDirection.Desc,
        //     fieldName: 'ty',
        //     ignoreCase: false,
        //     strategy: DefaultSortingStrategy.instance()
        // },
        // ];
    }

    /** Event Handlers and Methods */
    public onChange() {
        // if (this.grid.groupingExpressions.length > 0) {
        //     this.grid.groupingExpressions = [];
        // } else {
        //     this.grid.groupingExpressions = [
        //     {
        //         dir: SortingDirection.Desc,
        //         fieldName: 'ty',
        //         ignoreCase: false,
        //         strategy: DefaultSortingStrategy.instance()
        //     },
        //     ];
        // }
    }

    public rowSelectionChanged(args) {
        this.grid.clearCellSelection();
        this.selectedDataChanged.emit(args.newSelection);
    }

    public toggleGrouping() {
        if (this.grid.groupingExpressions.length > 0) {
            this.grid.groupingExpressions = [];
        } else {
            this.grid.groupingExpressions = [
                {
                    dir: SortingDirection.Desc,
                    fieldName: 'ty',
                    ignoreCase: false,
                    strategy: DefaultSortingStrategy.instance()
                },
            ];
        }
    }

    public gridKeydown(evt) {
        if (this.grid.selectedRows.length > 0 &&
            evt.shiftKey === true && evt.ctrlKey === true && evt.key.toLowerCase() === 'd') {
            evt.preventDefault();
            this.keyDown.emit();
        }
    }

    public customKeydown(args: IGridKeydownEventArgs) {
        // const target: CellType = args.target as CellType;
        // const evt: KeyboardEvent = args.event as KeyboardEvent;
        // const type = args.targetType;

        // if (type === 'dataCell' && target.column.field === 'Chart' && evt.key.toLowerCase() === 'enter') {
        //     this.grid.selectRows([target.row.rowID], true);
        //     this.chartColumnAction(target);
        // }
    }

    public chartColumnAction(target) {
        this.chartColumnKeyDown.emit(target.row.data);
    }

    public ngOnDestroy() {
        this.analyticsSerivce.unsubscribeToRealTimeQuote();
        this.socketService.removeListener('connect', this.subscribeToSocket);
    }
}
