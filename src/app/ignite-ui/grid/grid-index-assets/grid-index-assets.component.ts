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
import { IAsset } from '../../../../app/assets/asset.model';

@Component({
    selector: 'grid-index-assets',
    styleUrls: ['./grid-index-assets.component.scss'],
    templateUrl: './grid-index-assets.component.html',
    standalone: false
})
export class GridIndexAssetsComponent implements OnInit, OnDestroy {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() assestsEvents: IAsset[];
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

    rowDetailParent(cell): void {
        this.rowDetailEvent.next(cell);
    }
  
}
