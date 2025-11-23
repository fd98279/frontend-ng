import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOptionTicker, OptionAsset } from './option';
import { Location } from '@angular/common';
import { OptionService } from './option.service';

@Component({
    templateUrl: './option-component.html',
    styleUrls: ['option-component.scss'],
    standalone: false
})

export class OptionComponent implements OnInit {
    public optionAsset: OptionAsset;
    public sravzId: String;
    public selected: IOptionTicker;
    public optionTickers: IOptionTicker[];

    constructor(
        private optionService: OptionService,
        private route: ActivatedRoute,
        protected router: Router,
        protected location: Location,
        public cdr: ChangeDetectorRef,
        public element: ElementRef,
        private activatedRoute: ActivatedRoute
    ) {
    }

    updateFundamentals(optionResponse) {
        if (optionResponse) {
            this.optionAsset = new OptionAsset(
                optionResponse.code,
                optionResponse.datetime,
                JSON.parse(optionResponse.data)
            );
        }
    }

    ngOnInit() {
        this.optionTickers = this.route.snapshot.data['optionTickers'];
        this.updateFundamentals(this.route.snapshot.data['option']);
        this.route
        .queryParams
        .subscribe(_params => {
            this.sravzId = _params['code'] || '';
        });
    }

    onOptionTickerSelected(event) {
        this.optionAsset = undefined;
        const optionTickers = event as IOptionTicker[];
        if (optionTickers) {
            const optionTicker = optionTickers.pop();
            this.sravzId = optionTicker.SravzId;
            const code = `${optionTicker.Code}.${optionTicker.Exchange}`;
            const urlTree = this.router.createUrlTree([], {
                queryParams: { code: code },
                queryParamsHandling: 'merge',
                preserveFragment: true
            });
            this.location.go(urlTree.toString());
            this.optionService.getOptionByCodeS3URL(code)
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
