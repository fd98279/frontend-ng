import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    EventEmitter,
    Output
} from '@angular/core';
import {
    IgxGridComponent,
    IgxNumberSummaryOperand,
    IgxStringFilteringOperand,
    IgxSummaryResult
} from '@infragistics/igniteui-angular';
import { IUserAsset } from '../../../../app/assets/userasset.model';

@Component({
    selector: 'grid-users-assets',
    styleUrls: ['./grid-users-assets.component.scss'],
    templateUrl: './grid-users-assets.component.html',
    standalone: false
})
export class GridUsersAssetsComponent implements OnInit, OnDestroy {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() userassetsEvents: IUserAsset[];
    @Input() isUpdateIcon: any;
    @Input() isDeleteIcon: any;
    @Input() isDetailIcon: any;
    @Output() deleteEvent = new EventEmitter<string>();
    @Output() updateEvent = new EventEmitter<string>();
    @Output() rowDetailEvent = new EventEmitter<string>();

    constructor(private zone: NgZone) { }

    public ngOnInit() {
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

    deleteParent(cell): void {
        this.deleteEvent.next(cell);
    }

    rowDetailParent(cell): void {
        this.rowDetailEvent.next(cell);
    }

    updateUserAsset(cell): void {
        this.updateEvent.next(cell);
    }   
}
