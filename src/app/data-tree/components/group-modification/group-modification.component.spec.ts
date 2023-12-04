import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupModificationComponent } from './group-modification.component';

describe('GroupModificationComponent', () => {
  let component: GroupModificationComponent;
  let fixture: ComponentFixture<GroupModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
