import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartPageComponent } from './get-start-page.component';

describe('GetStartPageComponent', () => {
  let component: GetStartPageComponent;
  let fixture: ComponentFixture<GetStartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
