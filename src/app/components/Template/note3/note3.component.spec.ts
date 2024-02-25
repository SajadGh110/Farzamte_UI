import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Note3Component } from './note3.component';

describe('Note3Component', () => {
  let component: Note3Component;
  let fixture: ComponentFixture<Note3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Note3Component]
    });
    fixture = TestBed.createComponent(Note3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
