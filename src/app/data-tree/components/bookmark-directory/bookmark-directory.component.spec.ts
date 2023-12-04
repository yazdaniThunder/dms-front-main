import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkDirectoryComponent } from './bookmark-directory.component';

describe('BookmarkDirectoryComponent', () => {
  let component: BookmarkDirectoryComponent;
  let fixture: ComponentFixture<BookmarkDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
