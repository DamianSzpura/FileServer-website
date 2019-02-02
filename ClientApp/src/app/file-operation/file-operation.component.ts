import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { WebFile } from '../_models/file';
import { FileService } from '../_services/file.service';
import { AlertService } from '../_services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-operation',
  templateUrl: './file-operation.component.html',
  styleUrls: ['./file-operation.component.less']
})

export class FileOperationComponent implements OnChanges {
  @Input() selectedFile: WebFile;
  @Input() currentFolder: string[];
  @Output() selectedFileChanged = new EventEmitter();
  fileForm: FormGroup;
  submitted: boolean = false;
  public buttonClicked: boolean;

  constructor(
    private fileService: FileService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService) {
  }

  ngOnChanges() {
    if (this.selectedFile) {
      this.fileForm = this.formBuilder.group({
        name: [this.selectedFile.name, Validators.required],
        comment: [this.selectedFile.comment]
      });
    }
  }

  get f() { return this.fileForm.controls; }

  onDownload() {
    this.buttonClicked = true;
    this.fileService.getByName(this.currentFolder, this.selectedFile.name)
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
        this.alertService.error(error);
      });
    setTimeout(() => {
      this.buttonClicked = false
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
    this.fileService.update(this.currentFolder, this.selectedFile)
      .subscribe(
        event => {
          this.selectedFileChanged.emit();
          this.alertService.success("File changed.");
          this.submitted = false;
        }, error => {
          this.alertService.error(error);
        });
    setTimeout(() => {
      this.buttonClicked = false
    }, 5000);
  }

  onDelete() {
    this.buttonClicked = true;
    this.fileService.delete(this.currentFolder, this.selectedFile)
      .subscribe(
        event => {
          this.selectedFileChanged.emit();
          this.alertService.success("File has been deleted.");
          this.selectedFile = null;
        }, error => {
          this.alertService.error(error);
      });
    this.buttonClicked = false;
  }

  onGetLink() {
    this.router.navigate(["/file", this.selectedFile.linkId]);
  }
}
