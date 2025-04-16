import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarzamteFeatures } from './farzamte-features';

describe('Pre6Component', () => {
  let component: FarzamteFeatures;
  let fixture: ComponentFixture<FarzamteFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarzamteFeatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarzamteFeatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
