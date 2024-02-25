import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-note4',
  templateUrl: './note4.component.html',
  styleUrls: ['./note4.component.scss']
})
export class Note4Component {
  @Input() title!: string;
  @Input() title2!: string;
  @Input() title3!: string;
  @Input() items!: string[];
  @Input() border_color!: string;
  @Input() title_color!: string;
  @Input() title2_color!: string;
  @Input() title3_color!: string;
  @Input() item_color!: string;
}
