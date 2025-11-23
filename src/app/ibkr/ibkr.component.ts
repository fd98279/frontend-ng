import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgniteUIService } from '../ignite-ui/services/ignite-ui-service';
// import { IIgniteUIMessage } from '../ignite-ui/services/ignite-ui-message-model';

@Component({
    templateUrl: './ibkr.component.html',
    standalone: false
})

export class IBKRComponent implements OnInit, AfterViewInit {

  public IBKR_URL: string;
  constructor(private route: ActivatedRoute,
    private igniteUIService: IgniteUIService) {
    this.IBKR_URL = 'http://localhost:6080/';
  }

  public ngOnInit() {
  }

  public ngAfterViewInit(): void {
    // const indexQuotesData: IIgniteUIMessage = {
    //   MessageID: this.igniteUIService.MESSAGE_IDS['INDEXQUOTES'],
    //   Message: this.indexQuotes
    // };
    // this.igniteUIService.sendMessage(indexQuotesData);
  }


}
