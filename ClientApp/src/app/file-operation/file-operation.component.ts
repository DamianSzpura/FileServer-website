import { Component, OnInit, Input } from '@angular/core';

import { WebFile } from '../_models/file';

@Component({
  selector: 'app-file-operation',
  templateUrl: './file-operation.component.html',
  styleUrls: ['./file-operation.component.less']
})
export class FileOperationComponent implements OnInit {
  @Input() selectedFile: WebFile

  constructor() {

  }

  ngOnInit() {
  }
}
