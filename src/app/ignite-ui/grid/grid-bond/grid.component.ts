import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    Input} from '@angular/core';
import { Bond } from '../../../bond/bond';


@Component({
    selector: 'grid-bond',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class BondGridComponent implements OnInit, OnDestroy {


    private windowWidth: any;
    @Input() bond: Bond;

    constructor(private zone: NgZone) {
    }

    public ngOnInit() {

    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }




    public isArray(obj: any) {
        return Array.isArray(obj);
    }

    public isObject(obj: any) {
        return typeof(obj) == "object";
    }
}
