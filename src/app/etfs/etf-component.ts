import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fundamental, IETFTicker } from './etf';
import { Location } from '@angular/common';
import { ETFService } from './etf.service';

@Component({
    templateUrl: './etf-component.html',
    styleUrls: ['etf-component.scss'],
    standalone: false
})

export class ETFComponent implements OnInit {
    public fundamental: Fundamental;
    public sravzId: String;
    public selected: IETFTicker;
    public etfTickers: IETFTicker[];

    constructor(
        private etfsService: ETFService,
        private route: ActivatedRoute,
        protected router: Router,
        protected location: Location,
        public cdr: ChangeDetectorRef,
        public element: ElementRef,
        private activatedRoute: ActivatedRoute
    ) {
    }

    updateFundamentals(etfsResponse) {
        if (etfsResponse) {
            this.fundamental = new Fundamental(
                etfsResponse.code,
                etfsResponse.datetime,
                null,
                JSON.parse(etfsResponse.data)
            );
        }
    }

    ngOnInit() {
        this.etfTickers = this.route.snapshot.data['etfTickers'];
        this.updateFundamentals(this.route.snapshot.data['etfs']);
        this.route
        .queryParams
        .subscribe(_params => {
            this.sravzId = _params['code'] || '';
        });
    }

    getFundamentalsForTicker() {
        if (this.selected) {
            this.sravzId = this.selected.SravzId;
            this.etfsService.getETFByCode(`${this.selected.APICode}`)
            .subscribe(data => { this.updateFundamentals(data); } );
        }
    }

    onETFTickerSelected(event) {
        const etfTickers = event as IETFTicker[];
        if (etfTickers) {
            const etfTicker = etfTickers.pop();
            this.sravzId = etfTicker.SravzId;
            const code = `${etfTicker.APICode}`;
            const urlTree = this.router.createUrlTree([], {
                queryParams: { code: code },
                queryParamsHandling: 'merge',
                preserveFragment: true
            });
            this.location.go(urlTree.toString());
            this.etfsService.getETFByCode(code)
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

}
