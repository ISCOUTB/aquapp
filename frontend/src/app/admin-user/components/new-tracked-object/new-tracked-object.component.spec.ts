import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTrackedObjectComponent } from './new-tracked-object.component';

describe('NewTrackedObjectComponent', () => {
  let component: NewTrackedObjectComponent;
  let fixture: ComponentFixture<NewTrackedObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTrackedObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTrackedObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
