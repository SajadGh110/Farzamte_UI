import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-note3',
  templateUrl: './note3.component.html',
  styleUrls: ['./note3.component.scss']
})
export class Note3Component {
  @Input() title!: string;
  @Input() title2!: string;
  @Input() title3!: string;
  @Input() text!: string;
  @Input() border_color!: string;
  @Input() title_color!: string;
  @Input() title2_color!: string;
  @Input() title3_color!: string;
  @Input() text_color!: string;
}
