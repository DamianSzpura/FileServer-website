import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class AlertService {
  private _subject: BehaviorSubject<any> = new BehaviorSubject(null);

  public readonly messages: Observable<any> = this._subject.asObservable();

  constructor() {
  }

  success(message: any) {
    this._subject.next({ type: 'success', text: message });
  }

  error(message: any) {
    
    this._subject.next({ type: 'error', text: message });
  }
}
