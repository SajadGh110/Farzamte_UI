import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';

describe('LoginComponent', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Login]
    });
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
