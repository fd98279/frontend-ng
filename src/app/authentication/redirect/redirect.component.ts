import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { ExternalAuthProvider } from '../services/external-auth-configs';
import { ExternalLogin } from '../models/login';
import { ExternalAuthService } from '../services/external-auth.service';
import { InitUserService } from '../../@theme/services/init-user.service';
import { UserStore } from '../../@core/stores/user.store';
import { NbAuthResult, NbAuthService } from '@nebular/auth';

const routeData = 'value';

@Component({
    template: '<p>Signing in...</p>',
    standalone: false
})
export class RedirectComponent implements OnInit {
  private provider: ExternalAuthProvider;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private user: UserService,
    private authService: AuthenticationService,
    private externalAuthService: ExternalAuthService,
    protected initUserService: InitUserService,
    protected userStore: UserStore) {
    this.provider = route.data[routeData].provider as ExternalAuthProvider;
  }

  async ngOnInit() {
    const userInfo: ExternalLogin = await this.externalAuthService.getUserInfo(this.provider);
    const result = await this.authService.loginWithExternal(userInfo);
    if (!result.error) {
      this.user.setCurrentUser(result.user);
      if (result.user.nbAuthResult.isSuccess()) {
        this.initUserService.initCurrentUser().subscribe();
      } else {
        // this.errors = result.getErrors();
      }
      const redirect = result.user.nbAuthResult.getRedirect();
      if (redirect) {
        setTimeout(() => {
          // TODO: Check why does not work
          return this.router.navigateByUrl('/home');
        }, 10);
      }
      // /// App
      // export interface UserJWT {
      //   // using registered/public claims per https://www.iana.org/assignments/jwt/jwt.xhtml
      //   exp: number;
      //   name: string;
      //   username: string;
      //   given_name: string;
      //   family_name: string;
      //   email?: string;
      //   picture: string;
      // }

      // /** Client user model */
      // export interface User extends UserJWT {
      //   token: string;
      // }


      /// Neb
      // export interface User {
      //  id: number;
      //  role: string;
      //  firstName: string;
      //  lastName: string;
      //  email: string;
      //  name?: string;
      //  age: number;
      //  login: string;
      //  picture: string;
      //  address: Address;
      //  settings: Settings;
      // }
      // this.router.navigate(['/profile']);
    } else {
      alert(result.error);
    }
  }

}
