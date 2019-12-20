import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { FileService } from '../../shared/services/file.service';
import { UserService } from '../../core/services/user.service';
import { concatMap, mergeMap, map } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';

@Injectable()
export class FileShareDetailsResolver implements Resolve<any> {
    constructor(private _fileService: FileService, private _userService: UserService) {}
  
    resolve(activatedRoute: ActivatedRouteSnapshot) {
      return this._fileService.getFileInfo(activatedRoute.params.id)
        .pipe(
            mergeMap(
                (response: any) => {
                    if (response) {   
                        return forkJoin(of(response), this._userService.getById(response.userId))
                    } else {
                        return forkJoin(of(null), of(null))
                    }
                }
            ),
            map(
                (data: any[]) => {
                    return { file: data[0], user: data[1], fileLinkId: activatedRoute.params.id }
                }
            )
        );
    }
  }
  