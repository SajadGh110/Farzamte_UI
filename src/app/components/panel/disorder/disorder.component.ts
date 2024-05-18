import { Component } from '@angular/core';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";

@Component({
  selector: 'app-disorder',
  standalone: true,
  imports: [
    DashboardTopmenuComponent,
    DashboardSidebarComponent
  ],
  templateUrl: './disorder.component.html',
  styleUrl: './disorder.component.scss'
})
export class DisorderComponent {

}
