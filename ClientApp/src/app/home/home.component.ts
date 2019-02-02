import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { Role } from '../_models/role';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '../_services/alert.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  themeForm: FormGroup;
  currentUser: User;
  users: User[] = [];

  themes = [{ 'id': 1, 'name': 'violet' }, { 'id': 2, 'name': 'green' }, { 'id': 3, 'name': 'red' }, { 'id': 4, 'name': 'blue' }, { 'id': 5, 'name': 'gray' }];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.themeForm = this.formBuilder.group({
      theme: [this.currentUser.style]
    });
  }

  onChangeTheme() {
    this.currentUser.style = this.themeForm.controls.theme.value
    this.updateUser();
  }

  updateUser() {
    this.userService.update(this.currentUser).subscribe(
      event => {
        this.alertService.success("User updated, re-login to see changes.", true);
      }, error => {
        this.alertService.error(error);
      });
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  deleteUser(id: number) {
    this.userService.delete(id).pipe(first())
      .subscribe(() => {
        this.loadAllUsers()
      });
  }

  public loadAllUsers() {
    this.userService.getAll().pipe(first())
      .subscribe(users => {
        this.users = users;
      });
  }
}
