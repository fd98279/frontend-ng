import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateRange } from '@infragistics/igniteui-angular';
import { environment } from '../../environments/environment';
import { IEarnings } from './earnings';
import { EarningsService } from './earnings.service';
import { IAsset } from '../assets/asset.model';
import { AnalyticsService } from '../analytics.service';

@Component({
    templateUrl: './earnings-component.html',
    standalone: false
})

export class EarningsComponent implements OnInit {
    public fromDate: Date;
    public toDate: Date;
    public range: DateRange;
    public earnings: IEarnings[];
    public assets: IAsset[];
    earningsAnalysisUrl: string;
    selectedAssets: IAsset[];

    constructor(
        private earningsService: EarningsService,
        private route: ActivatedRoute,
        protected router: Router,
        private analyticsService: AnalyticsService,
    ) {
        this.fromDate = new Date((new Date()).getTime() - (environment.rss_feeds_default_days * 24 * 60 * 60 * 1000));
        this.toDate = new Date();
        this.range = <DateRange>{
            start: this.fromDate,
            end: this.toDate
        };

        this.analyticsService.topics[this.analyticsService.TOPIC_RUST].subscribe(
            (message) => {
                if (message) {
                    switch (message.id) {
                        case this.analyticsService.MESSAGE_IDS['RUST_BACKEND_EARNINGS']: {
                            if (message.data) {
                                this.earningsAnalysisUrl = message.data;
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            }
        );
    }

    ngOnInit() {
        this.assets = this.route.snapshot.data['assets'];
        this.assets = this.assets.filter(x => (x.Country === 'US' || x.Country === 'USA') && x.Type === 'Stock');
        this.earnings = this.route.snapshot.data['earnings'];
    }

    refreshEarnings() {
        this.earningsService.getEarnings(new Date(this.range.start), new Date(this.range.end))
            .subscribe(data => {
                this.earnings = data;
            }
            );
    }

    onEarningsSelected(event) {
        console.log(event);
        if (event != null && event.length > 0) {
            this.router.navigateByUrl(`/earnings/earnings-details?code=${event[0]['code']}`);
        }

    }

    onAssetsSelected(assets: any[]) {
        this.selectedAssets = assets.map(asset => asset).slice(0, 1);  // Pass Ticker to the service
        if (this.selectedAssets.length > 0) {
            this.earningsAnalysisUrl = null;
            this.analyticsService.sendMessageToNSQ(this.analyticsService.MESSAGE_IDS['RUST_BACKEND_EARNINGS'],
                // Args should be an array else backend-node errors out.                                                    
                this.analyticsService.TOPIC_RUST, [this.selectedAssets[0].SravzId, this.selectedAssets[0].Symbol], {}, `Get Earnings For {this.selectedCode}`);
        }
    }

}
