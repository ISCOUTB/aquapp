import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AquappComponent } from './aquapp.component';

describe('AquappComponent', () => {
  let component: AquappComponent;
  let fixture: ComponentFixture<AquappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AquappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AquappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
