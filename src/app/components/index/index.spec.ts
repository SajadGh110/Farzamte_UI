import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Index } from './index';

describe('HomeComponent', () => {
  let component: Index;
  let fixture: ComponentFixture<Index>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Index]
    });
    fixture = TestBed.createComponent(Index);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
