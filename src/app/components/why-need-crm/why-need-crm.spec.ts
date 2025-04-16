import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyNeedCrm } from './why-need-crm';

describe('Pre4Component', () => {
  let component: WhyNeedCrm;
  let fixture: ComponentFixture<WhyNeedCrm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyNeedCrm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyNeedCrm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
