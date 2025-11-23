import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAsset } from './asset.model';
import { AnalyticsService } from '../analytics.service';
import { IgniteUIService } from '../ignite-ui/services/ignite-ui-service';
import { IIgniteUIMessage } from '../ignite-ui/services/ignite-ui-message-model';
import { IgxTabsComponent, IgxToastComponent } from '@infragistics/igniteui-angular';
import { PersistanceService } from '../common/persistance.service';
declare var TradingView;

@Component({
    templateUrl: './assets.component.html',
    standalone: false
})


export class AssetsComponent implements OnInit {
  assets: IAsset[];
  public sravzIds: string[];
  public combinedChartSeriesData: any[];
  public gridApi;
  public defaultColDef;
  imagePathSettle: string;
  imagePathChange: string;
  imagePathInterest: string;
  imagePathVolume: string;
  combinedChartImgUrl: string;
  stockChart: any;
  stockHeatMapChart: any;
  showChart: boolean;
  showChartMarketHeatMap: boolean;
  parentTabWidth: any;
  public selectedAssets: string[];
  public maxNumberOfAssetSelectionAllowed: number;
  @ViewChild('tradingview') tradingview?: ElementRef;
  @ViewChild('tradingview_heatmap') tradingview_heatmap?: ElementRef;
  @ViewChild('tradingview_heatmap_spx500') tradingview_heatmap_spx500?: ElementRef;
  // @ViewChild('tradingview1') tradingview1?: ElementRef;
  @ViewChild('tab') tab?: IgxTabsComponent;
  @ViewChild('toast') toast: { open: (arg0: string) => void; };
  constructor(private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private igniteUIService: IgniteUIService,
    private _renderer2: Renderer2,
    private persistanceService: PersistanceService) {
    this.showChart = false;
    this.stockHeatMapChart = true;
    this.selectedAssets = [];
    this.maxNumberOfAssetSelectionAllowed = 10;
    this.analyticsService.topics[this.analyticsService.TOPIC_PCA].subscribe(
      (message: {
        id: any; kwargs: { device: string; }; data:
        { combined_chart: string; map: (arg0: (item: any) => void) => void; };
      }) => {
        if (message) {
          switch (message.id) {
            case 9.1: {
              if (message.kwargs.device === 'mobile' && message.data) {
                this.combinedChartImgUrl = message.data.combined_chart;
                const combinedChartDataURL: IIgniteUIMessage = {
                  MessageID: this.igniteUIService.MESSAGE_IDS['IGNITEUICOMBINEDCHARTSIMAGEURL'],
                  Message: this.combinedChartImgUrl
                };
                igniteUIService.sendMessage(combinedChartDataURL);
              } else if (message.kwargs.device === 'pc' && message.data) {
                this.combinedChartSeriesData = [];
                message.data.map(item => {
                  const result: any = JSON.parse(item.result).data;
                  result.title = item.title;
                  this.combinedChartSeriesData.push(result);
                }
                );
                const combinedChartSeriesDataMessage: IIgniteUIMessage = {
                  MessageID: this.igniteUIService.MESSAGE_IDS['IGNITEUICOMBINEDCHARTS'],
                  Message: this.combinedChartSeriesData
                };
                igniteUIService.sendMessage(combinedChartSeriesDataMessage);
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

  ngOnInit() {
    this.assets = this.route.snapshot.data['assets'];
    this.route
      .queryParams
      .subscribe(_params => {
        if (_params['sravzIds']) {
          this.sravzIds = _params['sravzIds'].split(',', 10) || [];
        }
      });
    if (this.sravzIds) {
      if (this.sravzIds) {
        this.analyticsService.getCombinedChart(this.sravzIds);
      }
    }
    this.displayChart();
  }

  onAssetsSelected(event) {
    // Return data for the first 10 elements
    // if (event.length > this.maxNumberOfAssetSelectionAllowed) {
    //   this.toast.open("Cannot select more than 10 assets. First 10 assets are used to display the charts.");
    // }
    this.selectedAssets = event.map((asset: { SravzId: any; }) => asset.SravzId).slice(0, this.maxNumberOfAssetSelectionAllowed);
  }

  getCombinedChart() {
    if (this.selectedAssets.length > 0) {
      this.analyticsService.getCombinedChart(this.selectedAssets);
    }
  }

  public displayChart() {
    this.showChart = true;
    this.stockChart = new TradingView.widget(
      {
        container_id: 'tradingview',
        "autosize": true,
        "symbol": "NASDAQ:AAPL",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        width: '100%',
        height: '100%',
      }
    );
  }

  public displayHeatMapChart() {
    this.showChartMarketHeatMap = true;
    let parentWidth = this.tab.viewPort.nativeElement.clientWidth;
    let element = this.tradingview_heatmap?.nativeElement;
    if (element?.childNodes) {
      element.childNodes.forEach(node => {
        this._renderer2.removeChild(element, node)
      })
    }
    element = this.tradingview_heatmap_spx500?.nativeElement;
    if (element?.childNodes) {
      element.childNodes.forEach(node => {
        this._renderer2.removeChild(element, node)
      })
    }

    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.text = `
    {
      "exchanges": [
        "ADX",
        "AMEX",
        "ASX",
        "BER",
        "BET",
        "BIST",
        "BSE",
        "BX",
        "CSE",
        "CSECY",
        "DUS",
        "EURONEXT",
        "FWB",
        "GPW",
        "HAM",
        "HNX",
        "IDX",
        "JSE",
        "KRX",
        "KSE",
        "LSE",
        "MIL",
        "MUN",
        "NASDAQ",
        "NASDAQDUBAI",
        "NEO",
        "NEWCONNECT",
        "NYSE",
        "OMXCOP",
        "OMXHEX",
        "OMXICE",
        "OMXRSE",
        "OMXSTO",
        "OMXTSE",
        "OMXVSE",
        "OTC",
        "SSE",
        "TASE",
        "TPEX",
        "TSX",
        "TSXV",
        "UPCOM",
        "XETR"
      ],
      "dataSource": "NASDAQ100",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": "light",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "width": "${parentWidth}",
      "height": "800"
    }`;
    this.tradingview_heatmap?.nativeElement.appendChild(script);

    script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.text = `
    {
      "exchanges": [],
      "dataSource": "SPX500",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": "light",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "width": "${parentWidth}",
      "height": "800"
    }`;
    this.tradingview_heatmap_spx500?.nativeElement.appendChild(script);
    // this._renderer2.listen(element, "load", () => {
    //   setTimeout(() => {
    //     let iframe = element.querySelector('iframe').contentWindow.document.querySelector();
    //     alert("hellow world");
    //   }, 50);
    // });

    // this.stockHeatMapChart = new TradingView.widget(
    //   {
    //     container_id: 'tradingview_heatmap',
    //     "exchanges": [],
    //     "dataSource": "SPX500",
    //     "grouping": "sector",
    //     "blockSize": "market_cap_basic",
    //     "blockColor": "change",
    //     "locale": "en",
    //     "symbolUrl": "",
    //     "colorTheme": "light",
    //     "hasTopBar": false,
    //     "isDataSetEnabled": false,
    //     "isZoomEnabled": true,
    //     "hasSymbolTooltip": true,
    //     "width": "100%",
    //     "height": "100%"
    //   }
    // );
  }

  public onTabSelected(event): void {
    this.showChart = false;
    this.showChartMarketHeatMap = false;
    this.parentTabWidth = this.tab.viewPort.nativeElement.clientWidth;
    if (this.tab.selectedIndex == 0) {
      this.displayChart();
    } if (this.tab.selectedIndex == 1) {
      this.displayHeatMapChart();
    }
  }

}
