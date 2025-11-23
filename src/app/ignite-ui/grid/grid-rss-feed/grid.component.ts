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
    Pipe,
    PipeTransform,
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
import { IRSSFeedEntry } from '../../../feed/feed';


@Component({
    selector: 'grid-rss-feed',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class RSSFeedGridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() rssFeedEntries: IRSSFeedEntry[];
    @Output() rssFeedEntrySelected: EventEmitter<IRSSFeedEntry[]> = new EventEmitter();
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

    public filter(term, by) {
        if (by === 'country') {
            this.grid1.filter('Country', term, IgxStringFilteringOperand.instance().condition('contains'));
        } else if (by === 'name') {
            this.grid1.filter('Name', term, IgxStringFilteringOperand.instance().condition('contains'));
        }
        this.grid1.markForCheck();
    }

    public cellSelection(evt) {
        const cell = evt.cell;
        this.grid1.selectRows([cell.row.rowID], true);
    }

    public handleRowSelectionChange(args) {
        this.rssFeedEntrySelected.emit(args.newSelection);
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

@Pipe({
    name: 'withoutTownFrom',
    standalone: false
})
export class PipeWithoutTownFrom implements PipeTransform {
    public transform(collection: any[], townFrom: string) {
        return collection.filter((item) => item !== townFrom);
    }
}
