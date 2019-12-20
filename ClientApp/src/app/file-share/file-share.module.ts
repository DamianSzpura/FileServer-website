import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileShareDetailsComponent } from './components/file-share-details/file-share-details.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { FileShareRoutingModule } from './file-share-routing.module';
import { FileShareComponent } from './file-share.component';
import { FileShareDetailsResolver } from './resolvers/file-share-details.resolver';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FileShareRoutingModule
  ],
  providers: [FileShareDetailsResolver],
  declarations: [
    FileShareDetailsComponent,
    FileShareComponent
  ]
})
export class FileShareModule { }
