import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedObjectFieldComponent } from './tracked-object-field.component';

describe('TrackedObjectFieldComponent', () => {
  let component: TrackedObjectFieldComponent;
  let fixture: ComponentFixture<TrackedObjectFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackedObjectFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackedObjectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
