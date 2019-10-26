import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AquappExportDataComponent } from './aquapp-export-data.component';

describe('AquappExportDataComponent', () => {
  let component: AquappExportDataComponent;
  let fixture: ComponentFixture<AquappExportDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AquappExportDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AquappExportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
