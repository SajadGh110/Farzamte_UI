import { ComponentFixture, TestBed } from '@angular/core/testing';

import { About } from './about';

describe('AboutComponent', () => {
  let component: About;
  let fixture: ComponentFixture<About>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [About]
    });
    fixture = TestBed.createComponent(About);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
