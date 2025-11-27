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
import {ignoreElements} from "rxjs";

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
  protected flag_acu:boolean = false;
  protected flag_avm:boolean = false;
  protected flag_simple_data:boolean = false;
  protected flag_detailed_data:boolean = false;

  unit_list:any = [];
  month_list:any = [];
  portType_list:any = [];

  selected_unit:string = "";
  selected_date_type:number = 0;
  StartDate:string = "";
  EndDate:string = "";
  displayedColumns: string[] = [
    'number',
    'agent',
    'portType',
    'totalCalls',
    'criticalErrors',
    'averageScore',
    'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8'
  ];
  dataSource_simple_qa:any = [];
  dataSource_qa:MatTableDataSource<QAModel> = new MatTableDataSource<QAModel>();
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private getData:QaService, private fb:FormBuilder) {}

  radarCharts: { [portType: string]: EChartsOption } = {};

  async ngOnInit() {
    if (this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin" && this.auth.getUserName() !== "momeni.mobin") {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }
    if (this.auth.getUserName() == 'nouri.mobin'){
      this.toast.error({ detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight' });
      await this.router.navigate(['profile']);
    }

    await this.get_units();
    if (this.unit_list.length == 0) {
      this.toast.warning({ detail: "سطح دسترسی!", summary: "متاسفانه شما به این بخش دسترسی ندارید!", duration: 5000, position: 'topRight' });
    }
    else {
      this.selected_unit = this.unit_list[0];
      this.flag_acu = true;

      await this.get_date(this.selected_unit);
      this.flag_avm = true;

      await this.search();
    }
  }

  async get_units(){
    this.unit_list = await this.getData.GetAccessibleUnits().toPromise();
  }

  async get_date(unit:string){
    this.month_list = await this.getData.GetAvailableMonths(unit).toPromise();
  }

  async get_portTypes(unit:string, StartDate:string, EndDate:string){
    this.portType_list = await this.getData.GetPortTypes(unit, StartDate, EndDate).toPromise();
  }

  async simple_data(portType:string){
    try {
      return await this.getData.GetAgentScoresSimple(this.StartDate, this.EndDate, this.selected_unit, portType).toPromise();
    } catch (error) {
      console.error('Error in detailed_data method:', error);
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

  async search(){
    this.flag_simple_data = false;
    this.flag_detailed_data = false;
    this.portType_list = [];
    this.dataSource_qa.data = [];
    this.dataSource_simple_qa = [];
    this.radarCharts = {};

    switch(this.selected_date_type){
      case 0:
        this.StartDate = this.month_list[0]+"-01";
        this.EndDate = this.month_list[0]+"-30";
        break;
      case 1:
        this.StartDate = this.month_list[2]+"-01";
        this.EndDate = this.month_list[0]+"-30";
        break;
      case 2:
        this.StartDate = this.month_list[5]+"-01";
        this.EndDate = this.month_list[0]+"-30";
        break;
      case 3:
        this.StartDate = "2025-01-01";
        this.EndDate = this.month_list[0]+"-30";
        break;
    }

    await this.get_portTypes(this.selected_unit, this.StartDate, this.EndDate);

    const allDetailedData: any[] = [];
    const allSimpleData: any[] = [];
    for (let i = 0; i < this.portType_list.length; i++) {
      const sData:any = await this.simple_data(this.portType_list[i]);
      const dData:any = await this.detailed_data(this.portType_list[i]);
      if (dData) {
        allDetailedData.push(...dData);
      }
      if (sData) {
        allSimpleData.push(sData);
        this.createRadarChart(this.portType_list[i], sData);
      }
    }
    this.dataSource_qa.data = allDetailedData;
    this.dataSource_simple_qa = allSimpleData;
    this.flag_detailed_data = true;
    this.flag_simple_data = true;

  }

  private createRadarChart(portType: string, data: any[]) {
    // استخراج نام کارشناس‌ها و امتیازات
    const agents = data.map(item => item.agent);
    const scores = data.map(item => item.averageScore);

    // ایجاد اندیکاتور برای رادار (هر کارشناس یک محور)
    const indicators = agents.map(agent => ({
      name: agent,
      max: 100
    }));

    // داده‌های چارت - برای هر portType یک سری داده
    const seriesData = [
      {
        value: scores,
        name: portType,
        areaStyle: {},
        lineStyle: {
          width: 2
        }
      }
    ];

    // تنظیمات چارت
    this.radarCharts[portType] = {
      title: {
        text: `پورت تایپ: ${portType}`,
        right: '10%',
        textAlign: 'center',
        textStyle: {
          fontFamily: 'Nazanin',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.name}: ${params.value}%`;
        }
      },
      legend: {
        data: [portType],
        left: '2%',
        bottom: 0,
        textStyle: {
          fontFamily: 'Nazanin'
        }
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      radar: {
        shape: 'circle',
        scale: true,
        center: ['50%', '50%'],
        radius: '60%',
        axisName: {
          color: '#428BD4',
          fontSize: 12,
          fontFamily: 'Nazanin',
          fontWeight: 'bold'
        },
        indicator: indicators,
        splitLine: {
          lineStyle: {
            color: ['rgba(66, 139, 212, 0.3)']
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(66, 139, 212, 0.5)'
          }
        }
      },
      series: [
        {
          type: 'radar',
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: true,
            formatter: (params: any) => {
              return `${params.value}%`;
            },
            fontFamily: 'Bahnschrift',
            position: 'top'
          },
          itemStyle: {
            color: '#c36577'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(195, 101, 119, 0.7)'
              }, {
                offset: 1, color: 'rgba(195, 101, 119, 0.1)'
              }]
            }
          },
          data: seriesData
        }
      ]
    };
  }

  // تابع برای گرفتن چارت بر اساس portType
  getRadarChart(portType: string): EChartsOption {
    return this.radarCharts[portType] || {};
  }

  // تابع برای چک کردن وجود چارت
  hasRadarChart(portType: string): boolean {
    return !!this.radarCharts[portType];
  }

  // لیست portTypeهای موجود برای نمایش
  get portTypesWithCharts(): string[] {
    return Object.keys(this.radarCharts);
  }

  protected readonly Object = Object;
}
