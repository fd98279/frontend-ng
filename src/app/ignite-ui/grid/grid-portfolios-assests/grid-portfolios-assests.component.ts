import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input
} from '@angular/core';
import {
    IgxGridComponent,
    IgxNumberSummaryOperand,
    IgxStringFilteringOperand,
    IgxSummaryResult
} from '@infragistics/igniteui-angular';
import { IPortfolioAsset } from '../../../../app/quotes/quotes.model';

@Component({
    selector: 'grid-portfolios-assests',
    styleUrls: ['./grid-portfolios-assests.component.scss'],
    templateUrl: './grid-portfolios-assests.component.html',
    standalone: false
})
export class GridPortfoliosAssestsComponent implements OnInit, OnDestroy {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() portfolioAssetsEvents: IPortfolioAsset[];


    constructor(private zone: NgZone) { }

    public ngOnInit() {
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

    private backgroundClasses = (rowData: any, columnKey: string): boolean => {
        return rowData.pnlpercent > 0;
    }

    private backgroundClasssesPsPercentage = (rowData: any, columnKey: string): boolean => {
        return rowData.pnlpercent < 0;
    }

    // tslint:disable-next-line:member-ordering
    backgroundCell = {
        'showUp': this.backgroundClasses,
        'showDown': this.backgroundClasssesPsPercentage
    };
}
