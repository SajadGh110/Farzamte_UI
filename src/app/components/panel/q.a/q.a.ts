import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardSidebarComponent } from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { NgToastService } from "ng-angular-popup";
import { AuthService } from "../../../services/auth.service";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CommonModule } from "@angular/common";
import { QaService } from "../../../services/qa.service";
import { MatTableModule } from '@angular/material/table';
import { EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CriticalCallsDialogComponent } from './critical-calls-dialog/critical-calls-dialog.component';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import * as XLSX from 'xlsx';

interface GroupedAgentData {
  agent: string;
  records: any[];
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-q.a',
  standalone: true,
  imports: [
    CommonModule,
    DashboardSidebarComponent,
    MatProgressSpinner,
    FormsModule,
    MatTableModule,
    NgxEchartsDirective,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    DashboardTopmenuComponent,
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './q.a.html',
  styleUrl: './q.a.scss'
})
export class QA implements OnInit {
  protected flag_acu: boolean = false;
  protected flag_avm: boolean = false;
  protected flag_loading_data: boolean = false;
  protected show_report: boolean = false;

  protected qaPermissions:string[] = [
    'qa.crm.view',
    'qa.etebar.view',
    'qa.online.view',
    'qa.paziresh.view',
    'qa.qa.view',
    'qa.toseebazar.view'
  ];

  unit_list: any = [];
  month_list: { value: string, selected: boolean }[] = [];
  portType_list: any = [];
  selected_unit_list: string[] = [];
  selected_unit: string = "";

  groupedDataSource: GroupedAgentData[] = [];
  barCharts: { [portType: string]: EChartsOption } = {};

  chartHeights: { [portType: string]: string } = {};
  protected searchTerm: string = '';
  protected sortColumn: string = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  public constructor(private toast: NgToastService, protected auth: AuthService, private getData: QaService, private dialog: MatDialog) {}

  async ngOnInit() {
    if (!this.auth.hasAnyPermission(this.qaPermissions)) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    await this.get_units();
    if (this.unit_list.length == 0) {
      this.toast.warning({ detail: "سطح دسترسی!", summary: "متاسفانه شما به این بخش دسترسی ندارید!", duration: 5000, position: 'topRight' });
    } else {
      this.selected_unit = this.unit_list[0];
      this.selected_unit_list = [this.selected_unit];
      this.flag_acu = true;
      await this.get_dates(this.selected_unit);
    }
  }

  async get_units() {
    const res = await this.getData.GetAccessibleUnits().toPromise();
    this.unit_list = res.map((unit: string) =>
      unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase()
    );
  }

  async get_dates(unit: string) {
    this.flag_avm = false;
    try {
      const months = await this.getData.GetAvailableMonths(unit).toPromise();
      if (!months || months.length === 0) {
        this.month_list = [];
        this.toast.info({detail: "عدم وجود داده", summary: `در حال حاضر هیچ گزارش ماهانه‌ای برای تیم ${unit} ثبت نشده است.`, duration: 5000});
        return;
      }
      this.month_list = months.map((m: string) => ({ value: m, selected: false }));
      if (this.month_list.length > 0) this.month_list[0].selected = true;
      this.flag_avm = true;

    } catch (error) {
      this.toast.error({detail: "خطا در سیستم", summary: "مشکلی در دریافت تاریخ‌های گزارش به وجود آمد.", duration: 4000});
    }
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
              return record ? record.averageScore : undefined;
            });
          chartDataSeries.push({
            name: month,
            type: 'bar',
            data: seriesData,
            barGap: '0%',
            barCategoryGap: '20%',
            large: true,
            label: {show: true, position: 'right', formatter: '{c}%', fontFamily: 'Inter', fontWeight: 'bold', fontSize: 11, color: '#444'},
            itemStyle: {borderRadius: [0, 6, 6, 0], shadowBlur: 3, shadowColor: 'rgba(0,0,0,0.1)'},
            barWidth: 12,
            emphasis: {
              focus: 'series',
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.2)'
              }
            }
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

      this.groupedDataSource = Array.from(groupedMap, ([agent, records]) => ({
        agent,
        records: records.sort((a, b) => a.month.localeCompare(b.month))
      }));
      this.show_report = true;
    } catch (e) {
      console.error(e);
      this.toast.error({ detail: "خطا", summary: "در دریافت اطلاعات مشکلی پیش آمد" });
    } finally {
      this.flag_loading_data = false;
    }
  }

  createChart(portType: string, agents: string[], series: any[]) {
    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

    this.barCharts[portType] = {
      color: colors,
      title: {
        text: `تحلیل عملکرد - ${portType}`,
        left: 'center',
        top: 5,
        textStyle: {
          fontFamily: 'Vazirmatn',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1e293b'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        textStyle: { fontFamily: 'Vazirmatn', color: '#333' },
        formatter: (params: any) => {
          let res = `<div style="direction: rtl; text-align: right; font-family: Vazirmatn;">
            <b style="color: #1e40af;">${params[0].name}</b><br/>`;
          params.forEach((item: any) => {
            if (item.value !== undefined && item.value !== null) {
              res += `${item.marker} ${item.seriesName}: <b style="font-family: Inter;">${item.value}%</b><br/>`;
            }
          });
          res += `</div>`;
          return res;
        }
      },
      legend: {
        data: series.map(s => s.name),
        top: 40,
        itemGap: 20,
        textStyle: { fontFamily: 'Vazirmatn', fontSize: 12, color: '#64748b' }
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '5%',
        top: '90',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        max: 100,
        splitLine: {
          lineStyle: { type: 'dashed', color: '#e2e8f0' }
        },
        axisLabel: {
          fontFamily: 'Inter',
          fontWeight: 'bold',
          color: '#94a3b8',
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'category',
        data: agents,
        axisLine: { show: false },
        axisTick: { alignWithLabel: true },
        axisLabel: {
          fontFamily: 'Vazirmatn',
          fontWeight: 'bold',
          fontSize: 12,
          color: '#334155',
          margin: 15
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

  getScoreClass(score: number) {
    if (score >= 90) return 'high-score';
    if (score >= 80) return 'medium-score';
    return 'low-score';
  }

  onUnitChange(event: any) {
    this.selected_unit = event.options[0].value;
    this.get_dates(this.selected_unit);
  }

  get tableTotals(): any {
    let totals = {
      totalCalls: 0,
      faultyCalls: 0,
      criticalErrors: 0,
      totalScoreSum: 0,
      i1: 0, i2: 0, i3: 0, i4: 0, i5: 0, i6: 0, i7: 0, i8: 0,
      recordCount: 0,
      finalAvg: 0
    };

    // تغییر اصلی اینجاست: استفاده از filteredGroups بجای groupedDataSource
    const source = this.filteredGroups;

    if (!source || source.length === 0) return totals;

    source.forEach(group => {
      group.records.forEach(record => {
        totals.totalCalls += (record.totalCalls || 0);
        totals.faultyCalls += (record.faultyCalls || 0);
        totals.criticalErrors += (record.criticalErrors || 0);
        totals.totalScoreSum += (record.averageScore || 0);

        if (record.scores) {
          totals.i1 += (record.scores.i1 || 0);
          totals.i2 += (record.scores.i2 || 0);
          totals.i3 += (record.scores.i3 || 0);
          totals.i4 += (record.scores.i4 || 0);
          totals.i5 += (record.scores.i5 || 0);
          totals.i6 += (record.scores.i6 || 0);
          totals.i7 += (record.scores.i7 || 0);
          totals.i8 += (record.scores.i8 || 0);
        }
        totals.recordCount++;
      });
    });

    if (totals.recordCount > 0) {
      totals.finalAvg = Math.round(totals.totalScoreSum / totals.recordCount);
    }

    return totals;
  }

  exportToExcel() {
    const dataToExport = [];

    const currentData = this.filteredGroups;

    if (currentData.length === 0) {
      this.toast.warning({ detail: "هشدار", summary: "داده‌ای برای خروجی گرفتن وجود ندارد" });
      return;
    }

    // ۱. اضافه کردن دیتای بدنه جدول
    currentData.forEach((group, index) => {
      group.records.forEach(record => {
        dataToExport.push({
          'ردیف': index + 1,
          'نام کارشناس': group.agent,
          'ماه': record.month,
          'نوع پورت': record.portType,
          'تعداد تماس': record.totalCalls,
          'خطای بحرانی': record.faultyCalls,
          'خطای سیستمی': record.criticalErrors,
          'امتیاز نهایی': record.averageScore + '%',
          'i1': record.scores.i1, 'i2': record.scores.i2,
          'i3': record.scores.i3, 'i4': record.scores.i4,
          'i5': record.scores.i5, 'i6': record.scores.i6,
          'i7': record.scores.i7, 'i8': record.scores.i8,
        });
      });
    });

    // ۲. اضافه کردن سطر مجموع در انتهای آرایه
    const totals = this.tableTotals; // استفاده از همان گتر که قبلاً نوشتیم
    dataToExport.push({
      'ردیف': 'مجموع کل',
      'نام کارشناس': '---',
      'ماه': '---',
      'نوع پورت': '---',
      'تعداد تماس': totals.totalCalls,
      'خطای بحرانی': totals.faultyCalls,
      'خطای سیستمی': totals.criticalErrors,
      'امتیاز نهایی': totals.finalAvg + '%',
      'i1': totals.i1, 'i2': totals.i2,
      'i3': totals.i3, 'i4': totals.i4,
      'i5': totals.i5, 'i6': totals.i6,
      'i7': totals.i7, 'i8': totals.i8,
    });

    // ۳. ساخت و دانلود فایل
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'گزارش QA');

    XLSX.writeFile(wb, `QA_Report_${this.selected_unit}.xlsx`);
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.groupedDataSource.sort((a, b) => {
      let res = 0;

      // ۱. استخراج مقدار برای مقایسه
      const getVal = (item: GroupedAgentData) => {
        if (column === 'agent') return item.agent;

        // برای ستون‌های عددی (Calls, Faulty, i1-i8, Score)
        // از مجموع مقادیر ردیف‌های آن کارشناس استفاده می‌کنیم
        if (column.startsWith('i')) { // برای i1 تا i8
          return item.records.reduce((sum, r) => sum + (r.scores?.[column] || 0), 0);
        }

        if (column === 'averageScore') {
          // برای Score میانگین کل ردیف‌های گروه را می‌گیریم
          return item.records.reduce((sum, r) => sum + (r.averageScore || 0), 0) / item.records.length;
        }

        // برای سایر ستون‌ها مثل totalCalls, faultyCalls, criticalErrors
        return item.records.reduce((sum, r) => sum + (r[column] || 0), 0);
      };

      const valA = getVal(a);
      const valB = getVal(b);

      // ۲. مقایسه مقادیر
      if (valA < valB) res = -1;
      else if (valA > valB) res = 1;

      return this.sortDirection === 'asc' ? res : -res;
    });
  }

  get filteredGroups() {
    if (!this.searchTerm.trim()) return this.groupedDataSource;

    const term = this.searchTerm.toLowerCase().trim();
    return this.groupedDataSource.filter(group =>
      group.agent.toLowerCase().includes(term) ||
      group.records.some(r => r.portType.toLowerCase().includes(term))
    );
  }
}
