import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FeedService } from './feed.service';
import { FeedEntry } from './feed-entry';
import { Feed, IRSSFeedEntry } from './feed';
import { FeedInfo } from './feed-info';
import { ActivatedRoute } from '@angular/router';
import { DateRange } from '@infragistics/igniteui-angular';
import { environment } from '../../environments/environment';
import { PersistanceService } from '../common/persistance.service';

@Component({
    templateUrl: './feed-component.html',
    standalone: false
})

export class FeedComponent implements OnInit, AfterViewInit {

    // private feedUrl = 'https://www.cnbc.com/id/100003114/device/rss/rss.html';
    feeds: Array<Feed> = [];
    public todayDate = new Date();
    rssFeedEntries: Array<IRSSFeedEntry>;
    feedSources: Array<string> = [
        'cnbc_top_news',
        'cnbc_world_news',
        'cnbc_asia_news',
        'cnbc_europe_news',
        'cnbc_business_news',
        'cnbc_earnings_news',
        'cnbc_commentary',
        'cnbc_economy',
        'cnbc_finance',
        'cnbc_technology',
        'cnbc_politics',
        'cnbc_health_care',
        'cnbc_real_estate',
        'cnbc_wealth',
        'cnbc_autos',
        'cnbc_energy',
        'cnbc_media',
        'cnbc_retail',
        'cnbc_travel',
        'cnbc_small_business',
        'kitco',
        'wsj_opinion',
        'wsj_world_news',
        'wsj_us_business_news',
        'wsj_market_news',
        'wsj_technology',
        'wsj_life_style',
        'nsdaq_original_content',
        'nsdaq_futures',
        'nsdaq_cryptocurrencies',
        'nasdaq_dividends',
        'nasdaq_earnings',
        'nasdaq_etfs',
        'nasdaq_ipos',
        'nasdaq_markets',
        'nasdaq_options',
        'nasdaq_stocks',
        'nasdaq_artificial_intelligence',
        'nasdaq_blockchain',
        'nasdaq_corporate_governance',
        'nasdaq_financial_advisors',
        'nasdaq_fintech',
        'nasdaq_innovation',
        'nasdaq_nasdaq_news',
        'nasdaq_technology',
        'nasdaq_investing',
        'nasdaq_retirement',
        'nasdaq_saving_money',
        // 'reuters_topnew',
    ];

    public fromDate: Date;
    public toDate: Date;
    public range: DateRange;
    public RSS_URL: string;
    @ViewChild('tradingview') tradingview?: ElementRef;

    constructor(
        private feedService: FeedService,
        private route: ActivatedRoute,
        private _renderer2: Renderer2,
        private persistanceService: PersistanceService
    ) {
        this.fromDate = new Date((new Date()).getTime() - (environment.rss_feeds_default_days * 24 * 60 * 60 * 1000));
        this.toDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // Tomorrow's date
        this.range = <DateRange>{
            start: this.fromDate,
            end: this.toDate
        };
    }

    ngOnInit() {
        this.rssFeedEntries = this.route.snapshot.data['rssFeedEntries'];
        // this.refreshFeed();
    }

    refreshFeeds() {
        this.feedService.getRSSFeedEntriesS3Url(new Date(this.range.start), new Date(this.range.end))
            .subscribe(data => {
                this.rssFeedEntries = data;
            }
            );
    }

    onRssFeedEntrySelected(event) {
        const selectedFeedEntriesLink = event.map(entry => entry.link);
        if (selectedFeedEntriesLink.length > 0) {
            window.open(selectedFeedEntriesLink[0], '_blank');
            // console.log(selectedFeedEntriesLink[0]);
            // this.RSS_URL = selectedFeedEntriesLink[0];
        }
    }

    ngAfterViewInit() {
        let script = this._renderer2.createElement('script');
        script.type = `text/javascript`;
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
        script.text = `
        {
            "feedMode": "all_symbols",
            "colorTheme": "${this.persistanceService.get('theme')}",
            "isTransparent": false,
            "displayMode": "regular",
            "width": "100%",
            "height": 830,
            "locale": "en"
        }
        `;
        this.tradingview?.nativeElement.appendChild(script);
    }

}
