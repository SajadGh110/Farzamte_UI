import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Callcenter } from './callcenter';

describe('CallcenterComponent', () => {
  let component: Callcenter;
  let fixture: ComponentFixture<Callcenter>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Callcenter]
    });
    fixture = TestBed.createComponent(Callcenter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
