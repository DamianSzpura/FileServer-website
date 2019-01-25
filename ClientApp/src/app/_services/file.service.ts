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

  getByName(currentFolder: string[], fileName: string) {
    return this.http.get<File>('api/server/file/' + currentFolder.join(">") + "/" + fileName + "/download", { responseType: 'blob' as 'json' });
  }

  getFileInfo(currentFolder: string[], fileName: string): any {
    return this.http.get<WebFile>('api/server/file/' + currentFolder.join(">") + "/" + fileName);
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

  // update(user: PageFile) {
  //   return this.http.put(`/users/` + user.id, user);
  // }

  // delete(id: number) {
  //   return this.http.delete(`/users/` + id);
  // }
}
