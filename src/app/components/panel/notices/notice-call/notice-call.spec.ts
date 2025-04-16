import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeCall } from './notice-call';

describe('NoticeCallComponent', () => {
  let component: NoticeCall;
  let fixture: ComponentFixture<NoticeCall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeCall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeCall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
