import { Component, OnInit } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileUploaderOptions } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../common/settings.service';
import { NbTokenService } from '@nebular/auth';
import { Router } from '@angular/router';
import { UserStore } from '../@core/stores/user.store';
import { PersistanceService } from '../common/persistance.service';

@Component({
    selector: 'upload-component',
    templateUrl: './upload.component.html',
    standalone: false
})
export class UploadComponent implements OnInit {
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public message: string;

  constructor(private toastrService: ToastrService,
    private settingsService: SettingsService,
    private tokenService: NbTokenService,
    public userStore: UserStore,
    private persistanceService: PersistanceService,
    protected router: Router) {
  }

  receiveMessage($event) {
    this.message = $event;
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  ngOnInit(): void {
    const authHeader: Array<{
      name: string;
      value: string;
    }> = [];
    this.tokenService.get().subscribe(token => {
      if (token.isValid()) {
        authHeader.push({name: 'Authorization' , value: 'Bearer ' + token.getPayload().access_token});
      } else {
        this.router.navigateByUrl('/auth/login');
      }

    });
    this.uploader = new FileUploader({ url: this.settingsService.getAppConstants().portfolioServiceBaseUri + '/assets'});
    const uploadOptions = <FileUploaderOptions>{headers : authHeader};
    this.uploader.setOptions(uploadOptions);
    this.uploader.onBuildItemForm = (fileItem, form) => {
      // tslint:disable-next-line:forin
      for (const key in fileItem.formData) {
        form.append(key, fileItem.formData[key]);
      }
      return { fileItem, form };
    };
    this.uploader.onCompleteAll = () => this.completeAll();
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

  completeAll() {
    // console.log(this.uploader.response);
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    if (this.persistanceService.get('notification')!= null && this.persistanceService.get('notification'))
    this.toastrService.info('File uploaded: ' + response,null, {
      positionClass: 'toast-bottom-center' });
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    this.toastrService.error('File uploaded error: ' + response,null, {
      positionClass: 'toast-bottom-center' });
  }
}
