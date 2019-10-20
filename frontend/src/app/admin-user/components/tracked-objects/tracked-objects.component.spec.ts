import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedObjectsComponent } from './tracked-objects.component';

describe('TrackedObjectsComponent', () => {
  let component: TrackedObjectsComponent;
  let fixture: ComponentFixture<TrackedObjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackedObjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackedObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
