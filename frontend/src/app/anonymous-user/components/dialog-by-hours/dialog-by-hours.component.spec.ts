import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogByHoursComponent } from './dialog-by-hours.component';

describe('DialogByHoursComponent', () => {
  let component: DialogByHoursComponent;
  let fixture: ComponentFixture<DialogByHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogByHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogByHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
