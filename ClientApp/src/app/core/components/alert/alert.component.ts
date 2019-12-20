import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { AlertService } from '../../../services/alert.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.less'],
  animations: [
    trigger('alertAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate("300ms ease-out", style({opacity: 1 }))
      ]),
      transition(':leave', [
        style({  opacity: 1 }),
        animate("500ms ease-out", style({ opacity: 0 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private _alertService: AlertService, private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    
    console.log('a');
    this._alertService.messages.subscribe(message => {
      console.log('b');
      console.log(message);
      this.message = message;
      this._cd.detectChanges()
      if (this.message) {
        setTimeout(() => this.onHide(), 5000);
      }       
    });
  }

  onHide() {
    this.message = null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
