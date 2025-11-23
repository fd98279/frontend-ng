import { Component, OnInit, Inject, DOCUMENT } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { PersistanceService } from '../common/persistance.service';




import { WindowRef } from '../common/window.service';

@Component({
    selector: 'index-selector',
    templateUrl: './index.selector.component.html',
    standalone: false
})


export class IndexSelectorComponent implements OnInit {


  selectedTypeId = 'Russell 3000';
  availableTypes = [
    { id: 'futures', type: 'futures', name: 'Futures', source: 'uiv1' , 'url': 'futures'},
    { id: 'ecocal', type: 'ecocal', name: 'Economic Calendar', source: 'uiv1', 'url': 'ecocal' },
    { id: 'snp', type: 'snp', name: 'S&P 500', source: 'uiv1', 'url': 'snp' },
    { id: 'russell', type: 'russell', name: 'Russell 3000', source: 'uiv2', 'url': 'russell/components' },
    { id: 'dj30', type: 'dj30', name: 'DJ30', source: 'uiv2', 'url': 'dj30/components' },
  ];


  constructor(@Inject(DOCUMENT) private document: any,
    private route: ActivatedRoute,
    private router: Router,
    private winRef: WindowRef) {
  }

  ngOnInit () {
    this.selectedTypeId = this.availableTypes.find(x => this.router.url.includes(x.url)).id;
  }


  onTypeChange($event) {
    // console.log($event);
    // if ($event.source === 'uiv1') {
    // this.winRef.nativeWindow.location.href = '/' + $event.type;
    this.router.navigateByUrl('/' + $event.url);
    // }
  }
}
