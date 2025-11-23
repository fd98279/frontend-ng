import { Component, Input, ViewChild } from '@angular/core';
import { IgxTabsComponent } from '@infragistics/igniteui-angular';
import { AnalyticsService } from '../analytics.service';


@Component({
    selector: 'portfolio-tearsheet',
    templateUrl: './portfolio.tearsheet.component.html',
    standalone: false
})
export class PortfolioTearsheetComponent {
  public PCATearSheetUrl: string;
  public returnsTearSheetUrl: string;
  public timeSeriesUrl: string;
  public prophetModelUrl: string;
  public evaluatePredictionUrl: string;
  public changePointPriorAnalysisUrl: string;
  public changePointPriorValidationUrl: string;
  public predictionWithChangePointUrl: string;
  public predictFutureUrl: string;
  public covarianceAnalysisUrl: string;
  public LeveragedFundsUrl: string;
  public displayTabs: boolean;
  @Input() portfolioName: string;
  @ViewChild('tabs') tabs: IgxTabsComponent;

  constructor(private analyticsService: AnalyticsService) {

    this.analyticsService.topics[this.analyticsService.TOPIC_PCA].subscribe(
      message => {
        this.displayTabs = true;
        if (message) {
          switch (message.id) {
            case this.analyticsService.MESSAGE_IDS['PCA_ENGINE.create_portfolio_pca_report']: {
              this.PCATearSheetUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.create_portfolio_returns_tear_sheet']: {
              this.returnsTearSheetUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.portfolio_returns_timeseries_analysis']: {
              this.timeSeriesUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.get_stocker_tear_sheet_create_prophet_model']: {
              this.prophetModelUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.get_stocker_tear_sheet_create_evaluate_prediction']: {
              this.evaluatePredictionUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.get_stocker_tear_sheet_create_change_point_prior_analysis']: {
              this.changePointPriorAnalysisUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.get_stocker_tear_sheet_create_change_point_prior_validation']: {
              this.changePointPriorValidationUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.get_stocker_tear_sheet_create_prediciton_with_change_point']: {
              this.predictionWithChangePointUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.get_stocker_tear_sheet_predict_future']: {
              this.predictFutureUrl = message.data;
              break;
            }
            case this.analyticsService.MESSAGE_IDS['PORTFOLIO_ENGINE.get_correlation_analysis_tear_sheet']: {
              this.covarianceAnalysisUrl = message.data;
              //this.tabs.selectedIndex = -1;
              //this.tabs.selectedIndex = 0;
              break;
            }
            default: {
              break;
            }
          }
        }
      }
    );

    this.analyticsService.topics[this.analyticsService.TOPIC_RUST].subscribe(
      message => {
        this.displayTabs = true;
        if (message) {
          switch (message.id) {
            case this.analyticsService.MESSAGE_IDS['RUST_BACKEND_LEVERAGED_FUNDS']: {
              this.LeveragedFundsUrl = message.data;
              break;
            }
            default: {
              break;
            }
          }
        }
      }
    );
  }

  ResetUI() {
    this.returnsTearSheetUrl = '';
    this.PCATearSheetUrl = this.returnsTearSheetUrl = this.timeSeriesUrl = null;
    this.prophetModelUrl = null;
    this.evaluatePredictionUrl = null;
    this.changePointPriorAnalysisUrl = null;
    this.changePointPriorValidationUrl = null;
    this.predictionWithChangePointUrl = null;
    this.predictFutureUrl = null;
    this.covarianceAnalysisUrl = null;
  }

  RequestData(portfolio_name, user_id, messageids) {
    if (portfolio_name && user_id) {
      this.ResetUI();
      this.analyticsService.getPortfolioTearSheets(portfolio_name, user_id, messageids);
    }
  }


}
