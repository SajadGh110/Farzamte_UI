import { Component } from '@angular/core';
import {MenuTitle} from "../Template/menu-title/menu-title";
import {MenuComponent} from "../Template/menu/menu.component";
import {Footer2Component} from "../Template/footer2/footer2.component";

@Component({
    selector: 'app-what-crm-is-not',
    imports: [
        MenuTitle,
        MenuComponent,
        Footer2Component
    ],
    templateUrl: './what-crm-is-not.html',
    styleUrl: './what-crm-is-not.scss'
})
export class WhatCrmIsNot {

}
