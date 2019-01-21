import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PageFile } from '../_models/file';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FileService {
  constructor(private http: HttpClient) { }

  getAllFromFolder(currentFolder: string[]) {
    return this.http.get<Array<PageFile>>('api/server/files/' + currentFolder.join(">") + "/-");
  }

  getAllFromSearch(currentFolder: string[], searchForm: FormGroup) {
    this.http.get<Array<PageFile>>('api/server/files/' + currentFolder.join(">") + "/" + searchForm.controls.search.value);
  }

  getByName(currentFolder: string[], fileName: string) {
    return this.http.get<File>('api/server/file/' + currentFolder.join(">") + "/" + fileName, { responseType: 'blob' as 'json' });
  }

  add(currentFolder: string[], formData: FormData) {
    return this.http.post('api/server/upload/' + currentFolder.join(">"), formData, { reportProgress: true, })
  }

  // update(user: PageFile) {
  //   return this.http.put(`/users/` + user.id, user);
  // }

  // delete(id: number) {
  //   return this.http.delete(`/users/` + id);
  // }
}
