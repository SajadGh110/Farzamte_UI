import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeSMSComponent } from './notice-sms.component';

describe('NoticeSMSComponent', () => {
  let component: NoticeSMSComponent;
  let fixture: ComponentFixture<NoticeSMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeSMSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoticeSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
