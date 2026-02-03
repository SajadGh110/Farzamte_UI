import {Component, OnInit} from '@angular/core';
import {BarChartModule, LineChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";

@Component({
    selector: 'app-view-360',
  imports: [
    BarChartModule,
    PieChartModule,
    LineChartModule,
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
  ],
    templateUrl: './view-360.html',
    styleUrl: './view-360.scss'
})
export class View360 implements OnInit {
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder) {}
  async ngOnInit() {

  }
}
