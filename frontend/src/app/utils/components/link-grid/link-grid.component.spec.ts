import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkGridComponent } from './link-grid.component';

describe('LinkGridComponent', () => {
  let component: LinkGridComponent;
  let fixture: ComponentFixture<LinkGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
