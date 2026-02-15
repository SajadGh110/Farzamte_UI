import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutCallDialog } from './out-call-dialog';

describe('OutCallDialog', () => {
  let component: OutCallDialog;
  let fixture: ComponentFixture<OutCallDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutCallDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutCallDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
