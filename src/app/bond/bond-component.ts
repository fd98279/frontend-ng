import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bond, IBond, IBondTicker } from './bond';
import { Location } from '@angular/common';
import { BondService } from './bond.service';

@Component({
    templateUrl: './bond-component.html',
    styleUrls: ['bond-component.scss'],
    standalone: false
})

export class BondComponent implements OnInit {
    public bond: IBond;
    public sravzId: String;
    public selected: IBondTicker;
    public bondTickers: IBondTicker[];

    constructor(
        private bondService: BondService,
        private route: ActivatedRoute,
        protected router: Router,
        protected location: Location,
        public cdr: ChangeDetectorRef,
        public element: ElementRef,
        private activatedRoute: ActivatedRoute
    ) {
    }

    updateFundamentals(bondsResponse) {
        if (bondsResponse) {
            this.bond = new Bond(
                bondsResponse.code,
                bondsResponse.datetime,
                JSON.parse(bondsResponse.data)
            );
        }
    }

    ngOnInit() {
        this.bondTickers = this.route.snapshot.data['bondTickers'];
        this.updateFundamentals(this.route.snapshot.data['bonds']);
        this.route
        .queryParams
        .subscribe(_params => {
            this.sravzId = _params['code'] || '';
        });
    }



    getFundamentalsForTicker() {
        if (this.selected) {
            this.sravzId = this.selected.SravzId;
            this.bondService.getBondByCodeS3URL(`${this.selected.Code}`)
            .subscribe(data => {
                 this.updateFundamentals(data);
            } );
        }
    }

    onBondTickerSelected(event) {
        const bondTickers = event as IBondTicker[];
        if (bondTickers) {
            const bondTicker = bondTickers.pop();
            this.sravzId = bondTicker.SravzId;
            const code = `${bondTicker.Code}`;
            const urlTree = this.router.createUrlTree([], {
                queryParams: { code: code },
                queryParamsHandling: 'merge',
                preserveFragment: true
            });
            this.location.go(urlTree.toString());
            this.bondService.getBondByCodeS3URL(code)
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
