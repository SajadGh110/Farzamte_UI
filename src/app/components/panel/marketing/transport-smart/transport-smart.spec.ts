import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportSmart } from './transport-smart';

describe('TransportSmart', () => {
  let component: TransportSmart;
  let fixture: ComponentFixture<TransportSmart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportSmart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportSmart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
