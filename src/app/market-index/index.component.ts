import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IAsset } from '../assets/asset.model';
import { ActivatedRoute } from '@angular/router';
import { IQuote } from '../quotes/quotes.model';
import { IgniteUIService } from '../ignite-ui/services/ignite-ui-service';
import { IIgniteUIMessage } from '../ignite-ui/services/ignite-ui-message-model';

@Component({
    templateUrl: './index.component.html',
    standalone: false
})

export class IndexComponent implements AfterViewInit {

  public assets: IAsset[];
  public showDetails: boolean;
  public indexQuotes: IQuote[];

  constructor(private route: ActivatedRoute,
    private igniteUIService: IgniteUIService) {
      this.showDetails = true;
      this.assets = this.route.snapshot.data['assets'];
      this.indexQuotes = this.route.snapshot.data['indexQuotes'];
  }

  public ngAfterViewInit(): void {
    this.route.url.subscribe(params => {
      switch (params[0].path) {
        case 'index':
          const indexQuotesData: IIgniteUIMessage = {
            MessageID: this.igniteUIService.MESSAGE_IDS['INDEXQUOTES'],
            Message: this.indexQuotes
          };
          this.igniteUIService.sendMessage(indexQuotesData);
          break;
        default:
          break;
      }
    });
  }

}
