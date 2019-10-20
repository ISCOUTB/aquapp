import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNumberFieldComponent } from './new-number-field.component';

describe('NewNumberFieldComponent', () => {
  let component: NewNumberFieldComponent;
  let fixture: ComponentFixture<NewNumberFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNumberFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNumberFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
