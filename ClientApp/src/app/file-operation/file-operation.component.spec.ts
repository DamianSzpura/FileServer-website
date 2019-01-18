import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOperationComponent } from './file-operation.component';

describe('FileOperationComponent', () => {
  let component: FileOperationComponent;
  let fixture: ComponentFixture<FileOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
