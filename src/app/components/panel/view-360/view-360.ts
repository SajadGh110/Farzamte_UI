import {Component, OnInit} from '@angular/core';
import {BarChartModule, LineChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
    selector: 'app-view-360',
    imports: [
        BarChartModule,
        PieChartModule,
        LineChartModule,
        DashboardSidebarComponent,
    ],
    templateUrl: './view-360.html',
    styleUrl: './view-360.scss'
})
export class View360 implements OnInit {
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder) {}
  async ngOnInit() {
    if (this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin") {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }
  }
}
