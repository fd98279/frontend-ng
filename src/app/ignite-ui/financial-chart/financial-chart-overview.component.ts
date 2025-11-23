import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FinancialDataService } from '../services/financial-data.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FinancialDataService],
    selector: 'app-financial-chart-overview',
    styleUrls: ['./financial-chart-overview.component.scss'],
    templateUrl: './financial-chart-overview.component.html',
    standalone: false
})
export class FinancialChartOverviewComponent implements OnChanges {

    public stocksData: any;
    public displayLogarithmicScale: boolean;
    public calloutsData: any[];
    @Input() chartdata: any;

    constructor(private dataService: FinancialDataService) {
        this.stocksData = this.chartdata;
        this.displayLogarithmicScale = false;
        if (this.stocksData) {
            this.calloutsData = this.getCallouts(this.stocksData);
        }
    }

    ngOnChanges() {
        this.stocksData = this.chartdata;
        if (this.stocksData) {
            this.calloutsData = this.getCallouts(this.stocksData);
        }
    }

    public getCallouts(stocks: any[]): any[] {
        const callouts: any[] = [];
        for (const stock of stocks) {
            const intervalSplit = Math.floor(Math.random() * (300 - 280)) + 280;
            const intervalDiv = Math.floor(Math.random() * (400 - 360)) + 360;
            const calloutMin = new CalloutDataItem({ label: 'MIN' });
            const calloutMax = new CalloutDataItem({ label: 'MAX' });
            // initalizing values for min/max callouts
            calloutMin.value = Number.MAX_VALUE;
            calloutMax.value = Number.MIN_VALUE;
            let idx = 0;

            for (const item of stock) {
                // finding item with min/max price
                if (calloutMin.value > item.close) {
                    calloutMin.value = item.close;
                    calloutMin.index = idx;
                }
                if (calloutMax.value < item.close) {
                    calloutMax.value = item.close;
                    calloutMax.index = idx;
                }
                const offset = idx + 10;
                const calloutEvent = new CalloutDataItem({ index: idx });
                // creating SPLIT/DIVIDENT events at specific intervals
                if (offset % intervalSplit === 5) {
                    calloutEvent.value = item.close;
                    calloutEvent.label = 'SPLIT';
                    callouts.push(calloutEvent);
                } else if (offset % intervalDiv === 5) {
                    calloutEvent.value = item.close;
                    calloutEvent.label = 'DIV';
                    callouts.push(calloutEvent);
                }
                idx++;
            }
            callouts.push(calloutMin);
            callouts.push(calloutMax);
        }
        return callouts;
    }
}

class CalloutDataItem {
    public label: string;
    public index: number;
    public value: number;

    public constructor(init?: Partial<CalloutDataItem>) {
        Object.assign(this, init);
    }
}
