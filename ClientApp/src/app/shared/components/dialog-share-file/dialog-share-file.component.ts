import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { share } from 'rxjs/operators';
import { WebFile } from '../../models/file';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-dialog-share-file',
  templateUrl: './dialog-share-file.component.html',
  styleUrls: ['./dialog-share-file.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogShareFileComponent implements OnInit {
  shareFileFormGroup: FormGroup;
  loading = false;
  sendMessage = false;

  constructor(public dialogRef: MatDialogRef<DialogShareFileComponent>, @Inject(MAT_DIALOG_DATA) public data: { file: WebFile, link: string}, public _fileService: FileService, public _cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForms();
  }

  private initForms() {
    this.shareFileFormGroup = new FormGroup({});
    const emailFormControl = new FormControl('',  [Validators.required, Validators.email])
    this.shareFileFormGroup.addControl('email', emailFormControl);
  }

  onSubmit() {
    if (this.shareFileFormGroup.invalid) {
      this.shareFileFormGroup.markAsTouched();
      return;
    }
    this.loading = true;
    this._fileService.sendEmailWithLink({sendToEmail: this.emailControl.value, link: this.data.link}).pipe(share()).subscribe(() => {
      
      this.loading = false;
      this.sendMessage = true;
      this._cd.detectChanges();
    }, () => {
      
      this.loading = false;
      this.sendMessage = false;
      this._cd.detectChanges();
    })

  }

  closeDialog() {
    this.dialogRef.close();
  }

  get emailControl() {
    return this.shareFileFormGroup.controls.email
  }
}
