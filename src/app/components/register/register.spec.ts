import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';

describe('RegisterComponent', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Register]
    });
    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
