import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IAsset } from '../assets/asset.model';
import { ActivatedRoute } from '@angular/router';
import { PersistanceService } from '../common/persistance.service';

@Component({
    templateUrl: './forex.component.html',
    standalone: false
})
export class ForexComponent implements AfterViewInit {

  public assets: IAsset[];
  public showDetails: boolean;
  @ViewChild('tradingview') tradingview?: ElementRef;
  @ViewChild('tradingview_heatmap') tradingview_heatmap?: ElementRef;

  constructor(private route: ActivatedRoute,
    private _renderer2: Renderer2,
    private persistanceService: PersistanceService) {
    this.showDetails = true;
    this.assets = this.route.snapshot.data['assets'];
  }

  ngAfterViewInit() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.text = `
    {
      "width": 100%,
      "height": 400,
      "currencies": [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY",
        "INR"
      ],
      "isTransparent": false,
      "colorTheme": "${this.persistanceService.get('theme')}",
      "locale": "en"
    }
    `;
    this.tradingview?.nativeElement.appendChild(script);

    let script_heamap = this._renderer2.createElement('script');
    script_heamap.type = `text/javascript`;
    script_heamap.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
    script_heamap.text = `
    {
      "width": 100%,
      "height": 400,
      "currencies": [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY",
        "INR"
      ],
      "isTransparent": false,
      "colorTheme": "${this.persistanceService.get('theme')}",
      "locale": "en"
    }
    `;
    this.tradingview_heatmap?.nativeElement.appendChild(script_heamap);
  }
}
