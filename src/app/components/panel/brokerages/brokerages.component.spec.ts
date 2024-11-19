import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokeragesComponent } from './brokerages.component';

describe('DashboardComponent', () => {
  let component: BrokeragesComponent;
  let fixture: ComponentFixture<BrokeragesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokeragesComponent]
    });
    fixture = TestBed.createComponent(BrokeragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
