import { Component, OnInit, Inject, Output, EventEmitter, Input, DOCUMENT } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';




import { WindowRef } from '../common/window.service';

@Component({
    selector: 'asset-type-selector',
    templateUrl: './asset_type.selector.component.html',
    standalone: false
})


export class AssetTypeSelectorComponent implements OnInit {

  @Input() UploadComponentFileItem: any;
  @Output() messageEvent = new EventEmitter<string>();

  selectedTypeId = '';

  availableTypes = [
    { id: 'Future', type: 'fut', name: 'Future'},
    { id: 'Stock', type: 'stk', name: 'Stock' },
    { id: 'Data', type: 'data', name: 'Data' }
  ];

  constructor(@Inject(DOCUMENT) private document: any,
    private route: ActivatedRoute,
    private router: Router,
    private winRef: WindowRef) {
  }

  ngOnInit () {
  }


  onTypeChange($event) {
    if (this.UploadComponentFileItem) {
      this.UploadComponentFileItem.formData['AssetType'] = $event.type;
      this.UploadComponentFileItem.formData['AssetName'] = $event.name;
    }
    this.messageEvent.emit($event);
  }

}


