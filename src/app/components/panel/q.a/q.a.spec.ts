import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QA } from './q.a';

describe('QAComponent', () => {
  let component: QA;
  let fixture: ComponentFixture<QA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
