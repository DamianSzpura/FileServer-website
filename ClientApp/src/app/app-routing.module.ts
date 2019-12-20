import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { HomeComponent } from "./core/components/home/home.component";
import { LoginComponent } from "./core/components/login/login.component";
import { RegisterComponent } from "./core/components/register/register.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    { path: '', loadChildren: () => import('./file-upload/file-upload.module').then(m => m.FileUploadModule),  canActivate: [AuthGuard]},
    { path: 'file', loadChildren: () => import('./file-share/file-share.module').then(m => m.FileShareModule)},
    { path: 'account', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
  
    // otherwise redirect to home
    { path: '**', redirectTo: 'login' }
  ];
  
@NgModule({
    imports: [
      RouterModule.forRoot(routes, { enableTracing: false })
    ],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }