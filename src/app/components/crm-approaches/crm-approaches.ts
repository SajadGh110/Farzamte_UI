import { Component } from '@angular/core';
import {MenuTitle} from "../Template/menu-title/menu-title";
import {MenuComponent} from "../Template/menu/menu.component";
import {Footer2Component} from "../Template/footer2/footer2.component";

@Component({
    selector: 'app-crm-approaches',
    imports: [
        MenuTitle,
        MenuComponent,
        Footer2Component
    ],
    templateUrl: './crm-approaches.html',
    styleUrl: './crm-approaches.scss'
})
export class CrmApproaches {

}
