import { Component, Inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent {
  public progress: number;
  public message: string;
  public files: Array<string>;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Array<string>>(baseUrl + 'api/Upload/files').subscribe(result => {
      this.files = result;
    }, error => console.error(error));
  }

  delete(file) {
    const formData = new FormData();

    formData.append(file, file);

    const deleteReq = new HttpRequest('DELETE', 'api/upload', formData, { reportProgress: true, });

    this.http.request(deleteReq).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        window.location.reload();
        this.message = event.body.toString();
      }
    });
  }

  upload(files) {
    var bar = <HTMLElement>document.getElementById('prog-bar');
    if (files.lenght === 0)
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
      else if (event.type === HttpEventType.Response)
        this.message = event.body.toString();
    });
  }
}
