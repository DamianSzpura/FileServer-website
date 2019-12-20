import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from '../../shared/models/user';

@Injectable()
export class StyleService {
  private themeWrapper = document.querySelector('body');

  constructor() {
  }

  changeTheme(style: string) {
    this.editLess(style);
  }

  private editLess(style: string) {
    switch (style) {
      case "violet": {
        this.themeWrapper.style.setProperty('--violet', '#ce93d8');
        break;
      }
      case "gray": {
        this.themeWrapper.style.setProperty('--violet', '#9e9e9e');
        break;
      }
      case "green": {
        this.themeWrapper.style.setProperty('--violet', '#80cbc4');
        break;
      }
      case "red": {
        this.themeWrapper.style.setProperty('--violet', '#ef9a9a');
        break;
      }
      case "blue": {
        this.themeWrapper.style.setProperty('--violet', '#81d4fa');
      }
      default: {
        this.themeWrapper.style.setProperty('--violet', '#ce93d8');
        break;
      }
    }
  }
}
