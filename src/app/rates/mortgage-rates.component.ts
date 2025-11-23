import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgxTabsComponent } from '@infragistics/igniteui-angular';
import { IMortgageQuote } from './mortgage-quotes.model';

@Component({
    templateUrl: './mortgage-rates.component.html',
    standalone: false
})
export class MortgageRatesComponent implements OnInit, AfterViewInit {
  @ViewChild('tabs') tabs: IgxTabsComponent;
  public quotes: IMortgageQuote[];
  @ViewChild('rates') rates?: ElementRef;
  @ViewChild('loancalculator') loancalculator?: ElementRef;


  constructor(private route: ActivatedRoute,
    private _renderer2: Renderer2) {
    this.quotes = this.route.snapshot.data['quotes'];
  }

  ngOnInit() {
    this.quotes = this.route.snapshot.data['quotes'];
  }


  ngAfterViewInit() {
    let script1 = this._renderer2.createElement('script');
    script1.type = `text/javascript`;
    script1.src = "https://www.mlcalc.com/mortgage-rates/widget-narrow.js";
    this.rates?.nativeElement.appendChild(script1);

    let script2 = this._renderer2.createElement('script');
    script2.type = `text/javascript`;
    script2.src = "https://www.mlcalc.com/mortgage-rates/widget-narrow.js";
    script2.text = `
      mlcalc_default_calculator = 'loan';
      mlcalc_currency_code = 'usd';
      mlcalc_amortization = 'year_nc';
      mlcalc_purchase_price = '300,000';
      mlcalc_down_payment = '20';
      mlcalc_mortgage_term = '30';
      mlcalc_interest_rate = '4.5';
      mlcalc_property_tax = '3,000';
      mlcalc_property_insurance = '1,500';
      mlcalc_pmi = '0.52';
      mlcalc_loan_amount = '250,000';
      mlcalc_loan_term = '15';
    `;
    this.loancalculator?.nativeElement.appendChild(script2);
  }
}



