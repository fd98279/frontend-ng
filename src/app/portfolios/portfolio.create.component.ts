import { Component, Injectable, ViewChild, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuote, IPortfolioAsset, IPortfolio } from '../quotes/quotes.model';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from './portfolio.service';
import { IPortfolioRaw, IPortfolioBulk } from './portfolio.model';
import { QuoteService } from '../quotes/quotes.service';
import { IgniteUIService } from '../ignite-ui/services/ignite-ui-service';
import { IIgniteUIMessage } from '../ignite-ui/services/ignite-ui-message-model';
import { PersistanceService } from '../common/persistance.service';

interface RandomPortfolioSettings {
  portfolioName: string;
  numberOfAssets: number;
  strategy: string;
  selectedAssetTypes: string[];
}

interface AssetTypeOption {
  type: string;
  display: string;
  weight: number;
}


@Injectable()

@Component({
    templateUrl: './portfolio.create.component.html',
    selector: 'portfolio-create',
    styleUrls: ['./portfolio.create.component.scss'],
    standalone: false
})

export class PortfolioCreateComponent implements OnInit {
  public futureQuotes: IQuote[];
  public snpQuotes: IQuote[];
  public indexQuotes: IQuote[];
  public currencyQuotes: IQuote[];
  public ratesQuotes: IQuote[];
  public cryptoQuotes: IQuote[];
  public etfQuotes: IQuote[];
  public vixQuotes: IQuote[];
  public portfolioAssets: IPortfolioAsset[];
  public readOnly = false;
  
  // Random portfolio generation properties
  public showRandomGenerator = false;
  public isGeneratingRandom = false;
  public currentDate = new Date();
  
  public randomPortfolioSettings: RandomPortfolioSettings = {
    portfolioName: `Random Portfolio ${new Date().getMonth() + 1}${new Date().getDate()}`,
    numberOfAssets: 5,
    strategy: 'balanced',
    selectedAssetTypes: ['Futures', 'Stocks', 'ETF', 'Crypto', 'Currency']
  };

  // Maximum number of assets allowed in random portfolio
  public readonly MAX_RANDOM_ASSETS = 10;

  public assetTypeOptions: AssetTypeOption[] = [
    { type: 'Futures', display: 'Futures', weight: 0.2 },
    { type: 'Stocks', display: 'Stocks', weight: 0.3 },
    { type: 'Index', display: 'Indices', weight: 0.15 },
    { type: 'ETF', display: 'ETFs', weight: 0.2 },
    { type: 'Crypto', display: 'Crypto', weight: 0.1 },
    { type: 'Currency', display: 'Currency', weight: 0.05 },
    { type: 'Rates', display: 'Rates', weight: 0.05 }
  ];

  private strategyAllocations = {
    balanced: { Futures: 20, Stocks: 40, Index: 15, ETF: 15, Crypto: 5, Currency: 3, Rates: 2 },
    growthFocused: { Futures: 10, Stocks: 50, Index: 10, ETF: 20, Crypto: 8, Currency: 1, Rates: 1 },
    conservative: { Futures: 5, Stocks: 25, Index: 30, ETF: 25, Crypto: 2, Currency: 8, Rates: 5 },
    aggressive: { Futures: 30, Stocks: 35, Index: 5, ETF: 15, Crypto: 12, Currency: 2, Rates: 1 },
    diversified: { Futures: 15, Stocks: 25, Index: 15, ETF: 20, Crypto: 8, Currency: 10, Rates: 7 }
  };

  constructor(private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private quoteService: QuoteService,
    private igniteUIService: IgniteUIService,
    private toastrService: ToastrService,
    private persistanceService: PersistanceService,
  ) {
  }


  public ngOnInit(): void {
    this.futureQuotes = this.route.snapshot.data['futureQuotes'];
    this.indexQuotes = this.route.snapshot.data['indexQuotes'];
    this.currencyQuotes = this.route.snapshot.data['currencyQuotes'];
    this.ratesQuotes = this.route.snapshot.data['ratesQuotes'];
    this.cryptoQuotes = this.route.snapshot.data['cryptoQuotes'];
    this.etfQuotes = this.route.snapshot.data['etfQuotes'];
  }

  onBulkPortfolioCreate(rawPortfolio: IPortfolioBulk) {
    console.log(rawPortfolio);
  }

  onPortfolioCreate(rawPortfolio: IPortfolioRaw) {
    // Total weight must be 100%
    // if (Math.floor(rawPortfolio.percent) !== 100) {
    //   this.toastrService.info(`Total portfolio weight is not 100% - Total weight ${rawPortfolio.percent}`,null, {
    //    positionClass: 'toast-bottom-center' });
    // }
    // Make sure to create a deep copy of the form-model
    const portfolio: IPortfolio = Object.assign({}, rawPortfolio);
    portfolio.portfolioassets = [];
    rawPortfolio.portfolioassets.forEach((o) => {
      if (o._id || o.id) {
        portfolio.portfolioassets.push({
          AssetId: o._id || o.id,
          SravzId: o.SravzId,
          purchaseprice: o.Last,
          quantity: o.Weight_Price/o.Last,
          weight: o.Weight_Pct,
          pnl: 0,
          value: o.Weight_Price,
          created: new Date()
        });
      }
    });
    // Allow 0 value portoflio
    // if (portfolio.portfolioassets.length > 0 && portfolio.cost > 0) {
      if (portfolio.portfolioassets.length > 0) {
      this.portfolioService.createPortfolio(portfolio)
        .subscribe(data => {
          if (!data.error) {
            this.toastrService.success('Portfolio Created', null, {
              positionClass: 'toast-bottom-center'
            });
          }
        }
        );
    } else {
      this.toastrService.info('Either selected portfolio assets or the portfolio value is 0', null, {
        positionClass: 'toast-bottom-center'
      });
    }
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

  // Random Portfolio Generation Methods
  public generateRandomPortfolio(): void {
    this.showRandomGenerator = !this.showRandomGenerator;
  }

  public toggleAssetType(assetType: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.randomPortfolioSettings.selectedAssetTypes.includes(assetType)) {
        this.randomPortfolioSettings.selectedAssetTypes.push(assetType);
      }
    } else {
      const index = this.randomPortfolioSettings.selectedAssetTypes.indexOf(assetType);
      if (index > -1) {
        this.randomPortfolioSettings.selectedAssetTypes.splice(index, 1);
      }
    }
  }

  public validateAssetCount(): void {
    if (this.randomPortfolioSettings.numberOfAssets > this.MAX_RANDOM_ASSETS) {
      this.randomPortfolioSettings.numberOfAssets = this.MAX_RANDOM_ASSETS;
      this.toastrService.info(`Maximum ${this.MAX_RANDOM_ASSETS} assets allowed`, 'Info', {
        positionClass: 'toast-bottom-center'
      });
    }
  }

  public createRandomPortfolio(): void {
    if (this.randomPortfolioSettings.selectedAssetTypes.length === 0) {
      this.toastrService.warning('Please select at least one asset type', 'Warning', {
        positionClass: 'toast-bottom-center'
      });
      return;
    }

    // Enforce maximum asset limit
    if (this.randomPortfolioSettings.numberOfAssets > this.MAX_RANDOM_ASSETS) {
      this.toastrService.warning(`Maximum ${this.MAX_RANDOM_ASSETS} assets allowed for random portfolios`, 'Warning', {
        positionClass: 'toast-bottom-center'
      });
      this.randomPortfolioSettings.numberOfAssets = this.MAX_RANDOM_ASSETS;
      return;
    }

    this.isGeneratingRandom = true;
    
    try {
      const randomAssets = this.selectRandomAssets();
      const portfolioWithWeights = this.assignRandomWeights(randomAssets);
      
      // Create the portfolio using existing logic
      const rawPortfolio: IPortfolioRaw = {
        _id: '',
        name: this.randomPortfolioSettings.portfolioName || `Random Portfolio ${Date.now()}`,
        description: `Auto-generated ${this.randomPortfolioSettings.strategy} portfolio with ${this.randomPortfolioSettings.numberOfAssets} assets`,
        cost: 100, // Notional value
        value: 100,
        percent: 100,
        pnl: 0,
        ispublic: false,
        portfolioassets: portfolioWithWeights,
        created: new Date(),
        pnlcalculationdt: new Date()
      };

      this.onPortfolioCreate(rawPortfolio);
      
      this.toastrService.success(
        `Random ${this.randomPortfolioSettings.strategy} portfolio created with ${portfolioWithWeights.length} assets`, 
        'Success',
        { positionClass: 'toast-bottom-center' }
      );

      this.showRandomGenerator = false;
      this.resetRandomSettings();
      
    } catch (error) {
      this.toastrService.error('Failed to create random portfolio. Please try again.', 'Error', {
        positionClass: 'toast-bottom-center'
      });
    } finally {
      this.isGeneratingRandom = false;
    }
  }

  private selectRandomAssets(): any[] {
    const selectedAssets: any[] = [];
    const strategy = this.strategyAllocations[this.randomPortfolioSettings.strategy];
    const targetCount = Math.min(parseInt(this.randomPortfolioSettings.numberOfAssets.toString()), this.MAX_RANDOM_ASSETS);
    
    // Get allocation per asset type based on strategy
    const assetTypeDistribution = this.calculateAssetTypeDistribution(strategy, targetCount);
    
    // Select random assets from each type
    for (const [assetType, count] of Object.entries(assetTypeDistribution)) {
      if (count > 0 && this.randomPortfolioSettings.selectedAssetTypes.includes(assetType)) {
        const assetsOfType = this.getAssetsForType(assetType);
        if (assetsOfType && assetsOfType.length > 0) {
          const randomAssetsFromType = this.getRandomItemsFromArray(assetsOfType, count);
          selectedAssets.push(...randomAssetsFromType.map(asset => ({
            ...asset,
            assetType: assetType
          })));
        }
      }
    }

    // If we don't have enough assets, fill from largest available pools
    while (selectedAssets.length < targetCount) {
      const availableTypes = this.randomPortfolioSettings.selectedAssetTypes.filter(type => {
        const assets = this.getAssetsForType(type);
        return assets && assets.length > 0;
      });
      
      if (availableTypes.length === 0) break;
      
      const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const assets = this.getAssetsForType(randomType);
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      
      // Avoid duplicates
      if (!selectedAssets.some(a => a.SravzId === randomAsset.SravzId)) {
        selectedAssets.push({...randomAsset, assetType: randomType});
      }
    }

    return selectedAssets.slice(0, targetCount);
  }

  private calculateAssetTypeDistribution(strategy: any, targetCount: number): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};
    const availableTypes = this.randomPortfolioSettings.selectedAssetTypes;
    
    // Calculate proportional distribution
    let totalWeight = 0;
    availableTypes.forEach(type => {
      totalWeight += strategy[type] || 0;
    });
    
    let allocated = 0;
    availableTypes.forEach((type, index) => {
      const weight = strategy[type] || 0;
      const proportion = weight / totalWeight;
      
      if (index === availableTypes.length - 1) {
        // Last type gets remaining assets
        distribution[type] = targetCount - allocated;
      } else {
        const count = Math.max(1, Math.round(targetCount * proportion));
        distribution[type] = count;
        allocated += count;
      }
    });
    
    return distribution;
  }

  private getAssetsForType(assetType: string): IQuote[] {
    switch (assetType) {
      case 'Futures':
        return this.futureQuotes || [];
      case 'Stocks':
        return this.snpQuotes || [];
      case 'Index':
        return this.indexQuotes || [];
      case 'Currency':
        return this.currencyQuotes || [];
      case 'Rates':
        return this.ratesQuotes || [];
      case 'Crypto':
        return this.cryptoQuotes || [];
      case 'ETF':
        return this.etfQuotes || [];
      default:
        return [];
    }
  }

  private getRandomItemsFromArray<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  private assignRandomWeights(assets: any[]): any[] {
    const totalAssets = assets.length;
    let remainingWeight = 100;
    
    const portfolioAssets = assets.map((asset, index) => {
      let weight: number;
      
      if (index === totalAssets - 1) {
        // Last asset gets remaining weight
        weight = remainingWeight;
      } else {
        // Generate random weight between 5% and 25% for balanced distribution
        const minWeight = 5;
        const maxWeight = Math.min(25, remainingWeight - (totalAssets - index - 1) * minWeight);
        weight = Math.random() * (maxWeight - minWeight) + minWeight;
        weight = Math.round(weight * 100) / 100; // Round to 2 decimal places
        remainingWeight -= weight;
      }
      
      return {
        _id: asset._id || asset.id,
        id: asset._id || asset.id,
        SravzId: asset.SravzId,
        Name: asset.Name,
        Last: asset.Last,
        Weight_Pct: weight,
        Weight_Price: (100 * weight) / 100, // Based on $100 notional
        assetType: asset.assetType
      };
    });

    // Send the generated assets to the grid component
    this.sendRandomAssetsToGrid(portfolioAssets);
    
    return portfolioAssets;
  }

  private sendRandomAssetsToGrid(portfolioAssets: any[]): void {
    // Send message to grid component to populate with random assets
    const randomPortfolioMessage: IIgniteUIMessage = {
      MessageID: this.igniteUIService.MESSAGE_IDS['RANDOM_PORTFOLIO'] || 'RANDOM_PORTFOLIO',
      Message: {
        portfolioAssets: portfolioAssets,
        portfolioName: this.randomPortfolioSettings.portfolioName
      }
    };
    this.igniteUIService.sendMessage(randomPortfolioMessage);
  }

  private resetRandomSettings(): void {
    this.randomPortfolioSettings = {
      portfolioName: `Random Portfolio ${new Date().getMonth() + 1}${new Date().getDate()}`,
      numberOfAssets: 5,
      strategy: 'balanced',
      selectedAssetTypes: ['Futures', 'Stocks', 'ETF', 'Crypto', 'Currency']
    };
    
    // Ensure numberOfAssets doesn't exceed maximum
    if (this.randomPortfolioSettings.numberOfAssets > this.MAX_RANDOM_ASSETS) {
      this.randomPortfolioSettings.numberOfAssets = this.MAX_RANDOM_ASSETS;
    }
  }
}
