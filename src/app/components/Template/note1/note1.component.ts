import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-note1',
  templateUrl: './note1.component.html',
  styleUrls: ['./note1.component.scss']
})
export class Note1Component{
  @Input() title!: string;
  @Input() text!: string;
  @Input() color!: string;
}
