import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { YTD, YTDCodes } from './ytd';
import { FundamentalsService } from '../fundamentals/fundamental.service';
import { IAsset } from '../assets/asset.model';
import { IMFTicker } from '../mutual-funds/mutual-funds';
import { IETFTicker } from '../etfs/etf';
import { IgniteUIService } from '../ignite-ui/services/ignite-ui-service';
import { IIgniteUIMessage } from '../ignite-ui/services/ignite-ui-message-model';

@Component({
    templateUrl: './ytd-component.html',
    styleUrls: ['ytd-component.scss'],
    standalone: false
})

export class YTDComponent implements OnInit {
    public assets: IAsset[];
    public ytdCodsToFetchData: String;
    public ytdCodes: YTDCodes;
    public mfTickers: IMFTicker[];
    public etfTickers: IETFTicker[];

    constructor(
        private fundamentalsService: FundamentalsService,
        private route: ActivatedRoute,
        protected router: Router,
        protected location: Location,
        public cdr: ChangeDetectorRef,
        public element: ElementRef,
        public igniteUIService: IgniteUIService) {
    }

    // Used for any code
    onYTDCodeSelected(event: any[]) {
        const selectedCodes = event.map(ytdCode => ytdCode.value).slice(0, 10);
        if (selectedCodes.length > 0) {
            this.fundamentalsService.getYTDS3URL(selectedCodes.join(','))
                .subscribe(data => {
                    const ytdData: IIgniteUIMessage = {
                        MessageID: this.igniteUIService.MESSAGE_IDS['SHOW_YTD_DATA'],
                        Message: data
                    };
                    this.igniteUIService.sendMessage(ytdData);
                });
        }
    }

    updateFundamentals(fundamentalsResponse) {
        if (fundamentalsResponse && fundamentalsResponse.data) {
            this.ytdCodes = fundamentalsResponse.data.map((str, index) => ({ value: str, id: index + 1 }));
        }
    }

    // Used for stocks
    onAssetsSelected(assets: any[]) {
        const selectedAssetsTickers = assets.map(asset => asset.Ticker).slice(0, 10);  // Pass Ticker to the service
        if (selectedAssetsTickers.length > 0) {
            this.fundamentalsService.getYTDS3URL(selectedAssetsTickers.join(','))
                .subscribe(data => {
                    const ytdData: IIgniteUIMessage = {
                        MessageID: this.igniteUIService.MESSAGE_IDS['SHOW_YTD_DATA'],
                        Message: data
                    };
                    this.igniteUIService.sendMessage(ytdData);
                });

            const selectedAssetsSravzIDs = assets.map(asset => asset.SravzId).slice(0, 10);  // Pass Ticker to the service
            this.fundamentalsService.getQuotesStats(selectedAssetsSravzIDs.join(','))
                .subscribe(data => {
                    const quotesStatsData: IIgniteUIMessage = {
                        MessageID: this.igniteUIService.MESSAGE_IDS['SHOW_QUOTES_STATS_DATA'],
                        Message: data
                    };
                    this.igniteUIService.sendMessage(quotesStatsData);
                });

            this.fundamentalsService.getQuotesStatsLatest(selectedAssetsSravzIDs.map(code => `'${code}'`).join(','))
                .subscribe(data => {
                    const latestStatsData: IIgniteUIMessage = {
                        MessageID: this.igniteUIService.MESSAGE_IDS['SHOW_QUOTES_LATEST_STATS'],
                        Message: data
                    };
                    this.igniteUIService.sendMessage(latestStatsData);
                });
        }
    }

    onMFTickerSelected(mf: IMFTicker[]) {
        if (mf != null) {
            this.fundamentalsService.getYTDS3URL(mf.map(item => item.Code).join(','))
                .subscribe(data => {
                    const ytdData: IIgniteUIMessage = {
                        MessageID: this.igniteUIService.MESSAGE_IDS['SHOW_YTD_DATA'],
                        Message: data
                    };
                    this.igniteUIService.sendMessage(ytdData);
                });
        }
    }

    onETFTickerSelected(etf: IETFTicker[]) {
        if (etf != null) {
            this.fundamentalsService.getYTDS3URL(etf.map(item => item.Code).join(','))
                .subscribe(data => {
                    const ytdData: IIgniteUIMessage = {
                        MessageID: this.igniteUIService.MESSAGE_IDS['SHOW_YTD_DATA'],
                        Message: data
                    };
                    this.igniteUIService.sendMessage(ytdData);
                });
        }
    }

    ngOnInit() {
        this.assets = this.route.snapshot.data['assets'];
        this.assets = this.assets.filter(x => (x.Country === 'US' || x.Country === 'USA') && x.Type === 'Stock');
        this.mfTickers = this.route.snapshot.data['mfTickers'];
        this.etfTickers = this.route.snapshot.data['etfTickers'];
        this.updateFundamentals(this.route.snapshot.data['ytdCodes']);
    }

    back() {
        this.location.back();
        return false;
    }

}
