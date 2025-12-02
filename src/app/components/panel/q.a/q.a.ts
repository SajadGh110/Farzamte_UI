import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormsModule} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {QaService} from "../../../services/qa.service";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButton} from "@angular/material/button";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {QAModel} from "../../../models/qa.model";
import {EChartsOption} from "echarts";
import {NgxEchartsDirective} from "ngx-echarts";
import * as echarts from 'echarts';

@Component({
  selector: 'app-q.a',
  imports: [
    DashboardSidebarComponent,
    MatProgressSpinner,
    NgIf,
    MatRadioGroup,
    FormsModule,
    MatRadioButton,
    MatButton,
    MatTableModule,
    NgForOf,
    NgxEchartsDirective
  ],
  providers: [DatePipe],
  templateUrl: './q.a.html',
  styleUrl: './q.a.scss'
})
export class QA implements OnInit {
  protected flag_acu: boolean = false;
  protected flag_avm: boolean = false;
  protected flag_simple_data: boolean = false;
  protected flag_detailed_data: boolean = false;

  unit_list: any = [];
  month_list: any = [];
  portType_list: any = [];

  selected_unit: string = "";
  selected_date_type: number = 0;
  StartDate: string = "";
  EndDate: string = "";
  displayedColumns: string[] = [
    'number',
    'agent',
    'portType',
    'totalCalls',
    'criticalErrors',
    'averageScore',
    'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8'
  ];
  dataSource_simple_qa: any = [];
  dataSource_qa: MatTableDataSource<QAModel> = new MatTableDataSource<QAModel>();

  barCharts: { [portType: string]: EChartsOption } = {};

  public constructor(private toast: NgToastService, private auth: AuthService, private router: Router, private getData: QaService, private fb: FormBuilder) {}

  async ngOnInit() {
    if (this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin" && this.auth.getUserName() !== "momeni.mobin") {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }
    if (this.auth.getUserName() == 'nouri.mobin') {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }

    await this.get_units();
    if (this.unit_list.length == 0) {
      this.toast.warning({detail: "سطح دسترسی!", summary: "متاسفانه شما به این بخش دسترسی ندارید!", duration: 5000, position: 'topRight'});
    } else {
      this.selected_unit = this.unit_list[0];
      this.flag_acu = true;

      await this.get_date(this.selected_unit);
      this.flag_avm = true;

      await this.search();
    }
  }

  async get_units() {
    this.unit_list = await this.getData.GetAccessibleUnits().toPromise();
  }

  async get_date(unit: string) {
    this.month_list = await this.getData.GetAvailableMonths(unit).toPromise();
  }

  async get_portTypes(unit: string, StartDate: string, EndDate: string) {
    this.portType_list = await this.getData.GetPortTypes(unit, StartDate, EndDate).toPromise();
  }

  async simple_data(portType: string) {
    try {
      return await this.getData.GetAgentScoresSimple(this.StartDate, this.EndDate, this.selected_unit, portType).toPromise();
    } catch (error) {
      console.error('Error in simple_data method:', error);
      return [];
    }
  }

  async detailed_data(portType: string) {
    try {
      return await this.getData.GetAgentScoresDetailed(this.StartDate, this.EndDate, this.selected_unit, portType).toPromise();
    } catch (error) {
      console.error('Error in detailed_data method:', error);
      return [];
    }
  }

  async search() {
    this.flag_simple_data = false;
    this.flag_detailed_data = false;
    this.portType_list = [];
    this.dataSource_qa.data = [];
    this.dataSource_simple_qa = [];
    this.barCharts = {};

    switch (this.selected_date_type) {
      case 0:
        this.StartDate = this.month_list[0] + "-01";
        this.EndDate = this.month_list[0] + "-30";
        break;
      case 1:
        this.StartDate = this.month_list[2] + "-01";
        this.EndDate = this.month_list[0] + "-30";
        break;
      case 2:
        this.StartDate = this.month_list[5] + "-01";
        this.EndDate = this.month_list[0] + "-30";
        break;
      case 3:
        this.StartDate = "2025-01-01";
        this.EndDate = this.month_list[0] + "-30";
        break;
    }

    await this.get_portTypes(this.selected_unit, this.StartDate, this.EndDate);

    const allDetailedData: any[] = [];
    const allSimpleData: any[] = [];
    for (let i = 0; i < this.portType_list.length; i++) {
      const sData: any = await this.simple_data(this.portType_list[i]);
      const dData: any = await this.detailed_data(this.portType_list[i]);
      if (dData) {
        allDetailedData.push(...dData);
      }
      if (sData) {
        allSimpleData.push(sData);
        this.createBarChart(this.portType_list[i], sData);
      }
    }
    this.dataSource_qa.data = allDetailedData;
    this.dataSource_simple_qa = allSimpleData;
    this.flag_detailed_data = true;
    this.flag_simple_data = true;
  }

  private createBarChart(portType: string, data: any[]) {
    const sortedData = [...data].sort((a, b) => a.averageScore - b.averageScore);
    
    const agents = sortedData.map(item => item.agent);
    const scores = sortedData.map(item => item.averageScore);

    this.barCharts[portType] = {
      title: {
        text: `عملکرد کارشناسان - ${portType}`,
        left: 'center',
        top: 10,
        textStyle: {
          fontFamily: 'Nazanin',
          fontSize: 18,
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'category',
        data: agents,
        axisLabel: {
          width: 100,
          overflow: 'truncate',
          interval: 0,
          fontFamily: 'Nazanin',
          fontWeight: 'bold'
        }
      },
      series: [
        {
          name: portType,
          type: 'bar',
          data: scores,
          barWidth: '60%',
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
            fontFamily: 'Bahnschrift',
            fontWeight: 'bold',
            color: '#000'
          },
          itemStyle: {
            borderRadius: [0, 20, 20, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.1)',
            borderRadius: [0, 20, 20, 0]
          }
        }
      ]
    };
  }

  getChartOption(portType: string): EChartsOption {
    return this.barCharts[portType] || {};
  }

  get portTypesWithCharts(): string[] {
    return Object.keys(this.barCharts);
  }

  protected readonly Object = Object;
}