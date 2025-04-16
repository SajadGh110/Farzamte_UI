import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";

@Component({
    selector: 'app-ai-analysis',
    imports: [
        DashboardSidebarComponent,
        DashboardTopmenuComponent
    ],
    templateUrl: './ai-analysis.html',
    styleUrl: './ai-analysis.scss'
})
export class AiAnalysis implements OnInit {
  public constructor(private auth:AuthService, private router:Router, private toast:NgToastService) {}
  async ngOnInit() {
    if (this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin") {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }
  }
}
