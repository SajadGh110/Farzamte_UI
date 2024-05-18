import { Component } from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";

@Component({
  selector: 'app-other',
  standalone: true,
    imports: [
        DashboardSidebarComponent,
        DashboardTopmenuComponent
    ],
  templateUrl: './other.component.html',
  styleUrl: './other.component.scss'
})
export class OtherComponent {

}
