import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperuserStartPageComponent } from './superuser-start-page.component';

describe('SuperuserStartPageComponent', () => {
  let component: SuperuserStartPageComponent;
  let fixture: ComponentFixture<SuperuserStartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperuserStartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperuserStartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
