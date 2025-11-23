import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    PipeTransform,
    Pipe,
    ElementRef
} from '@angular/core';
import {
    DefaultSortingStrategy,
    IgxDropDownComponent,
    IgxGridComponent,
    IgxInputGroupComponent,
    IgxStringFilteringOperand,
    SortingDirection
} from '@infragistics/igniteui-angular';
import { IEvent, IUsFedCalendar,  } from '../../../economics/economic.model';

@Component({
    selector: 'grid-usfed-calender',
    styleUrls: ['./grid-usfed-calender.component.scss'],
    templateUrl: './grid-usfed-calender.component.html',
    standalone: false
})
export class GridUsFedCalenderComponent implements OnInit, OnDestroy {
    @ViewChild(IgxDropDownComponent) public igxDropDown: IgxDropDownComponent;
    @ViewChild('inputGroup', { read: IgxInputGroupComponent }) public inputGroup: IgxInputGroupComponent;
    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    public rippleColor = 'grey';
    public displayTime = 'today';
    public displayTimes;
    private windowWidth: any;
    @Input() calenderEvents: IUsFedCalendar;


    constructor(private zone: NgZone) { }

    public ngOnInit() {
        this.grid1.sortingExpressions = [
            {
                dir: SortingDirection.Desc, fieldName: 'date',
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

    public filter(term, by, event) {
         if (by === 'type') {
            this.grid1.filter('type', term, IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        this.grid1.markForCheck();
    }

    public selectDensity(event) {
        this.displayTime = this.displayTimes[event.index].label;
        if (this.displayTime === 'today') {
            this.grid1.filter('date', new Date().toISOString().slice(0, 10), IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        else if (this.displayTime == 'yesterday') {
            this.grid1.filter('date', new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10), IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        else if (this.displayTime == 'week') {
            this.grid1.clearFilter('date');
        }
        else if (this.displayTime == 'tomorrow') {
            this.grid1.filter('date', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10), IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        this.grid1.markForCheck();
    }

    private backgroundClasses = (rowData: any, columnKey: string): boolean => {
        return rowData.change > 0;
    }

    private backgroundClasssesPsPercentage = (rowData: any, columnKey: string): boolean => {
        return rowData.change < 0;
    }

    // tslint:disable-next-line:member-ordering
    backgroundCell = {
        'showUp': this.backgroundClasses,
        'showDown': this.backgroundClasssesPsPercentage
    };

}

@Pipe({
    name: 'startsWith',
    standalone: false
})
export class AutocompletePipeStartsWith implements PipeTransform {
    public transform(collection: any[], term = '') {
        return collection.filter((item) => item.toString().toLowerCase().startsWith(term.toString().toLowerCase()));
    }
}