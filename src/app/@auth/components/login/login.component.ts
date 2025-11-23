/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NB_AUTH_OPTIONS,
  NbAuthSocialLink,
  NbAuthService,
  NbAuthResult,
} from '@nebular/auth';
import { getDeepFromObject } from '../../helpers';
import { EMAIL_PATTERN } from '../constants';
import { InitUserService } from '../../../@theme/services/init-user.service';
import { ExternalAuthService, AuthenticationService, UserService } from '../../../authentication';
import { ExternalAuthProvider } from '../../../authentication/services/external-auth-configs';
import { UserStore } from '../../../@core/stores/user.store';
import { PersistanceService } from '../../../common/persistance.service';
import { ButtonGroupAlignment } from '@infragistics/igniteui-angular';

@Component({
    selector: 'ngx-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class NgxLoginComponent implements OnInit, AfterViewInit {
  public alignment = ButtonGroupAlignment.vertical;
  minLength: number = this.getConfigValue('forms.validation.password.minLength');
  maxLength: number = this.getConfigValue('forms.validation.password.maxLength');
  redirectDelay: number = this.getConfigValue('forms.login.redirectDelay');
  showMessages: any = this.getConfigValue('forms.login.showMessages');
  strategy: string = this.getConfigValue('forms.login.strategy');
  socialLinks: NbAuthSocialLink[] = this.getConfigValue('forms.login.socialLinks');
  rememberMe = this.getConfigValue('forms.login.rememberMe');
  isEmailRequired: boolean = this.getConfigValue('forms.validation.email.required');
  isPasswordRequired: boolean = this.getConfigValue('forms.validation.password.required');
  @ViewChild('tradingviewcontainer') tradingviewcontainer?: ElementRef;

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted = false;
  loginForm: UntypedFormGroup;
  alive = true;
  public guestLoginReturnUrl: string;
  private loginSuccessReturnUrl: string;

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  @ViewChild('tradingview') tradingview?: ElementRef;
  @ViewChild('tradingview_movers') tradingview_movers?: ElementRef;

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    protected router: Router,
    protected initUserService: InitUserService,
    public authService: ExternalAuthService,
    private authentication: AuthenticationService,
    public userService: UserService,
    public userStore: UserStore,
    private route: ActivatedRoute,
    private _renderer2: Renderer2,
    private persistanceService: PersistanceService) {

    this.minLength = this.getConfigValue('forms.validation.password.minLength');
    this.maxLength = this.getConfigValue('forms.validation.password.maxLength');
    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
    this.isEmailRequired = this.getConfigValue('forms.validation.email.required');
    this.isPasswordRequired = this.getConfigValue('forms.validation.password.required');

  }
  private returnUrl: string;
  /** expose to template */
  public providers = ExternalAuthProvider;

  ngOnInit(): void {

    const emailValidators = [
      Validators.pattern(EMAIL_PATTERN),
    ];
    this.isEmailRequired && emailValidators.push(Validators.required);

    const passwordValidators = [
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ];
    this.isPasswordRequired && passwordValidators.push(Validators.required);

    this.loginForm = this.fb.group({
      email: this.fb.control('', [...emailValidators]),
      password: this.fb.control('', [...passwordValidators]),
      rememberMe: this.fb.control(false),
    });

    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });

    if (this.returnUrl) {
      this.guestLoginReturnUrl = `/auth/login-guest?returnUrl=${encodeURIComponent(this.returnUrl)}`;
      this.loginSuccessReturnUrl = this.returnUrl;
    } else {
      this.guestLoginReturnUrl = `/auth/login-guest`;
      this.loginSuccessReturnUrl = '/home';
    }


  }

  login(_user): void {
    this.user = this.loginForm.value;
    this.errors = [];
    this.messages = [];
    this.submitted = true;


    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
        this.initUserService.initCurrentUser().subscribe();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(this.loginSuccessReturnUrl);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    let script = this._renderer2.createElement('script');
    let tradingviewcontainer_width = this.tradingviewcontainer.nativeElement.offsetWidth;
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.text = `
    {
      "colorTheme": "${this.persistanceService.get('theme')}",
      "dateRange": "12M",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": false,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "width": "${tradingviewcontainer_width}",
      "height": "660",
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(41, 98, 255, 1)",
      "gridLineColor": "rgba(240, 243, 250, 0)",
      "scaleFontColor": "rgba(106, 109, 120, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
      "tabs": [
        {
          "title": "Indices",
          "symbols": [
            {
              "s": "FOREXCOM:SPXUSD",
              "d": "S&P 500"
            },
            {
              "s": "FOREXCOM:NSXUSD",
              "d": "US 100"
            },
            {
              "s": "FOREXCOM:DJI",
              "d": "Dow 30"
            },
            {
              "s": "INDEX:NKY",
              "d": "Nikkei 225"
            },
            {
              "s": "INDEX:DEU40",
              "d": "DAX Index"
            },
            {
              "s": "FOREXCOM:UKXGBP",
              "d": "UK 100"
            }
          ],
          "originalTitle": "Indices"
        },
        {
          "title": "Futures",
          "symbols": [
            {
              "s": "CME_MINI:ES1!",
              "d": "S&P 500"
            },
            {
              "s": "CME:6E1!",
              "d": "Euro"
            },
            {
              "s": "COMEX:GC1!",
              "d": "Gold"
            },
            {
              "s": "NYMEX:CL1!",
              "d": "Crude Oil"
            },
            {
              "s": "NYMEX:NG1!",
              "d": "Natural Gas"
            },
            {
              "s": "CBOT:ZC1!",
              "d": "Corn"
            }
          ],
          "originalTitle": "Futures"
        },
        {
          "title": "Bonds",
          "symbols": [
            {
              "s": "CME:GE1!",
              "d": "Eurodollar"
            },
            {
              "s": "CBOT:ZB1!",
              "d": "T-Bond"
            },
            {
              "s": "CBOT:UB1!",
              "d": "Ultra T-Bond"
            },
            {
              "s": "EUREX:FGBL1!",
              "d": "Euro Bund"
            },
            {
              "s": "EUREX:FBTP1!",
              "d": "Euro BTP"
            },
            {
              "s": "EUREX:FGBM1!",
              "d": "Euro BOBL"
            }
          ],
          "originalTitle": "Bonds"
        },
        {
          "title": "Forex",
          "symbols": [
            {
              "s": "FX:EURUSD",
              "d": "EUR/USD"
            },
            {
              "s": "FX:GBPUSD",
              "d": "GBP/USD"
            },
            {
              "s": "FX:USDJPY",
              "d": "USD/JPY"
            },
            {
              "s": "FX:USDCHF",
              "d": "USD/CHF"
            },
            {
              "s": "FX:AUDUSD",
              "d": "AUD/USD"
            },
            {
              "s": "FX:USDCAD",
              "d": "USD/CAD"
            }
          ],
          "originalTitle": "Forex"
        }
      ]
    }
    `;
    this.tradingview?.nativeElement.appendChild(script);


    let script_movers = this._renderer2.createElement('script');
    script_movers.type = `text/javascript`;
    script_movers.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
    script_movers.text = `
    {
      "colorTheme": "${this.persistanceService.get('theme')}",
      "dateRange": "12M",
      "exchange": "US",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": false,
      "showSymbolLogo": false,
      "showFloatingTooltip": false,
      "width": "${tradingviewcontainer_width}",
      "height": "660",
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(41, 98, 255, 1)",
      "gridLineColor": "rgba(240, 243, 250, 0)",
      "scaleFontColor": "rgba(106, 109, 120, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)"
    }
    `;
    this.tradingview_movers?.nativeElement.appendChild(script_movers);
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  signUpGuest() {
    this.router.navigateByUrl(this.guestLoginReturnUrl);
  }

  signUpG() {
    this.userService.clearCurrentUser();
    this.userStore.setUser(null);
    this.authService.login(ExternalAuthProvider.Google);
  }

  signUpMS() {
    this.authService.login(ExternalAuthProvider.Microsoft);
  }

  signUpFb() {
    this.userService.clearCurrentUser();
    this.userStore.setUser(null);
    this.authService.login(ExternalAuthProvider.Facebook);
  }

  signUpT() {
    this.userService.clearCurrentUser();
    this.userStore.setUser(null);
    this.authService.login(ExternalAuthProvider.Twitter);
  }

  signUpL() {
    this.authService.login(ExternalAuthProvider.LinkedIn);
  }


}
