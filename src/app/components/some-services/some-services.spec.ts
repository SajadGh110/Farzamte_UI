import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SomeServices } from './some-services';

describe('Pre5Component', () => {
  let component: SomeServices;
  let fixture: ComponentFixture<SomeServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SomeServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SomeServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
