import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { FileUploadDetailsComponent } from "../file-upload/components/file-upload-details/file-upload-details.component";

const routes: Routes = [
    { path: '', component: FileUploadComponent, children: [
        { path: '', redirectTo: 'details', pathMatch: 'full' },
        { path: 'details', component: FileUploadDetailsComponent },
    ]}
  ];
  
@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class FileUploadRoutingModule { }