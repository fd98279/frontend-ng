import { NgModule, NO_ERRORS_SCHEMA, Injectable, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';

import { SravzAppComponent } from './sravz-app.component';
import { NavBarComponent } from './nav/nav-bar.component';
import { JQ_TOKEN, TOASTR_TOKEN, Toastr, CollapsibleWellComponent, SimpleModalComponent } from './common/index';
import { appRoutes } from './routes';
import { ModalTriggerDirective } from './common/modalTrigger.directive';
import { PersistanceService } from './common/persistance.service';
import { UpgradeModule } from '@angular/upgrade/static';
import { SettingsService } from './common/settings.service';
import { ToastrModule } from 'ngx-toastr';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { WindowRef } from './common/window.service';
import { RecaptchaFormsModule } from 'ng-recaptcha';

const toastr: Toastr = window['toastr'];
const jQuery = window['$'];

import { Socket, SocketIoModule } from 'ngx-socket-io';
import { SettingsComponent } from './settings/settings.component';
import { UploadModule } from './upload/upload.module';
import { WSSocketService } from './socket.service';
import { WebsocketService } from './websocket.service';
import { AWSService } from './aws.service';
import { ContactUSComponent } from './contactus/contactus.component';
import { ContactUSService } from './contactus/contactus.service';
import { RxjsHelperService } from './common/rxjs.helper.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { RouterExtService } from './common/router.ext.service';
import { AboutComponent } from './about/about.component';
import { TrainingComponent } from './training/trainig.component';
import { DisqusModule } from 'ngx-disqus';
import { IgxComboModule,
  IgxRippleModule,
  IgxLayoutModule,
  IgxNavbarModule,
  IgxNavigationDrawerModule,
  IgxProgressBarModule,
  IgxButtonModule,
  IgxIconModule,
  IgxTabsModule,
  IgxTooltipModule,
  IgxCheckboxModule,
  IgxActionStripModule,
  IgxToastModule,
  IgxCardModule} from '@infragistics/igniteui-angular';
import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';
import { AuthModule } from './@auth/auth.module';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AuthenticationModule, ExternalAuthService } from './authentication';
import { environment } from '../environments/environment';
import { AuthGuard } from './@auth/auth.guard';
import { NSQStatusService } from './common/nsq.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CareersComponent } from './careers/careers.component';
import { PipesModule } from './pipe/pipes.module';
import { AdminComponent } from './admin/admin.component';
import { Error404Component } from './errors/404.component';
import { Error401Component } from './errors/401.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { LoaderService } from './loader/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { LoaderComponent } from './loader/loader.component';
import { NgNavigatorShareService } from './ng-navigator-share.service';
import {ClipboardModule} from '@angular/cdk/clipboard';

@Injectable()
export class SocketPortfolio extends Socket {

  constructor(settingsService: SettingsService, appRef: ApplicationRef) {
    super({ url: settingsService.getAppConstants().dataServiceBaseUri, options: {
      'timeout' : 10000,
      'transports' : ['websocket', 'polling', 'flashsocket']
    }}, appRef);
  }
}

@Injectable()
export class SocketData extends Socket {

  constructor(settingsService: SettingsService, appRef: ApplicationRef) {
    super({ url: settingsService.getAppConstants().dataServiceBaseUri, options: {
      'timeout' : 10000,
      'transports' : ['websocket', 'polling', 'flashsocket']
    }}, appRef);
  }
}

// @Injectable()
// export class SocketGo extends Socket {
//   constructor(private settingsService: SettingsService) {
//     super({ url: settingsService.getAppConstants().analyticsServiceBaseUri + '/socket.io/', options: {} });
//   }
// }
@NgModule({ declarations: [
        SravzAppComponent,
        NavBarComponent,
        Error404Component,
        Error401Component,
        CollapsibleWellComponent,
        SimpleModalComponent,
        ModalTriggerDirective,
        SettingsComponent,
        ContactUSComponent,
        AboutComponent,
        PrivacyComponent,
        TrainingComponent,
        CareersComponent,
        AdminComponent,
        LoaderComponent
    ],
    exports: [IgxNavbarModule
    ],
    schemas: [NO_ERRORS_SCHEMA],
    bootstrap: [SravzAppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes, { enableTracing: false }),
        UpgradeModule,
        ToastrModule.forRoot({
            maxOpened: 1,
            preventDuplicates: true,
            autoDismiss: true
        }),
        SocketIoModule,
        NgSelectModule,
        UploadModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        IgxComboModule,
        IgxNavigationDrawerModule,
        IgxNavbarModule,
        IgxLayoutModule,
        IgxRippleModule,
        IgxTooltipModule,
        IgxCheckboxModule,
        IgxCardModule,
        // HomeModule,
        DisqusModule,
        AuthModule.forRoot(),
        CoreModule.forRoot(),
        ThemeModule.forRoot(),
        AuthenticationModule,
        IgxProgressBarModule,
        IgxButtonModule,
        IgxIconModule,
        IgxRadialGaugeModule,
        NgSelectModule,
        IgxTabsModule,
        PipesModule,
        IgxActionStripModule,
        ClipboardModule,
        IgxToastModule], providers: [
        { provide: TOASTR_TOKEN, useValue: toastr },
        { provide: JQ_TOKEN, useValue: jQuery },
        PersistanceService,
        SettingsService,
        AuthGuard,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        WindowRef,
        SocketPortfolio,
        SocketData,
        /*    SocketGo, */
        WSSocketService,
        WebsocketService,
        AWSService,
        ContactUSService,
        RxjsHelperService,
        RouterExtService,
        NSQStatusService,
        LoaderService,
        NgNavigatorShareService,
        provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    ] })

export class AppModule {
  constructor(private externalAuthService: ExternalAuthService) {
      /**
       * To register a social login, un-comment one or more of the following and add your service provider Client ID.
       * See https://github.com/IgniteUI/igniteui-cli/wiki/Angular-Authentication-Project-Template#add-a-third-party-social-provider
       */
      this.externalAuthService.addGoogle(environment.GOOGLE_CLIENT_KEY);
      this.externalAuthService.addMicrosoft('');
      this.externalAuthService.addFacebook(environment.FACEBOOK_APP_ID);
      this.externalAuthService.addTwitter(environment.TWITTER_APP_ID);
      this.externalAuthService.addLinkedIn(environment.LINKEDIN_APP_ID);
  }
}
