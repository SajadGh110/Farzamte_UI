import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-spanspecial',
  templateUrl: './spanspecial.component.html',
  styleUrls: ['./spanspecial.component.scss']
})
export class SpanspecialComponent {
  @Input() text!: string;
  @Input() color!: string;
}
