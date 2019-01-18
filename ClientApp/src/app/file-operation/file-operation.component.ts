import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-operation',
  templateUrl: './file-operation.component.html',
  styleUrls: ['./file-operation.component.css']
})
export class FileOperationComponent implements OnInit {

  @Input() selectedFile: file

  constructor() { }

  ngOnInit() {
  }

}

interface file {
  name: string;
  extension: string;
}
