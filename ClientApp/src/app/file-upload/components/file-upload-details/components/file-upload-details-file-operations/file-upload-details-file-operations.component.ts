import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { first } from 'rxjs/operators';
import { WebFile } from '../../../../../shared/models/file';
import { FileService } from '../../../../../shared/services/file.service';
import { AlertService } from '../../../../../services/alert.service';
import { DialogShareFileComponent } from '../../../../../shared/components/dialog-share-file/dialog-share-file.component';
import { RestApiService } from '../../../../../core/services/rest-api.service';


@Component({
  selector: 'app-file-upload-details-file-operations',
  templateUrl: './file-upload-details-file-operations.component.html',
  styleUrls: ['./file-upload-details-file-operations.component.less']
})

export class FileUploadDetailsFileOperationsComponent implements OnChanges {
  @Input() selectedFile: WebFile;
  @Input() currentFolder: string[];
  @Output() selectedFileChanged = new EventEmitter();
  fileForm: FormGroup;
  submitted: boolean = false;
  public buttonClicked: boolean;

  constructor(
    private _fileService: FileService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _dialog: MatDialog,
    private _restApiSerivce: RestApiService,
    private _cd: ChangeDetectorRef) {
  }

  ngOnChanges() {
    if (this.selectedFile) {
      this.fileForm = this._formBuilder.group({
        name: [this.selectedFile.name, Validators.required],
        comment: [this.selectedFile.comment]
      });
    }
  }

  get f() { return this.fileForm.controls; }

  onDownload() {
    this.buttonClicked = true;
    this._fileService.getByName(this.currentFolder, this.selectedFile.name)
      .subscribe(result => {
        if (!result.type.endsWith("json")) {
          var blobFile = new Blob([result], { type: "application/octet-stream" });

          var urlToFile = window.URL.createObjectURL(blobFile);
          var documentToDownload = document.createElement('a');

          documentToDownload.href = urlToFile;
          documentToDownload.download = this.selectedFile.name;
          documentToDownload.click();

          window.URL.revokeObjectURL(urlToFile);
          documentToDownload.remove();
        }
      }, error => {
        
        this._alertService.error(error);
      });
    setTimeout(() => {
      this.buttonClicked = false
      this._cd.detectChanges();
    }, 5000);
  }

  onChange() {
    this.buttonClicked = true;
    if (!this.submitted && this.f.name.value == "-") {
      this.f.name.setValue(this.selectedFile.name);
    }

    this.submitted = true;
    if (this.fileForm.invalid) {
      return;
    }

    this.selectedFile.name = this.f.name.value;
    this.selectedFile.comment = this.f.comment.value
    this._fileService.update(this.currentFolder, this.selectedFile)
      .subscribe(
        event => {
          this.selectedFileChanged.emit();
          this._alertService.success("File changed.");
          this.submitted = false;
        }, error => {
          this._alertService.error(error);
        });
    setTimeout(() => {
      this.buttonClicked = false;
      this._cd.detectChanges();
    }, 5000);
  }

  onDelete() {
    this.buttonClicked = true;
    this._fileService.delete(this.currentFolder, this.selectedFile)
      .subscribe(
        event => {
          this.selectedFileChanged.emit();
          this._alertService.success("File has been deleted.");
          this.selectedFile = null;
        }, error => {
          this._alertService.error(error);
      });
    this.buttonClicked = false;
    this._cd.detectChanges();
  }

  onShare() {
    let dialogRef: MatDialogRef<DialogShareFileComponent>;
    dialogRef = this._dialog.open(DialogShareFileComponent, {
      disableClose: true,
      autoFocus: false,
      data: { file: this.selectedFile, link: location.origin + "/file/details/" + this.selectedFile.linkId }
    });

    dialogRef
      .beforeClose().pipe(first())
      .subscribe();
  }
}
