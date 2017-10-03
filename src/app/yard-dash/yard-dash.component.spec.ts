import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardDashComponent } from './yard-dash.component';

describe('YardDashComponent', () => {
  let component: YardDashComponent;
  let fixture: ComponentFixture<YardDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
