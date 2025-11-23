import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IgxDemoModule } from '../ignite-ui/ignite-ui.module';
import { FormsModule } from '@angular/forms';
import { YTDRoutes } from './ytd.routes';
import { FundamentalsService } from '../fundamentals/fundamental.service';
import { YTDCodesResolver } from './ytd-codes-resolver';
import { YTDComponent } from './ytd-component';
import { AssetsService } from '../assets/assets.service';
import { IgxTabsModule } from '@infragistics/igniteui-angular';
import { AssetResolver } from '../assets/asset-resolver.service';
import { MutualFundsService } from '../mutual-funds/mutual-funds.service';
import { MutualFundsTickerResolver } from '../mutual-funds/mutual-funds-ticker-resolver.service';
import { ETFTickerResolver } from '../etfs/etf-ticker-resolver.service';
import { ETFService } from '../etfs/etf.service';

@NgModule({
  declarations: [
    YTDComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(YTDRoutes),
    IgxDemoModule,
    FormsModule,
  ],
  providers: [
    FundamentalsService,
    YTDCodesResolver,
    AssetsService,
    AssetResolver,
    MutualFundsTickerResolver,
    MutualFundsService,
    ETFTickerResolver,
    ETFService
  ]
})
export class YTDModule { }
