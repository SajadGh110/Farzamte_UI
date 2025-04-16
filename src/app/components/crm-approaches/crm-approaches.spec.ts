import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmApproaches } from './crm-approaches';

describe('Pre2Component', () => {
  let component: CrmApproaches;
  let fixture: ComponentFixture<CrmApproaches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrmApproaches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmApproaches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
