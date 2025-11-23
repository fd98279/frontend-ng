import { Component, OnInit, Inject, ViewChild, DOCUMENT } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

@Component({
    templateUrl: './assets.upload.component.html',
    standalone: false
})


export class AssetUploadComponent implements OnInit {

  assetUploadForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    file: new UntypedFormControl(''),
  });

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {

  }

  onSubmit() {
    console.warn(this.assetUploadForm.value);
  }}
