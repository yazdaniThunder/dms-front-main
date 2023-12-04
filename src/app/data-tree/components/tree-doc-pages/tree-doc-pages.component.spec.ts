import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDocPagesComponent } from './tree-doc-pages.component';

describe('TreeDocPagesComponent', () => {
  let component: TreeDocPagesComponent;
  let fixture: ComponentFixture<TreeDocPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeDocPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeDocPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
