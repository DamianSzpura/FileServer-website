import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragulaModule } from 'ng2-dragula';
import { FileUploadModule } from 'ng2-file-upload';
import { ContextMenuModule } from 'ngx-contextmenu';
import { ReactiveFormsModule } from '@angular/forms';

import { FileOperationComponent } from './file-operation/file-operation.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { AlertComponent } from './_directives/alert.component';
import { FileShareComponent } from './file-share/file-share.component';

import { AuthGuard } from './_guards/auth.guard';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import { FileService } from './_services/file.service';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { StyleService } from './_services/style.service';

const routes = [
  { path: '', component: UploadFileComponent, canActivate: [AuthGuard] },
  { path: 'account', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'file/:id', component: FileShareComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: 'news' }
];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    DragulaModule.forRoot(),
    FileUploadModule,
    ReactiveFormsModule,
    ContextMenuModule.forRoot()
  ],
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    UploadFileComponent,
    FileOperationComponent,
    RegisterComponent,
    LoginComponent,
    AlertComponent,
    FileShareComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    FileService,
    StyleService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
