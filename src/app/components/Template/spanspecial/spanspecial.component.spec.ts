import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanspecialComponent } from './spanspecial.component';

describe('SpanspecialComponent', () => {
  let component: SpanspecialComponent;
  let fixture: ComponentFixture<SpanspecialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpanspecialComponent]
    });
    fixture = TestBed.createComponent(SpanspecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
