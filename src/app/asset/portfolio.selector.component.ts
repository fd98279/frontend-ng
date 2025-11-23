import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IPortfolio } from '../portfolios/portfolio.model';


@Component({
    selector: 'portfolio-selector-component',
    templateUrl: 'portfolio.selector.component.html',
    standalone: false
})

export class PortfolioSelectorComponent implements OnInit {
  @Input() portfolios: IPortfolio[];
  portfolioControl = new UntypedFormControl();
  portfolioSelectorForm: UntypedFormGroup;
  @Output() portfolioSelectedEvent = new EventEmitter<string>();


  constructor(private fb: UntypedFormBuilder) {
    this.portfolioSelectorForm = fb.group({
      'Portfolio': ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.portfolioSelectedEvent.emit(this.portfolioSelectorForm.value.Portfolio);
  }

}
