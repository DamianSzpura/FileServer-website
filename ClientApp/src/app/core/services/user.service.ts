import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../../shared/models/user';
import { RestApiService } from './rest-api.service';

@Injectable()
export class UserService {
  constructor(private _http: HttpClient, private _restApiService: RestApiService ) { }

  getAll() {
    return this._http.get<User[]>(this._restApiService.getApiUrl(`/users`));
  }

  getById(id: number) {
    return this._http.get<User>(this._restApiService.getApiUrl(`/users/` + id));
  }

  register(user: User) {
    return this._http.post(this._restApiService.getApiUrl(`/users/register`), user);
  }

  update(user: User) {
    return this._http.put(this._restApiService.getApiUrl(`/users/` + user.id), user);
  }

  delete(id: number) {
    return this._http.delete(this._restApiService.getApiUrl(`/users/` + id));
  }
}
