import { Component } from '@angular/core';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";

@Component({
  selector: 'app-happy-call',
  standalone: true,
  imports: [
    DashboardTopmenuComponent,
    DashboardSidebarComponent
  ],
  templateUrl: './happy-call.component.html',
  styleUrl: './happy-call.component.scss'
})
export class HappyCallComponent {

}
