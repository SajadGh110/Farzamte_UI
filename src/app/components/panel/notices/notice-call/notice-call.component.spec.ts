import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeCallComponent } from './notice-call.component';

describe('NoticeCallComponent', () => {
  let component: NoticeCallComponent;
  let fixture: ComponentFixture<NoticeCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeCallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoticeCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
