import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Note2Component } from './note2.component';

describe('Note2Component', () => {
  let component: Note2Component;
  let fixture: ComponentFixture<Note2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Note2Component]
    });
    fixture = TestBed.createComponent(Note2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
