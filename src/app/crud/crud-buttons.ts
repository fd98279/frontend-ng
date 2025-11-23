import {Component} from '@angular/core';

@Component({
    selector: 'child-cell',
    template: `<button (click)="deleteMethod()" [hidden]="!showDelete">
    <i class="fa fa-trash" aria-hidden="true"></i>
    </button>
    <button (click)="updateMethod()" [hidden]="!showUpdate">
    <i class="fa fa-upload" aria-hidden="true"></i>
    </button>
    <button (click)="detailsMethod()" [hidden]="!showDetails">
    <i class="fa fa-bars" aria-hidden="true"></i>
    </button>`,
    styles: [
        `.btn {
            line-height: 0.5
        }`
    ],
    standalone: false
})
export class CrudButtonsComponent  {
    public params: any;
    public showDelete: boolean;
    public showUpdate: boolean;
    public showDetails: boolean;

    agInit(params: any): void {
        this.params = params;
        this.showDelete = this.params.context.componentParent.showDelete;
        this.showUpdate = this.params.context.componentParent.showUpdate;
        this.showDetails = this.params.context.componentParent.showDetails;
    }

    public deleteMethod() {
        this.params.context.componentParent.DeleteRow({Row: this.params.node.rowIndex,
            Col: this.params.colDef.headerName, Data: this.params});
    }

    public updateMethod() {
        this.params.context.componentParent.UpdateRow({Row: this.params.node.rowIndex,
            Col: this.params.colDef.headerName, Data: this.params});
    }

    public detailsMethod() {
        this.params.context.componentParent.RowDetails({Row: this.params.node.rowIndex,
            Col: this.params.colDef.headerName, Data: this.params});
    }

    refresh(): boolean {
        return false;
    }
}
