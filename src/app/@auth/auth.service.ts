import { Injectable, Inject, OnInit, DOCUMENT } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { RxjsHelperService } from '../common/rxjs.helper.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService  {


  constructor(private http: HttpClient,
  private rxjsHelperService: RxjsHelperService) {}

  verifyReCaptcha(captcha_response) {
    return this.http.post<any>(environment.BACKEND_GO_URL + '/api/recaptcha', {Value: captcha_response})
    .pipe(catchError(this.rxjsHelperService.handleError<any>('verifyReCaptcha', [])));
  }

}
