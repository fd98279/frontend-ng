import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';
import {
    IgxGridComponent,
    SortingDirection,
    DefaultSortingStrategy,
    IgxGridCell
} from '@infragistics/igniteui-angular';
import { AnalysisRequest, Fundamental } from '../../../mutual-funds/mutual-funds';
import { UserStore } from '../../../@core/stores/user.store';

@Component({
    selector: 'grid-mutual-fund',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
    standalone: false
})
export class MutualFundGridComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    @Input() fundamentals: Fundamental;
    @Output() tabIndexChanged = new EventEmitter<number>();
    @Output() analysisRequested = new EventEmitter<AnalysisRequest>();

    public selectedProperty: string;
    public selectedTabIndex = 0;
    public propertyOptions: { value: string; label: string }[] = [];
    public analysisQuery: string = '';
    public analysisHistory: string[] = [];


    constructor(private zone: NgZone, public userStore: UserStore) {
    // isGuest now comes from userStore.isGuest()
    }

    public submitAnalysis() {
        if (!this.selectedProperty || !this.analysisQuery) return;

        const request: AnalysisRequest = {
            json_keys: [this.selectedProperty],
            llm_query: this.analysisQuery,
        };

        this.analysisRequested.emit(request);
        this.analysisHistory.push(this.analysisQuery);
        this.analysisQuery = '';
    }

    private initPropertyOptions() {
        if (!this.fundamentals) return;

        const options: { value: string; label: string }[] = [];
        const processedPaths = new Set<string>();

        const addOption = (path: string, value: any) => {
            if (processedPaths.has(path)) return;
            processedPaths.add(path);

            const label = path.split('.').map(part =>
                part
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
            ).join(' - ');

            options.push({ value: path, label });

        };

        Object.keys(this.fundamentals).forEach(key => {
            if (key !== 'code' && key !== 'datetime' && key !== 'data' && key !== 'dataObject') {
                addOption(key, this.fundamentals[key]);
            }
        });

        this.propertyOptions = options.sort((a, b) => a.label.localeCompare(b.label));
    }


    public ngOnInit() {
        this.grid1.sortingExpressions = [
            {
                dir: SortingDirection.Desc, fieldName: 'date',
                ignoreCase: true, strategy: DefaultSortingStrategy.instance()
            }
        ];
        this.initPropertyOptions();
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }


    public cellSelection(evt) {
        // this.grid1.selectRows([cell.row.rowID], true);
    }

    public handleRowSelectionChange() {
        // this.fundamentalsSelected.emit(args.newSelection);
    }

    public ngAfterViewInit() {
        // const rowsData = this.grid1.dataRowList.toArray();
        // rowsData.forEach((row) => {
        //     const rowCells: IgxGridCell[] = row.cells.toArray();
        // });
    }

    public isArray(obj: any) {
        return Array.isArray(obj);
    }
}
