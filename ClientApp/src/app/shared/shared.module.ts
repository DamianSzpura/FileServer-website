import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogShareFileComponent } from './components/dialog-share-file/dialog-share-file.component';
import { FileService } from './services/file.service';
import { DragulaModule } from 'ng2-dragula';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FileUploadModule } from 'ng2-file-upload';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule.forRoot(),
    ContextMenuModule.forRoot(),
    FileUploadModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [
    FileService
  ],
  exports: [
    DragulaModule,
    ContextMenuModule,
    FileUploadModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule
  ],
  entryComponents: [
    DialogShareFileComponent
  ],
  declarations: [
    DialogShareFileComponent
  ]
})
export class SharedModule { }
