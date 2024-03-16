import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-notelist',
  templateUrl: './notelist.component.html',
  styleUrls: ['./notelist.component.scss']
})
export class NotelistComponent {
  @Input() title!: string;
  @Input() items!: string[];
  @Input() color!: string;
  @Input() bs_width!: string;
  @Input() bs_width_reverse!: string;
}
