import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeSms } from './notice-sms';

describe('NoticeSMSComponent', () => {
  let component: NoticeSms;
  let fixture: ComponentFixture<NoticeSms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeSms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeSms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
