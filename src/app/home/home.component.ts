import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuote } from '../quotes/quotes.model';
import { IgniteUIService } from '../ignite-ui/services/ignite-ui-service';
import { IIgniteUIMessage } from '../ignite-ui/services/ignite-ui-message-model';

@Component({
    templateUrl: './home.component.html',
    standalone: false
})

export class HomeComponent implements OnInit,  AfterViewInit {

  public indexQuotes: IQuote[];

  constructor(private route: ActivatedRoute,
  private igniteUIService: IgniteUIService) {
  }

  public ngOnInit() {
    this.indexQuotes = this.route.snapshot.data['indexQuotes'].filter(item => (item as IQuote).MajorIndex);
  }

  public ngAfterViewInit(): void {
    const indexQuotesData: IIgniteUIMessage = {
      MessageID: this.igniteUIService.MESSAGE_IDS['INDEXQUOTES'],
      Message: this.indexQuotes
    };
    this.igniteUIService.sendMessage(indexQuotesData);
  }


}
