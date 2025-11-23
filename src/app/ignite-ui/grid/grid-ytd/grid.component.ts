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
    DateRange,
    SortingDirection,
    DefaultSortingStrategy,
    IgxGridCell
} from '@infragistics/igniteui-angular';
import { DbQueryResultItem, DbQueryResultResponse, QuoteStats, YTD } from '../../../ytd/ytd';
import { IgniteUIService } from '../../services/ignite-ui-service';


@Component({
    selector: 'grid-ytd',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class YTDGridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    public ytds: YTD[];
    public stats: QuoteStats[];
    public quotes_stats_latest: DbQueryResultItem[];
    public minDate: Date;
    public maxDate: Date;
    public range: DateRange;
    public sentimentCellStyle: any;
    public options = {
        digitsInfo: '1.4-4',
    };
    public formatOptions = this.options;

    constructor(private igniteUIService: IgniteUIService) {
        this.ytds = [];
        this.stats = [];
        this.quotes_stats_latest = [];
        this.igniteUIService.getMessage().subscribe(
            (message: { MessageID: any; Message: any[]; }) => {
                switch (message.MessageID) {
                    case this.igniteUIService.MESSAGE_IDS['SHOW_YTD_DATA']: {
                        if (message.Message) {
                            const newData = [];
                            this.ytds.map(item => newData.push(item));
                            (message.Message as YTD[]).map((item: YTD) => {
                                if (!this.ytds.map(ytd_item => ytd_item.Code).includes(item.Code)) {
                                    newData.push(item);
                                }
                            });
                            this.ytds = newData;
                        } else {
                            this.ytds = [];
                        }
                        break;
                    }
                    case this.igniteUIService.MESSAGE_IDS['SHOW_QUOTES_STATS_DATA']: {
                        if (message.Message) {
                            const newData = [];
                            this.stats.map(item => newData.push(item));
                            (message.Message as QuoteStats[]).map((item: QuoteStats) => {
                                if (!this.stats.map(stats_item => stats_item.sravz_id).includes(item.sravz_id)) {
                                    newData.push(item);
                                }
                            });
                            this.stats = newData;
                        } else {
                            this.stats = [];
                        }
                        break;
                    }
                    case this.igniteUIService.MESSAGE_IDS['SHOW_QUOTES_LATEST_STATS']: {
                        if (message.Message) {
                            const newData = [];
                            this.quotes_stats_latest.map(item => newData.push(item));
                            (message.Message as unknown as DbQueryResultResponse).DbQueryResult.map((item: DbQueryResultItem) => {
                                if (!this.quotes_stats_latest.map(stats_item => stats_item.sravz_id).includes(item.sravz_id)) {
                                    newData.push(item);
                                }
                            });
                            this.quotes_stats_latest = newData;
                        } else {
                            this.quotes_stats_latest = [];
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        );

        this.sentimentCellStyle = {
            color: (rowData, columnKey, cellValue) => {
                if (cellValue) {
                    if (cellValue > 0) {
                        return 'green';
                    } else if (cellValue < 0) {
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

    public cellSelection(evt) {
        // this.grid1.selectRows([cell.row.rowID], true);
    }

    public handleRowSelectionChange() {
        // this.fundamentalsSelected.emit(args.newSelection);
    }

    public ngAfterViewInit() {
        // const rowsData = this.grid1.dataRowList.toArray();
        // rowsData.forEach((row) => { });
    }

    public isArray(obj: any) {
        return Array.isArray(obj);
    }

    public reset() {
        this.ytds = [];
        this.stats = [];
        this.quotes_stats_latest = [];
    }
}
