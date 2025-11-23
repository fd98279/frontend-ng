import { Component, HostListener } from '@angular/core';
import { SettingsService } from '../common/settings.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactUSService } from './contactus.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../@auth/auth.service';
import { PersistanceService } from '../common/persistance.service';

@Component({
    templateUrl: './contactus.component.html',
    providers: [],
    standalone: false
})


export class ContactUSComponent {
  contactForm: UntypedFormGroup;
  disabledSubmitButton = true;
  optionsSelect: Array<any>;
  siteKey: string;
  public pageId = '/contactus';
  public CONTACT_US_URL: string;

  @HostListener('input') oninput() {

    if (this.contactForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  constructor(fb: UntypedFormBuilder,
    private contactUsService: ContactUSService,
    private toastrService: ToastrService,
    private persistanceService: PersistanceService,
    private authService: AuthService) {

    this.siteKey = environment.recaptchaSiteKey;

    this.contactForm = fb.group({
      'Name': ['', Validators.required],
      'Email': ['', Validators.compose([Validators.required, Validators.email])],
      'Subjects': ['', Validators.required],
      'Message': ['', Validators.required],
      'Copy': [''],
      'reCaptcha': ['', Validators.required]
    });
    this.CONTACT_US_URL = 'https://jobs.sravz.com/contact-us/';
  }

  onSubmit() {
    this.authService.verifyReCaptcha(this.contactForm.value.reCaptcha).subscribe((captchaServerResponse) => {
      if (this.persistanceService.get('notification')!= null && this.persistanceService.get('notification'))
      this.toastrService.info('Saving message!',null, {
        positionClass: 'toast-bottom-center' });
      if (captchaServerResponse !== 'Valid') {
        this.contactForm.controls['reCaptcha'].reset();
      } else {
        this.contactUsService.sendMessage(this.contactForm.value).subscribe(() => {
          this.toastrService.success('Thanks for your message. Message saved!',null, {
            positionClass: 'toast-bottom-center' });
          this.contactForm.reset();
          this.disabledSubmitButton = true;
        }, error => {
          this.toastrService.error('Message send error',null, {
            positionClass: 'toast-bottom-center' });
        });
      }
    }, (error) => {
      this.toastrService.error('reCaptcha verification error',null, {
        positionClass: 'toast-bottom-center' });
      this.contactForm.controls['reCaptcha'].reset();
    });
  }

}


