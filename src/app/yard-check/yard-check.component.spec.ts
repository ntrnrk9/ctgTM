import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardCheckComponent } from './yard-check.component';

describe('YardCheckComponent', () => {
  let component: YardCheckComponent;
  let fixture: ComponentFixture<YardCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
