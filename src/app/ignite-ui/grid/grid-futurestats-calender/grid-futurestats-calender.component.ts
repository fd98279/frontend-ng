import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input} from '@angular/core';
import {
    DefaultSortingStrategy,
    IgxDropDownComponent,
    IgxGridComponent,
    IgxInputGroupComponent,
    IgxStringFilteringOperand,
    SortingDirection
} from '@infragistics/igniteui-angular';
import { IFutureStat } from '../../../futures/futures.model';

@Component({
    selector: 'grid-futurestats-calender',
    styleUrls: ['./grid-futurestats-calender.component.scss'],
    templateUrl: './grid-futurestats-calender.component.html',
    standalone: false
})
export class GridFutureStatsCalenderComponent implements OnInit, OnDestroy {
    @ViewChild(IgxDropDownComponent) public igxDropDown: IgxDropDownComponent;
    @ViewChild('inputGroup', { read: IgxInputGroupComponent }) public inputGroup: IgxInputGroupComponent;
    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    public rippleColor = 'grey';
    public displayTime = 'today';
    public displayTimes;
    private windowWidth: any;
    @Input() calenderEvents: IFutureStat;


    constructor(private zone: NgZone) { }

    public ngOnInit() {
        this.grid1.sortingExpressions = [
            {
                dir: SortingDirection.Desc, fieldName: 'FromDate',
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

    public filter(term, by, event) {
         if (by === 'Name') {
            this.grid1.filter('Name', term, IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        this.grid1.markForCheck();
    }

    public selectDensity(event) {
        this.displayTime = this.displayTimes[event.index].label;
        if (this.displayTime === 'today') {
            this.grid1.filter('FromDate', new Date().toISOString().slice(0, 10), IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        else if (this.displayTime == 'yesterday') {
            this.grid1.filter('FromDate', new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10), IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        else if (this.displayTime == 'week') {
            this.grid1.clearFilter('FromDate');
        }
        this.grid1.markForCheck();
    }

    // public  rowStyles = {
    //     background: (row: RowType) => (+row.data['AdjustedCode'] <=  +row.data['Max ']  && +row.data['AdjustedClose '] > +row.data['75%']) ? '#90EE90' : '#00000000',
    // };

    private showGreen = (rowData: any, columnKey: string): boolean => {
        return rowData['AdjustedClose']  <=  rowData['max']  && rowData['AdjustedClose'] > rowData['75%'];
    }

    private showAmber  = (rowData: any, columnKey: string): boolean => {
        return rowData['AdjustedClose']  <=  rowData['75%']  && rowData['AdjustedClose'] > rowData['50%'];
    }

    private showOrange = (rowData: any, columnKey: string): boolean => {
        return rowData['AdjustedClose']  <=  rowData['50%']  && rowData['AdjustedClose'] > rowData['25%'];
    }

    private showRed  = (rowData: any, columnKey: string): boolean => {
        return rowData['AdjustedClose']  <=  rowData['25%']  && rowData['AdjustedClose'] >= rowData['min'];
    }


    // tslint:disable-next-line:member-ordering
    backgroundCell = {
        'showGreen': this.showGreen,
        'showRed': this.showRed,
        'showAmber': this.showAmber,
        'showOrange': this.showOrange,
    };

}
