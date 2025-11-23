import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EconomicService } from './economic.service';
import { IEconomicEvent, IUsFedCalendar } from './economic.model';
import { IgxTabsComponent } from '@infragistics/igniteui-angular';
import { PersistanceService } from '../common/persistance.service';

@Component({
    templateUrl: './calendar.component.html',
    standalone: false
})


export class CalendarComponent implements OnInit, AfterViewInit {
  public defaultColDef;
  public showDelete: boolean;
  public showUpdate: boolean;
  public showDetails: boolean;
  public events: IEconomicEvent[];
  public usFedCalendar: IUsFedCalendar;
  public fromDate: Date;
  public toDate: Date;
  @ViewChild('tabs') tabs: IgxTabsComponent;
  @ViewChild('tradingview') tradingview?: ElementRef;

  constructor(private route: ActivatedRoute,
    private economicService: EconomicService,
    private _renderer2: Renderer2,
    private persistanceService: PersistanceService) {

    this.fromDate = economicService.getMonday(new Date());
    this.toDate = economicService.getFriday(new Date());

  }

  ngOnInit() {
    this.events = this.route.snapshot.data['events'];
    this.usFedCalendar = this.route.snapshot.data['usFedEvents'];
  }

  ngAfterViewInit() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.text = `
    {
      "colorTheme": "${this.persistanceService.get('theme')}",
      "isTransparent": false,
      "width": "100%",
      "height": "600",
      "locale": "en",
      "importanceFilter": "-1,0,1",
      "currencyFilter": "USD,EUR,ITL,NZD,CHF,AUD,FRF,JPY,ZAR,TRL,CAD,DEM,MXN,ESP,GBP"
    }
    `;
    this.tradingview?.nativeElement.appendChild(script);
  }


  public getEvents() {
    this.economicService.getEconomicEvents(this.fromDate.toISOString().substring(0, 10),
      this.toDate.toISOString().substring(0, 10)).subscribe((events) => {
        this.events = events;
        this.tabs.selectedIndex = -1;
        this.tabs.selectedIndex = 0;
      });
    this.economicService.getUsFedEvents().subscribe((usFedCalendar) => {
        this.usFedCalendar = usFedCalendar;
      });
  }
}

