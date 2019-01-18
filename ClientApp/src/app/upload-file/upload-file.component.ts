import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { isNullOrUndefined } from 'util';
import { ResponseContentType } from '@angular/http';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  public progress: number;
  public message: string;
  public files: Array<file>;

  public selectedFile: file;

  private currentFolder: string[] = []

  public uploader: FileUploader;
  searchForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.setMainFolder();
    this.uploader = new FileUploader({ url: 'api/server/files' });
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }

  ngOnInit() {
    this.http.get<Array<file>>('api/server/files/' + this.currentFolder.join(">") + "/-").subscribe(result => {
      this.files = result;
    }, error => console.error(error));
  }

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  private setMainFolder() {
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser)
      this.currentFolder.push(currentUser.username);
    else
      this.router.navigate(["/login"]);
  }

  openFolder(folderName) {
    this.currentFolder.push(folderName)

    if (this.currentFolder.length > 1) { }

    this.http.get<Array<file>>('api/server/files/' + this.currentFolder.join(">") + "/-").subscribe(result => {
      this.files = result;
    }, error => console.error(error));
    this.selectedFile = null;
  }

  onSearch() {
    if (this.searchForm.controls.search.value != "") {
      this.http.get<Array<file>>('api/server/files/' + this.currentFolder.join(">") + "/" + this.searchForm.controls.search.value).subscribe(result => {
        this.files = result;
      }, error => console.error(error));
      this.selectedFile = null;
    }
    else {
      this.http.get<Array<file>>('api/server/files/' + this.currentFolder.join(">") + "/-").subscribe(result => {
        this.files = result;
      }, error => console.error(error));
      this.selectedFile = null;
    }
  }

  closeFolder() {
    this.currentFolder.pop()

    this.http.get<Array<file>>('api/server/files/' + this.currentFolder.join(">") + "/-").subscribe(result => {
      this.files = result;
    }, error => console.error(error));
    this.selectedFile = null;
  }

  download(fileName) {
    this.http.get<File>('api/server/file/' + this.currentFolder.join(">") + "/" + fileName, { responseType: 'blob' as 'json' }).subscribe(result => {
      if (!result.type.endsWith("json")) {
        var blobFile = new Blob([result], { type: "application/octet-stream" });

        var urlToFile = window.URL.createObjectURL(blobFile);
        var documentToDownload = document.createElement('a');

        documentToDownload.href = urlToFile;
        documentToDownload.download = fileName;
        documentToDownload.click();

        window.URL.revokeObjectURL(urlToFile);
        documentToDownload.remove();
      }
    }, error => console.error(error));
  }

  upload(files) {
    var bar = <HTMLElement>document.getElementById('prog-bar');
    if (files.lenght === 0 || files.lenght == isNullOrUndefined)
      return;

    const formData = new FormData();

    for (let file of files)
      formData.append(file.name, file);

    const uploadReq = new HttpRequest('POST', 'api/server/upload/' + this.currentFolder.join(">"), formData, { reportProgress: true, });

    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
        this.message = 'Uploading... ' + this.progress + '%';
        bar.style.width = this.progress + '%';
      }
      else if (event.type === HttpEventType.Response) {
        this.message = event.body.toString();
        this.ngOnInit();
      }
    });
  }

  select(file) {
    var listOfAllFiles = document.getElementById(file.name).parentElement.parentElement.parentElement.children;
    var fileBorder;

    var fileToSelect = document.getElementById(file.name);

    for (var i = 0; i < listOfAllFiles.length; i++) {
      fileBorder = listOfAllFiles[i].lastElementChild.lastElementChild;

      if (fileBorder.classList.contains('card--selected'))
        fileBorder.classList.remove('card--selected');
    }

    this.selectedFile = null;

    fileToSelect.classList.add('card--selected');
    this.selectedFile = file;
  }
}

interface file {
  name: string;
  extension: string;
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
