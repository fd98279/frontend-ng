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
    ElementRef,
    AfterViewInit
} from '@angular/core';
import {
    DefaultSortingStrategy,
    IgxDropDownComponent,
    IgxGridComponent,
    IgxInputGroupComponent,
    IgxStringFilteringOperand,
    SortingDirection
} from '@infragistics/igniteui-angular';
import { IEvent } from '../../../economics/economic.model';

@Component({
    selector: 'grid-economic-calender',
    styleUrls: ['./grid-economic-calender.component.scss'],
    templateUrl: './grid-economic-calender.component.html',
    standalone: false
})
export class GridEconomicCalenderComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(IgxDropDownComponent) public igxDropDown: IgxDropDownComponent;
    @ViewChild('inputGroup', { read: IgxInputGroupComponent }) public inputGroup: IgxInputGroupComponent;
    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    public items: Array<String> = [];
    public itemSelected;
    public rippleColor = 'grey';
    public displayTime = 'today';
    public displayTimes;
    private windowWidth: any;
    @Input() calenderEvents: IEvent[];


    constructor(private zone: NgZone) { }

    public ngOnInit() {
        this.items = [...new Set(this.calenderEvents.map(item => item.country))];
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

    ngAfterViewInit(): void {
        // this.igxDropDown.selectItem("US");
        this.igxDropDown.setSelectedItem(this.items.indexOf("US"))
    }

    public ngOnDestroy() {
    }


    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

    public filter(term, by, event) {
        if (by === 'country') {
            if (term == null) {
                if (event.value) {
                    this.grid1.filter('country', event.value, IgxStringFilteringOperand.instance().condition('contains'), true);
                }
            } else {
                this.grid1.filter('country', term, IgxStringFilteringOperand.instance().condition('contains'), true);
            }
        } else if (by === 'type') {
            this.grid1.filter('type', term, IgxStringFilteringOperand.instance().condition('contains'), true);
        }
        this.grid1.markForCheck();
    }

    public selectEconomicEvents(event) {
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