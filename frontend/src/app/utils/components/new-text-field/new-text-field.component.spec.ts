import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTextFieldComponent } from './new-text-field.component';

describe('NewTextFieldComponent', () => {
  let component: NewTextFieldComponent;
  let fixture: ComponentFixture<NewTextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTextFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
