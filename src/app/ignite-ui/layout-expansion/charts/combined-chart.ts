import { Component, QueryList, ViewChildren, Input, OnChanges, ViewChild } from '@angular/core';
import { IExpansionPanelEventArgs, IgxExpansionPanelComponent, IgxTabsComponent } from '@infragistics/igniteui-angular';
import { IgniteUIService } from '../../services/ignite-ui-service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'layout-expansion-combined-chart',
    styleUrls: ['./combined-chart.scss'],
    templateUrl: './combined-chart.html',
    standalone: false
})

export class ExpansionPanelCombinedChartsComponent {

    @ViewChildren(IgxExpansionPanelComponent)
    public accordion: QueryList<IgxExpansionPanelComponent>;
    public chartData: any;
    public chartImageUrl: string;
    @ViewChild('tabs') tabs: IgxTabsComponent;


    constructor(private igniteUIService: IgniteUIService) {
        this.igniteUIService.getMessage().subscribe(
            message => {
                switch (message.MessageID) {
                    case this.igniteUIService.MESSAGE_IDS['IGNITEUICOMBINEDCHARTS']: {
                        if (message.Message) {
                            // const highestStartingDate = message.Message.flatMap(item => item[0].time).sort().pop();
                            // this.chartData = message.Message.map(item => {
                            //     const item2 = item.filter(item1 => item1.time >= highestStartingDate);
                            //     item2.title = item.title;
                            //     return item2;
                            // });
                            this.chartData = message.Message;
                            this.chartData.forEach(series => series.forEach(item => item.time = new Date(item.time)));
                        }
                        this.tabs.selectedIndex = -1;
                        this.tabs.selectedIndex = 0;
                        break;
                    }
                    case this.igniteUIService.MESSAGE_IDS['IGNITEUICOMBINEDCHARTSIMAGEURL']: {
                        this.chartImageUrl = message.Message;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        );
    }

    public collapsed(index: number) {
        if (!this.accordion) {
            return true;
        }
        return this.accordion.toArray()[index] && this.accordion.toArray()[index].collapsed;
    }

    public onInteraction(event: IExpansionPanelEventArgs) {
        // const expandedPanels = this.accordion.filter((panel) => !panel.collapsed);
        // expandedPanels.forEach((expandedPanel) => {
        //     if (expandedPanel.id !== event.panel.id) {
        //         // expandedPanel.collapse();
        //     }
        // });
    }

}
