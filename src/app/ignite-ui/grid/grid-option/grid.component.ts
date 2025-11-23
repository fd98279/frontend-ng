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
    ConnectedPositioningStrategy,
    IgxInputGroupComponent,
    IgxGridComponent,
    SortingDirection,
    DefaultSortingStrategy,
    IgxGridCell,
    ISelectionEventArgs,
    IgxDropDownComponent
} from '@infragistics/igniteui-angular';
import { OptionAsset } from '../../../option/option';


@Component({
    selector: 'grid-option',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class OptionGridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    public gridData: any;
    public dropDownSelectedValue: string;
    public items: Array<{ field: string }> = [];
    callData: any[] = [];
    putData: any[] = [];
    infoData: any[] = [];
    type = 'Line';
    infoType: string;
    public yAxisdropDownSelectedValue: string;
    public yAxisitems: Array<{ field: string }> = [];
    public graphitems: Array<{ field: string }> = [];
    public graphOptions: { field: string }[] = [
        { field: 'Area' },
        { field: 'Auto' },
        { field: 'Column' },
        { field: 'Line' },
        { field: 'Point' },
        { field: 'Spline' },
        { field: 'SplineArea' },
        { field: 'StepArea' },
        { field: 'StepLine' },
        { field: 'Waterfall' },

    ];
    @Input() option: OptionAsset;
    @ViewChild(IgxDropDownComponent, { static: true }) public igxDropDown: IgxDropDownComponent;
    @ViewChild('inputGroup', { read: IgxInputGroupComponent, static: true }) public inputGroup: IgxInputGroupComponent;
    @ViewChild('inputGraphGroup', { read: IgxInputGroupComponent, static: true }) public inputGraphGroup: IgxInputGroupComponent;
    @ViewChild('inputinfoGraphGroup', { read: IgxInputGroupComponent, static: true }) public inputinfoGraphGroup: IgxInputGroupComponent;
    @ViewChild('inputYaxisGroup', { read: IgxInputGroupComponent, static: true }) public inputYaxisGroup: IgxInputGroupComponent;

    constructor(private zone: NgZone) {
    }

    public ngOnInit() {
        this.items = [];
        this.yAxisitems = [];
        this.gridData = [];

        for (const item of this.option.data.data) {
            this.items.push({ 'field': item.expirationDate });
        }
        for (const item in this.option.data.data[0]) {
            if (typeof (this.option.data.data[0][item]) == 'number')
                this.graphitems.push({ 'field': item });
        }
        for (const item in this.option.data.data[0].options.PUT[0]) {
            if (typeof (this.option.data.data[0].options.PUT[0][item]) == 'number' && item != 'strike')
                this.yAxisitems.push({ 'field': item });
        }
        this.infoType = this.graphitems[0].field;
        this.yAxisdropDownSelectedValue = this.yAxisitems[0].field;
        this.infoData = this.option.data.data.map(val => ({ name: val.expirationDate, value: val[this.infoType] }));
        this.callData = this.option.data.data[0].options.CALL.map(val => ({ name: val.strike, value: val[this.yAxisdropDownSelectedValue] }));
        this.putData = this.option.data.data[0].options.PUT.map(val => ({ name: val.strike, value: val[this.yAxisdropDownSelectedValue] }));
        this.dropDownSelectedValue = this.option.data.data[0].expirationDate;
        this.gridData = this.option.data.data[0];
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


    public cellSelection(evt) {
        const cell = evt.cell;
        // this.grid1.selectRows([cell.row.rowID], true);
    }

    public handleRowSelectionChange(args) {
        // this.fundamentalsSelected.emit(args.newSelection);
    }

    public ngAfterViewInit() {
        // const rowsData = this.grid1.dataRowList.toArray();
        // rowsData.forEach((row) => {
        //     const rowCells: IgxGridCell[] = row.cells.toArray();
        // });
    }

    public openDropDown() {
        if (this.igxDropDown.collapsed) {
            this.igxDropDown.open({
                modal: false,
                positionStrategy: new ConnectedPositioningStrategy({
                    // target: this.inputGroup.element.nativeElement
                })
            });
        }
    }

    public isArray(obj: any) {
        return Array.isArray(obj);
    }

    public isObject(obj: any) {
        return typeof (obj) === 'object';
    }

    public onDDLSelection(eventArgs: ISelectionEventArgs) {
        this.dropDownSelectedValue = eventArgs.newSelection.value;
        this.gridData = this.option.data.data.filter(x => x.expirationDate == eventArgs.newSelection.value)[0];
        this.infoData = this.gridData.map(val => ({ name: val.expirationDate, value: val[this.infoType] }));
        this.callData = this.gridData.options.CALL.map(val => ({ name: val.strike, value: val[this.yAxisdropDownSelectedValue] }));
        this.putData = this.gridData.options.PUT.map(val => ({ name: val.strike, value: val[this.yAxisdropDownSelectedValue] }));

    }

    public openDropDown1() {
        if (this.igxDropDown.collapsed) {
            this.igxDropDown.open({
                target: this.inputGraphGroup.element.nativeElement,
                modal: false,
                positionStrategy: new ConnectedPositioningStrategy()
            });
        }
    }

    public onDDLgraphSelection(eventArgs: ISelectionEventArgs) {
        this.type = eventArgs.newSelection.value;
    }

    public openDropDown2() {
        if (this.igxDropDown.collapsed) {
            this.igxDropDown.open({
                target: this.inputYaxisGroup.element.nativeElement,
                modal: false,
                positionStrategy: new ConnectedPositioningStrategy()
            });
        }
    }

    public openDropDown3() {
        if (this.igxDropDown.collapsed) {
            this.igxDropDown.open({
                target: this.inputinfoGraphGroup.element.nativeElement,
                modal: false,
                positionStrategy: new ConnectedPositioningStrategy()
            });
        }
    }

    public onDDLinfoGraphSelection(eventArgs: ISelectionEventArgs) {
        this.infoType = eventArgs.newSelection.value;
        this.infoData = this.option.data.data.map(val => ({ name: val.expirationDate, value: val[this.infoType] }));
    }

    public onDDLyAxisSelection(eventArgs: ISelectionEventArgs) {
        this.yAxisdropDownSelectedValue = eventArgs.newSelection.value;
        this.callData = this.option.data.data[0].options.CALL.map(val => ({ name: val.strike, value: val[this.yAxisdropDownSelectedValue] }));
        this.putData = this.option.data.data[0].options.PUT.map(val => ({ name: val.strike, value: val[this.yAxisdropDownSelectedValue] }));
    }

}
