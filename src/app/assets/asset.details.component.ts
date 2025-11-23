import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { AssetTearsheetComponent } from '../tearsheet/asset.tearsheet.component';
import { RouterExtService } from '../common/router.ext.service';


@Component({
    templateUrl: './asset.details.component.html',
    standalone: false
})
export class AssetDetailsComponent implements OnInit, AfterViewInit {
    public assetName: string;
    public previousUrl: string;

    @ViewChild(AssetTearsheetComponent, { static: false }) child: AssetTearsheetComponent;
    // @ViewChild('assettearsheet') assetTearSheet;
    // @ViewChild(AssetTearsheetComponent, {static: false}) assetTearSheetComponent: AssetTearsheetComponent;
    @ViewChildren(AssetTearsheetComponent) childrenComponent: QueryList<AssetTearsheetComponent>;

    constructor(
        private route: ActivatedRoute,
        private analyticsService: AnalyticsService,
        private router: Router,
        private routerExtService: RouterExtService) {
    }

    public ngOnInit() {
        this.route
            .queryParams
            .subscribe(_params => {
                // Defaults to 0 if no query param provided.
                this.assetName = _params['asset'] || '';
                // this.child.RequestData(this.asset, null);
            });
    }

    public ngAfterViewInit(): void {
        this.childrenComponent.changes.subscribe((comps: QueryList<AssetTearsheetComponent>) => {
            // Now you can access to the child component
            comps.first.RequestData(this.assetName, null);
        });
        // this.assetTearSheet.RequestData(this.assetName, null);
    }

    public goToPrevious(): void {
        const previous = this.routerExtService.getPreviousUrl();
        if (previous) {
            this.routerExtService.router.navigateByUrl(previous);
        }
    }

    // public invokeParentMethod() {
    //     this.params.context.componentParent.UpdateRow({
    //         Row: this.params.node.rowIndex,
    //         Col: this.params.colDef.headerName, Data: this.params
    //     });
    // }

    // refresh(): boolean {
    //     return false;
    // }

    // onGridReady(params) {
    //     this.gridApi = params.api;
    //     this.gridColumnApi = params.columnApi;
    //     this.aggridService.resizeGridColumns(params.columnApi);
    // }
}
