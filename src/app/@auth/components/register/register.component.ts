/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink, NbAuthService, NbAuthResult } from '@nebular/auth';
import { getDeepFromObject } from '../../helpers';
import { EMAIL_PATTERN } from '../constants';

@Component({
    selector: 'ngx-register',
    styleUrls: ['./register.component.scss'],
    templateUrl: './register.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgxRegisterComponent implements OnInit {
  minLoginLength: number = this.getConfigValue(('forms.validation.fullName.minLength'));
  maxLoginLength: number = this.getConfigValue(('forms.validation.fullName.maxLength'));
  minLength: number = this.getConfigValue('forms.validation.password.minLength');
  maxLength: number = this.getConfigValue('forms.validation.password.maxLength');
  isFullNameRequired: boolean = this.getConfigValue('forms.validation.fullName.required');
  isEmailRequired: boolean = this.getConfigValue('forms.validation.email.required');
  isPasswordRequired: boolean = this.getConfigValue('forms.validation.password.required');
  redirectDelay: number = this.getConfigValue('forms.register.redirectDelay');
  showMessages: any = this.getConfigValue('forms.register.showMessages');
  strategy: string = this.getConfigValue('forms.register.strategy');
  socialLinks: NbAuthSocialLink[] = this.getConfigValue('forms.login.socialLinks');

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  registerForm: UntypedFormGroup;
  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    protected router: Router) {
    this.minLoginLength = this.getConfigValue(('forms.validation.fullName.minLength'));
    this.maxLoginLength = this.getConfigValue(('forms.validation.fullName.maxLength'));
    this.minLength = this.getConfigValue('forms.validation.password.minLength');
    this.maxLength = this.getConfigValue('forms.validation.password.maxLength');
    this.isFullNameRequired = this.getConfigValue('forms.validation.fullName.required');
    this.isEmailRequired = this.getConfigValue('forms.validation.email.required');
    this.isPasswordRequired = this.getConfigValue('forms.validation.password.required');
    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.strategy = this.getConfigValue('forms.register.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
  }

  get login() { return this.registerForm.get('fullName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get terms() { return this.registerForm.get('terms'); }

  ngOnInit(): void {
    const loginValidators = [
      Validators.minLength(this.minLoginLength),
      Validators.maxLength(this.maxLoginLength),
    ];
    this.isFullNameRequired && loginValidators.push(Validators.required);

    const emailValidators = [
      Validators.pattern(EMAIL_PATTERN),
    ];
    this.isEmailRequired && emailValidators.push(Validators.required);

    const passwordValidators = [
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ];
    this.isPasswordRequired && passwordValidators.push(Validators.required);

    this.registerForm = this.fb.group({
      fullName: this.fb.control('', [...loginValidators]),
      email: this.fb.control('', [...emailValidators]),
      password: this.fb.control('', [...passwordValidators]),
      confirmPassword: this.fb.control('', [...passwordValidators]),
      terms: this.fb.control(''),
    });
  }

  register(): void {
    this.user = this.registerForm.value;
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.register(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        const _errors = result.getErrors();
        _errors.push(result.getResponse().error.error);
        this.errors = _errors;
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
