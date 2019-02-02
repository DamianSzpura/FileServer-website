import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { WebFile } from '../_models/file';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FileService {
  constructor(private http: HttpClient) { }

  getAllFromFolder(currentFolder: string[]) {
    return this.http.get<Array<WebFile>>('api/server/files/' + currentFolder.join(">") + "/-");
  }

  getAllFromSearch(currentFolder: string[], searchForm: FormGroup) {
    return this.http.get<Array<WebFile>>('api/server/files/' + currentFolder.join(">") + "/" + searchForm.controls.search.value);
  }

  getFileInfo(linkId: string): any {
    return this.http.get<WebFile>('api/server/share/file/' + linkId);
  }

  getByName(currentFolder: string[], fileName: string) {
    return this.http.get<File>('api/server/file/' + currentFolder.join(">") + "/" + fileName + "/download", { responseType: 'blob' as 'json' });
  }

  getDataLinkId(linkId: string): any {
    return this.http.get<File>('api/server/share/file/download/' + linkId, { responseType: 'blob' as 'json' });
  }

  addToServer(currentFolder: string[], formData: FormData) {
    return this.http.request(new HttpRequest('POST', 'api/server/upload/' + currentFolder.join(">"), formData, { reportProgress: true, }));
  }

  addToDb(currentFolder: string[], fileInfo: WebFile[]) {
    return this.http.request(new HttpRequest('POST', 'api/server/upload/' + currentFolder.join(">") + "/db", fileInfo, { reportProgress: true, }));
  }

  addFolder(currentFolder: string[], fileInfo: WebFile) {
    return this.http.request(new HttpRequest('POST', 'api/server/upload/' + currentFolder.join(">") + "/addfolder", fileInfo, { reportProgress: true, }));
  }

  update(currentFolder: string[], fileInfo: WebFile) {
    return this.http.request(new HttpRequest('PUT', 'api/server/change/' + currentFolder.join(">"), fileInfo));
  }

  delete(currentFolder: string[], fileInfo: WebFile) {
    return this.http.request(new HttpRequest('PATCH', 'api/server/delete/' + currentFolder.join(">"), fileInfo));
  }
}
