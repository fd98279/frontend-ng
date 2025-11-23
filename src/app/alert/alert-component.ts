import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IAlert } from './alert';
import { AlertService } from './alert.service';
import { UserStore } from '../@core/stores/user.store';

@Component({
    templateUrl: './alert-component.html',
    styleUrls: ['alert-component.scss'],
    standalone: false
})

export class AlertComponent implements OnInit {
    public alert: IAlert;
    public alerts: IAlert[];
    @ViewChild('toast') toast: { open: (arg0: string) => void; };

    constructor(
        private alertService: AlertService,
        private route: ActivatedRoute,
        protected router: Router,
        protected location: Location,
        public cdr: ChangeDetectorRef,
        public element: ElementRef,
        public userStore: UserStore
    ) {

    }

    ngOnInit() {
        this.alerts = this.route.snapshot.data['alerts'];
    }

    back() {
        this.location.back();
        return false;
    }

    onalertselected(alerts: any): void {
        if (this.userStore.getUser() == null || this.userStore.getUser()?.login == 'guest123') {
            this.toast.open(`${this.userStore.getUser()?.login} is not allowed to create alerts. Please log in with your user id or register to create a user ID`);
        } else {
            let crudAlerts = [];

            for (var alert of alerts) {
                let singleAlert = {} as IAlert;
                singleAlert.condition = alert.newValue.condition;
                singleAlert.type = alert.newValue.type;
                singleAlert.sid = "";
                singleAlert._id = alert.newValue._id;
                if (alert.type == 'add') {
                    singleAlert.crudtype = "Insert";
                }
                else if (alert.type == 'delete') {
                    singleAlert.crudtype = "Delete";
                }
                else if (alert.type == 'update') {
                    singleAlert.crudtype = "Update";
                }
                crudAlerts.push(singleAlert);
            }
            this.alertService.crudAlert(crudAlerts).subscribe(response => {
                let errorMessages = "";
                response.map((item: IAlert) => {
                    if (!item.crudstatus) {
                        errorMessages = errorMessages + " " + item.crudmessage + " ";
                    }
                });
                if (errorMessages != "") {
                    this.toast.open(`${errorMessages}`);
                }
            })
        }
        setTimeout(() => {
            // Refresh the grid
            this.alertService.getAlertsByUser().subscribe(updatedAlerts => {
                this.alerts
                this.alerts = updatedAlerts;
            })
        }, 1000);
    }
}
