import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { FileUploadDetailsComponent } from "../file-upload/components/file-upload-details/file-upload-details.component";
import { FileShareComponent } from "./file-share.component";
import { FileShareDetailsComponent } from "./components/file-share-details/file-share-details.component";
import { FileShareDetailsResolver } from "./resolvers/file-share-details.resolver";

const routes: Routes = [
    { path: '', component: FileShareComponent, children: [
        { path: '', redirectTo: 'details', pathMatch: 'full' },
        { path: 'details/:id', component: FileShareDetailsComponent, resolve: {
          viewData: FileShareDetailsResolver
        }}
    ]}
  ];
  
@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class FileShareRoutingModule { }