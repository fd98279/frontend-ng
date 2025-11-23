import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IDashboardAssetType } from '../main/dashboard.model';
import { IRegionData, IWorldData } from '../services/data.service';

@Component({
    selector: 'app-list-cases',
    templateUrl: './list-cases.component.html',
    styleUrls: ['./list-cases.component.scss'],
    host: { class: 'app__list' },
    standalone: false
})
export class ListCasesComponent {

    public dataSets = ['Confirmed', 'Recovered', 'Deaths', 'Active'];
    public key: string;
    public totalCases: number;
    public listSortedData: IDashboardAssetType[];
    private _type: string;

    constructor(private router: Router) { }

    @Output() regionSelected = new EventEmitter<IRegionData>();

    @Input()
    public set type(value: string) {
        this.key = `total${value}`;
        this._type = value;
    }
    public get type(): string {
        return this._type;
    }

    @Input()
    public set data(value: IDashboardAssetType[]) {
        // this.listSortedData = value.data.sort((a, b) => {
        //     return b.value - a.value;
        // });
        // this.totalCases = value.totalCases;
        this.listSortedData = value;
    }

    public onListItemClicked(item: IRegionData) {
        this.regionSelected.emit(item);
    }

    public navigate() {
        switch (this.type) {
            case 'Futures':
                this.router.navigate(['/futures/all'], {});
                break;
            case 'ETFs':
                this.router.navigate(['/etfs/etfs'], {});
                break;
            case 'Indexes':
                this.router.navigate(['/marketindex/index'], {});
                break;
            case 'Currencies':
                this.router.navigate(['forex/all'], {});
                break;
            case 'Rates':
                this.router.navigate(['rates/all'], {});
                break;
            case 'Mutual Funds':
                this.router.navigate(['mutualfunds/mutualfunds'], {});
                break;
            case 'Earnings':
                this.router.navigate(['earnings/earnings'], {});
                break;
            case 'Fundamentals':
                this.router.navigate(['fundamentals/fundamentals'], {});
                break;
            case 'News':
                this.router.navigate(['feeds/feed'], {});
                break;
            case 'Portfolios':
                this.router.navigate(['portfolio/list'], {});
                break;
            case 'Futures':
                this.router.navigate(['quotes/list'], {});
                break;
            case 'Mortgage Rates':
                this.router.navigate(['/rates/mortgage'], {});
                break;
            case 'Charts':
                this.router.navigate(['/asset/all'], {});
                break;
            case 'Economic Calendar':
                this.router.navigate(['/economics/calendar'], {});
                break;
            case 'Analytics':
                this.router.navigate(['/analytics/all'], { queryParams: {analyticsType: "Time Series Analysis", assetType: 'asset'}});
                break;
            default:
                break;
        }
    }

    public onListItemClickedNavigateToUrl(item: IDashboardAssetType) {
        this.router.navigate([item.link], { queryParams: JSON.parse(item.linkParams) });
    }

    getFontColor(value: number) {
        let color = 'orange';
        if (value < 0) {
            color = 'red';
        } else if (value > 0) {
            color = 'green';
        }
        return color;
    }
}
