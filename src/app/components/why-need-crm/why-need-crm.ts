import { Component } from '@angular/core';
import {MenuTitle} from "../Template/menu-title/menu-title";
import {MenuComponent} from "../Template/menu/menu.component";
import {Footer2Component} from "../Template/footer2/footer2.component";

@Component({
    selector: 'app-why-need-crm',
    imports: [
        MenuTitle,
        MenuComponent,
        Footer2Component
    ],
    templateUrl: './why-need-crm.html',
    styleUrl: './why-need-crm.scss'
})
export class WhyNeedCrm {

}
