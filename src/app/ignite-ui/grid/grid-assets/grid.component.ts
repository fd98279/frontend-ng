import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {
    IgxGridComponent,
    IgxStringFilteringOperand} from '@infragistics/igniteui-angular';
import { IAsset } from '../../../assets/asset.model';



@Component({
    selector: 'grid-assets',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class AssetsGridComponent implements OnInit, OnDestroy {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    public localData: any[];
    public isFinished = false;
    private _timer;
    @Input() rowSelectionMode: 'multiple';
    @Input() assets: IAsset[];
    @Output() assetsSelected: EventEmitter<IAsset[]> = new EventEmitter();


    constructor(private zone: NgZone) { }

    public ngOnInit() {
        this.localData = this.assets;
    }

    public ngOnDestroy() {
        clearInterval(this._timer);
    }


    public cellSelection(evt) {
        const cell = evt.cell;
        // this.grid1.selectRows([cell.row.rowID], true);
        alert('test');
    }

    public handleRowSelectionChange(args) {
        // const currentSelection = this.grid1.selectedRows(); // return array of row ids
        // console.log('This is current selection ' + currentSelection);
        this.assetsSelected.emit(args.newSelection);
    }

    public getSelectedRows(args) {
        // const currentSelection = this.grid1.selectedRows(); // return array of row ids
    }

    public reset() {
        this.grid1.deselectAllRows(false);
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
    }

    public filter(term, by) {
        if (by === 'country') {
            this.grid1.filter('Country', term, IgxStringFilteringOperand.instance().condition('contains'));
        } else if (by === 'name') {
            this.grid1.filter('Name', term, IgxStringFilteringOperand.instance().condition('contains'));
        }
        this.grid1.markForCheck();
    }
}
