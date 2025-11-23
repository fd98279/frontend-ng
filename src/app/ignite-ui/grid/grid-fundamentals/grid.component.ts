import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    AfterViewInit,
    ElementRef,
    Renderer2,
    OnChanges
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    IgxGridComponent,
    IgxStringFilteringOperand,
    DateRange,
    SortingDirection,
    DefaultSortingStrategy,
    IgxGridCell,
    IgxTabsComponent
} from '@infragistics/igniteui-angular';
import { PersistanceService } from '../../../common/persistance.service';
import { Fundamental } from '../../../fundamentals/fundamental';
declare var TradingView;

@Component({
    selector: 'grid-fundamentals',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class FundamentalsGridComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() fundamentals: Fundamental;
    public minDate: Date;
    public maxDate: Date;
    public range: DateRange;
    public sentimentCellStyle: any;
    stockChart: any;
    @ViewChild('tradingview1') tradingview1?: ElementRef;
    @ViewChild('tradingview') tradingview?: ElementRef;
    @ViewChild('tradingview2') tradingview2?: ElementRef;
    public showSummary: boolean;
    public showChart: boolean;
    @ViewChild('tab') tab?: IgxTabsComponent;


    constructor(private zone: NgZone,
        private _renderer2: Renderer2,
        private persistanceService: PersistanceService) {
            this.showChart = true;
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

    public cellSelection(evt) {
        const cell = evt.cell;
        // this.grid1.selectRows([cell.row.rowID], true);
    }

    public handleRowSelectionChange(args) {
        // this.fundamentalsSelected.emit(args.newSelection);
    }

    public updatedTVSymbolDetails() {
        let script = this._renderer2.createElement('script');
        script.type = `text/javascript`;
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
        script.text = `
        {
            "colorTheme": "${this.persistanceService.get('theme')}",
            "isTransparent": false,
            "largeChartUrl": "",
            "displayMode": "regular",
            "width": "100%",
            "height": "800",
            "symbol": "${this.fundamentals.dataObject.General.Exchange}:${this.fundamentals.dataObject.General.Code}",
            "locale": "en"
          }
        `;
        let childElements = this.tradingview?.nativeElement.childNodes;
        if (childElements != null) {
            for (let child of childElements) {
                this._renderer2.removeChild(this.tradingview?.nativeElement, child);
            }
        }
        this.tradingview?.nativeElement.appendChild(script);

        let script2 = this._renderer2.createElement('script');
        script2.type = `text/javascript`;
        script2.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
        script2.text = `
        {
          "symbol": "${this.fundamentals.dataObject.General.Exchange}:${this.fundamentals.dataObject.General.Code}",
          "width": "100%",
          "colorTheme": "${this.persistanceService.get('theme')}",
          "isTransparent": true,
          "locale": "en"
        }`;
        childElements = this.tradingview2?.nativeElement.childNodes;
        if (childElements != null) {
            for (let child of childElements) {
                this._renderer2.removeChild(this.tradingview2?.nativeElement, child);
            }
        }
        this.tradingview2?.nativeElement.appendChild(script2);


        childElements = this.tradingview2?.nativeElement.childNodes;
        if (childElements != null) {
            for (let child of childElements) {
                this._renderer2.removeChild(this.tradingview2?.nativeElement, child);
            }
        }
        this.stockChart = new TradingView.MediumWidget(
            {
                "symbols": [
                    [
                        "${this.fundamentals.dataObject.General.Name}",
                        `${this.fundamentals.dataObject.General.Code}|1D`
                    ]
                ],
                "chartOnly": false,
                "width": "100%",
                "height": "800",
                "locale": "en",
                "colorTheme": `${this.persistanceService.get('theme')}`,
                "autosize": false,
                "showVolume": false,
                "hideDateRanges": false,
                "scalePosition": "right",
                "scaleMode": "Normal",
                "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
                "fontSize": "10",
                "noTimeScale": false,
                "valuesTracking": "1",
                "chartType": "line",
                "container_id": "tradingview2"
            }
        );

    }
    public ngAfterViewInit() {
        this.updatedTVSymbolDetails()
    }

    ngOnChanges() {
        this.updatedTVSymbolDetails()
    }

    public isArray(obj: any) {
        return Array.isArray(obj);
    }

    public onTabSelected(event): void {
        if (this.tab.selectedIndex == 0) {
            this.showChart = true;
        } else {
            this.showChart = false;
        }
    }
}

