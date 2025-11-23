import { Component, OnInit, ViewChild } from '@angular/core';
import { PersistanceService } from '../common/persistance.service';
import { UntypedFormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserStore } from '../@core/stores/user.store';
import { EodApiStatus, IEodApiStatus, NSQStatus } from '../common/nsq.model';
import { NSQStatusService } from '../common/nsq.service';
import { environment } from '../../environments/environment';
import { IgxRadialGaugeComponent } from 'igniteui-angular-gauges';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: false
})


export class SettingsComponent implements OnInit {
  nsqStatus: NSQStatus;
  eodAPIStatus: IEodApiStatus;
  eodAPIStatus2: IEodApiStatus;
  defaultYears: any;
  selectedDefaultNoYear: any;
  settingsForm: UntypedFormGroup;
  formMessage: string;
  maxClients: number;
  checkBoxEnabled = false;
  public currentTheme: string;

  @ViewChild('radialGauge', { static: true })
  public radialGauge: IgxRadialGaugeComponent;

  constructor(public userStore: UserStore,
    private toastrService: ToastrService,
    private persistanceService: PersistanceService,
    private nsqStatusService: NSQStatusService) {
    this.maxClients = environment.BACKEND_PY_TOPIC_MAX_CLIENTS;

  }

  ngOnInit() {
    // this.defaultNoYears = new FormControl(this.selectedDefaultNoYear.value, [Validators.required, Validators.pattern('[0-9]*')]);
    // this.settingsForm = new FormGroup({
    //   defaultNoYear: this.defaultNoYears
    // });
    this.nsqStatusService.getNSQStatus(environment.BACKEND_PY_TOPIC_NAME).subscribe(x => {
      this.nsqStatus = x;
    });
    this.nsqStatusService.getEodApiStatus().subscribe(eodApiStatusResponse => {
      this.eodAPIStatus = new EodApiStatus(
        eodApiStatusResponse.code,
        eodApiStatusResponse.datetime,
        JSON.parse(eodApiStatusResponse.data)
      );
    });
    this.nsqStatusService.getEodApiStatus2().subscribe(eodApiStatusResponse => {
      this.eodAPIStatus2 = new EodApiStatus(
        eodApiStatusResponse.code,
        eodApiStatusResponse.datetime,
        JSON.parse(eodApiStatusResponse.data)
      );
    });
    this.checkBoxEnabled = this.persistanceService.get('notification') ? this.persistanceService.get('notification') : false;
    this.currentTheme = this.persistanceService.get('theme') ? this.persistanceService.get('theme') : 'dark';
    this.radialGauge.scaleBrush = '#e8e8e8';
  }

  reset() {
    // this.defaultYears.selected = this.appSettings.graphs.defaultNoYear;
  }

  save() {
    // this.appSettings.graphs.defaultNoYear = this.defaultYears.selected;
    // this.settingsService.setAppSettings(this.appSettings);
    this.reset();
  }

  deleteCache() {
    this.persistanceService.clearHTTPCache();
    if (this.persistanceService.get('notification') != null && this.persistanceService.get('notification')) {
      this.toastrService.info('HTTP Cache deleted', null, {
        positionClass: 'toast-bottom-center'
      });
    }
  }

  toggleTheme() {
    if (this.persistanceService.get('theme') === 'light' || !this.persistanceService.get('theme')) {
      this.persistanceService.set('theme', 'dark');
    } else {
      this.persistanceService.set('theme', 'light');
    }
    this.currentTheme = this.persistanceService.get('theme');
  }

  toggleCheckBox() {
    this.checkBoxEnabled = !this.checkBoxEnabled;
    this.persistanceService.set('notification', this.checkBoxEnabled);
  }

  saveSettings() {
    // if (this.settingsForm['controls']['defaultNoYear']['value']['id'] !== this.selectedDefaultNoYear.id) {
    //   this.appSettings.graphs.defaultNoYear = this.settingsForm['controls']['defaultNoYear']['value'];
    //   this.settingsService.setAppSettings(this.appSettings);
    //   this.formMessage = `Default years set to: ${this.appSettings.graphs.defaultNoYear.value}`;
    //   this.selectedDefaultNoYear = this.appSettings.graphs.defaultNoYear;
    // }
  }

  validateDefaultNoYears() {
    // return this.defaultNoYears.valid || this.defaultNoYears.untouched;
  }

}


