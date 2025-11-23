import { Component } from '@angular/core';
import { environment } from '../../environments/environment';


@Component({
    templateUrl: './admin.component.html',
    providers: [],
    standalone: false
})


export class AdminComponent {

  public PORTAINER_URL: string;
  public NSQ_ADMIN_URL: string;
  public TRAEFIK_DASHBOARD_URL: string;
  public AIRFLOW1_ADMIN_URL: string;
  public PORTAINER2_URL: string;
  public NSQ2_ADMIN_URL: string;
  public TRAEFIK2_DASHBOARD_URL: string;
  public AIRFLOW2_ADMIN_URL: string;


  constructor() {
    this.PORTAINER_URL = 'https://portainer1.sravz.com';
    this.TRAEFIK_DASHBOARD_URL = 'https://monitor1.sravz.com';
    this.NSQ_ADMIN_URL = 'https://nsqadmin.sravz.com';
    this.AIRFLOW1_ADMIN_URL = 'https://airflowweb.sravz.com';

    this.PORTAINER2_URL = 'https://portainer2.sravz.com';
    this.TRAEFIK2_DASHBOARD_URL = 'https://monitor2.sravz.com';
    this.NSQ2_ADMIN_URL = 'https://nsqadmin1.sravz.com';
    this.AIRFLOW2_ADMIN_URL = 'https://airflowweb1.sravz.com';

  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }

}


