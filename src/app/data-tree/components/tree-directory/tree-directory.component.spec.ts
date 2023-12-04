import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDirectoryComponent } from './tree-directory.component';

describe('DirectoryPageComponent', () => {
  let component: TreeDirectoryComponent;
  let fixture: ComponentFixture<TreeDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
