import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetsService } from './assets.service';
import { UserAsset, IUserAsset } from './userasset.model';

import { CrudButtonsComponent } from '../crud/crud-buttons';
import { IgxDialogComponent } from '@infragistics/igniteui-angular';


@Component({
    selector: 'user-asset-list-component',
    styleUrls: ['./user.assets.list.component.scss'],
    templateUrl: './user.assets.list.component.html',
    standalone: false
})


export class UserAssetListComponent implements OnInit, AfterViewInit {
  userassets: IUserAsset[];
  public assetToDelete: any;
  public assetToUpdate: any;
  public modalHeader: string;
  public modalSubmitButtonText: string;
  public enableSubmitButton: boolean;
  private updatedAsset: UserAsset;
  public defaultColDef;
  public showDelete: boolean;
  public showUpdate: boolean;
  public showDetails: boolean;

  @ViewChild(IgxDialogComponent, { static: false }) public dialog: IgxDialogComponent;
  constructor(private route: ActivatedRoute,
    private assetsService: AssetsService,
    private router: Router) {

    this.showDelete = true;
    this.showUpdate = true;
    this.showDetails = true;

    this.defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    this.updatedAsset = new UserAsset(null, null, null);

  }

  ngOnInit() {
    this.userassets = this.route.snapshot.data['userassets'];
  }

  ngAfterViewInit() {
    // this.basicModal.show();
  }

  onGridReady(params) {
    this.userassets = this.route.snapshot.data['userassets'];
  }

  public DeleteRow(cell) {
    this.enableSubmitButton = true;
    this.assetToUpdate = null;
    this.assetToDelete = cell;
    this.OpenModal('Delete Asset', 'Delete');
  }

  public UpdateRow(cell) {
    this.assetToUpdate = cell;
    this.assetToDelete = null;
    this.OpenModal('Update Asset', 'Update');
  }

  public RowDetails(cell) {
    this.router.navigate(['/asset/details'], { queryParams: { 'asset': cell.USER_ASSET_NAME.S } });
  }

  public OpenModal(modalHeader, modalSubmitButtonText) {
    this.modalHeader = modalHeader;
    this.modalSubmitButtonText = modalSubmitButtonText;
    this.dialog.open();
  }

  public CloseModal() {
    this.assetToDelete = this.assetToUpdate = null;
    this.dialog.close();
  }

  assetTypeChanged($event) {
    if (this.assetToUpdate.USER_ASSET_TYPE.S !== $event.name) {
      this.enableSubmitButton = true;
      this.updatedAsset.USER_ASSET_TYPE = $event.name;
    } else {
      this.enableSubmitButton = false;
    }
  }

  public DeleteOrUpdateAsset() {
    if (this.assetToDelete) {
      this.assetsService.deleteAssetsByUser(this.assetToDelete.USER_ASSET_NAME.S)
        .subscribe(() => {
          this.userassets = this.route.snapshot.data['userassets'];
          this.CloseModal();
          this.assetsService.getAssetsByUser().subscribe((data1) => {
            this.userassets = data1;
          });
        });
    } else if (this.assetToUpdate) {
      const asset = new UserAsset(this.assetToUpdate.USERNAME.S,
        this.assetToUpdate.USER_ASSET_NAME.S,
        this.updatedAsset.USER_ASSET_TYPE);
      this.assetsService.updateAssetsByUser(asset)
        .subscribe(() => {
          this.userassets = this.route.snapshot.data['userassets'];
          this.CloseModal();
          this.assetsService.getAssetsByUser().subscribe((data1) => {
            this.userassets = data1;
          });
        });
    }

  }
}
