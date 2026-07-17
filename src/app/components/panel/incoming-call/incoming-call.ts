import { Component, OnInit } from '@angular/core';
import { DashboardSidebarComponent } from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { DashboardTopmenuComponent } from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule, DatePipe } from '@angular/common';
import { NgxEchartsDirective } from "ngx-echarts";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgToastService } from "ng-angular-popup";
import { TimeService } from "../../../services/time.service";
import * as echarts from 'echarts';
import { EChartsOption } from "echarts";
import { IncomingCallService } from "../../../services/incoming-call.service";
import { AuthService } from "../../../services/auth.service";
import { format, subDays } from "date-fns";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDialog } from '@angular/material/dialog';
import { IncomingCallDialog} from "./incoming-call-dialog/incoming-call-dialog";
import {MatIcon} from "@angular/material/icon";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-incoming-call',
  standalone: true,
  imports: [
    CommonModule, DashboardSidebarComponent, DashboardTopmenuComponent,
    FormsModule, ReactiveFormsModule, MatProgressSpinnerModule,
    NgxEchartsDirective, MatSelectModule, MatButtonModule,
    MatSlideToggleModule, MatIcon
  ],
  providers: [DatePipe],
  templateUrl: './incoming-call.html',
  styleUrl: './incoming-call.scss'
})
export class IncomingCall implements OnInit {
  protected INCPermissions:string[] = [
    'incomingCall.crm.view',
    'incomingCall.etebar.view',
    'incomingCall.online.view',
    'incomingCall.paziresh.view',
    'incomingCall.qa.view',
    'incomingCall.toseebazar.view'
  ];
  dateform!: FormGroup;
  filterForm!: FormGroup;

  Units: string[] = [];
  Types: string[] = ['همه', 'تجمیع', 'مشتریان', 'سایرین'];
  Branchs: string[] = [];

  selectedUnit: string = '';
  selectedType: string = 'همه';
  selectedBranch: string = '';

  protected flag_time = false;
  protected flag_filter = false;
  protected flag_count = false;
  protected flag_Ph_Reasons_Totals = false;
  protected flag_Reason_Detail_Totals = false;
  protected flag_loading = false;
  protected flag_experts = false;

  protected searchTerm: string = '';
  protected sortColumn: string = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  dataSource_experts:any[] = [];
  StartDate = "";
  EndDate = "";
  selected_days = 0;
  reason_selected_Totals = "";

  // متغیر استایل سراسری برای عناوین چارت‌ها
  readonly TitleTextStyle = {
    fontFamily: 'Nazanin',
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#3b82f6'
  };

  series_calls_count_day: EChartsOption = {};
  series_Phonecall_Reasons_tmp_Totals: EChartsOption = {};
  series_Reason_Detail_bar_Totals: EChartsOption = {};

  constructor(
    private toast: NgToastService,
    public auth: AuthService,
    private fb: FormBuilder,
    private getData: IncomingCallService,
    private timeService: TimeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (!this.auth.hasAnyPermission(this.INCPermissions)) return;
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
    this.filterForm = this.fb.group({
      flag_filter_type: [false],
      flag_filter_unit: [false],
      flag_filter_branch: [false]
    });
    this.initCharts();
    this.SetTime(30);
  }

  get f() { return this.filterForm.controls; }

  async SetTime(days: number) {
    try {
      const res = await this.getData.get_LastDate().toPromise();
      this.EndDate = res.endDate;
      this.StartDate = format(subDays(new Date(this.EndDate), days), 'yyyy-MM-dd');
      this.updateDateAndFetch();
    } catch (e) {
      this.toast.error({ detail: "خطا", summary: "خطا در دریافت آخرین تاریخ" });
    }
  }

  async OnUpdateDate() {
    this.StartDate = this.dateform.value.StartDate;
    this.EndDate = this.dateform.value.EndDate;
    this.updateDateAndFetch();
  }

  private async updateDateAndFetch() {
    this.selected_days = this.timeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.patchValue({ StartDate: this.StartDate, EndDate: this.EndDate });
    this.flag_time = true;

    await this.fetchFilterOptions();
    this.executeSearch();
  }

  async fetchFilterOptions() {
    this.flag_filter = false;
    const [units, branches] = await Promise.all([
      this.getData.get_AllUnits(this.StartDate, this.EndDate).toPromise(),
      this.getData.get_AllBranches(this.StartDate, this.EndDate).toPromise()
    ]);
    this.Units = units;
    this.Branchs = branches;
    this.selectedUnit = this.Units[0] || '';
    this.selectedBranch = this.Branchs[0] || '';
    this.flag_filter = true;
  }

  async executeSearch() {
    this.flag_count = this.flag_Ph_Reasons_Totals = this.flag_experts = false;

    const unitParam = this.selectedUnit || 'همه واحد ها';
    const typeParam = this.f['flag_filter_type'].value ? this.selectedType : 'همه';
    const branchParam = this.f['flag_filter_branch'].value ? this.selectedBranch : 'همه شعب';

    try {
      const [resCount, resReasons, resExperts] = await Promise.all([
        this.getData.get_CountDay(this.StartDate, this.EndDate, unitParam, typeParam, branchParam).toPromise(),
        this.getData.get_PhonecallReasons(this.StartDate, this.EndDate, unitParam, typeParam, branchParam).toPromise(),
        this.getData.get_FilteredExpertsDetails(this.StartDate, this.EndDate, unitParam, typeParam, branchParam).toPromise()
        ]);

      this.updateCountChart(resCount);
      this.updateReasonsTreemap(resReasons);
      this.dataSource_experts = resExperts;

      if (resReasons && resReasons.length > 0) {
        await this.loadReasonDetails(resReasons[0].reason);
      } else {
        this.flag_Reason_Detail_Totals = false;
      }

      this.flag_count = this.flag_Ph_Reasons_Totals = this.flag_experts = true;
    } catch (err) {
      this.toast.error({ detail: "خطا", summary: "خطا در دریافت اطلاعات از سرور" });
    }
  }

  async loadReasonDetails(reason: string) {
    this.flag_Reason_Detail_Totals = false;
    this.reason_selected_Totals = reason;

    const unitParam = this.selectedUnit || 'همه واحد ها';
    const typeParam = this.f['flag_filter_type'].value ? this.selectedType : 'همه';
    const branchParam = this.f['flag_filter_branch'].value ? this.selectedBranch : 'همه شعب';

    try {
      const res = await this.getData.get_ReasonDetail(this.StartDate, this.EndDate, reason, unitParam, typeParam, branchParam).toPromise();
      const labels = res?.map((item: any) => item.reasonDetail) || [];
      const values = res?.map((item: any) => item.count) || [];

      this.series_Reason_Detail_bar_Totals = {
        ...this.series_Reason_Detail_bar_Totals,
        yAxis: { ...(this.series_Reason_Detail_bar_Totals.yAxis as any), data: labels },
        series: [{ ...(this.series_Reason_Detail_bar_Totals.series as any)[0], data: values }]
      };
      this.flag_Reason_Detail_Totals = true;
    } catch (error) {
      this.flag_Reason_Detail_Totals = false;
      this.toast.error({ detail: "خطا", summary: "دیتایی یافت نشد" });
    }
  }

  private updateCountChart(data: any[]) {
    const dates = data.map(d => d.date);
    const counts = data.map(d => d.count);

    this.series_calls_count_day = {
      ...this.series_calls_count_day,
      xAxis: {
        ...(this.series_calls_count_day.xAxis as any),
        data: dates
      },
      series: [
        {
          ...(this.series_calls_count_day.series as any)[0],
          data: counts
        }
      ]
    };
  }

  private updateReasonsTreemap(data: any[]) {
    const chartData = data.map(item => ({ name: item.reason, value: item.count }));
    this.series_Phonecall_Reasons_tmp_Totals = {
      ...this.series_Phonecall_Reasons_tmp_Totals,
      series: [{ ... (this.series_Phonecall_Reasons_tmp_Totals.series as any)[0], data: chartData }]
    };
  }

  async chart_click_Totals(event: any) {
    if (event.name) {
      await this.loadReasonDetails(event.name);
      this.scrollTo('Target_Totals');
    }
  }

  async Popup_List_Totals(event: any) {
    this.flag_loading = true;
    const unitParam = this.selectedUnit || 'همه واحد ها';
    const typeParam = this.f['flag_filter_type'].value ? this.selectedType : 'همه';
    const branchParam = this.f['flag_filter_branch'].value ? this.selectedBranch : 'همه شعب';
    try {
      const res = await this.getData.get_Description(this.StartDate, this.EndDate, event.name, unitParam, typeParam, branchParam).toPromise();
      this.flag_loading = false;

      if (res && res.length > 0) {
        this.dialog.open(IncomingCallDialog, {
          width: '950px',
          data: { title: event.name, details: res }
        });
      } else {
        this.toast.info({ detail: "اطلاع", summary: "توضیحاتی برای این مورد یافت نشد" });
      }
    } catch (e) {
      this.flag_loading = false;
      this.toast.error({ detail: "خطا", summary: "خطا در ارتباط با سرور" });
    }
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  private initCharts() {
    this.series_calls_count_day = {
      title: {
        text: 'روند تماس‌های ثبت شده',
        left: 'center',
        textStyle: { fontFamily: 'Vazirmatn', fontSize: 18 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          return `<div style="font-family: Vazirmatn; direction: rtl; text-align: right;">
                  تاریخ: <b>${params[0].name}</b><br/>
                  تعداد تماس: <b>${params[0].value}</b>
                </div>`;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: { color: '#000' }
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: [],
        axisLabel: {
          rotate: 45,
          fontFamily: 'Vazirmatn',
          fontSize: 11,
          interval: 0
        },
        axisLine: { lineStyle: { color: '#999' } }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', opacity: 0.5 } }
      },
      series: [{
        name: 'تعداد تماس',
        data: [],
        type: 'line',
        smooth: true,
        color: '#3b82f6',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { borderWidth: 2, borderColor: '#fff' }
      }]
    };

    this.series_Phonecall_Reasons_tmp_Totals = {
      tooltip: {trigger: 'item', formatter: '{b}: <b>{c}</b>', backgroundColor: 'rgba(255, 255, 255, 0.9)'},
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [{
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2, gapWidth: 2 },
        color: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#2563eb'],
        label: { show: true, fontFamily: 'Nazanin', fontSize: 14, fontWeight: 'bold' }
      }]
    };

    this.series_Reason_Detail_bar_Totals = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}: <b>{c}</b> مورد'
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: [],
        inverse: true,
        axisLabel: { fontFamily: 'Nazanin', fontWeight: 'bold' }
      },
      series: [{
        type: 'bar',
        barWidth: '45%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#93c5fd' },
            { offset: 1, color: '#3b82f6' }
          ]),
          borderRadius: [0, 10, 10, 0]
        },
        data: []
      }]
    };
  }

  get filteredGroups() {
    if (!this.searchTerm.trim()) return this.dataSource_experts;

    const term = this.searchTerm.toLowerCase().trim();
    return this.dataSource_experts.filter(item =>
      (item.fullName && item.fullName.toLowerCase().includes(term)) ||
      (item.unit && item.unit.toLowerCase().includes(term)) ||
      (item.branch && item.branch.toLowerCase().includes(term))
    );
  }

  exportToExcel() {
    const dataToExport:any[] = [];

    const currentData = this.filteredGroups;

    if (currentData.length === 0) {
      this.toast.warning({ detail: "هشدار", summary: "داده‌ای برای خروجی گرفتن وجود ندارد" });
      return;
    }

    currentData.forEach((group, index) => {
      dataToExport.push({
        'ردیف': index + 1,
        'نام کارشناس': group.fullName,
        'تعداد تماس': group.totalCalls,
        'واحد': group.unit,
        'شعبه': group.branch
      });
    });
    // ۳. ساخت و دانلود فایل
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'گزارش تماس ورودی');

    XLSX.writeFile(wb, `InComingCall_Report_${this.StartDate}-${this.EndDate}.xlsx`);
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.dataSource_experts.sort((a, b) => {
      let valA: any, valB: any;

      if (column === 'fullName') {
        valA = a.fullName?.toLowerCase() || '';
        valB = b.fullName?.toLowerCase() || '';
      } else if (column === 'unit') {
        valA = a.unit?.toLowerCase() || '';
        valB = b.unit?.toLowerCase() || '';
      } else if (column === 'branch') {
        valA = a.branch?.toLowerCase() || '';
        valB = b.branch?.toLowerCase() || '';
      } else if (column === 'totalCalls') {
        valA = a.totalCalls || 0;
        valB = b.totalCalls || 0;
      } else {
        return 0;
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
