import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-note2',
    templateUrl: './note2.component.html',
    styleUrls: ['./note2.component.scss'],
    standalone: false
})
export class Note2Component {
  @Input() title!: string;
  @Input() title2!: string;
  @Input() text!: string;
  @Input() border_color!: string;
  @Input() title_color!: string;
  @Input() title2_color!: string;
  @Input() text_color!: string;
}
