import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgxTabsComponent } from '@infragistics/igniteui-angular';
import { AnalyticsService } from '../analytics.service';
import { IAsset } from '../assets/asset.model';
import { IIgniteUIMessage } from '../ignite-ui/services/ignite-ui-message-model';
import { IgniteUIService } from '../ignite-ui/services/ignite-ui-service';

@Component({
    templateUrl: './spread-analysis.component.html',
    standalone: false
})


export class SpreadAnalysisComponent implements OnInit {
  assets: IAsset[];
  selectedAssetsArray: any[];
  selectedAssets: any[];
  spreadAnalysisURL: string;
  sravzIds: any[];
  @ViewChild('tabs') tabs: IgxTabsComponent;

  constructor(private route: ActivatedRoute, private analyticsService: AnalyticsService, private igniteUIService: IgniteUIService) {
    this.analyticsService.topics[this.analyticsService.TOPIC_PCA].subscribe(
      (message) => {
        if (message) {
          switch (message.id) {
            case this.analyticsService.MESSAGE_IDS['spread.perform_spread_analysis_for_assets']: {
              if (message.data) {
                this.spreadAnalysisURL = message.data;
                this.tabs.selectedIndex = -1;
                this.tabs.selectedIndex = 0;
              }
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

  ngOnInit() {
    this.assets = this.route.snapshot.data['assets'];
  }

  onAssetsSelected(event) {
    this.selectedAssets = [];
    this.selectedAssetsArray = event.map(asset => asset.SravzId).slice(0, 10);
    if (this.selectedAssetsArray.length == 2) {
      this.selectedAssets.push(this.convertArraytoJson(this.selectedAssetsArray));
    }
  }

  swap() {
    if (this.selectedAssetsArray.length == 2) {
      this.selectedAssetsArray = [this.selectedAssetsArray[0], this.selectedAssetsArray[1]] = [this.selectedAssetsArray[1], this.selectedAssetsArray[0]];
      this.selectedAssets = [];
      this.selectedAssets.push(this.convertArraytoJson(this.selectedAssetsArray));
    }
  }

  onSubmit(event) {
    if (this.selectedAssets.length > 0) {
      // alert(JSON.stringify(this.selectedAssets[0]));
      this.sravzIds = [];
      this.sravzIds.push(this.selectedAssets[0]["left"])
      this.sravzIds.push(this.selectedAssets[0]["right"])
      // const selectedAssets = event.map(asset => asset.SravzId).slice(0, 10);
      if (this.sravzIds.length > 0) {
        this.analyticsService.sendMessageToNSQ(this.analyticsService.MESSAGE_IDS['spread.perform_spread_analysis_for_assets'],
          this.analyticsService.TOPIC_PCA, this.sravzIds, {}, `Perform Spread Analysis for {sravzIds}`);
      }
    }
    // event.stopPropagation();
  }

  convertArraytoJson(array) {
    var json = {};
    json["left"] = array[0];
    json["right"] = array[1];
    return json;
  }
}
