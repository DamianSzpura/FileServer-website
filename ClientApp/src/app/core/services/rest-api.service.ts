import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../../environments/environment";

@Injectable()
export class RestApiService {

  constructor(private _http: HttpClient) {}

  private baseURL() {
    return environment.api;
  }

  getApiUrl(url) {
    return `${this.baseURL()}${url}`;
  }
}
