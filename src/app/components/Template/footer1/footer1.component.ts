import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-footer1',
    templateUrl: './footer1.component.html',
    styleUrls: ['./footer1.component.scss'],
    standalone: false
})
export class Footer1Component {
  @Input() img: boolean = false;
}
