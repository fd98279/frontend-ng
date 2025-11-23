import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../@core/interfaces/common/users';
import { UserStore } from '../@core/stores/user.store';
import { map, takeUntil } from 'rxjs/operators';
import { IgxIconService, IgxNavigationDrawerComponent } from '@infragistics/igniteui-angular';
import { finance, programming, elections } from "@igniteui/material-icons-extended";
import { environment } from '../../environments/environment';
import { NbRoleProvider } from '@nebular/security';
import { ROLES } from '../@auth/roles';
import { SettingsService } from '../common/settings.service';
import { NgNavigatorShareService } from '../ng-navigator-share.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { PersistanceService } from '../common/persistance.service';

@Component({
    selector: 'nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
    standalone: false
})

export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {
  public user: User;
  public isAdmin = false;
  private destroy$: Subject<void> = new Subject<void>();
  public title: string;
  public showDataGroup = false;
  public showFinanceGroup = false;
  public showCryptoGroup = false;
  public showEconomicsGroup = false;
  public showAnalyticsGroup = false;
  public showLinksGroup = false;
  public selected = 'Avatar';
  public environmentName = '';
  public today = new Date();
  public isMobile: false;
  @ViewChild('toast') toast: { open: (arg0: string) => void; };



  @ViewChild(IgxNavigationDrawerComponent)
  public drawer: IgxNavigationDrawerComponent;
  @ViewChild('tradingview') tradingview?: ElementRef;

  public drawerState = {
    miniTemplate: false,
    open: false,
    pin: true
  };

  /** Select item and close drawer if not pinned */
  public navigate(item) {
    this.selected = item.text;
    if (!this.drawer.pin) {
      // this.drawer.closed()
    }
  }

  addIcons() {
    for (let icon of [...finance, ...programming, ...elections]) {
      this.iconService.addSvgIconFromText(icon.name, icon.value, "imx-icons");
    }
  }

  showSubMenu(number) {
    if (number === 1) {
      this.showDataGroup = !this.showDataGroup;
    } else if (number === 2) {
      this.showFinanceGroup = !this.showFinanceGroup;
    } else if (number === 3) {
      this.showCryptoGroup = !this.showCryptoGroup;
    } else if (number === 4) {
      this.showEconomicsGroup = !this.showEconomicsGroup;
    } else if (number === 5) {
      this.showAnalyticsGroup = !this.showAnalyticsGroup;
    } else if (number === 6) {
      this.showLinksGroup = !this.showLinksGroup;
    }
  }

  constructor(public userStore: UserStore,
    public roleProvider: NbRoleProvider,
    public settingsService: SettingsService,
    private iconService: IgxIconService,
    private ngNavigatorShareService: NgNavigatorShareService,
    private clipboard: Clipboard,
    private _renderer2: Renderer2,
    private persistanceService: PersistanceService) {
    this.title = 'Sravz';
    this.environmentName = environment.name;
    this.isMobile = this.settingsService.getAppSettings().isMobile;
  }

  ngOnInit() {

    this.userStore.onUserStateChange()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((user: User) => {
        this.user = user;
        this.updateRole();
      });

    this.addIcons();
  }

  public updateRole() {
    this.roleProvider.getRole()
      .pipe(map(role => {
        const roles = role instanceof Array ? role : [role];
        this.isAdmin = roles.some(x => x && x.toLowerCase() === ROLES.ADMIN);
      }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  share() {
    if (!this.ngNavigatorShareService.canShare()) {
      this.clipboard.copy(window.location.href)
      this.toast.open(`Copied ${window.location.href} to the clipboard. Please share the url.`)
    }
    this.ngNavigatorShareService.share({
      title: 'Sravz',
      text: 'Link shared from www.sravz.com',
      url: window.location.href
    }).then((response) => {
      console.log(response);
    })
      .catch((error) => {
        console.log(error);
      });
  }

  ngAfterViewInit() {
/*     let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.text = `
    {
      "symbols": [
          {
              "proName": "FOREXCOM:SPXUSD",
              "title": "S&P 500"
          },
          {
              "proName": "FOREXCOM:NSXUSD",
              "title": "US 100"
          },
          {
              "proName": "FX_IDC:EURUSD",
              "title": "EUR/USD"
          },
          {
              "proName": "BITSTAMP:BTCUSD",
              "title": "Bitcoin"
          },
          {
              "proName": "BITSTAMP:ETHUSD",
              "title": "Ethereum"
          },
          {
              "description": "Gold",
              "proName": "COMEX:GC1!"
          },
          {
              "description": "Crude",
              "proName": "NYMEX:CL1!"
          },
          {
              "description": "US100",
              "proName": "CURRENCYCOM:US100"
          }
      ],
          "showSymbolLogo": false,
              "colorTheme": "${this.persistanceService.get('theme')}",
                  "isTransparent": false,
                      "displayMode": "adaptive",
                          "locale": "en"
  }
    `;
    this.tradingview?.nativeElement.appendChild(script); */
  }

}
