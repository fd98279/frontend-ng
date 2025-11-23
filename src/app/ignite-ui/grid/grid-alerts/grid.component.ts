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
    IgxDialogComponent,
    IgxGridComponent,
    IgxStringFilteringOperand,
    RowType,
    Transaction} from '@infragistics/igniteui-angular';
import { IAlert } from '../../../alert/alert';



@Component({
    selector: 'grid-alerts',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class AlertsGridComponent implements OnInit, OnDestroy {

    @ViewChild(IgxDialogComponent, { static: true }) public dialog: IgxDialogComponent;
    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    public isFinished = false;
    public transactionsData: Transaction[] = [];
    private _timer;
    @Input() rowSelectionMode: 'multiple';
    @Input() alerts: IAlert[];
    @Output() alertsSelected: EventEmitter<any[]> = new EventEmitter();


    constructor(private zone: NgZone) { }
    public discardedTransactionsPerRecord: Map<number, Transaction[]> = new Map<number, Transaction[]>()

    public ngOnInit() {

    }

    public ngOnDestroy() {
        clearInterval(this._timer);
    }

    public reset() {
        this.grid1.deselectAllRows(false);
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
    }

    public filter(term, by) {
        if (by === 'condition') {
            this.grid1.filter('condition', term, IgxStringFilteringOperand.instance().condition('contains'));
        } else if (by === 'type') {
            this.grid1.filter('type', term, IgxStringFilteringOperand.instance().condition('contains'));
        }
        this.grid1.markForCheck();
    }

    public addRow() {
        this.grid1.addRow({
            // Generate a random _id else multiple rows cannot be added
            // Delete _id when passing the insert row to the backend, backend fails if _id is passed for new record/insert
            _id: (Math.random() + 1).toString(36).substring(2),
            type : '',
            condition: ''
        });
    }

    delete(cell){
        this.grid1.deleteRowById(cell.id.rowID);
    }
    public undo() {
        /* exit edit mode and commit changes */
        this.grid1.endEdit(true);
        this.grid1.transactions.undo();
    }

    public redo() {
        /* exit edit mode and commit changes */
        this.grid1.endEdit(true);
        this.grid1.transactions.redo();
    }

    public openCommitDialog() {
        this.transactionsData = this.grid1.transactions.getAggregatedChanges(true);
        this.dialog.open();
    }

    public startEdit(row?): void {
        const firstEditable = row.cells.filter(cell => cell.editable)[0];
        const grid = row.grid;

        if (grid.rowList.filter(r => r === row).length !== 0) {
            grid.gridAPI.crudService.enterEditMode(firstEditable, event);
            firstEditable.activate();
        }
        // row.hide();
    }

    public isDirty(rowContext: RowType) {
        return rowContext && rowContext.deleted;
    }

    public isDeleted(rowContext: RowType) {
        return rowContext && rowContext.deleted;
    }

    public hasDiscardedTransactions(rowContext: RowType) {
        if (!rowContext) { return false; }
        const lastDiscarded = this.discardedTransactionsPerRecord.get(rowContext.key);
        return lastDiscarded && lastDiscarded.length > 0;
    }

    public commit() {
        this.grid1.transactions.commit(this.alerts);
        this.alertsSelected.emit(this.transactionsData);
        this.dialog.close();
    }

    public discard() {
        this.grid1.transactions.clear();
        this.dialog.close();
    }

    public stateFormatter(value: any) {
        return JSON.stringify(value);
    }

    public typeFormatter(value: string) {
        return value.toUpperCase();
    }

    public classFromType(type: string): string {
        return `transaction--${type.toLowerCase()}`;
    }
}

