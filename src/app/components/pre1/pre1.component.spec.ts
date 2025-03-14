import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pre1Component } from './pre1.component';

describe('Pre1Component', () => {
  let component: Pre1Component;
  let fixture: ComponentFixture<Pre1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pre1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pre1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
