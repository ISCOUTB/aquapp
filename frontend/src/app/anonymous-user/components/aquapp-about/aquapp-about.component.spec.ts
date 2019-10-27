import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AquappAboutComponent } from './aquapp-about.component';

describe('AquappAboutComponent', () => {
  let component: AquappAboutComponent;
  let fixture: ComponentFixture<AquappAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AquappAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AquappAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
