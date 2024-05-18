import { Component } from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";

@Component({
  selector: 'app-notices',
  standalone: true,
    imports: [
        DashboardSidebarComponent,
        DashboardTopmenuComponent
    ],
  templateUrl: './notices.component.html',
  styleUrl: './notices.component.scss'
})
export class NoticesComponent {

}
