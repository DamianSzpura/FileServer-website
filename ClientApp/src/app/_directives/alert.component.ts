import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../_services/alert.service';
import { trigger, transition, style, animate } from '@angular/animations';

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
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
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
