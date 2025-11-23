import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersistanceService } from '../../common/persistance.service';
import { IDashboard, IDashboardAPI } from '../main/dashboard.model';
import { MainComponent } from '../main/main.component';
import { IgniteUIService } from '../services/ignite-ui-service';


@Component({
    selector: 'app-root',
    templateUrl: './markets.dashboard.component.html',
    styleUrls: ['./markets.dashboard.component.scss'],
    host: { class: 'app' },
    standalone: false
})

export class MarketsDashboardComponent implements AfterViewInit, OnInit {

  @ViewChild('main', { static: true }) public main: MainComponent;

  public darkTheme = true;
  public dashboardData: IDashboardAPI;
  public ssVisability = '';

  constructor( private igniteUIService: IgniteUIService,
    private persistanceService: PersistanceService,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit() {
    this.main.dashboardData = this.route.snapshot.data['dashboardData'];
    // this.refreshFeed();
}

  public ngAfterViewInit(): void {
    this.darkTheme = true;
    if (this.persistanceService.get('theme')) {
      this.darkTheme = this.persistanceService.get('theme') === 'dark';
    }
    // this.main.map.darkTheme = this.darkTheme;
    // this.main.map.changeMap();
    // this.main.map.changeMapSeriesBrushScale();
  }
   public onUpdateTimeRetrieved(lastCommit: number) {
  //   this.footer.lastUpdate = new Date(lastCommit);
   }

  public onDataReceived($event) {
    this.ssVisability = $event;
  }
}
