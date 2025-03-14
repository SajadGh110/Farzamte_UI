import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pre3Component } from './pre3.component';

describe('Pre3Component', () => {
  let component: Pre3Component;
  let fixture: ComponentFixture<Pre3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pre3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pre3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
