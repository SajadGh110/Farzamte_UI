import { Component, OnInit } from '@angular/core';
import { DashboardSidebarComponent } from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { NgToastService } from "ng-angular-popup";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CommonModule } from "@angular/common";
import { QaService } from "../../../services/qa.service";
import { MatButton } from "@angular/material/button";
import { MatTableModule } from '@angular/material/table';
import { EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CriticalCallsDialogComponent } from './critical-calls-dialog/critical-calls-dialog.component';

interface GroupedAgentData {
  agent: string;
  records: any[];
}

@Component({
  selector: 'app-q.a',
  standalone: true,
  imports: [
    CommonModule,
    DashboardSidebarComponent,
    MatProgressSpinner,
    FormsModule,
    MatButton,
    MatTableModule,
    NgxEchartsDirective,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './q.a.html',
  styleUrl: './q.a.scss'
})
export class QA implements OnInit {
  protected flag_acu: boolean = false;
  protected flag_avm: boolean = false;
  protected flag_loading_data: boolean = false;
  protected show_report: boolean = false;

  unit_list: any = [];
  month_list: { value: string, selected: boolean }[] = [];
  portType_list: any = [];
  selected_unit: string = "";

  groupedDataSource: GroupedAgentData[] = [];
  barCharts: { [portType: string]: EChartsOption } = {};
  
  chartHeights: { [portType: string]: string } = {};

  public constructor(private toast: NgToastService, private auth: AuthService, private router: Router, private getData: QaService, private dialog: MatDialog) {}

  async ngOnInit() {
    await this.get_units();
    if (this.unit_list.length == 0) {
      this.toast.warning({ detail: "سطح دسترسی!", summary: "متاسفانه شما به این بخش دسترسی ندارید!", duration: 5000, position: 'topRight' });
    } else {
      this.selected_unit = this.unit_list[0];
      this.flag_acu = true;
      await this.get_dates(this.selected_unit);
    }
  }

  async get_units() {
    this.unit_list = await this.getData.GetAccessibleUnits().toPromise();
  }

  async get_dates(unit: string) {
    this.flag_avm = false;
    const months = await this.getData.GetAvailableMonths(unit).toPromise();
    this.month_list = months.map((m: string) => ({ value: m, selected: false }));
    if (this.month_list.length > 0) this.month_list[0].selected = true;
    this.flag_avm = true;
  }

  get selectedMonths(): string[] {
    return this.month_list.filter(m => m.selected).map(m => m.value);
  }

  async search() {
    const selectedMonths = this.selectedMonths;
    if (selectedMonths.length === 0) {
      this.toast.warning({ detail: "توجه", summary: "لطفا حداقل یک ماه را انتخاب کنید", duration: 3000 });
      return;
    }

    this.flag_loading_data = true;
    this.show_report = false;
    this.barCharts = {};
    this.chartHeights = {}; // ریست کردن ارتفاع‌ها
    this.groupedDataSource = [];

    try {
      let allPortTypes = new Set<string>();
      for (const month of selectedMonths) {
          const types = await this.getData.GetPortTypes(this.selected_unit, month).toPromise();
          types.forEach((t: string) => allPortTypes.add(t));
      }
      this.portType_list = Array.from(allPortTypes);

      let rawTableData: any[] = []; 

      for (const portType of this.portType_list) {
        let chartDataSeries: any[] = [];
        let allAgents = new Set<string>();
        let monthDataMap = new Map<string, any[]>();

        for (const month of selectedMonths) {
            const simpleData = await this.getData.GetAgentScoresSimple(month, this.selected_unit, portType).toPromise();
            const detailedData = await this.getData.GetAgentScoresDetailed(month, this.selected_unit, portType).toPromise();
            
            monthDataMap.set(month, simpleData);
            
            if (detailedData) {
                detailedData.forEach((d: any) => {
                    allAgents.add(d.agent);
                    d.month = month; 
                    rawTableData.push(d);
                });
            }
        }

        const chartYAxisData = Array.from(allAgents).sort(); 

        for (const month of selectedMonths) {
            const dataForMonth = monthDataMap.get(month) || [];
            
            const seriesData = chartYAxisData.map(agent => {
                const record = dataForMonth.find((d: any) => d.agent === agent);
                return record ? record.averageScore : null;
            });

            chartDataSeries.push({
                name: month,
                type: 'bar',
                data: seriesData,
                label: { 
                    show: true, 
                    position: 'right', 
                    formatter: '{c}%',
                    fontFamily: 'Bahnschrift',
                    fontWeight: 'bold',
                    fontSize: 12
                },
                barWidth: 10, 
                emphasis: { focus: 'series' }
            });
        }
        
        const barsPerAgent = selectedMonths.length;
        const heightPerAgent = (barsPerAgent * 15) + 30; // 15px برای هر میله + 30px فاصله
        const calculatedHeight = Math.max(400, (chartYAxisData.length * heightPerAgent) + 150);
        
        this.chartHeights[portType] = `${calculatedHeight}px`;

        this.createChart(portType, chartYAxisData, chartDataSeries);
      }

      const sortedData = rawTableData.sort((a, b) => {
          if (a.agent < b.agent) return -1;
          if (a.agent > b.agent) return 1;
          return a.month.localeCompare(b.month);
      });

      const groupedMap = new Map<string, any[]>();
      sortedData.forEach(item => {
          if (!groupedMap.has(item.agent)) {
              groupedMap.set(item.agent, []);
          }
          groupedMap.get(item.agent)?.push(item);
      });

      this.groupedDataSource = Array.from(groupedMap, ([agent, records]) => ({ agent, records }));
      this.show_report = true;

    } catch (e) {
      console.error(e);
      this.toast.error({ detail: "خطا", summary: "در دریافت اطلاعات مشکلی پیش آمد" });
    } finally {
      this.flag_loading_data = false;
    }
  }

  createChart(portType: string, agents: string[], series: any[]) {
    this.barCharts[portType] = {
      title: {
        text: `عملکرد کارشناسان - ${portType}`,
        left: 'center',
        textStyle: { fontFamily: 'Nazanin', fontSize: 18 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        textStyle: { fontFamily: 'Bahnschrift' }
      },
      legend: {
        data: series.map(s => s.name),
        top: 30,
        textStyle: { fontFamily: 'Bahnschrift', fontSize: 12 }
      },
      grid: {
        left: '3%',
        right: '12%', // تغییر مهم: افزایش فضای راست برای جلوگیری از بیرون زدن لیبل
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        max: 100,
        boundaryGap: [0, 0.01],
        axisLabel: { 
            formatter: '{value}%', 
            fontFamily: 'Bahnschrift',
            fontWeight: 'bold'
        }
      },
      yAxis: {
        type: 'category',
        data: agents,
        axisLabel: { 
            fontFamily: 'Bahnschrift',
            fontWeight: 'bold',
            fontSize: 13,
            color: '#1a237e'
        }
      },
      series: series
    };
  }

  get portTypesWithCharts(): string[] {
    return Object.keys(this.barCharts);
  }

  async openCriticalDetails(record: any) {
    if (!record.faultyCalls || record.faultyCalls === 0) {
        this.toast.info({ detail: "اطلاعات", summary: "هیچ تماس بحرانی برای نمایش وجود ندارد", duration: 3000 });
        return;
    }    
    try {
      const details = await this.getData.GetCriticalCallDetails(record.month, this.selected_unit, record.agent).toPromise();

      this.dialog.open(CriticalCallsDialogComponent, {
        width: '900px',
        maxWidth: '95vw',
        direction: 'rtl',
        panelClass: 'custom-dialog-container',
        data: {
          agent: record.agent,
          month: record.month,
          details: details
        }
      });

    } catch (e) {
      console.error(e);
      this.toast.error({ detail: "خطا", summary: "در دریافت جزئیات مشکلی پیش آمد" });
    }
  }
}