import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticlesBackgroundComponent } from './particles-background.component';

describe('ParticlesBackgroundComponent', () => {
  let component: ParticlesBackgroundComponent;
  let fixture: ComponentFixture<ParticlesBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticlesBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticlesBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
