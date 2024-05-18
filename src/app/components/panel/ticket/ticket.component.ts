import { Component } from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";

@Component({
  selector: 'app-ticket',
  standalone: true,
    imports: [
        DashboardSidebarComponent,
        DashboardTopmenuComponent
    ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {

}
