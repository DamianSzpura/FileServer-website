import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { FileUploader } from "ng2-file-upload";
import { FormGroup, FormBuilder } from "@angular/forms";
import { WebFile } from "../../../shared/models/file";
import { ContextMenuComponent } from "ngx-contextmenu";
import { User } from "../../../shared/models/user";
import { Router } from "@angular/router";
import { FileService } from "../../../shared/services/file.service";
import { AlertService } from "../../../services/alert.service";
import { HttpEventType } from "@angular/common/http";
import { share } from "rxjs/operators";


@Component({
  selector: 'app-file-upload-details',
  templateUrl: './file-upload-details.component.html',
  styleUrls: ['./file-upload-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class FileUploadDetailsComponent implements OnInit {
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
    private _router: Router,
    private _fileService: FileService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchForm = this._formBuilder.group({
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
      this._router.navigate(["/login"]);
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

    this._fileService.addFolder(this.currentFolder, fileInfo)
      .subscribe(event => {
        if (event.type === HttpEventType.Response) {
          this._alertService.success('Added new folder to ' + this.currentFolder.join("/"));
          this.getFiles();
        }
      }, error => {
        this._alertService.error(error);
      });
  }

  onSearch() {
    if (this.searchForm.controls.search.value != "") {
      this._fileService.getAllFromSearch(this.currentFolder, this.searchForm)
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

    this._fileService.addToServer(this.currentFolder, formData)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
            uploadBar.style.width = this.uploadProgress + '%';
          }
          else if (event.type === HttpEventType.Response) {
            this._fileService.addToDb(this.currentFolder, fileInfoArray)
              .subscribe(
                data => {
                  this._alertService.success('Files added to ' + this.currentFolder.join("/"));
                  this.getFiles();
                },
                error => {
                  
                  this._alertService.error(error);
                });
          }
        }, error => {
          
          this._alertService.error(error);
        });
  }

  onChangeFolder(toDirectory: WebFile) {
    var fileToChange = this.selectedFile;
    fileToChange.path = toDirectory.path + "\\" + toDirectory.name;
    this._fileService.update(this.currentFolder, fileToChange).subscribe(
      event => {
        this.getFiles();
        this._alertService.success("File moved.");
        this.selectedFile = null;
      }, error => {
        this._alertService.error(error);
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
    this._fileService.getAllFromFolder(this.currentFolder)
      .pipe(
        share()
      )
      .subscribe(result => {
        this.files = result;
        Array.from(this.files).forEach(file => {
          file.size *= 0.0009765625;
        });
        this._cd.detectChanges();
      }, error => {
        this._alertService.error(error);
      });
  }

  get getDirectories() {
    if (this.selectedFile && this.files) {
      return this.files.filter(x => !x.extension && x.name !== this.selectedFile.name);
    }
    else {
      return null;
    }
  }
}
