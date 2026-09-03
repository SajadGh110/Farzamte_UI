import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsDialog } from './leads-dialog';

describe('LeadsDialog', () => {
  let component: LeadsDialog;
  let fixture: ComponentFixture<LeadsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
