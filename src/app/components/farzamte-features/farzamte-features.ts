import { Component } from '@angular/core';
import {MenuTitle} from "../Template/menu-title/menu-title";
import {MenuComponent} from "../Template/menu/menu.component";
import {Footer2Component} from "../Template/footer2/footer2.component";

@Component({
    selector: 'app-farzamte-features',
  imports: [
    MenuTitle,
    MenuComponent,
    Footer2Component
  ],
    templateUrl: './farzamte-features.html',
    styleUrl: './farzamte-features.scss'
})
export class FarzamteFeatures {

}
