import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorAppComponent } from './sensor-app.component';

describe('SensorAppComponent', () => {
  let component: SensorAppComponent;
  let fixture: ComponentFixture<SensorAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
