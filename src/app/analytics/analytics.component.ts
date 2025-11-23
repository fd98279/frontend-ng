import { Component, OnInit, ViewChild } from '@angular/core';
import { IAsset } from '../assets/asset.model';
import { ActivatedRoute } from '@angular/router';
import { AssetTearsheetComponent } from '../tearsheet/asset.tearsheet.component';
import { AnalyticsService } from '../analytics.service';
import { ToastrService } from 'ngx-toastr';
import { IUserAsset } from '../assets/userasset.model';
import { IPortfolio } from '../portfolios/portfolio.model';
import { PortfolioTearsheetComponent } from '../tearsheet/portfolio.tearsheet.component';

@Component({
    templateUrl: './analytics.component.html',
    standalone: false
})
export class AnalyticsComponent implements OnInit {

  public assets: IAsset[];
  public userassets: IUserAsset[];
  public portfolios: IPortfolio[];
  public showDetails: boolean;
  public analyticsType: string;
  public analyticsDocUrl: string;
  public analyticsGitUrl: string;
  public assetType: string;
  public portfolioName: string;
  public assetName: string;
  private sub: any;

  @ViewChild(AssetTearsheetComponent, { static: false }) assetTearSheetComponent: AssetTearsheetComponent;
  @ViewChild(PortfolioTearsheetComponent, { static: false }) portfolioTearSheetComponent: PortfolioTearsheetComponent;

  constructor(private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private toastrService: ToastrService) {
    this.showDetails = true;
    this.assets = this.route.snapshot.data['assets'];
    this.userassets = this.route.snapshot.data['userassets'];
    this.portfolios = this.route.snapshot.data['portfolios'];
  }

  public ngOnInit() {
    this.assets = this.route.snapshot.data['assets'];
    this.userassets = this.route.snapshot.data['userassets'];
    this.portfolios = this.route.snapshot.data['portfolios'];
    this.sub = this.route
      .queryParams
      .subscribe(_params => {
        // Defaults to 0 if no query param provided.
        this.analyticsType = _params['analyticsType'] || '';
        this.assetType = _params['assetType'] || '';
      });
    this.analyticsDocUrl = `https://docs.sravz.com/docs/analytics/${this.analyticsType.split(' ').join('-').toLowerCase()}`;
    this.analyticsGitUrl = `https://github.com/sravzpublic/training/blob/master/training-py/${this.analyticsType}.ipynb`;
  }
  /* On asset or portfolio selected */

  RestUI() {
    if (this.assetTearSheetComponent) {
      this.assetTearSheetComponent.ResetUI();
    }
    if (this.portfolioTearSheetComponent) {
      this.portfolioTearSheetComponent.ResetUI();
    }
  }
  onPortfolioSelected(item: any) {
    if (this.analyticsType) {
      this.portfolioName = item.name;
      this.RestUI();
      if (this.analyticsType == "Leveraged Funds") {
        this.portfolioTearSheetComponent.RequestData(
          item.portfolioassets.map((x: { SravzId: any; }) => x.SravzId),
          item.user?._id,
          this.analyticsService.PortfolioAnalyticsTypesToMessageIDMapping[this.analyticsType]
        );
      } else {
        this.portfolioTearSheetComponent.RequestData(
          this.portfolioName,
          item.user?._id,
          this.analyticsService.PortfolioAnalyticsTypesToMessageIDMapping[this.analyticsType]
        );
      }
    } else {
      this.toastrService.error('Invalid analytics type', null, {
        positionClass: 'toast-bottom-center'
      });
    }
  }

  /* Get analysis for the sravz Asset */
  onAssetSelected(item: IAsset[]) {
    if (this.analyticsType && item.length > 0) {
      this.assetName = item[0].SravzId;
      this.RestUI();
      this.assetTearSheetComponent.RequestData(this.assetName,
        this.analyticsService.AssetAnalyticsTypesToMessageIDMapping[this.analyticsType]);
    } else {
      this.toastrService.error('Invalid analytics type', null, {
        positionClass: 'toast-bottom-center'
      });
    }
  }

  /* Get analytics for the user assets */
  onUserAssetSelected(item) {
    item = item.USER_ASSET_NAME.S;
    if (this.analyticsType) {
      this.assetName = item;
      this.RestUI();
      /* Request data for the asset name and use the mapping for the analytics message ID */
      this.assetTearSheetComponent.RequestData(this.assetName,
        this.analyticsService.AssetAnalyticsTypesToMessageIDMapping[this.analyticsType]);
    } else {
      this.toastrService.error('Invalid analytics type', null, {
        positionClass: 'toast-bottom-center'
      });
    }
  }

}
