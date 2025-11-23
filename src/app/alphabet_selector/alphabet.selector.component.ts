import { Component, OnInit, Inject, Output, EventEmitter, DOCUMENT } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WindowRef } from '../common/window.service';

@Component({
    selector: 'alphabet-selector',
    templateUrl: './alphabet.selector.component.html',
    standalone: false
})


export class AlphabetSelectorComponent implements OnInit {
  selectedTypes = [];
  availableTypes = [
    { id: 'A',  type: 'A', name: 'A' },
    { id: 'B',  type: 'B', name: 'B' },
    { id: 'C',  type: 'C', name: 'C' },
    { id: 'D',  type: 'D', name: 'D' },
    { id: 'E',  type: 'E', name: 'E' },
    { id: 'F',  type: 'F', name: 'F' },
    { id: 'G',  type: 'G', name: 'G' },
    { id: 'H',  type: 'H', name: 'H' },
    { id: 'I',  type: 'I', name: 'I' },
    { id: 'J',  type: 'J', name: 'J' },
    { id: 'K',  type: 'K', name: 'K' },
    { id: 'L',  type: 'L', name: 'L' },
    { id: 'M',  type: 'M', name: 'M' },
    { id: 'N',  type: 'N', name: 'N' },
    { id: 'O',  type: 'O', name: 'O' },
    { id: 'P',  type: 'P', name: 'P' },
    { id: 'Q',  type: 'Q', name: 'Q' },
    { id: 'R',  type: 'R', name: 'R' },
    { id: 'S',  type: 'S', name: 'S' },
    { id: 'T',  type: 'T', name: 'T' },
    { id: 'U',  type: 'U', name: 'U' },
    { id: 'V',  type: 'V', name: 'V' },
    { id: 'W',  type: 'W', name: 'W' },
    { id: 'X',  type: 'X', name: 'X' },
    { id: 'Y',  type: 'Y', name: 'Y' },
    { id: 'Z',  type: 'Z', name: 'Z' },
    { id: '#',  type: '#', name: '#' }
  ];

  @Output() messageEvent = new EventEmitter<any[]>();

  constructor(@Inject(DOCUMENT) private document: any,
    private route: ActivatedRoute,
    private router: Router,
    private winRef: WindowRef) {
  }

  ngOnInit () {
  }


  onTypeChange($event) {
    this.messageEvent.emit(this.selectedTypes);
  }
}
