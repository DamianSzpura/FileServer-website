import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../shared/models/user';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { Role } from '../../../shared/models/role';
import { themes } from './home.config';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  themeForm: FormGroup;
  currentUser: User;
  users: User[] = [];

  themes = themes

  constructor(
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.themeForm = this._formBuilder.group({
      theme: [this.currentUser.style]
    });
  }

  onChangeTheme() {
    this.currentUser.style = this.themeForm.controls.theme.value
    this.updateUser();
  }

  updateUser() {
    this._userService.update(this.currentUser).subscribe(
      event => {
        this._alertService.success("User updated, re-login to see changes.");
      }, error => {
        this._alertService.error(error);
      });
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  deleteUser(id: number) {
    this._userService.delete(id).pipe(first())
      .subscribe(() => {
        this.loadAllUsers()
      });
  }

  public loadAllUsers() {
    this._userService.getAll().pipe(first())
      .subscribe(users => {
        this.users = users;
      });
  }
}
