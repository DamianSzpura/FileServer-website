import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { isNullOrUndefined } from 'util';
import { ResponseContentType } from '@angular/http';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { WebFile } from '../_models/file';
import { FileService } from '../_services/file.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  uploadMessage: string;
  uploadProgress: number;
  currentFolder: string[] = []
  uploader: FileUploader;
  searchForm: FormGroup;
  files: Array<WebFile>;
  selectedFile: WebFile;

  @ViewChild(ContextMenuComponent) public addFolderMenu: ContextMenuComponent;
  currentUser: User;

  constructor(
    private router: Router,
    private fileService: FileService,
    private formBuilder: FormBuilder,
    private alertService: AlertService) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });

    this.setUpComponent();
  }

  public hasFileOver: boolean = false;

  public fileOver(e: any): void {
    this.hasFileOver = e;
  }

  private setUpComponent() {
    this.uploader = new FileUploader({ url: 'api/server/files' });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.setMainFolder();
    this.getFiles();
  }

  private setMainFolder() {
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser)
      this.currentFolder.push(currentUser.username);
    else
      this.router.navigate(["/login"]);
  }

  onOpenFolder(folderName) {
    this.currentFolder.push(folderName)
    this.getFiles();
  }

  onCloseFolder() {
    this.currentFolder.pop()
    this.getFiles();
  }

  onAddFolder() {
    let fileInfo: WebFile = new WebFile;

    fileInfo.name = "NewFolder";
    fileInfo.path = this.currentFolder.join("/")
    fileInfo.size = 0;
    fileInfo.userId = this.currentUser.id;

    this.fileService.addFolder(this.currentFolder, fileInfo)
      .subscribe(event => {
        if (event.type === HttpEventType.Response) {
        this.alertService.success('Added new folder to ' + this.currentFolder.join("/"), true);
        this.getFiles();
      }
      }, error => {
        this.alertService.error(error);
      });
  }

  onSearch() {
    if (this.searchForm.controls.search.value != "") {
      this.fileService.getAllFromSearch(this.currentFolder, this.searchForm)
        .subscribe(result => {
        this.files = result;
        }, error => {
          this.alertService.error(error);
        });
      this.selectedFile = null;
    }
    else {
      this.getFiles();
    }
  }

  onDownload(file) {
    this.fileService.getByName(this.currentFolder, file)
      .subscribe(result => {
      if (!result.type.endsWith("json")) {
        var blobFile = new Blob([result], { type: "application/octet-stream" });

        var urlToFile = window.URL.createObjectURL(blobFile);
        var documentToDownload = document.createElement('a');

        documentToDownload.href = urlToFile;
        documentToDownload.download = file;
        documentToDownload.click();

        window.URL.revokeObjectURL(urlToFile);
        documentToDownload.remove();
      }
      }, error => {
        this.alertService.error(error);
      });
  }

  onUpload(files: FileList) {
    if (files.length === 0)
      return;

    let fileInfoArray: WebFile[] = [];

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append(file.name, file);
      let fileInfo: WebFile = new WebFile
      fileInfo.name = file.name;
      fileInfo.path = this.currentFolder.join("/")
      fileInfo.size = file.size;
      fileInfo.dateCreation = new Date(file.lastModified);
      fileInfo.userId = this.currentUser.id;
      fileInfoArray.push(fileInfo);
    });

    var uploadBar = <HTMLElement>document.getElementById('prog-bar');

    this.fileService.addToServer(this.currentFolder, formData)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
            uploadBar.style.width = this.uploadProgress + '%';
          }
          else if (event.type === HttpEventType.Response) {
            this.fileService.addToDb(this.currentFolder, fileInfoArray)
              .subscribe(
              data => {
                this.alertService.success('Files added to ' + this.currentFolder.join("/"), true);
                this.getFiles();
                },
              error => {
                this.alertService.error(error);
              });
          }
        }, error => {
          this.alertService.error(error);
        });
  }

  onSelect(file: WebFile) {
    this.selectedFile = null;

    var listOfAllFiles = document.getElementsByClassName('card--selected');
    for (var i = 0; i < listOfAllFiles.length; i++) {
      listOfAllFiles[i].classList.remove('card--selected');
    }

    var fileToSelect = document.getElementById(file.name);
    fileToSelect.classList.add('card--selected');

    this.selectedFile = file;
  }

  getFiles() {
    this.fileService.getAllFromFolder(this.currentFolder)
      .subscribe(result => {
        this.files = result;
        Array.from(this.files).forEach(file => {
          file.size *= 0.0009765625;
        });
      }, error => {
        this.alertService.error(error);
      });
    this.selectedFile = null;
  }
}

/*
  delete(file) {
    const formData = new FormData();

    formData.append(file, file);

    const deleteReq = new HttpRequest('DELETE', 'api/upload', formData, { reportProgress: true, });

    this.http.request(deleteReq).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        this.message = event.body.toString();
      }
    });
  } */
