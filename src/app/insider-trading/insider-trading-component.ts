import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IInsiderTrade } from './insider-trading';

@Component({
    templateUrl: './insider-trading-component.html',
    styleUrls: ['insider-trading-component.scss'],
    standalone: false
})

export class InsiderTradingComponent implements OnInit {
    public insiderTrades: IInsiderTrade[];
    public sravzId: String;
    public chartData: any[] = [];

    constructor(
        private route: ActivatedRoute,
        protected router: Router,
        protected location: Location,
        public cdr: ChangeDetectorRef,
        public element: ElementRef    ) {
    }

    updateFundamentals(fundamentalsResponse) {
        if (fundamentalsResponse) {
            this.insiderTrades = JSON.parse(fundamentalsResponse.data);
            this.chartData = Array.from(new Set(this.insiderTrades.map(s => s.transactionAcquiredDisposed)))
            .map(params => {
              return {
                name: params,
                value: this.insiderTrades.filter(opts => opts.transactionAcquiredDisposed === params).length
              };
            });
      
        }
    }

    ngOnInit() {
        this.updateFundamentals(this.route.snapshot.data['fundamentals']);
    }

    onInsiderTradeSelected(event) {
        const selectedInsiderTradeLink = event.map(entry => entry.link);
        if (selectedInsiderTradeLink.length > 0) {
            window.open(selectedInsiderTradeLink[0], '_blank');
        }
    }

    back() {
        this.location.back();
        return false;
    }

}
