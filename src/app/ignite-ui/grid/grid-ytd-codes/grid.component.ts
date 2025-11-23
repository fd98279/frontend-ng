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
    DateRange,
    IgxGridCell
} from '@infragistics/igniteui-angular';
import { YTDCodes } from '../../../ytd/ytd';


@Component({
    selector: 'grid-ytd-codes',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class YtdCodesGridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('grid1', { read: IgxGridComponent, static: false })
    public grid1: IgxGridComponent;
    @Input() ytdCodes: YTDCodes[];
    @Output() ytdCodesSelected: EventEmitter<YTDCodes[]> = new EventEmitter();


    constructor() {

    }

    public reset() {
        this.grid1.deselectAllRows(false);
    }

    public ngOnInit() {
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
    }

    public handleRowSelectionChange(args) {
        setTimeout(() =>  {
            this.ytdCodesSelected.emit(args.newSelection);
        }, 1);
    }

    public ngAfterViewInit() {
        const rowsData = this.grid1.dataRowList.toArray();
        rowsData.forEach((row) => {
        });
      }
}
