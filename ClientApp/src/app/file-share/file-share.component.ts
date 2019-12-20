import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-file-share',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileShareComponent {
  constructor() {
   }
}
