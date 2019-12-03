import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorAppExportDataComponent } from './sensor-app-export-data.component';

describe('SensorAppExportDataComponent', () => {
  let component: SensorAppExportDataComponent;
  let fixture: ComponentFixture<SensorAppExportDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorAppExportDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorAppExportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
