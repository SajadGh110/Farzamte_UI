import { Component } from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    DashboardTopmenuComponent
  ],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
}
