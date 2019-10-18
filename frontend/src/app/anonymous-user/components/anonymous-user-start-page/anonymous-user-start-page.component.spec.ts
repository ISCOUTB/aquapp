import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousUserStartPageComponent } from './anonymous-user-start-page.component';

describe('AnonymousUserStartPageComponent', () => {
  let component: AnonymousUserStartPageComponent;
  let fixture: ComponentFixture<AnonymousUserStartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonymousUserStartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousUserStartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
