import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { StyleService } from './services/style.service';
import { SharedModule } from '../shared/shared.module';
import { AlertComponent } from './components/alert/alert.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RegisterComponent } from './components/register/register.component';
import { RouterModule } from '@angular/router';
import { RestApiService } from './services/rest-api.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    RestApiService,
    AuthGuard,
    AuthenticationService,
    UserService,
    StyleService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  declarations: [
    AlertComponent,
    HomeComponent,
    LoginComponent,
    NavMenuComponent,
    RegisterComponent
  ],
  exports: [
    AlertComponent,
    HomeComponent,
    LoginComponent,
    NavMenuComponent,
    RegisterComponent
  ]
})
export class CoreModule { }
