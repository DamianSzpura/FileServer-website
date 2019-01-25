import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.less']
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
