/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NB_AUTH_OPTIONS, NbAuthService, NbAuthResult } from '@nebular/auth';
import { getDeepFromObject } from '../../helpers';
import { UserService, ExternalAuthService } from '../../../authentication';
import { UserStore } from '../../../@core/stores/user.store';

@Component({
    selector: 'ngx-logout',
    templateUrl: './logout.component.html',
    standalone: false
})
export class NgxLogoutComponent implements OnInit {

  redirectDelay: number = this.getConfigValue('forms.logout.redirectDelay');
  strategy: string = this.getConfigValue('forms.logout.strategy');

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              public userService: UserService,
              public userStore: UserStore,
              private authService: ExternalAuthService,
              protected router: Router) { }

  ngOnInit(): void {
    this.logout(this.strategy);
  }

  logout(strategy: string): void {
    // If used external login
    if (this.userService.currentUser) {
      strategy = 'oidc';
      this.userService.clearCurrentUser();
    }
    if (strategy == null) {
        this.userService.clearCurrentUser();
        this.userStore.setUser(null);
        setTimeout(() => {
          return this.router.navigateByUrl('/login');
        }, this.redirectDelay);
    } else {
      this.service.logout(strategy).subscribe((result: NbAuthResult) => {
        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        // Check: This function stops the processing
        if (strategy === 'oidc') {
          this.authService.logout();
        }
      });
    }
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
