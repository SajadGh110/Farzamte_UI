import {Component, OnInit} from '@angular/core';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {AuthService} from "../../../services/auth.service";
import { NgToastService } from 'ng-angular-popup';
import {Router} from "@angular/router";

@Component({
    selector: 'app-disorder',
    imports: [
        DashboardTopmenuComponent,
        DashboardSidebarComponent
    ],
    templateUrl: './disorder.html',
    styleUrl: './disorder.scss'
})
export class Disorder implements OnInit {
  public constructor(private auth:AuthService, private router:Router, private toast:NgToastService) {}
  async ngOnInit() {
    if (this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin") {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }
  }
}
