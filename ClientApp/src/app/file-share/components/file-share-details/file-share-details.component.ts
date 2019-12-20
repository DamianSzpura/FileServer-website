import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebFile } from '../../../shared/models/file';
import { User } from '../../../shared/models/user';
import { FileService } from '../../../shared/services/file.service';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-file-share-details',
  templateUrl: './file-share-details.component.html',
  styleUrls: ['./file-share-details.component.less']
})
export class FileShareDetailsComponent implements OnInit {
  fileLinkId: string;
  sharedFile: WebFile;
  sharedFileOwner: User;
   public fileDownloaded: boolean;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _fileService: FileService,
    private _alertService: AlertService,
    private _userService: UserService) { }

  ngOnInit() {
    this.fileLinkId = this.getFileLinkId();
    this.sharedFile = this.getFileData();
    this.sharedFileOwner = this.getUserData();
  }

  onDownload() {
    this.fileDownloaded = true;
    this._fileService.getDataLinkId(this.fileLinkId)
      .subscribe(result => {
        if (!result.type.endsWith("json")) {
          var blobFile = new Blob([result], { type: "application/octet-stream" });

          var urlToFile = window.URL.createObjectURL(blobFile);
          var documentToDownload = document.createElement('a');

          documentToDownload.href = urlToFile;
          documentToDownload.download = this.sharedFile.name;
          documentToDownload.click();

          window.URL.revokeObjectURL(urlToFile);
          documentToDownload.remove();
        }
      }, error => {
        this._alertService.error(error);
      });
    setTimeout(() => {
      this.fileDownloaded = false
    }, 5000);
  }

  private getFileLinkId() {
    return this._activatedRoute.snapshot.data.viewData.fileLinkId;
  }
  
  private getFileData() {
    return this._activatedRoute.snapshot.data.viewData.file;
  }

  private getUserData() {
    return this._activatedRoute.snapshot.data.viewData.user;
  }
}
