import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Note1Component } from './note1.component';

describe('Note1Component', () => {
  let component: Note1Component;
  let fixture: ComponentFixture<Note1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Note1Component]
    });
    fixture = TestBed.createComponent(Note1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
