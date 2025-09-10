import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    Input
} from '@angular/core';
import {
    IgxGridComponent,
    IgxNumberSummaryOperand,
    IgxStringFilteringOperand,
    IgxSummaryResult,
    IgxExpansionPanelComponent,
    IgxExcelExporterService,
    IgxExcelExporterOptions
} from '@infragistics/igniteui-angular';
import { IQuote } from '../../../quotes/quotes.model';

@Component({
    selector: 'grid-quotes',
    styleUrls: ['./grid.quotes.component.scss'],
    templateUrl: './grid.quotes.component.html'
})
export class GridQuotesComponent implements OnInit, OnDestroy {


    constructor(private zone: NgZone, private excelExportService: IgxExcelExporterService) {
        this.isCollapsed = true;
    }

    @ViewChild('grid1', { read: IgxGridComponent, static: true })
    public grid1: IgxGridComponent;
    private windowWidth: any;
    public isCollapsed: boolean;
    @Input() indexQuotes: IQuote[];
    @ViewChild(IgxExpansionPanelComponent, { read: IgxExpansionPanelComponent, static: true })
    public panel: IgxExpansionPanelComponent;

    public ngOnInit() {
    }

    public ngOnDestroy() {
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

    public filter(term, by) {
        if (by === 'country') {
            this.grid1.filter('Country', term, IgxStringFilteringOperand.instance().condition('contains'));
        } else if (by === 'name') {
            this.grid1.filter('Name', term, IgxStringFilteringOperand.instance().condition('contains'));
        }
        this.grid1.markForCheck();
    }

    public exportButtonHandler() {
        /*
        The following code demonstrates how to attach event handlers to exporter specific events
        and also how to customize the column export process.
        this.excelExportService.onColumnExport.subscribe((args: IColumnExportingEventArgs) => {
          if (args.header == "Age" && args.columnIndex == 1) {
            args.cancel = true;
          }
        });
        this.excelExportService.onRowExport.subscribe((args: IRowExportingEventArgs) => {
        });
        this.excelExportService.onExportEnded.subscribe((args: IExcelExportEndedEventArgs) => {
        });
        */
        this.excelExportService.export(this.grid1, new IgxExcelExporterOptions('ExportFileFromGrid'));
    }

    private backgroundClasses = (rowData: any, columnKey: string): boolean => {
        return rowData.PercentChange > 0;
    }

    private backgroundClasssesPsPercentage = (rowData: any, columnKey: string): boolean => {
        return rowData.PercentChange < 0;
    }

    // tslint:disable-next-line:member-ordering
    backgroundCell = {
        'showUp': this.backgroundClasses,
        'showDown': this.backgroundClasssesPsPercentage
    };

}

