import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDateTimeComponent } from './dialog-date-time.component';

describe('DialogDateTimeComponent', () => {
  let component: DialogDateTimeComponent;
  let fixture: ComponentFixture<DialogDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
