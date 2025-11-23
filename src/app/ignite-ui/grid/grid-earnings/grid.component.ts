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
    IgxStringFilteringOperand,
    DateRange,
    SortingDirection,
    DefaultSortingStrategy,
    IgxGridCell,
    IgxDropDownComponent,
    IgxInputGroupComponent
} from '@infragistics/igniteui-angular';
import { IEarnings } from '../../../earnings/earnings';


@Component({
    selector: 'grid-earnings',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class EarningsGridComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(IgxDropDownComponent) public igxDropDown: IgxDropDownComponent;
    @ViewChild('inputGroup', { read: IgxInputGroupComponent }) public inputGroup: IgxInputGroupComponent;
    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() earnings: IEarnings[];
    @Output() earningsSelected: EventEmitter<IEarnings[]> = new EventEmitter();
    public minDate: Date;
    public maxDate: Date;
    public range: DateRange;
    public sentimentCellStyle: any;
    public displayTime = 'today';
    public displayTimes;
    public itemSelected;
    public items: Array<String> = [];

    constructor(private zone: NgZone) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.maxDate.getDay() - 7);
        this.sentimentCellStyle = {
            color: (rowData, columnKey, cellValue, rowIndex) => {
                if (cellValue) {
                    if (cellValue.actual > 0) {
                        return 'green';
                    } else if (cellValue.actual < 0) {
                        return 'red';
                    }
                }
            }
        };
    }

    public ngOnInit() {
        this.items = [...new Set(this.earnings.map(item => {
            try {
                return item.code.split(".")[1]; // Code is in ticker.country format
            } catch {
            }
        }))];
        this.grid1.sortingExpressions = [
            {
                dir: SortingDirection.Desc, fieldName: 'report_date',
                ignoreCase: true, strategy: DefaultSortingStrategy.instance()
            }
        ];
        this.displayTimes = [
            { label: 'today', selected: this.displayTime === 'today', togglable: true },
            { label: 'tomorrow', selected: this.displayTime === 'tomorrow', togglable: true },
            { label: 'yesterday', selected: this.displayTime === 'yesterday', togglable: true },
            { label: 'week', selected: this.displayTime === 'week', togglable: true }
        ];
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }
/*
    public filter(term, by) {
        if (by === 'code') {
            this.grid1.filter('code', term, IgxStringFilteringOperand.instance().condition('contains'));
        }
        this.grid1.markForCheck();
    } */

    public cellSelection(evt) {
        const cell = evt.cell;
        // this.grid1.selectRows([cell.row.rowID], true);
    }

    public handleRowSelectionChange(args) {
        setTimeout(() => {
            this.earningsSelected.emit(args.newSelection);
        }, 1);
    }

    public ngAfterViewInit() {
        this.igxDropDown.setSelectedItem(this.items.indexOf("US"))
        // const rowsData = this.grid1.dataRowList.toArray();
        // rowsData.forEach((row) => {
        //   const rowCells: IgxGridCell[] = row.cells.toArray();
        // });
    }


    public filter(term, by, event) {
        if (by === 'country') {
            if (term == null) {
                if (event.value) {
                    this.grid1.filter('code', event.value, IgxStringFilteringOperand.instance().condition('contains'), true);
                }
            } else {
                this.grid1.filter('code', term, IgxStringFilteringOperand.instance().condition('contains'), true);
            }
        } else if (by === 'code') {
            this.grid1.filter('code', term, IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        this.grid1.markForCheck();
    }


    public selectEconomicEvents(event) {
        this.displayTime = this.displayTimes[event.index].label;
        if (this.displayTime === 'today') {
            this.grid1.filter('report_date', new Date().toISOString().slice(0, 10), IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        else if (this.displayTime == 'yesterday') {
            this.grid1.filter('report_date', new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10), IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        else if (this.displayTime == 'week') {
            this.grid1.clearFilter('report_date');
        }
        else if (this.displayTime == 'tomorrow') {
            this.grid1.filter('report_date', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10), IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        this.grid1.markForCheck();
    }


    private backgroundClasses = (rowData: any, columnKey: string): boolean => {
        return rowData.difference > 0;
    }

    private backgroundClasssesPsPercentage = (rowData: any, columnKey: string): boolean => {
        return rowData.difference < 0;
    }

    // tslint:disable-next-line:member-ordering
    backgroundCell = {
        'showUp': this.backgroundClasses,
        'showDown': this.backgroundClasssesPsPercentage
    };
}
