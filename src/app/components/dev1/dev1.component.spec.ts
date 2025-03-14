import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dev1Component } from './dev1.component';

describe('Dev1Component', () => {
  let component: Dev1Component;
  let fixture: ComponentFixture<Dev1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dev1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dev1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
