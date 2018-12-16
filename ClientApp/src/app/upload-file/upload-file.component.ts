import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  public progress: number;
  public message: string;
  public files: Array<file>;
  public uploader: FileUploader;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.uploader = new FileUploader({ url: 'api/Upload/files' });
  }

  ngOnInit() {
    this.http.get<Array<file>>('api/Upload/files').subscribe(result => {
      this.files = result;
    }, error => console.error(error));
  }

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  /*
  showFooter(file) {
    var listOfAllFiles = document.getElementById(file).parentElement.parentElement.children;
    var footerOfFile;

    var fileToEdit = document.getElementById(file).lastElementChild;

    for (var i = 0; i < listOfAllFiles.length; i++) {
      footerOfFile = listOfAllFiles[i].lastElementChild.lastElementChild;

      if (!footerOfFile.classList.contains('card-footer--hidden'))
        footerOfFile.classList.add('card-footer--hidden');
    }

    fileToEdit.classList.remove('card-footer--hidden');
  }

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

  upload(files) {
    var bar = <HTMLElement>document.getElementById('prog-bar');
    if (files.lenght === 0 || files.lenght == isNullOrUndefined)
      return;

    const formData = new FormData();

    for (let file of files)
      formData.append(file.name, file);

    const uploadReq = new HttpRequest('POST', 'api/upload', formData, { reportProgress: true, });

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
}

interface file {
  name: string;
  extension: string;
}
