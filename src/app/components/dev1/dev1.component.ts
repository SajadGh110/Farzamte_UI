import { Component, OnInit } from '@angular/core';
import {MenuTitleComponent} from "../Template/menu-title/menu-title.component";

@Component({
  selector: 'app-dev1',
  standalone: true,
  imports: [
    MenuTitleComponent
  ],
  templateUrl: './dev1.component.html',
  styleUrl: './dev1.component.scss'
})
export class Dev1Component {
}
