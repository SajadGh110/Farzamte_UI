import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAnalysis } from './ai-analysis';

describe('AiAnalysisComponent', () => {
  let component: AiAnalysis;
  let fixture: ComponentFixture<AiAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
