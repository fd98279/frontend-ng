import { ViewChild } from '@angular/core';
import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AnalysisRequest, Fundamental, IMFTicker } from './mutual-funds';
import { MutualFundsService } from './mutual-funds.service';
import { AnalyticsService } from '../analytics.service';

@Component({
    templateUrl: './mutual-fund-component.html',
    styleUrls: ['mutual-fund-component.scss'],
    standalone: false
})

export class MutualFundsComponent implements OnInit {
    @ViewChild('gridMutualFundTickers', { static: false }) gridMutualFundTickers;
    public fundamental: Fundamental;
    public sravzId: String;
    public selected: IMFTicker;
    public mfTickers: IMFTicker[];
    public activeTabIndex: number = 0;
    public selectedMFTickers: IMFTicker[] = [];
    llmQueryResultUrl: string;
    llmQueryResultHtml: string;

    constructor(
        private mutualFundsService: MutualFundsService,
        private route: ActivatedRoute,
        protected router: Router,
        protected location: Location,
        public cdr: ChangeDetectorRef,
        public element: ElementRef,
        private analyticsService: AnalyticsService,
        private http: HttpClient,
    ) {
        this.analyticsService.topics[this.analyticsService.TOPIC_RUST].subscribe(
            (message: { id: any; data: string; }) => {
                if (message) {
                    switch (message.id) {
                        case this.analyticsService.MESSAGE_IDS['RUST_BACKEND_LLM']: {
                            if (message.data) {
                                this.llmQueryResultUrl = message.data;
                                this.fetchHtmlContent();
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

    /**
     * Remove ticker from selectedMFTickers and unselect in grid
     */
    removeTicker(ticker: IMFTicker) {
        this.selectedMFTickers = this.selectedMFTickers.filter(t => t.SravzId !== ticker.SravzId);
        if (this.selected && this.selected.SravzId === ticker.SravzId) {
            this.selected = null;
        }
        if (this.gridMutualFundTickers && typeof this.gridMutualFundTickers.unselectTicker === 'function') {
            this.gridMutualFundTickers.unselectTicker(ticker);
        }
        this.cdr.detectChanges();
    }

    fetchHtmlContent() {
        this.http.get(this.llmQueryResultUrl, { responseType: 'text' })
            .subscribe(html => {
                this.llmQueryResultHtml = html;
            });
    }

    updateFundamentals(etfsResponse) {
        if (etfsResponse) {
            this.fundamental = new Fundamental(
                null,
                null,
                null,
                etfsResponse
            );
        }
    }

    ngOnInit() {
        this.mfTickers = this.route.snapshot.data['mfTickers'];
        this.updateFundamentals(this.route.snapshot.data['mfFundamental']);
        this.route
            .queryParams
            .subscribe(_params => {
                this.sravzId = _params['code'] || '';
            });
    }

    getFundamentalsForTicker() {
        if (this.selected) {
            this.sravzId = this.selected.SravzId;
            this.mutualFundsService.getMFBySravzID(this.selected.SravzId)
                .subscribe(data => { this.updateFundamentals(data); });
        }
    }

    onMFTickerSelected(event) {
        const mfTickers = event as IMFTicker[];
        if (mfTickers) {
            this.selectedMFTickers = mfTickers;
            const mfTicker = mfTickers[mfTickers.length - 1];
            this.sravzId = mfTicker.SravzId;
            const urlTree = this.router.createUrlTree([], {
                queryParams: { code: mfTicker.APICode },
                queryParamsHandling: 'merge',
                preserveFragment: true
            });
            this.location.go(urlTree.toString());
            this.mutualFundsService.getMFBySravzID(mfTicker.SravzId)
                .subscribe(data => {
                    this.updateFundamentals(data);
                });
        }
    }

    public filter(value) {
        if (this.selected === value) {
            this.cdr.detectChanges();
            return;
        }
        this.selected = value;
        this.cdr.detectChanges();
    }

    back() {
        this.location.back();
        return false;
    }

    onTabIndexChanged(index: number) {
        this.activeTabIndex = index;
    }

    handleAnalysis(request: AnalysisRequest) {
        if (this.selectedMFTickers.length > 0) {
            const tickers = this.selectedMFTickers.map(ticker => ticker.SravzId);
            this.analyticsService.sendMessageToNSQ(
                this.analyticsService.MESSAGE_IDS['RUST_BACKEND_LLM'],
                this.analyticsService.TOPIC_RUST,
                tickers,
                request,
                "LLM Query"
            );
        }
    }

}
