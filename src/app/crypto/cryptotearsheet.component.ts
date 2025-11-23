import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';


@Component({
    selector: 'crypto-tearsheet',
    templateUrl: './cryptotearsheet.component.html',
    standalone: false
})
export class CryptoTearsheetComponent implements OnInit {
    tearsheetUrl: string;


    constructor(private analyticsService: AnalyticsService) {
        this.analyticsService.topics[this.analyticsService.TOPIC_PCA].subscribe(
            message => {
                if (message) {
                    switch (message.id) {
                        case this.analyticsService.MESSAGE_IDS['CHARTS_ENGINE.get_crypto_tearsheet']: {
                            this.tearsheetUrl = message.data;
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
        // TODO: Investigate/implement empty param
        this.analyticsService.getTearSheet([['None']], this.analyticsService.MESSAGE_IDS['CHARTS_ENGINE.get_crypto_tearsheet']);
    }

}
