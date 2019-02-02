import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { StyleService } from '../_services/style.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(-2rem)', opacity: 0 }),
          animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('100ms ease-out', style({ transform: 'translateX(-2rem)', opacity: 0 }))
        ])
      ]
    )
  ],
})

export class NavMenuComponent implements OnInit {
  currentUser: any;

  constructor(
    private authenticationService: AuthenticationService,
    private styleService: StyleService,
    private router: Router) {
    authenticationService.currentUser.subscribe(newCurrentUser => this.onLogin(newCurrentUser));
  }

  ngOnInit() {
    this.onLogin(JSON.parse(localStorage.getItem('currentUser')));
  }

  public onLogin(newCurrentUser: User) {
    if (newCurrentUser)
      this.currentUser = newCurrentUser;
    else
      this.currentUser = null;
  }

  logout() {
    this.styleService.changeTheme("reset");
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
