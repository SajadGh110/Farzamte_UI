import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('HomeComponent', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Home]
    });
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
