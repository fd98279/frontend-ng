/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { User } from '../interfaces/common/users';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  /** Returns true if the current user is a guest */
  isGuest(): boolean {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return false;
    }
    // Return true if user is null/undefined, or if username/email is empty/null, or if it's the guest user
    return !this.user || 
           !this.user.userName || 
           !this.user.email || 
           (this.user.userName === 'guest123') || 
           (this.user.email === 'guest123@guest.com');
  }
  private user: User;

  // @ts-ignore: this.user is really assigned before being used
  protected userState$ = new BehaviorSubject(this.user);

  getUser(): User {
    return this.user;
  }

  setUser(paramUser: User) {
    this.user = paramUser;

    this.changeUserState(paramUser);
  }

  onUserStateChange() {
    return this.userState$.pipe(share());
  }

  changeUserState(paramUser: User) {
    this.userState$.next(paramUser);
  }

  setSetting(themeName: string) {
    if (this.user) {
      if (this.user.settings) {
        this.user.settings.themeName = themeName;
      } else {
        this.user.settings = { themeName: themeName };
      }

      this.changeUserState(this.user);
    }
  }
}
