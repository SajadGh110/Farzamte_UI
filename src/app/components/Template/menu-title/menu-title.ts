import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-menu-title',
    imports: [],
    templateUrl: './menu-title.html',
    styleUrl: './menu-title.scss'
})
export class MenuTitle {
  @Input() text_header:string = "متن سربرگ نسبتا طولانی برای تست";
  @Input() subtext_header:string = "Customer Relationship Management >> Farzamte.com";
  @Input() pre_color:string = "#d29702";
}
