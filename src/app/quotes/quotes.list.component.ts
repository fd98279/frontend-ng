import { Component, Injectable, ViewChild, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IQuote, IPortfolioAsset, IPortfolio } from '../quotes/quotes.model';
import { QuoteService } from '../quotes/quotes.service';
import { IgniteUIService } from '../ignite-ui/services/ignite-ui-service';
import { IIgniteUIMessage } from '../ignite-ui/services/ignite-ui-message-model';
import { IgxTabsComponent } from '@infragistics/igniteui-angular';
import { PersistanceService } from '../common/persistance.service';
declare var TradingView;

@Component({
    templateUrl: './quotes.list.component.html',
    standalone: false
})


export class QuoteListComponent implements OnInit, AfterViewInit {
  public futureQuotes: IQuote[];
  public snpQuotes: IQuote[];
  public indexQuotes: IQuote[];
  public currencyQuotes: IQuote[];
  public ratesQuotes: IQuote[];
  public cryptoQuotes: IQuote[];
  public vixQuotes: IQuote[];
  public etfQuotes: IQuote[];
  public portfolioAssets: IPortfolioAsset[];
  public readOnly = true;
  public showChart: boolean;
  periods = ['1M', '3M', '1Y', '5Y', 'All'];
  stockChart: any;

  @ViewChild('tradingview') tradingview?: ElementRef;
  @ViewChild('tradingview_stocks') tradingview_stocks?: ElementRef;
  @ViewChild('tradingview_indices') tradingview_indices?: ElementRef;
  @ViewChild('tradingview_futures') tradingview_futures?: ElementRef;
  @ViewChild('tradingview_forex') tradingview_forex?: ElementRef;
  @ViewChild('tradingview_crypto') tradingview_crypto?: ElementRef;
  // @ViewChild('tradingview1') tradingview1?: ElementRef;
  @ViewChild('tab') tab?: IgxTabsComponent;

  constructor(private route: ActivatedRoute,
    private quoteService: QuoteService,
    private igniteUIService: IgniteUIService,
    private _renderer2: Renderer2,
    private persistanceService: PersistanceService
  ) {
  }

  public ngOnInit(): void {
    this.showChart = false;
    this.futureQuotes = this.route.snapshot.data['futureQuotes'];
    this.indexQuotes = this.route.snapshot.data['indexQuotes'];
    this.currencyQuotes = this.route.snapshot.data['currencyQuotes'];
    this.ratesQuotes = this.route.snapshot.data['ratesQuotes'];
    this.cryptoQuotes = this.route.snapshot.data['cryptoQuotes'];
    this.etfQuotes = this.route.snapshot.data['etfQuotes'];
  }


  onPortfolioCreate(rawPortfolio: any) {
    // Not handled
  }

  public onFetchSnpQuotes(selectedStartCharaters: string[]) {
    this.quoteService.
      getStockQuotesByTickerStartLetter(selectedStartCharaters.join(',')).subscribe((snpQuotes) => {
        this.snpQuotes = snpQuotes;
        const indexQuotesData: IIgniteUIMessage = {
          MessageID: this.igniteUIService.MESSAGE_IDS['SNPQUOTES'],
          Message: snpQuotes
        };
        this.igniteUIService.sendMessage(indexQuotesData);
      });
  }

  ngAfterViewInit(): void {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.text = `
    {
      "width": "100%",
      "height": "500",
      "symbolsGroups": [
        {
          "name": "Indices",
          "originalName": "Indices",
          "symbols": [
            {
              "name": "FOREXCOM:SPXUSD",
              "displayName": "S&P 500"
            },
            {
              "name": "FOREXCOM:NSXUSD",
              "displayName": "US 100"
            },
            {
              "name": "FOREXCOM:DJI",
              "displayName": "Dow 30"
            },
            {
              "name": "INDEX:NKY",
              "displayName": "Nikkei 225"
            },
            {
              "name": "INDEX:DEU40",
              "displayName": "DAX Index"
            },
            {
              "name": "FOREXCOM:UKXGBP",
              "displayName": "UK 100"
            }
          ]
        },
        {
          "name": "Futures",
          "originalName": "Futures",
          "symbols": [
            {
              "name": "CME_MINI:ES1!",
              "displayName": "S&P 500"
            },
            {
              "name": "CME:6E1!",
              "displayName": "Euro"
            },
            {
              "name": "COMEX:GC1!",
              "displayName": "Gold"
            },
            {
              "name": "NYMEX:CL1!",
              "displayName": "Crude Oil"
            },
            {
              "name": "NYMEX:NG1!",
              "displayName": "Natural Gas"
            },
            {
              "name": "CBOT:ZC1!",
              "displayName": "Corn"
            }
          ]
        },
        {
          "name": "Bonds",
          "originalName": "Bonds",
          "symbols": [
            {
              "name": "CME:GE1!",
              "displayName": "Eurodollar"
            },
            {
              "name": "CBOT:ZB1!",
              "displayName": "T-Bond"
            },
            {
              "name": "CBOT:UB1!",
              "displayName": "Ultra T-Bond"
            },
            {
              "name": "EUREX:FGBL1!",
              "displayName": "Euro Bund"
            },
            {
              "name": "EUREX:FBTP1!",
              "displayName": "Euro BTP"
            },
            {
              "name": "EUREX:FGBM1!",
              "displayName": "Euro BOBL"
            }
          ]
        },
        {
          "name": "Forex",
          "originalName": "Forex",
          "symbols": [
            {
              "name": "FX:EURUSD",
              "displayName": "EUR/USD"
            },
            {
              "name": "FX:GBPUSD",
              "displayName": "GBP/USD"
            },
            {
              "name": "FX:USDJPY",
              "displayName": "USD/JPY"
            },
            {
              "name": "FX:USDCHF",
              "displayName": "USD/CHF"
            },
            {
              "name": "FX:AUDUSD",
              "displayName": "AUD/USD"
            },
            {
              "name": "FX:USDCAD",
              "displayName": "USD/CAD"
            }
          ]
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "${this.persistanceService.get('theme')}",
      "isTransparent": false,
      "locale": "en"
    }
    `;
    this.tradingview?.nativeElement.appendChild(script);

    let script_stocks = this._renderer2.createElement('script');
    script_stocks.type = `text/javascript`;
    script_stocks.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script_stocks.text = `
    {
      "title": "Stocks",
      "width": "100%",
      "height": 500,
      "locale": "en",
      "showSymbolLogo": true,
      "symbolsGroups": [
        {
          "name": "Financial",
          "symbols": [
            {
              "name": "NYSE:JPM",
              "displayName": "Jpmorgan Chase & Co"
            },
            {
              "name": "NYSE:WFC",
              "displayName": "Wells Fargo Co New"
            },
            {
              "name": "NYSE:BAC",
              "displayName": "Bank Amer Corp"
            },
            {
              "name": "NYSE:HSBC",
              "displayName": "Hsbc Hldgs Plc"
            },
            {
              "name": "NYSE:C",
              "displayName": "Citigroup Inc"
            },
            {
              "name": "NYSE:MA",
              "displayName": "Mastercard Incorporated"
            }
          ]
        },
        {
          "name": "Technology",
          "symbols": [
            {
              "name": "NASDAQ:AAPL",
              "displayName": "Apple"
            },
            {
              "name": "NASDAQ:GOOGL",
              "displayName": "Google Inc"
            },
            {
              "name": "NASDAQ:MSFT",
              "displayName": "Microsoft Corp"
            },
            {
              "name": "NASDAQ:FB",
              "displayName": "Meta Platforms, Inc"
            },
            {
              "name": "NYSE:ORCL",
              "displayName": "Oracle Corp"
            },
            {
              "name": "NASDAQ:INTC",
              "displayName": "Intel Corp"
            }
          ]
        },
        {
          "name": "Services",
          "symbols": [
            {
              "name": "NASDAQ:AMZN",
              "displayName": "Amazon Com Inc"
            },
            {
              "name": "NYSE:BABA",
              "displayName": "Alibaba Group Hldg Ltd"
            },
            {
              "name": "NYSE:T",
              "displayName": "At&t Inc"
            },
            {
              "name": "NYSE:WMT",
              "displayName": "Wal-mart Stores Inc"
            },
            {
              "name": "NYSE:V",
              "displayName": "Visa Inc"
            }
          ]
        }
      ],
      "colorTheme": "${this.persistanceService.get('theme')}"
    }
    `;
    this.tradingview_stocks?.nativeElement.appendChild(script_stocks);

    let script_indices = this._renderer2.createElement('script');
    script_indices.type = `text/javascript`;
    script_indices.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script_indices.text = `
    {
      "title": "Indices",
      "width": "100%",
      "height": 500,
      "locale": "en",
      "showSymbolLogo": true,
      "symbolsGroups": [
        {
          "name": "US & Canada",
          "symbols": [
            {
              "name": "FOREXCOM:SPXUSD",
              "displayName": "S&P 500"
            },
            {
              "name": "FOREXCOM:NSXUSD",
              "displayName": "US 100"
            },
            {
              "name": "CME_MINI:ES1!",
              "displayName": "S&P 500"
            },
            {
              "name": "INDEX:DXY",
              "displayName": "U.S. Dollar Currency Index"
            },
            {
              "name": "FOREXCOM:DJI",
              "displayName": "Dow 30"
            }
          ]
        },
        {
          "name": "Europe",
          "symbols": [
            {
              "name": "INDEX:SX5E",
              "displayName": "Euro Stoxx 50"
            },
            {
              "name": "FOREXCOM:UKXGBP",
              "displayName": "UK 100"
            },
            {
              "name": "INDEX:DEU40",
              "displayName": "DAX Index"
            },
            {
              "name": "INDEX:CAC40",
              "displayName": "CAC 40 Index"
            },
            {
              "name": "INDEX:SMI",
              "displayName": "SWISS MARKET INDEX SMI® PRICE"
            }
          ]
        },
        {
          "name": "Asia/Pacific",
          "symbols": [
            {
              "name": "INDEX:NKY",
              "displayName": "Nikkei 225"
            },
            {
              "name": "INDEX:HSI",
              "displayName": "Hang Seng"
            },
            {
              "name": "BSE:SENSEX",
              "displayName": "BSE SENSEX"
            },
            {
              "name": "BSE:BSE500",
              "displayName": "S&P BSE 500 INDEX"
            },
            {
              "name": "INDEX:KSIC",
              "displayName": "Kospi Composite"
            }
          ]
        }
      ],
      "colorTheme": "${this.persistanceService.get('theme')}"
    }
    `;
    this.tradingview_indices?.nativeElement.appendChild(script_indices);

    let script_futures = this._renderer2.createElement('script');
    script_futures.type = `text/javascript`;
    script_futures.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script_futures.text = `
    {
      "title": "Futures",
      "width": "100%",
      "height": 500,
      "locale": "en",
      "showSymbolLogo": true,
      "symbolsGroups": [
        {
          "name": "Energy",
          "symbols": [
            {
              "name": "NYMEX:CL1!",
              "displayName": "Crude Oil"
            },
            {
              "name": "NYMEX:NG1!",
              "displayName": "Natural Gas"
            },
            {
              "name": "TVC:UKOIL",
              "displayName": "Brent Oil"
            },
            {
              "name": "NYMEX:RB1!",
              "displayName": "Gasoline"
            },
            {
              "name": "NYMEX:HO1!",
              "displayName": "Heating Oil"
            },
            {
              "name": "NYMEX:AEZ1!",
              "displayName": "Ethanol"
            }
          ]
        },
        {
          "name": "Metals",
          "symbols": [
            {
              "name": "COMEX:GC1!",
              "displayName": "Gold"
            },
            {
              "name": "COMEX:SI1!",
              "displayName": "Silver"
            },
            {
              "name": "NYMEX:PL1!",
              "displayName": "Platinum"
            },
            {
              "name": "COMEX_MINI:QC1!",
              "displayName": "Copper"
            },
            {
              "name": "COMEX:ZNC1!",
              "displayName": "Zinc"
            },
            {
              "name": "COMEX:TIO1!",
              "displayName": "Iron Ore"
            }
          ]
        },
        {
          "name": "Agricultural",
          "symbols": [
            {
              "name": "NYMEX:KT1!",
              "displayName": "Coffee"
            },
            {
              "name": "NYMEX:TT1!",
              "displayName": "Cotton"
            },
            {
              "name": "CBOT:ZS1!",
              "displayName": "Soybean"
            },
            {
              "name": "CBOT:ZW1!",
              "displayName": "Wheat"
            },
            {
              "name": "NYMEX:YO1!",
              "displayName": "Sugar"
            },
            {
              "name": "CBOT:ZC1!",
              "displayName": "Corn"
            }
          ]
        },
        {
          "name": "Currencies",
          "symbols": [
            {
              "name": "CME:6E1!",
              "displayName": "Euro"
            },
            {
              "name": "CME:6B1!",
              "displayName": "British Pound"
            },
            {
              "name": "CME:6J1!",
              "displayName": "Japanese Yen"
            },
            {
              "name": "CME:6S1!",
              "displayName": "Swiss Franc"
            },
            {
              "name": "CME:6A1!",
              "displayName": "Australian Dollar"
            },
            {
              "name": "CME:6C1!",
              "displayName": "Canadian Dollar"
            }
          ]
        },
        {
          "name": "Indices",
          "symbols": [
            {
              "name": "CME_MINI:ES1!",
              "displayName": "S&P 500"
            },
            {
              "name": "CME_MINI:NQ1!",
              "displayName": "Nasdaq 100"
            },
            {
              "name": "CBOT_MINI:YM1!",
              "displayName": "Dow 30"
            },
            {
              "name": "CME:NKD1!",
              "displayName": "Nikkei 225"
            },
            {
              "name": "EUREX:FDAX1!",
              "displayName": "DAX"
            },
            {
              "name": "CME:IBV1!",
              "displayName": "IBovespa"
            }
          ]
        },
        {
          "name": "Interest Rates",
          "symbols": [
            {
              "name": "CBOT:ZN1!",
              "displayName": "10 Year T-Note"
            },
            {
              "name": "CBOT:ZF1!",
              "displayName": "5 Year T-Note"
            },
            {
              "name": "CBOT:Z3N1!",
              "displayName": "3 Year T-Note"
            },
            {
              "name": "CBOT:ZT1!",
              "displayName": "2 Year T-Note"
            },
            {
              "name": "CBOT:ZQ1!",
              "displayName": "30-day FED Funds IR"
            },
            {
              "name": "CBOT:ZB1!",
              "displayName": "T-Bond"
            }
          ]
        }
      ],
      "colorTheme": "${this.persistanceService.get('theme')}"
    }
    `;
    this.tradingview_futures?.nativeElement.appendChild(script_futures);


    let script_forex = this._renderer2.createElement('script');
    script_forex.type = `text/javascript`;
    script_forex.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script_forex.text = `
      {
      "title": "Currencies",
      "title_link": "/markets/currencies/rates-major/",
      "width": "100%",
      "height": 500,
      "locale": "en",
      "showSymbolLogo": true,
      "symbolsGroups": [
        {
          "name": "Major",
          "symbols": [
            {
              "name": "FX_IDC:EURUSD",
              "displayName": "EUR/USD"
            },
            {
              "name": "FX_IDC:USDJPY",
              "displayName": "USD/JPY"
            },
            {
              "name": "FX_IDC:GBPUSD",
              "displayName": "GBP/USD"
            },
            {
              "name": "FX_IDC:AUDUSD",
              "displayName": "AUD/USD"
            },
            {
              "name": "FX_IDC:USDCAD",
              "displayName": "USD/CAD"
            },
            {
              "name": "FX_IDC:USDCHF",
              "displayName": "USD/CHF"
            }
          ]
        },
        {
          "name": "Minor",
          "symbols": [
            {
              "name": "FX_IDC:EURGBP",
              "displayName": "EUR/GBP"
            },
            {
              "name": "FX_IDC:EURJPY",
              "displayName": "EUR/JPY"
            },
            {
              "name": "FX_IDC:GBPJPY",
              "displayName": "GBP/JPY"
            },
            {
              "name": "FX_IDC:CADJPY",
              "displayName": "CAD/JPY"
            },
            {
              "name": "FX_IDC:GBPCAD",
              "displayName": "GBP/CAD"
            },
            {
              "name": "FX_IDC:EURCAD",
              "displayName": "EUR/CAD"
            }
          ]
        },
        {
          "name": "Exotic",
          "symbols": [
            {
              "name": "FX_IDC:USDSEK",
              "displayName": "USD/SEK"
            },
            {
              "name": "FX_IDC:USDMXN",
              "displayName": "USD/MXN"
            },
            {
              "name": "FX_IDC:USDZAR",
              "displayName": "USD/ZAR"
            },
            {
              "name": "FX_IDC:EURTRY",
              "displayName": "EUR/TRY"
            },
            {
              "name": "FX_IDC:EURNOK",
              "displayName": "EUR/NOK"
            },
            {
              "name": "FX_IDC:GBPPLN",
              "displayName": "GBP/PLN"
            }
          ]
        }
      ],
      "colorTheme": "${this.persistanceService.get('theme')}"
    }
    `;
    this.tradingview_forex?.nativeElement.appendChild(script_forex);

    let script_crypto = this._renderer2.createElement('script');
    script_crypto.type = `text/javascript`;
    script_crypto.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script_crypto.text = `
    {
      "title": "Cryptocurrencies",
      "title_raw": "Cryptocurrencies",
      "title_link": "/markets/cryptocurrencies/prices-all/",
      "width": "100%",
      "height": 500,
      "locale": "en",
      "showSymbolLogo": true,
      "symbolsGroups": [
        {
          "name": "Overview",
          "symbols": [
            {
              "name": "CRYPTOCAP:TOTAL"
            },
            {
              "name": "BITSTAMP:BTCUSD"
            },
            {
              "name": "BITSTAMP:ETHUSD"
            },
            {
              "name": "FTX:SOLUSD"
            },
            {
              "name": "BINANCE:AVAXUSD"
            },
            {
              "name": "COINBASE:UNIUSD"
            }
          ]
        },
        {
          "name": "Bitcoin",
          "symbols": [
            {
              "name": "BITSTAMP:BTCUSD"
            },
            {
              "name": "COINBASE:BTCEUR"
            },
            {
              "name": "COINBASE:BTCGBP"
            },
            {
              "name": "BITFLYER:BTCJPY"
            },
            {
              "name": "CEXIO:BTCRUB"
            },
            {
              "name": "CME:BTC1!"
            }
          ]
        },
        {
          "name": "Ethereum",
          "symbols": [
            {
              "name": "BITSTAMP:ETHUSD"
            },
            {
              "name": "KRAKEN:ETHEUR"
            },
            {
              "name": "COINBASE:ETHGBP"
            },
            {
              "name": "BITFLYER:ETHJPY"
            },
            {
              "name": "BINANCE:ETHBTC"
            },
            {
              "name": "BINANCE:ETHUSDT"
            }
          ]
        },
        {
          "name": "Solana",
          "symbols": [
            {
              "name": "FTX:SOLUSD"
            },
            {
              "name": "BINANCE:SOLEUR"
            },
            {
              "name": "COINBASE:SOLGBP"
            },
            {
              "name": "BINANCE:SOLBTC"
            },
            {
              "name": "HUOBI:SOLETH"
            },
            {
              "name": "BINANCE:SOLUSDT"
            }
          ]
        },
        {
          "name": "Uniswap",
          "symbols": [
            {
              "name": "COINBASE:UNIUSD"
            },
            {
              "name": "KRAKEN:UNIEUR"
            },
            {
              "name": "COINBASE:UNIGBP"
            },
            {
              "name": "BINANCE:UNIBTC"
            },
            {
              "name": "KRAKEN:UNIETH"
            },
            {
              "name": "BINANCE:UNIUSDT"
            }
          ]
        }
      ],
      "colorTheme": "${this.persistanceService.get('theme')}"
  }
  `;
    this.tradingview_crypto?.nativeElement.appendChild(script_crypto);
  }
  // public onTabSelected(event): void {
  //   if (this.tab.selectedIndex == 0 || this.tab.selectedIndex == 1) {
  //     this.showChart = true;
  //   } else {
  //     this.showChart = false;
  //   }
  // }

}

