import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateRange } from '@infragistics/igniteui-angular';
import { environment } from '../../environments/environment';
import { Fundamental, IStockTicker } from './fundamental';
import { FundamentalsService } from './fundamental.service';
import { Location } from '@angular/common';

@Component({
    templateUrl: './fundamental-component.html',
    styleUrls: ['fundamental-component.scss'],
    standalone: false
})

export class FundamentalsComponent implements OnInit {
    public fromDate: Date;
    public toDate: Date;
    public range: DateRange;
    public fundamentals: Fundamental;
    public sravzId: String;
    public selected: IStockTicker;
    public stockTickers: IStockTicker[];

    constructor(
        private fundamentalsService: FundamentalsService,
        private route: ActivatedRoute,
        protected router: Router,
        protected location: Location,
        public cdr: ChangeDetectorRef,
        public element: ElementRef,
        private activatedRoute: ActivatedRoute
    ) {
        this.fromDate = new Date((new Date()).getTime() - (environment.rss_feeds_default_days * 24 * 60 * 60 * 1000));
        this.toDate = new Date();
        this.range = <DateRange>{
            start: this.fromDate,
            end: this.toDate
        };
    }

    updateFundamentals(fundamentalsResponse) { 
        if (fundamentalsResponse) {
            this.fundamentals = new Fundamental(
                fundamentalsResponse.code,
                fundamentalsResponse.datetime,
                null,
                JSON.parse(fundamentalsResponse.data)
            );
        }
    }

    ngOnInit() {
        this.stockTickers = this.route.snapshot.data['stockTickers'];
        this.updateFundamentals(this.route.snapshot.data['fundamentals']);
        this.route
        .queryParams
        .subscribe(_params => {
            if (_params['code']) {
                this.sravzId = _params['code'];
            }
        });
    }

    getFundamentalsForTicker() {
        if (this.selected) {
            this.sravzId = this.selected.SravzId;
            this.fundamentalsService.getFundamentalsByCodeS3URL(`${this.selected.Ticker}.${this.selected.Country}`)
                .subscribe(data => {
                    this.updateFundamentals(data);
                }
                );
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

    onStockTickerSelected(event) {
        const stockTickers = event as IStockTicker[];
        if (stockTickers) {
            const stockTicker = stockTickers.pop();
            this.sravzId = stockTicker.SravzId;
            const code = `${stockTicker.Ticker}.${stockTicker.Country}`;
            // https://stackoverflow.com/a/52225710
            const urlTree = this.router.createUrlTree([], {
                queryParams: { code: code },
                queryParamsHandling: 'merge',
                preserveFragment: true
            });
            this.location.go(urlTree.toString());
            this.fundamentalsService.getFundamentalsByCodeS3URL(code)
                .subscribe(data => {
                    this.updateFundamentals(data);
                });
        }
    }

}
