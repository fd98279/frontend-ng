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
import { IMortgageQuote } from '../../../../app/rates/mortgage-quotes.model';

@Component({
    selector: 'grid-mortgage-rate',
    styleUrls: ['./grid-mortgage-rate.component.scss'],
    templateUrl: './grid-mortgage-rate.component.html',
    standalone: false
})
export class GridMortgageRateComponent implements OnInit, OnDestroy {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() quotesEvents: IMortgageQuote[];
   

    constructor(private zone: NgZone) { }

    public ngOnInit() {
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }
  

    

    // public filter(term, by) {
    //     if (by === 'country') {
    //         this.grid1.filter('country', term, IgxStringFilteringOperand.instance().condition('contains'));
    //     } else if (by === 'event') {
    //         this.grid1.filter('event', term, IgxStringFilteringOperand.instance().condition('contains'));
    //     }
    //     this.grid1.markForCheck();
    // }
}
