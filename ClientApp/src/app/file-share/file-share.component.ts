import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebFile } from '../_models/file';
import { FileService } from '../_services/file.service';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-file-share',
  templateUrl: './file-share.component.html',
  styleUrls: ['./file-share.component.less']
})
export class FileShareComponent implements OnInit {
  fileLinkId: string;
  sharedFile: WebFile;
  sharedFileOwner: User;
   public fileDownloaded: boolean;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private alertService: AlertService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fileLinkId = params['id']
    });

    this.getFileInfo();
  }

  getFileInfo() {
    this.fileService.getFileInfo(this.fileLinkId)
      .subscribe(
        data => {
          this.sharedFile = data;
          this.getUserInfo();
        }, error => {
          this.alertService.error(error);
        });
  }

  getUserInfo() {
    this.userService.getById(this.sharedFile.userId)
      .subscribe(
        data => {
          this.sharedFileOwner = data;
        }, error => {
          this.alertService.error(error);
        });
  }

  onDownload() {
    this.fileDownloaded = true;
    this.fileService.getDataLinkId(this.fileLinkId)
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
        this.alertService.error(error);
      });
    setTimeout(() => {
      this.fileDownloaded = false
    }, 5000);
  }
}
