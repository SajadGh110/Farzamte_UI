import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disorder } from './disorder';

describe('DisorderComponent', () => {
  let component: Disorder;
  let fixture: ComponentFixture<Disorder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disorder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Disorder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
