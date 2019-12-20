import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadDetailsComponent } from './components/file-upload-details/file-upload-details.component';
import { FileUploadDetailsFileOperationsComponent } from './components/file-upload-details/components/file-upload-details-file-operations/file-upload-details-file-operations.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadRoutingModule } from './file-upload-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FileUploadRoutingModule
  ],
  declarations: [
    FileUploadDetailsComponent,
    FileUploadDetailsFileOperationsComponent,
    FileUploadComponent
  ]
})
export class FileUploadModule { }
