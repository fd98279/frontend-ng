import { Component, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { RemoteDataService, IRegionData } from '../services/data.service';
import { ListCasesComponent } from '../list-cases/list-cases.component';
import { IDashboard, IDashboardAssetType, IDashboardAPI } from './dashboard.model';

@Component({
    providers: [RemoteDataService],
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    host: { class: 'app__main' },
    standalone: false
})
export class MainComponent implements AfterViewInit {

  // @ViewChild(TimelineChartComponent, { read: TimelineChartComponent }) public charts: TimelineChartComponent;
  // @ViewChild('map', { static: true }) public map: MapCasesComponent;
  // @ViewChild('confirmedList', { static: true }) public confirmedList: ListCasesComponent;
  @ViewChild('futuresList', { static: true }) public futuresList: ListCasesComponent;
  @ViewChild('indexesList', { static: true }) public indexesList: ListCasesComponent;
  @ViewChild('currenciesList', { static: true }) public currenciesList: ListCasesComponent;
  @ViewChild('etfsList', { static: true }) public etfsList: ListCasesComponent;
  @ViewChild('mutualFundsList', { static: true }) public mutualFundsList: ListCasesComponent;
  @ViewChild('ratesList', { static: true }) public ratesList: ListCasesComponent;
  @ViewChild('earningsList', { static: true }) public earningsList: ListCasesComponent;
  @ViewChild('newsList', { static: true }) public newsList: ListCasesComponent;
  @ViewChild('portfoliosList', { static: true }) public portfoliosList: ListCasesComponent;
  @ViewChild('mortgageRatesList', { static: true }) public mortgageRatesList: ListCasesComponent;
  @ViewChild('chartsList', { static: true }) public chartsList: ListCasesComponent;
  @ViewChild('economicCalendarList', { static: true }) public economicCalendarList: ListCasesComponent;
  @ViewChild('analyticsList', { static: true }) public analyticsList: ListCasesComponent;

  @Input() dashboardData: IDashboardAPI;
  @Output() messageEvent = new EventEmitter<string>();
  @Output() updateTimeRetrieved = new EventEmitter<number>();

  private dataRequestConfirmed$: any;
  private dataRequestRecovered$: any;
  private dataRequestDeaths$: any;

  public dashboardItems = [];
  public dashboardItemSelected;

  constructor() {
    // const lastCommitTime$ = this.dataService.getLatestCommits();
    // lastCommitTime$.subscribe(data => {
    //   const lastCommit = new Date(data[0].commit.author.date).getTime();
    //   this.updateTimeRetrieved.emit(lastCommit);
    //   this.loadDataSets(lastCommit);
    // });
    // this.loadDataSets();
    this.dashboardItems = ['', 'Futures', 'Indexes', 'Currencies', 'ETFs', 'Mutual Funds', 'Rates', 'Earnings',
      'News', 'Fundamentals', 'Portfolios', 'Mortgage Ratest', 'Economic Calendar', 'Charts', 'Analytics'];
    this.dashboardItemSelected = '';
  }

   ngAfterViewInit() {
    Promise.resolve(1).then(() => {
      this.indexesList.data = this.dashboardData.index as IDashboardAssetType[];
      this.futuresList.data = this.dashboardData.futures as IDashboardAssetType[];
      this.currenciesList.data = this.dashboardData.currency as IDashboardAssetType[];
      this.etfsList.data = this.dashboardData.etf as IDashboardAssetType[];
      this.mutualFundsList.data = this.dashboardData.mutualfunds as IDashboardAssetType[];
      this.ratesList.data = this.dashboardData.rates as IDashboardAssetType[];
      this.earningsList.data = this.dashboardData.earnings as IDashboardAssetType[];
      this.portfoliosList.data = this.dashboardData.portfolios as IDashboardAssetType[];
      this.mortgageRatesList.data = this.dashboardData.mortgage as IDashboardAssetType[];
      this.newsList.data = this.dashboardData.rss_feeds as IDashboardAssetType[];
      this.chartsList.data = [
        { 'link': '/asset/all', 'linkParams': '{\"sravzIds\":\"fut_gold\"}', 'linkText': 'Gold Future' },
        { 'link': '/asset/all', 'linkParams': '{\"sravzIds\":\"fut_silver\"}', 'linkText': 'Silver Future' },
      ];
      this.economicCalendarList.data = [
        { 'link': '/economics/calendar', 'linkParams': '{\"autoFetch\": \"true\"}', 'linkText': 'US - Current Week' },
      ];
      this.analyticsList.data = [
        { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"PCA Analysis\",\"assetType\":\"portfolio\"}', 'linkText': 'PCA Analysis' },
        { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Prophet Model Analysis\", \"assetType\": \"asset\"}', 'linkText': 'Prophet Model Analysis' },
        { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Pyfolio Returns Analysis\", \"assetType\": \"asset\"}', 'linkText': 'Pyfolio Returns Analysis' },
        { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Rolling Statistics\", \"assetType\": \"asset\"}', 'linkText': 'Rolling Statistics' },
        { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Time Series Analysis\", \"assetType\": \"asset\"}', 'linkText': 'Time Series Analysis' },
        { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Covariance Analysis\",\"assetType\":\"portfolio\"}', 'linkText': 'Covariance Analysis' },
      ];
      this.messageEvent.emit('splash-screen--hidden');
    });
  }

  /**
   * Fetches the corresponding Confirmed, Recovered and Deaths cases data.
   */
  // public loadDataSets() {
  //   // this.dataRequestConfirmed$ = this.dataService.getDataSet(0, lastCommit);
  //   // this.dataRequestRecovered$ = this.dataService.getDataSet(1, lastCommit);
  //   // this.dataRequestDeaths$ = this.dataService.getDataSet(2, lastCommit);

  //   // forkJoin(this.dataRequestConfirmed$, this.dataRequestRecovered$, this.dataRequestDeaths$).subscribe(results => {
  //     // this.charts.transformChartConfirmedCases(results[0].toString());
  //     // this.charts.transformChartRecoveredCases(results[1].toString());
  //     const data: IDashboard = {
  //       'etf': [{
  //         'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100,
  //         'value': 33590481, 'change': '-5', 'change_pct': '-5'
  //       }],
  //       'futures': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '5' }],
  //       'index': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '5' }],
  //       'currency': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '-5' }],
  //       'mutualfunds': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '-5' }],
  //       'rates': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '0' }],
  //       'earnings': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '0' }],
  //       'fundamentals': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '0' }],
  //       'rss_feeds': [{ 'text': 'Title The UK\'s Covid vaccine program and delta surge means it\'s now a test case for the world' }],
  //       'portfolios': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '0' }],
  //       'mortgagerates': [{ 'sravz_id': 'test1', 'region': '', 'country': 'US', 'lat': 40, 'lon': -100, 'value': 33590481, 'change': '-5', 'change_pct': '0' }],
  //       'charts': [
  //         { 'link': '/asset/all', 'linkParams': '{\"sravzIds\":\"fut_gold\"}', 'linkText': 'Gold Future' },
  //         { 'link': '/asset/all', 'linkParams': '{\"sravzIds\":\"fut_silver\"}', 'linkText': 'Silver Future' },
  //       ],
  //       'economiccalander': [
  //         { 'link': '/economics/calendar', 'linkParams': '{\"autoFetch\": \"true\"}', 'linkText': 'US - Current Week' },
  //       ],
  //       'analytics': [
  //         { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"PCA Analysis\",\"assetType\":\"portfolio\"}', 'linkText': 'PCA Analysis' },
  //         { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Prophet Model Analysis\", \"assetType\": \"asset\"}', 'linkText': 'Prophet Model Analysis' },
  //         { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Pyfolio Returns Analysis\", \"assetType\": \"asset\"}', 'linkText': 'Pyfolio Returns Analysis' },
  //         { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Rolling Statistics\", \"assetType\": \"asset\"}', 'linkText': 'Rolling Statistics' },
  //         { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Time Series Analysis\", \"assetType\": \"asset\"}', 'linkText': 'Time Series Analysis' },
  //         { 'link': '/analytics/all', 'linkParams': '{\"analyticsType\":\"Covariance Analysis\",\"assetType\":\"portfolio\"}', 'linkText': 'Covariance Analysis' },
  //       ]
  //     };

  //     // const jsonDataConfirmed = JSON.parse('{"data":[{"region":"","country":"US","lat":40,"lon":-100,"value":33590481, "change":"-5", "change_pct": "-5%"}]}');
  //     // const jsonDataRecovered = JSON.parse('{"data":[{"region":"","country":"US","lat":40,"lon":-100,"value":33590481}]}');
  //     // const jsonDataDeaths = JSON.parse('{"data":[{"region":"","country":"US","lat":40,"lon":-100,"value":33590481}]}');

  //     // const worldData: ICasesData = { totalConfirmed: jsonDataConfirmed, totalRecovered: jsonDataRecovered, totalDeaths: jsonDataDeaths };

  //     // this.confirmedList.data = jsonDataConfirmed;
  //     // this.indexesList.data = data.indexes;
  //     // this.indexesList.data = this.dashboardData.index;
  //     this.futuresList.data = data.futures;
  //     // this.currenciesList.data = data.currencies;
  //     this.etfsList.data = data.etf;
  //     this.mutualFundsList.data = data.mutualfunds;
  //     this.ratesList.data = data.rates;
  //     this.earningsList.data = data.earnings;
  //     this.fundamentalsList.data = data.fundamentals;
  //     this.portfoliosList.data = data.portfolios;
  //     this.mortgageRatesList.data = data.mortgagerates;
  //     // this.newsList.data = data.news;
  //     this.chartsList.data = data.charts;
  //     this.economicCalendarList.data = data.economiccalander;
  //     this.analyticsList.data = data.analytics;
  //     // this.map.data = worldData;
  //     // this.map.onDataSetSelected({ index: 0 });

  //     // Hide splash screen after the data is loaded
  //     this.messageEvent.emit('splash-screen--hidden');
  //   // });
  // }

  // public ngOnDestroy() {
  //   if (this.dataRequestConfirmed$) {
  //     this.dataRequestConfirmed$.unsubscribe();
  //   }

  //   if (this.dataRequestRecovered$) {
  //     this.dataRequestRecovered$.unsubscribe();
  //   }

  //   if (this.dataRequestDeaths$) {
  //     this.dataRequestDeaths$.unsubscribe();
  //   }
  // }

  public formatDateLabel(item: any): string {
    return item.date.toLocaleDateString();
  }

  public onRegionSelected(region: IRegionData) {
    // this.map.zoomMapToLoc(region.lat, region.lon);
  }

  public showDashboardItem(dashboardItem) {
    return this.dashboardItemSelected && this.dashboardItemSelected !== dashboardItem && this.dashboardItemSelected !== '';
  }
}
