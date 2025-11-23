/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import {Component, Input, forwardRef} from '@angular/core';

@Component({
    selector: 'ngx-validation-message',
    styleUrls: ['./validation-message.component.scss'],
    template: `
      <div class="warning">
        @if (showMinLength) {
          <span class="caption status-danger"
          > Min {{ label }} length is {{ minLength }} symbols </span>
        }
        @if (showMaxLength) {
          <span class="caption status-danger"
          > Max {{ label }} length is {{ maxLength }} symbols </span>
        }
        @if (showPattern) {
          <span class="caption status-danger"> Incorrect {{ label }} </span>
        }
        @if (showRequired) {
          <span class="caption status-danger"> {{ label }} is required</span>
        }
        @if (showMin) {
          <span class="caption status-danger">Min value of {{ label }} is {{ min }}</span>
        }
        @if (showMax) {
          <span class="caption status-danger">Max value of {{ label }} is {{ max }}</span>
        }
      </div>
      `,
    standalone: false
})
export class NgxValidationMessageComponent {
  @Input()
  label = '';

  @Input()
  showRequired?: boolean;

  @Input()
  min?: number;

  @Input()
  showMin?: boolean;

  @Input()
  max?: number;

  @Input()
  showMax: boolean;

  @Input()
  minLength?: number;

  @Input()
  showMinLength?: boolean;

  @Input()
  maxLength?: number;

  @Input()
  showMaxLength?: boolean;

  @Input()
  showPattern?: boolean;
}
