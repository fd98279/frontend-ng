import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SettingsService } from './common/settings.service';
import { Router, NavigationStart } from '@angular/router';
import { WindowRef } from './common/window.service';
import { InitUserService } from './@theme/services/init-user.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { IgxNavigationDrawerComponent } from '@infragistics/igniteui-angular';
import { appRoutes } from './routes';

@Component({
    selector: 'sravz-app',
    templateUrl: './sravz-app.component.html',
    styleUrls: ['./sravz-app.component.scss'],
    standalone: false
})
export class SravzAppComponent implements OnInit, OnDestroy {
  public topNavLinks: Array<{
    path: string,
    name: string
  }> = [];
  @ViewChild(IgxNavigationDrawerComponent, { static: true }) public navdrawer: IgxNavigationDrawerComponent;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private initUserService: InitUserService,
    private winRef: WindowRef) {
    this.initUser();
    // for (const route of appRoutes) {
    //   if (route.path && route.data && route.path.indexOf('*') === -1) {
    //     this.topNavLinks.push({
    //       name: route.data.text,
    //       path: '/' + route.path
    //     });
    //   }
    // }
  }

  ngOnInit() {
    // Check if we need this?
    this.settingsService.updateAppSettings();
    // this.router.events.pipe(
    //   filter((x) => x instanceof NavigationStart)
    // )
    //   .subscribe((event: NavigationStart) => {
    //       if (event.url !== '/' && !this.navdrawer.pin) {
    //           // Close drawer when selecting a view on mobile (unpinned)
    //           // this.navdrawer.close();
    //       }
    //   });
  }


  initUser() {
    this.initUserService.initCurrentUser()
      .pipe(
        takeUntil(this.destroy$),
    )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
