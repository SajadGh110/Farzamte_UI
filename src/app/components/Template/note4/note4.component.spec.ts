import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Note4Component } from './note4.component';

describe('Note4Component', () => {
  let component: Note4Component;
  let fixture: ComponentFixture<Note4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Note4Component]
    });
    fixture = TestBed.createComponent(Note4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
