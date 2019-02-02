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
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(-2rem)', opacity: 0 }),
          animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('100ms ease-out', style({ transform: 'translateX(-2rem)', opacity: 0 }))
        ])
      ]
    )
  ],
})
export class UploadFileComponent implements OnInit {
  uploadMessage: string;
  uploadProgress: number;
  currentFolder: string[] = []
  uploader: FileUploader;
  searchForm: FormGroup;
  files: Array<WebFile>;
  selectedFile: WebFile;

  @ViewChild('fileMenu') public addFolderMenu: ContextMenuComponent;

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

    this.searchForm.controls['search'].valueChanges.subscribe(value => {
      this.onSearch();
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
    this.selectedFile = null;
  }

  onCloseFolder() {
    this.currentFolder.pop()
    this.getFiles();
    this.selectedFile = null;
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
        });
      this.selectedFile = null;
    }
    else {
      this.getFiles();
    }
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

  onChangeFolder(toDirectory: WebFile) {
    var fileToChange = this.selectedFile;
    fileToChange.path = toDirectory.path + "\\" + toDirectory.name;
    this.fileService.update(this.currentFolder, fileToChange).subscribe(
      event => {
        this.getFiles();
        this.alertService.success("File moved.");
        this.selectedFile = null;
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
    this.files = null
    this.fileService.getAllFromFolder(this.currentFolder)
      .subscribe(result => {
        this.files = result;
        Array.from(this.files).forEach(file => {
          file.size *= 0.0009765625;
        });
      }, error => {
        this.alertService.error(error);
      });
  }

  getDirectories() {
    if (this.selectedFile)
      return this.files.filter(x => !x.extension && x.name != this.selectedFile.name);
    else
      return null;
  }
}
