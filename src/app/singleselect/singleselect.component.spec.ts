import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleselectComponent } from './singleselect.component';

describe('SingleselectComponent', () => {
  let component: SingleselectComponent;
  let fixture: ComponentFixture<SingleselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
