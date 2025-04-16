import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatCrmIsNot } from './what-crm-is-not';

describe('Pre3Component', () => {
  let component: WhatCrmIsNot;
  let fixture: ComponentFixture<WhatCrmIsNot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatCrmIsNot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatCrmIsNot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
