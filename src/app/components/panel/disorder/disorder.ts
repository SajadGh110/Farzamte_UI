import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {AuthService} from "../../../services/auth.service";
import { NgToastService } from 'ng-angular-popup';
import {Router} from "@angular/router";

@Component({
    selector: 'app-disorder',
    imports: [
        DashboardSidebarComponent
    ],
    templateUrl: './disorder.html',
    styleUrl: './disorder.scss'
})
export class Disorder implements OnInit {
  public constructor(private auth:AuthService, private router:Router, private toast:NgToastService) {}
  async ngOnInit() {
    
  }
}
