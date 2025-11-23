import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { MarkerType } from 'igniteui-angular-charts';
import { IgxGeographicMapComponent } from 'igniteui-angular-maps';
import { IgxGeographicSymbolSeriesComponent } from 'igniteui-angular-maps';

@Component({
    selector: 'app-map-binding-data-json-points',
    styleUrls: ['./map-binding-data-json-points.component.scss'],
    templateUrl: './map-binding-data-json-points.component.html',
    standalone: false
})

export class MapBindingDataJsonPointsComponent implements AfterViewInit {

    @ViewChild('map', {static: true})
    public map: IgxGeographicMapComponent;
    @ViewChild('template', {static: true})
    public tooltip: TemplateRef<object>;
    constructor() {
    }

    public ngAfterViewInit(): void {
        // this.componentDidMount();
        this.onDataLoaded();
    }

    public componentDidMount() {
        // fetching JSON data with geographic locations from public folder
        // fetch('https://www.infragistics.com/angular-demos-dv/assets/Data/WorldCities.json')
        //     .then((response) => response.json())
        //     .then((data) => this.onDataLoaded(data));
    }

    public onDataLoaded() {
        // console.log('loaded https://www.infragistics.com/angular-demos-dv/assets/Data/WorldCities.json ' + jsonData.length);

        const jsonData = [
            { 'cap': false, 'pop':  0.468, 'lat': 68.9635467529297, 'lon': 33.0860404968262, 'country': 'Russia', 'name': 'Murmansk' },
            { 'cap': false, 'pop':  0.416, 'lat': 64.5206680297852, 'lon': 40.6461601257324, 'country': 'Russia', 'name': 'Arkhangelsk' },
            // tslint:disable-next-line:max-line-length
            { 'cap': false, 'pop':  5.825, 'lat': 59.9518890380859, 'lon': 30.4533271789551, 'country': 'Russia', 'name': 'Saint Petersburg' },
            { 'cap': false, 'pop':  0.152, 'lat': 59.5709991455078, 'lon': 150.780014038086, 'country': 'Russia', 'name': 'Magadan' },
            { 'cap': false, 'pop':  1.160, 'lat': 58.0002365112305, 'lon': 56.2324638366699, 'country': 'Russia', 'name': 'Perm\'' },
            { 'cap': false, 'pop':  1.620, 'lat': 56.8465423583984, 'lon': 60.6101303100586, 'country': 'Russia', 'name': 'Yekaterinburg' },
            // tslint:disable-next-line:max-line-length
            { 'cap': false, 'pop':  2.025, 'lat': 56.2896766662598, 'lon': 43.9406700134277, 'country': 'Russia', 'name': 'Nizhniy Novgorod' },
            { 'cap': false, 'pop':  1.800, 'lat': 55.8628082275391, 'lon': -4.26994752883911, 'country': 'UK', 'name': 'Glasgow' },
        ];
        const geoLocations: any[] = [];
        // parsing JSON data and using only cities that are capitals
        for (const jsonItem of jsonData) {
            if (jsonItem.cap) {
                const location = {
                    city: jsonItem.name,
                    country: jsonItem.country,
                    latitude: jsonItem.lat,
                    longitude: jsonItem.lon,
                    population: jsonItem.pop
                };
                geoLocations.push(location);
            }
        }

        // creating symbol series with loaded data
        const geoSeries = new IgxGeographicSymbolSeriesComponent();
        geoSeries.dataSource = geoLocations;
        geoSeries.markerType = MarkerType.Circle;
        geoSeries.latitudeMemberPath  = 'latitude';
        geoSeries.longitudeMemberPath = 'longitude';
        geoSeries.markerBrush = 'LightGray';
        geoSeries.markerOutline = 'Black';
        geoSeries.tooltipTemplate = this.tooltip;

        // adding symbol series to the geographic amp
        this.map.series.add(geoSeries);
    }
}
