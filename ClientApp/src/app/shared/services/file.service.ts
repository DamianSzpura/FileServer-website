import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { WebFile } from '../models/file';
import { FormGroup } from '@angular/forms';
import { RestApiService } from '../../core/services/rest-api.service';

@Injectable()
export class FileService {
  constructor(private _http: HttpClient, private _restApiService: RestApiService) { }

  getAllFromFolder(currentFolder: string[]) {
    return this._http.get<Array<WebFile>>(this._restApiService.getApiUrl('/api/server/files/' + currentFolder.join(">") + "/-"));
  }

  getAllFromSearch(currentFolder: string[], searchForm: FormGroup) {
    return this._http.get<Array<WebFile>>(this._restApiService.getApiUrl('/api/server/files/' + currentFolder.join(">") + "/" + searchForm.controls.search.value));
  }

  getFileInfo(linkId: string): any {
    return this._http.get<WebFile>(this._restApiService.getApiUrl('/api/server/share/file/' + linkId));
  }

  getByName(currentFolder: string[], fileName: string) {
    return this._http.get<File>(this._restApiService.getApiUrl('/api/server/file/' + currentFolder.join(">") + "/" + fileName + "/download"), { responseType: 'blob' as 'json' });
  }

  getDataLinkId(linkId: string): any {
    return this._http.get<File>(this._restApiService.getApiUrl('/api/server/share/file/download/' + linkId), { responseType: 'blob' as 'json' });
  }

  addToServer(currentFolder: string[], formData: FormData) {
    return this._http.request(new HttpRequest('POST', this._restApiService.getApiUrl('/api/server/upload/' + currentFolder.join(">")), formData));
  }

  addToDb(currentFolder: string[], fileInfo: WebFile[]) {
    return this._http.request(new HttpRequest('POST', this._restApiService.getApiUrl('/api/server/upload/' + currentFolder.join(">") + "/db"), fileInfo));
  }

  addFolder(currentFolder: string[], fileInfo: WebFile) {
    return this._http.request(new HttpRequest('POST', this._restApiService.getApiUrl('/api/server/upload/' + currentFolder.join(">") + "/addfolder"), fileInfo));
  }

  update(currentFolder: string[], fileInfo: WebFile) {
    return this._http.request(new HttpRequest('PUT', this._restApiService.getApiUrl('/api/server/change/' + currentFolder.join(">")), fileInfo));
  }

  delete(currentFolder: string[], fileInfo: WebFile) {
    return this._http.request(new HttpRequest('PATCH', this._restApiService.getApiUrl('/api/server/delete/' + currentFolder.join(">")), fileInfo));
  }

  sendEmailWithLink(data: { sendToEmail: string, link: string}) {
    return this._http.request(new HttpRequest('POST', this._restApiService.getApiUrl('/api/server/send-email'), data));
  }
}
