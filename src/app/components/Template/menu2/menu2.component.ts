import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-menu2',
    templateUrl: './menu2.component.html',
    styleUrls: ['./menu2.component.scss'],
    standalone: false
})
export class Menu2Component {
  @Input() Selected!: string;
}
