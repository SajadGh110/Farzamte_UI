import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crm_old } from './crm_old';

describe('CrmComponent', () => {
  let component: Crm_old;
  let fixture: ComponentFixture<Crm_old>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Crm_old]
    });
    fixture = TestBed.createComponent(Crm_old);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
