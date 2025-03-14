import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pre6Component } from './pre6.component';

describe('Pre6Component', () => {
  let component: Pre6Component;
  let fixture: ComponentFixture<Pre6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pre6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pre6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
