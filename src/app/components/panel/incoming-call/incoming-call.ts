import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { IncExpertModel } from "../../../models/inc-expert.model";
import { MatDialog } from '@angular/material/dialog';
import { IncomingCallDialog} from "./incoming-call-dialog/incoming-call-dialog";

@Component({
  selector: 'app-incoming-call',
  standalone: true,
  imports: [
    CommonModule, DashboardSidebarComponent, DashboardTopmenuComponent,
    FormsModule, ReactiveFormsModule, MatProgressSpinnerModule,
    NgxEchartsDirective, MatSelectModule, MatButtonModule,
    MatSlideToggleModule, MatTableModule, MatPaginatorModule
  ],
  providers: [DatePipe],
  templateUrl: './incoming-call.html',
  styleUrl: './incoming-call.scss'
})
export class IncomingCall implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('Quick, Target_Totals') sections!: QueryList<ElementRef>;

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
  protected flag_popup = false;
  protected flag_loading = false;
  protected flag_experts = false;

  dataSource_experts = new MatTableDataSource<IncExpertModel>();
  displayedColumns: string[] = ['readableFullName', 'unit', 'branch'];
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
    if (!this.auth.hasPermission('incomingCall.view')) return;
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

  ngAfterViewInit() {
    this.dataSource_experts.paginator = this.paginator;
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
    const isFiltered = this.f['flag_filter_type'].value || this.f['flag_filter_unit'].value || this.f['flag_filter_branch'].value;

    this.flag_count = this.flag_Ph_Reasons_Totals = this.flag_experts = false;

    try {
      let resCount, resReasons, resExperts;

      if (!isFiltered) {
        [resCount, resReasons, resExperts] = await Promise.all([
          this.getData.get_CountDay(this.StartDate, this.EndDate).toPromise(),
          this.getData.get_PhonecallReasons(this.StartDate, this.EndDate).toPromise(),
          this.getData.get_FilteredExpertsDetails(this.StartDate, this.EndDate, 'همه واحد ها', 'همه', 'همه شعب').toPromise()
        ]);
      } else {
        [resCount, resReasons, resExperts] = await Promise.all([
          this.getData.get_CountDay_F(this.StartDate, this.EndDate, this.selectedUnit, this.selectedType, this.selectedBranch).toPromise(),
          this.getData.get_PhonecallReasons_F(this.StartDate, this.EndDate, this.selectedUnit, this.selectedType, this.selectedBranch).toPromise(),
          this.getData.get_FilteredExpertsDetails(this.StartDate, this.EndDate, this.selectedUnit, this.selectedType, this.selectedBranch).toPromise()
        ]);
      }

      this.updateCountChart(resCount);
      this.updateReasonsTreemap(resReasons);
      this.dataSource_experts.data = resExperts;

      if (resReasons.length > 0) {
        await this.loadReasonDetails(resReasons[0].reason);
      } else {
        this.flag_Reason_Detail_Totals = false;
      }

      this.flag_count = this.flag_Ph_Reasons_Totals = this.flag_experts = true;
    } catch (err) {
      this.toast.error({ detail: "خطا", summary: "خطا در دریافت اطلاعات" });
    }
  }

  async loadReasonDetails(reason: string) {
    this.flag_Reason_Detail_Totals = false;
    (this.series_Reason_Detail_bar_Totals.series as any)[0].data = [];

    const unit = this.f['flag_filter_unit'].value ? this.selectedUnit : 'همه واحد ها';
    const type = this.f['flag_filter_type'].value ? this.selectedType : 'همه';
    const branch = this.f['flag_filter_branch'].value ? this.selectedBranch : 'همه شعب';

    try {
      const res = await this.getData.get_ReasonDetail_F(this.StartDate, this.EndDate, reason, unit, type, branch).toPromise();
      this.reason_selected_Totals = reason;

      const labels = res?.map((item: any) => item.reasonDetail) || [];
      const values = res?.map((item: any) => item.count) || [];

      this.series_Reason_Detail_bar_Totals = {
        ...this.series_Reason_Detail_bar_Totals,
        yAxis: {
          ...(this.series_Reason_Detail_bar_Totals.yAxis as any),
          data: labels
        },
        series: [
          {
            ...(this.series_Reason_Detail_bar_Totals.series as any)[0],
            data: values
          }
        ]
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
    const unit = this.f['flag_filter_unit'].value ? this.selectedUnit : 'همه واحد ها';
    const type = this.f['flag_filter_type'].value ? this.selectedType : 'همه';
    const branch = this.f['flag_filter_branch'].value ? this.selectedBranch : 'همه شعب';

    const res = await this.getData.get_Description(this.StartDate, this.EndDate, event.name, unit, type, branch).toPromise();
    this.flag_loading = false;

    if (res && res.length > 0) {
      this.flag_popup = true;
      this.dialog.open(IncomingCallDialog,{
        width: '900px',
        data: {
          title: event.name,
          details: res
        }
      });
    } else {
      this.toast.info({ detail: "اطلاع", summary: "توضیحاتی برای این مورد ثبت نشده است" });
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
}
