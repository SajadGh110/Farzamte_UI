import {Component} from '@angular/core';
import {BarChartModule, LineChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {DashboardSidebarComponent} from "../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../Template/dashboard-topmenu/dashboard-topmenu.component";
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
  title = "TestChart";
  dataset = [
    { name: "Iran", value: 10 },
    { name: "America", value: 7},
    { name: "England", value: 9},
    { name: "Germany", value: 8},
    { name: "Russia", value: 9},
    { name: "Korea", value: 7},
    { name: "China", value: 8},
    { name: "Poland", value: 2},
  ];
  dataset2 = [
    {
      "name": "Turkmenistan",
      "series": [
        {
          "value": 2668,
          "name": "2016-09-20T10:33:40.935Z"
        },
        {
          "value": 2850,
          "name": "2016-09-22T00:10:00.430Z"
        },
        {
          "value": 4685,
          "name": "2016-09-23T03:14:47.393Z"
        },
        {
          "value": 6882,
          "name": "2016-09-17T03:39:18.347Z"
        },
        {
          "value": 2715,
          "name": "2016-09-17T13:56:41.703Z"
        }
      ]
    },
    {
      "name": "Nepal",
      "series": [
        {
          "value": 3566,
          "name": "2016-09-20T10:33:40.935Z"
        },
        {
          "value": 2204,
          "name": "2016-09-22T00:10:00.430Z"
        },
        {
          "value": 3326,
          "name": "2016-09-23T03:14:47.393Z"
        },
        {
          "value": 6043,
          "name": "2016-09-17T03:39:18.347Z"
        },
        {
          "value": 4360,
          "name": "2016-09-17T13:56:41.703Z"
        }
      ]
    },
    {
      "name": "Germany",
      "series": [
        {
          "value": 3365,
          "name": "2016-09-20T10:33:40.935Z"
        },
        {
          "value": 2413,
          "name": "2016-09-22T00:10:00.430Z"
        },
        {
          "value": 6801,
          "name": "2016-09-23T03:14:47.393Z"
        },
        {
          "value": 3739,
          "name": "2016-09-17T03:39:18.347Z"
        },
        {
          "value": 4190,
          "name": "2016-09-17T13:56:41.703Z"
        }
      ]
    },
    {
      "name": "Turkey",
      "series": [
        {
          "value": 4682,
          "name": "2016-09-20T10:33:40.935Z"
        },
        {
          "value": 2216,
          "name": "2016-09-22T00:10:00.430Z"
        },
        {
          "value": 3823,
          "name": "2016-09-23T03:14:47.393Z"
        },
        {
          "value": 4341,
          "name": "2016-09-17T03:39:18.347Z"
        },
        {
          "value": 4148,
          "name": "2016-09-17T13:56:41.703Z"
        }
      ]
    },
    {
      "name": "Nigeria",
      "series": [
        {
          "value": 4077,
          "name": "2016-09-20T10:33:40.935Z"
        },
        {
          "value": 3211,
          "name": "2016-09-22T00:10:00.430Z"
        },
        {
          "value": 2404,
          "name": "2016-09-23T03:14:47.393Z"
        },
        {
          "value": 4246,
          "name": "2016-09-17T03:39:18.347Z"
        },
        {
          "value": 5081,
          "name": "2016-09-17T13:56:41.703Z"
        }
      ]
    }
  ]
}
