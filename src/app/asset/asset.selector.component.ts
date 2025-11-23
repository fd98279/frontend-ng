import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IAssetGroups } from '../assets/asset.model';
import { IUserAsset } from '../assets/userasset.model';

@Component({
    selector: 'asset-selector-component',
    templateUrl: 'asset.selector.component.html',
    standalone: false
})

export class AssetSelectorComponent implements OnInit {
  @Input() assetgroups: IAssetGroups[];
  @Input() userassets: IUserAsset[];
  assetControl = new UntypedFormControl();
  assetSelectorForm: UntypedFormGroup;
  @Output() assetSelectedEvent = new EventEmitter<string>();

  selectOneOnly(group: UntypedFormGroup): any {
    if (group) {
      if (group.get('SravzAsset').value ||  group.get('UserAsset').value) {
        return { oneSelected : true };
      }
    }
    return null;
  }

  constructor(private fb: UntypedFormBuilder) {
    this.assetSelectorForm = fb.group({
      'SravzAsset': [''],
      'UserAsset': ['']
    }, this.selectOneOnly);
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.assetSelectedEvent.emit(this.assetSelectorForm.value.UserAsset || this.assetSelectorForm.value.SravzAsset);
  }

  onUserAssetChanged($event) {
    if ($event.source.value) {
      this.assetSelectorForm.get('SravzAsset').setValue(null);
    }
  }

  onSravzAssetChanged($event) {
    if ($event.source.value) {
      this.assetSelectorForm.get('UserAsset').setValue(null);
    }
  }
}
