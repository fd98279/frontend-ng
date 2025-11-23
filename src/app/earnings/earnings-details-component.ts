import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateRange } from '@infragistics/igniteui-angular';
import { environment } from '../../environments/environment';
import { IEarnings, IEarningDetails } from './earnings';
import { EarningsService } from './earnings.service';
import { Location } from '@angular/common';

@Component({
    templateUrl: './earnings-details-component.html',
    standalone: false
})

export class EarningsDetailsComponent implements OnInit {
    public earningsDetails: IEarningDetails;
    public sravzID: String;

    constructor(
        private earningsService: EarningsService,
        private route: ActivatedRoute,
        protected location: Location
    ) {

    }

    ngOnInit() {
        this.earningsDetails = this.route.snapshot.data['earningsDetails'];
        this.route
            .queryParams
            .subscribe(_params => {
                // Defaults to 0 if no query param provided.
                this.sravzID = _params['code'] || '';
                // this.child.RequestData(this.asset, null);
            });
    }

    back() {
        this.location.back();
        return false;
    }


}
