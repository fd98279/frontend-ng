import { Component, Input, OnChanges, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { IAsset, IExchangeAsset } from '../assets/asset.model';
import { ActivatedRoute } from '@angular/router';
import { IgxTabsComponent } from '@infragistics/igniteui-angular';


@Component({
    selector: 'asset-tearsheet',
    templateUrl: './asset.tearsheet.component.html',
    standalone: false
})

export class AssetTearsheetComponent implements AfterViewInit {
    @Input() id!: string;
    @Input() assetName: string;
    returnsTearSheetUrl: string;
    indexComponentsUrl: string;
    indexComponents: IAsset[];
    exchangeComponents: IExchangeAsset[];
    rollingStatsTearSheet: string;
    timeSeriesAnalysisUrl: string;
    bayesiantimeSeriesUrl: string;
    prophetModelUrl: string;
    evaluatePredictionUrl: string;
    changePointPriorAnalysisUrl: string;
    changePointPriorValidationUrl: string;
    predictionWithChangePointUrl: string;
    predictFutureUrl: string;
    userAssetCovarianceAnalysisInnerHTML: string;
    leveragedFundsUrl: string;
    @ViewChild('tabs') tabs: IgxTabsComponent;
    displayTabs: boolean;

    constructor(private route: ActivatedRoute,
        private analyticsService: AnalyticsService) {
    }

    public ngAfterViewInit(): void {
        Promise.resolve(1).then(() => {
            this.route
                .queryParams
                .subscribe(_params => {
                    // Defaults to 0 if no query param provided.
                    this.assetName = _params['asset'] || '';
                    if (this.assetName) {
                        this.ResetUI();
                        this.analyticsService.getAssetDetails(this.assetName, null);
                        if (this.assetName.indexOf('idx_') >= 0) {
                            this.analyticsService.getIndexComponents(this.assetName).subscribe((data1) => {
                                this.indexComponents = data1 as IAsset[];
                                this.displayTabs = true;
                            });
                        }
                    }
                });

            this.analyticsService.topics[this.analyticsService.TOPIC_PCA].subscribe(
                (message: { id: any; data: string; signed_url: string; }) => {
                    if (message) {
                        this.displayTabs = true;
                        switch (message.id) {
                            case 1.1: {
                                this.rollingStatsTearSheet = message.data;
                                break;
                            }
                            case 14: {
                                this.returnsTearSheetUrl = message.data;
                                break;
                            }
                            case 16: {
                                this.timeSeriesAnalysisUrl = message.data;
                                break;
                            }
                            case 18: {
                                this.bayesiantimeSeriesUrl = message.data;
                                break;
                            }
                            case this.analyticsService.MESSAGE_IDS['RISK_ENGINE.get_stocker_tear_sheet_create_prophet_model']: {
                                this.prophetModelUrl = message.data;
                                break;
                            }
                            case this.analyticsService.MESSAGE_IDS['RISK_ENGINE.get_stocker_tear_sheet_create_evaluate_prediction']: {
                                this.evaluatePredictionUrl = message.data;
                                break;
                            }
                            case this.analyticsService.MESSAGE_IDS['RISK_ENGINE.get_stocker_tear_sheet_create_change_point_prior_analysis']: {
                                this.changePointPriorAnalysisUrl = message.data;
                                break;
                            }
                            case this.analyticsService.MESSAGE_IDS['RISK_ENGINE.get_stocker_tear_sheet_create_change_point_prior_validation']: {
                                this.changePointPriorValidationUrl = message.data;
                                break;
                            }
                            case this.analyticsService.MESSAGE_IDS['RISK_ENGINE.get_stocker_tear_sheet_create_prediciton_with_change_point']: {
                                this.predictionWithChangePointUrl = message.data;
                                break;
                            }
                            case this.analyticsService.MESSAGE_IDS['RISK_ENGINE.get_stocker_tear_sheet_predict_future']: {
                                this.predictFutureUrl = message.data;
                                break;
                            }
                            // Data containes the signed URL
                            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.get_correlation_analysis_tear_sheet_user_asset']: {
                                // let data = message.data;
                                // Change class so mdbootstrap could add the style
                                // const parser = new DOMParser();
                                // const doc = parser.parseFromString(data, 'text/html');
                                // const data_updated = data.replace(/dataframe/i, 'table');
                                this.userAssetCovarianceAnalysisInnerHTML = message.data;
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }
                }
            );
        });
    }

    ResetUI() {
        this.returnsTearSheetUrl = '';
        this.indexComponentsUrl = '';
        this.indexComponents = [];
        this.rollingStatsTearSheet = '';
        this.timeSeriesAnalysisUrl = '';
        this.bayesiantimeSeriesUrl = '';
        this.prophetModelUrl = '';
        this.evaluatePredictionUrl = '';
        this.changePointPriorAnalysisUrl = '';
        this.changePointPriorValidationUrl = '';
        this.predictionWithChangePointUrl = '';
        this.predictFutureUrl = '';
        this.leveragedFundsUrl = '';
    }


    RequestData(asset, messageids) {
        if (asset) {
            this.ResetUI();
            this.assetName = asset;
            this.analyticsService.getAssetDetails(asset, messageids);
        }
    }

}
