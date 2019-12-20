import { Component, OnInit } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { AuthenticationService } from "../../services/authentication.service";
import { StyleService } from "../../services/style.service";
import { Router } from "@angular/router";
import { User } from "../../../shared/models/user";


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
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
    private _authenticationService: AuthenticationService,
    private _styleService: StyleService,
    private _router: Router) {
    _authenticationService.currentUser.subscribe(newCurrentUser => this.onLogin(newCurrentUser));
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
    this._styleService.changeTheme("reset");
    this._authenticationService.logout();
    this._router.navigate(['/login']);
  }
}
