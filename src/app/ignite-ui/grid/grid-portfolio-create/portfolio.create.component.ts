import { DatePipe } from '@angular/common';
import { Component, Injectable, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  ConnectedPositioningStrategy, IgxSummaryResult, IgxNumberSummaryOperand,
  ISelectionEventArgs, IgxGridComponent, IgxDropDownComponent,
  IgxInputGroupComponent,
  HorizontalAlignment,
  VerticalAlignment,
  NoOpScrollStrategy,
  IgxDateSummaryOperand,
  IgxSummaryOperand
} from '@infragistics/igniteui-angular';
import { IQuote, IPortfolioAsset } from '../../../quotes/quotes.model';
import { IgniteUIService } from '../../services/ignite-ui-service';
import { NumberWithCommasPipe } from '../../../@theme/pipes';

@Injectable()

@Component({
    templateUrl: './portfolio.create.component.html',
    selector: 'grid-portfolio-create',
    styleUrls: ['./portfolio.create.component.scss'],
    standalone: false
})

export class PortfolioCreateGridComponent implements AfterViewInit {
  @Input() futureQuotes: IQuote[];
  @Input() snpQuotes: IQuote[];
  @Input() indexQuotes: IQuote[];
  @Input() currencyQuotes: IQuote[];
  @Input() ratesQuotes: IQuote[];
  @Input() cryptoQuotes: IQuote[];
  @Input() vixQuotes: IQuote[];
  @Input() etfQuotes: IQuote[];  
  @Input() readOnly: Boolean;
  @Output() createPortfolio: EventEmitter<any> = new EventEmitter();
  @Output() fetchSnpQuotes: EventEmitter<any> = new EventEmitter();

  @ViewChild('assetsGrid', { static: true }) public assetsGrid: IgxGridComponent;
  @ViewChild('portfolioGrid', { static: true }) public portfolioGrid: IgxGridComponent;
  @ViewChild(IgxDropDownComponent, { static: true }) public igxDropDown: IgxDropDownComponent;
  @ViewChild('inputGroup', { read: IgxInputGroupComponent, static: true }) public inputGroup: IgxInputGroupComponent;
  data: IQuote[] = [];
  type = 'Futures';
  selectedRows: any[] = [];
  selectedItemsNewGrid: any[] = [];
  public selectionMode: string;
  public hideRowSelectors: Boolean;

  public selectedStartCharater: string[] = [];
  isLoad = false;
  portfolioForm: UntypedFormGroup;
  public items: { field: string }[] = [
    { field: 'Futures' },
    { field: 'Index' },
    { field: 'Currency' },
    { field: 'Rates' },
    { field: 'Crypto' },
    { field: 'Stocks' },
    { field: 'ETF' },    
  ];
  public overlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
      horizontalStartPoint: HorizontalAlignment.Right,
      verticalStartPoint: VerticalAlignment.Bottom
    }),
    scrollStrategy: new NoOpScrollStrategy()
  };
  public mySummary = MySummary;
  public portfolioAssets: IPortfolioAsset[];

  constructor(private datePipe: DatePipe, private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private igniteUIService: IgniteUIService) {
    this.createPortfolioForm();
    this.selectedRows = [];
    this.selectionMode = 'none';
    this.hideRowSelectors = true;
  }

  public ngAfterViewInit(): void {
    /* Load in a different cycle, so change detection does not throw error */
    setTimeout(() => {
      this.data = this.futureQuotes;
      if (this.readOnly) {
        this.selectionMode = 'none';
        this.hideRowSelectors = true;
      } else {
        this.selectionMode = 'multiple';
        this.hideRowSelectors = false;
      }
    }, 0);

    this.igniteUIService.getMessage().subscribe(
      message => {
        switch (message.MessageID) {
          case this.igniteUIService.MESSAGE_IDS['SNPQUOTES']: {
            this.data = this.snpQuotes = message.Message as IQuote[];
            break;
          }
          case 'RANDOM_PORTFOLIO': {
            // Handle random portfolio generation
            this.handleRandomPortfolioGeneration(message.Message);
            break;
          }
          default: {
            break;
          }
        }
      }
    );
  }

  public createPortfolioForm(portfolio?) {
    this.portfolioForm = this.formBuilder.group({
      'name': [portfolio === undefined ? null : portfolio.name, { validators: [], updateOn: 'change' }],
      'description': [portfolio === undefined ? '' : portfolio.description, { validators: [], updateOn: 'change' }],
      'cost': [portfolio === undefined ? null : portfolio.cost, { validators: [], updateOn: 'change' }],
      'value': [portfolio === undefined ? null : portfolio.value, { validators: [], updateOn: 'change' }],
      'percent': [portfolio === undefined ? null : portfolio.percent, { validators: [], updateOn: 'change' }],
      'created': [portfolio === undefined ? null : portfolio.created, { validators: [], updateOn: 'change' }],
      'ispublic': [portfolio === undefined ? false : portfolio.ispublic, { validators: [], updateOn: 'change' }],
      'pnl': [portfolio === undefined ? 0 : portfolio.pnl, { validators: [], updateOn: 'change' }],
      'portfolioassets': [[], { validators: [], updateOn: 'change' }]
    });
  }

  resetPortfolio() {
    this.selectedItemsNewGrid = [];
  }

  submitPortfolio() {
    let sum = 0;
    let total_percent = 0;
    this.selectedItemsNewGrid.forEach(item => {
      sum += item.Weight_Price;
      total_percent += item.Weight_Pct;

    });
    this.portfolioForm.value.cost = sum;
    this.portfolioForm.value.value = sum;
    this.portfolioForm.value.created = new Date();
    this.portfolioForm.value.percent = total_percent;
    this.portfolioForm.value.portfolioassets = this.selectedItemsNewGrid;
    this.createPortfolio.emit(this.portfolioForm.value);
  }

  public onDDLSelection(eventArgs: ISelectionEventArgs) {
    this.type = eventArgs.newSelection.value;
    if (this.type === 'Futures') {
      this.data = this.futureQuotes;
    } else if (this.type === 'Index') {
      this.data = this.indexQuotes;
    } else if (this.type === 'Currency') {
      this.data = this.currencyQuotes;
    } else if (this.type === 'Rates') {
      this.data = this.ratesQuotes;
    } else if (this.type === 'Stocks') {
      this.data = this.snpQuotes;
    } else if (this.type === 'Crypto') {
      this.data = this.cryptoQuotes;
    } else if (this.type === 'ETF') {
      this.data = this.etfQuotes;
    }
    this.assetsGrid.selectedRows = this.getSelectedRows(this.type);
  }

  getSelectedRows(type) {
    if (this.selectedItemsNewGrid.length > 0) {
      const items = [];
      const itemIds = this.selectedItemsNewGrid.length > 0 ? this.selectedItemsNewGrid.map(({ SravzId }) => (SravzId)) : [];
      this.selectedItemsNewGrid.forEach(element => {
        const item = this.data.find(f => f.SravzId === element.SravzId);
        if (item) {
          items.push(item.SravzId);
        }
      });
      return items;

    } else {
      return [];
    }
  }

  public handleRowSelection(args: { added: string | any[]; removed: any[]; newSelection: any[]; }) {
    if (args.added.length || args.removed.length) {
      const selectedList: any[] = [];
      args.removed.forEach((element: any) => {
          const item = this.selectedItemsNewGrid.find(f => f.SravzId === element.SravzId);
          this.selectedItemsNewGrid.splice(this.selectedItemsNewGrid.indexOf(item), 1);  
      });
      args.newSelection.forEach(element => {
        selectedList.push(this.data.find(f => f.SravzId === element.SravzId));
      });
      this.addOrRemoveItemsToPortfolioAssetsGrid(selectedList, this.type);
    }
  }

  addOrRemoveItemsToPortfolioAssetsGrid(items, type) {
    let gridRows = this.selectedItemsNewGrid;
    this.isLoad = true;
    if (gridRows.length > 0) {
      items.forEach((element: { SravzId: any; }) => {
        if (element) {
          const item = gridRows.find(f => f.SravzId === element.SravzId);
          if (item) {
            gridRows.splice(gridRows.indexOf(item), 1);
          }
        }
      });
    }
    if (items.length > 0) {
      gridRows = gridRows.concat(items);
      gridRows.map(item => {
        // Allow any weights
        // item.Weight_Pct = 100 / gridRows.length;
        // 100 is portfolio notional value
        // item.Weight_Price = (100 * item.Weight_Pct) / 100;
      });
      if (gridRows.length > 0) {
        this.selectedItemsNewGrid = [];
        gridRows.forEach(x => this.selectedItemsNewGrid.push(x));
      }
    }
  }

  public openDropDown() {
    if (this.igxDropDown.collapsed) {
      this.igxDropDown.open({
        modal: false,
        positionStrategy: new ConnectedPositioningStrategy()
      });
    }
  }

  public typeChanged($event) {
    if (this.selectedStartCharater.length > 0 && (this.selectedStartCharater.sort().join(',') !== $event.sort().join(','))) {
      this.selectedStartCharater = $event;
      this.snpQuotes = [];
    } else if (this.selectedStartCharater.length === 0 && $event.length > 0) {
      this.selectedStartCharater = $event;
      this.snpQuotes = [];
    }
  }

  public cellEditDone(event) {
    const item = this.selectedItemsNewGrid.find(f => f.SravzId === event.rowData.SravzId);
    if (item) {
      item.Weight_Price = (100 * item.Weight_Pct) / 100;
    }
  }

  public fetchStockQuotes() {
    this.fetchSnpQuotes.emit(this.selectedStartCharater);
  }

  private backgroundClasses = (rowData: any, columnKey: string): boolean => {
    return rowData.Chg_Pct > 0;
  }

  private backgroundClasssesPsPercentage = (rowData: any, columnKey: string): boolean => {
    return rowData.Chg_Pct < 0;
  }

  // tslint:disable-next-line:member-ordering
  backgroundCell = {
    'showUp': this.backgroundClasses,
    'showDown': this.backgroundClasssesPsPercentage
  };

  public totalFormatter(summary: IgxSummaryResult, summaryOperand: IgxSummaryOperand): string {
    const result = summary.summaryResult;
      if (summaryOperand instanceof MySummary && summary.key !== 'count'
          && result !== null && result !== undefined) {
          const pipe = new NumberWithCommasPipe();
          return pipe.transform(result);
      }
      return result;
  }

  // Handle random portfolio generation
  private handleRandomPortfolioGeneration(messageData: any): void {
    if (messageData && messageData.portfolioAssets) {
      // Clear current selection
      this.selectedItemsNewGrid = [];
      
      // Update form with random portfolio name
      if (messageData.portfolioName) {
        this.portfolioForm.patchValue({
          name: messageData.portfolioName,
          description: messageData.portfolioAssets.length > 0 ? 
            `Random portfolio with ${messageData.portfolioAssets.length} assets from multiple asset classes` : 
            'Random portfolio'
        });
      }
      
      // Add the random assets to the portfolio grid
      messageData.portfolioAssets.forEach((asset: any) => {
        // Ensure the asset has all required properties
        const portfolioAsset = {
          ...asset,
          Weight_Pct: asset.Weight_Pct || 0,
          Weight_Price: asset.Weight_Price || 0,
          Country: asset.Country || 'Unknown',
          High: asset.High || asset.Last || 0,
          Low: asset.Low || asset.Last || 0,
          Change: asset.Change || 0,
          PercentChange: asset.PercentChange || 0,
          Time: asset.Time || new Date()
        };
        
        this.selectedItemsNewGrid.push(portfolioAsset);
      });

      // Auto-scroll to the portfolio assets section
      setTimeout(() => {
        const portfolioSection = document.querySelector('.grid__wrapper1:last-child');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }
}

class MySummary {
  public operate(data?: any[], allData = [], fieldName = ''): IgxSummaryResult[] {
    const result = [];
    result.push({
      key: 'total',
      // label: "Total Items",
      summaryResult: IgxNumberSummaryOperand.sum(data)
    });
    return result
  }
}

