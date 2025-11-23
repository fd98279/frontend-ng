import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { IgxSizeScaleComponent } from 'igniteui-angular-charts';
import { IgxValueBrushScaleComponent } from 'igniteui-angular-charts';
import { MarkerType } from 'igniteui-angular-charts';
import { IgxGeographicMapComponent } from 'igniteui-angular-maps';
import { IgxGeographicProportionalSymbolSeriesComponent
} from 'igniteui-angular-maps';
import { IgniteUIService } from '../services/ignite-ui-service';
import { IQuote } from '../../quotes/quotes.model';

@Component({
    selector: 'app-map-type-scatter-bubble-series',
    styleUrls: ['./map-type-scatter-bubble-series.component.scss'],
    templateUrl: './map-type-scatter-bubble-series.component.html',
    standalone: false
})
export class MapTypeScatterBubbleSeriesComponent implements AfterViewInit {

    @ViewChild('map', {static: true})
    public map: IgxGeographicMapComponent;
    @ViewChild('template', {static: true})
    public tooltipTemplate: TemplateRef<object>;
    public indexQuotesData: IQuote[];

    constructor(private igniteUIService: IgniteUIService) {

    }

    public ngAfterViewInit(): void {
        this.igniteUIService.getMessage().subscribe(
            message => {
                switch (message.MessageID) {
                    case this.igniteUIService.MESSAGE_IDS['INDEXQUOTES']: {
                        this.indexQuotesData = message.Message as IQuote[];
                        this.addSeries(this.indexQuotesData);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        );
    }


    public addSeries(locations: IQuote[]) {

        const sizeScale = new IgxSizeScaleComponent();
        sizeScale.minimumValue = 4;
        sizeScale.maximumValue = 60;
        const brushes = [
            'red',  // semi-transparent red
            'green'  // semi-transparent green
        ];

        const brushScale = new IgxValueBrushScaleComponent();
        brushScale.brushes = brushes;
        brushScale.minimumValue = -1;
        brushScale.maximumValue = 1;

        const symbolSeries = new IgxGeographicProportionalSymbolSeriesComponent();
        // symbolSeries.dataSource = locations;
        symbolSeries.dataSource = locations.filter(item => item.MajorIndex === true);
        symbolSeries.markerType = MarkerType.Circle;
        // symbolSeries.markerTemplate = this.tooltipTemplate;;
        symbolSeries.radiusScale = sizeScale;
        symbolSeries.fillScale = brushScale;
        symbolSeries.fillMemberPath = 'PercentChange';
        symbolSeries.radiusMemberPath = 'PercentChange';
        symbolSeries.latitudeMemberPath = 'CapitalLatitude';
        symbolSeries.longitudeMemberPath = 'CapitalLongitude';
        symbolSeries.markerOutline = 'rgba(0,0,0,0.3)';
        symbolSeries.tooltipTemplate = this.tooltipTemplate;

        this.map.series.add(symbolSeries);

    }

}
