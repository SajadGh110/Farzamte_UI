import { Component } from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";

@Component({
  selector: 'app-survey',
  standalone: true,
    imports: [
        DashboardSidebarComponent,
        DashboardTopmenuComponent
    ],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss'
})
export class SurveyComponent {

}
