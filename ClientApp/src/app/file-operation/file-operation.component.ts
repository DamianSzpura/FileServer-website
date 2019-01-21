import { Component, OnInit, Input } from '@angular/core';

import { PageFile } from '../_models/file';

@Component({
  selector: 'app-file-operation',
  templateUrl: './file-operation.component.html',
  styleUrls: ['./file-operation.component.css']
})
export class FileOperationComponent implements OnInit {
  @Input() selectedFile: PageFile

  constructor() { }

  ngOnInit() {
  }
}
