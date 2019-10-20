import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDatumComponent } from './new-datum.component';

describe('NewDatumComponent', () => {
  let component: NewDatumComponent;
  let fixture: ComponentFixture<NewDatumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDatumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDatumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
