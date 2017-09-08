import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerDaseComponent } from './trailer-dase.component';

describe('TrailerDaseComponent', () => {
  let component: TrailerDaseComponent;
  let fixture: ComponentFixture<TrailerDaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerDaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerDaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
