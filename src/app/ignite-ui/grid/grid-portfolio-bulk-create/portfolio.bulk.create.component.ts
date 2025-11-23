import { Component, Output, EventEmitter } from '@angular/core';
import { IgxExcelExporterService} from '@infragistics/igniteui-angular';


import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'grid-portfolio-bulk-create',
    styleUrls: ['./portfolio.bulk.create.component.scss'],
    templateUrl: './portfolio.bulk.create.component.html',
    standalone: false
})
export class PortfolioBulkCreateGridComponent {
    public portfolioCreateForm: UntypedFormGroup;
    @Output() createBulkPortfolio: EventEmitter<any> = new EventEmitter();

    constructor(private excelExportService: IgxExcelExporterService, fb: UntypedFormBuilder) {
        this.portfolioCreateForm = fb.group({
            name:  ['', Validators.required],
            description:  ['', Validators.required],
            sravzids: ['', Validators.required]
        });
    }
    public onSubmit() {
        this.createBulkPortfolio.emit(this.portfolioCreateForm.value);
    }
}
