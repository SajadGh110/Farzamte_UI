import { Component } from '@angular/core';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";

@Component({
  selector: 'app-call-in',
  standalone: true,
  imports: [
    DashboardTopmenuComponent,
    DashboardSidebarComponent
  ],
  templateUrl: './call-in.component.html',
  styleUrl: './call-in.component.scss'
})
export class CallInComponent {

}
