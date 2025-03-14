import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-menu-title',
  standalone: true,
  imports: [],
  templateUrl: './menu-title.component.html',
  styleUrl: './menu-title.component.scss'
})
export class MenuTitleComponent {
  @Input() text_header:string = "متن سربرگ نسبتا طولانی برای تست";
  @Input() subtext_header:string = "Customer Relationship Management >> Farzamte.com";
  @Input() pre_color:string = "#d29702";
}
