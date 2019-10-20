import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderFieldsComponent } from './render-fields.component';

describe('RenderFieldsComponent', () => {
  let component: RenderFieldsComponent;
  let fixture: ComponentFixture<RenderFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
