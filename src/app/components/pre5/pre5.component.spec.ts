import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pre5Component } from './pre5.component';

describe('Pre5Component', () => {
  let component: Pre5Component;
  let fixture: ComponentFixture<Pre5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pre5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pre5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
