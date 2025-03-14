import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pre4Component } from './pre4.component';

describe('Pre4Component', () => {
  let component: Pre4Component;
  let fixture: ComponentFixture<Pre4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pre4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pre4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
