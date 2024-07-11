import {Component} from '@angular/core';
import {BarChartModule, LineChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
@Component({
  selector: 'app-view-360',
  standalone: true,
    imports: [
        BarChartModule,
        PieChartModule,
        LineChartModule,
        DashboardSidebarComponent,
        DashboardTopmenuComponent
    ],
  templateUrl: './view-360.component.html',
  styleUrl: './view-360.component.scss'
})
export class View360Component {

}
