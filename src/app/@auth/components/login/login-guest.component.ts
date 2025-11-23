/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NB_AUTH_OPTIONS,
  NbAuthSocialLink,
  NbAuthService,
  NbAuthResult,
  NbAuthOAuth2JWTToken,
} from '@nebular/auth';
import { getDeepFromObject } from '../../helpers';
import { EMAIL_PATTERN } from '../constants';
import { InitUserService } from '../../../@theme/services/init-user.service';
import { ExternalAuthService, AuthenticationService, User, UserService } from '../../../authentication';
import { ExternalAuthProvider } from '../../../authentication/services/external-auth-configs';
import { Location } from '@angular/common';
import { ButtonGroupAlignment } from '@infragistics/igniteui-angular';
import { parseUser } from '../../../authentication/services/jwt-util';


@Component({
    selector: 'ngx-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class NgxLoginGuestComponent implements OnInit {
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

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted = false;
  loginForm: UntypedFormGroup;
  alive = true;

  private returnUrl: string;
  public guestLoginReturnUrl: string;
  public guestLoginSucessesReturnUrl: string;

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    protected router: Router,
    protected initUserService: InitUserService,
    public authService: ExternalAuthService,
    private authentication: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location) {
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
  /** expose to template */
  public providers = ExternalAuthProvider;


  ngOnInit(): void {
    this.signUpGuest();

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
      this.guestLoginSucessesReturnUrl = this.returnUrl; // No encoding is required, handled by angular router
    } else {
      this.guestLoginSucessesReturnUrl = '/home';
    }

  }

  login(_user): void {
    if (!_user) {
      this.user = this.loginForm.value;
    } else {
      this.user = _user;
    }
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
        /* Sets user and the token */
        const user: User = parseUser((result.getToken() as NbAuthOAuth2JWTToken).getPayload().access_token);
        user.nbAuthResult = result;
        this.userService.setCurrentUser(user);
        /* Set user after user login to be shown on the profile page*/
        this.initUserService.initCurrentUser().subscribe();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(this.guestLoginSucessesReturnUrl);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  getConfigValue(key: string): any {
    // return () => { getDeepFromObject(this.options, key, null); };
    return getDeepFromObject(this.options, key, null);
  }

  signUpGuest() {
    this.login({
      'email': 'guest123@guest.com',
      'password': 'password',
      rememberMe: true
    });
  }

  signUpG() {
    this.authService.login(ExternalAuthProvider.Google);
  }

  signUpMS() {
    this.authService.login(ExternalAuthProvider.Microsoft);
  }

  signUpFb() {
    this.authService.login(ExternalAuthProvider.Facebook);
  }

  signUpT() {
    this.authService.login(ExternalAuthProvider.Twitter);
  }

  signUpL() {
    this.authService.login(ExternalAuthProvider.LinkedIn);
  }


}
