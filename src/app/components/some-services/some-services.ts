import { Component } from '@angular/core';
import {MenuTitle} from "../Template/menu-title/menu-title";
import {MenuComponent} from "../Template/menu/menu.component";
import {Footer2Component} from "../Template/footer2/footer2.component";

@Component({
    selector: 'app-some-services',
    imports: [
        MenuTitle,
        MenuComponent,
        Footer2Component
    ],
    templateUrl: './some-services.html',
    styleUrl: './some-services.scss'
})
export class SomeServices {

}
