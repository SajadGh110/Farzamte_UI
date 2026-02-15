import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { OutcallService } from "../../../../services/outcall.service";
import { TimeService } from "../../../../services/time.service";
import { NgToastService } from "ng-angular-popup";
import { EChartsOption } from "echarts";
import { format, subDays } from "date-fns";
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from "ngx-echarts";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DashboardSidebarComponent } from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { DashboardTopmenuComponent } from "../../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {AuthService} from "../../../../services/auth.service";
import * as echarts from "echarts";
import { MatDialog } from '@angular/material/dialog';
import {OutCallDialog} from "../out-call-dialog/out-call-dialog";

@Component({
  selector: 'app-outcall-follow-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEchartsDirective,
    MatProgressSpinnerModule,
    DashboardSidebarComponent,
    DashboardTopmenuComponent
  ],
  templateUrl: './outcall-follow-up.html',
  styleUrl: './outcall-follow-up.scss'
})
export class OutcallFollowUp implements OnInit {
  dateform!: FormGroup;
  loading: boolean = false;
  popup: boolean = false;
  StartDate: string = "";
  EndDate: string = "";
  st_to_en: string = "";

  // دیتای باکس‌های موضوعات
  subjectsCount: any[] = [];
  totalCalls: number = 0;

  // تنظیمات نمودار خطی (تعداد تماس روزانه)
  chartOption: EChartsOption = {
    title: {
      text: 'روند تماس‌های ثبت شده',
      left: 'center',
      textStyle: {
        fontFamily: 'Vazirmatn',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    grid: {
      left: '3%',
      right: '6%',
      bottom: '15%',
      top: '15%',
      containLabel: true
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
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderWidth: 1,
      borderColor: '#3b82f6',
      textStyle: { fontFamily: 'Vazirmatn', color: '#000' },
      formatter: (params: any) => {
        return `<div style="direction: rtl; text-align: right;">
                <span style="color: #666;">تاریخ:</span> <b>${params[0].name}</b><br/>
                <span style="color: #3b82f6;">●</span> تعداد تماس: <b>${params[0].value}</b>
              </div>`;
      }
    },
    xAxis: {
      type: 'category',
      data: [],
      boundaryGap: true,
      axisLabel: {
        rotate: 45,
        fontFamily: 'Vazirmatn',
        fontSize: 11,
        interval: 0
      },
      axisLine: { lineStyle: { color: '#ccc' } }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.4
        }
      }
    },
    series: [{
      data: [],
      type: 'line',
      smooth: true,
      color: '#3b82f6',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
          { offset: 1, color: 'rgba(59, 130, 246, 0)' }
        ])
      },
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: {
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 5
      }
    }]
  };

  constructor(
    private fb: FormBuilder,
    private outcallService: OutcallService,
    private timeService: TimeService,
    private toast: NgToastService,
    protected auth: AuthService,
    private dialog: MatDialog
  ) {
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
  }

  async ngOnInit() {
    if (!this.auth.hasPermission('outCallT2.view')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    await this.initData();
  }

  async initData() {
    this.loading = true;
    try {
      // ۱. دریافت آخرین تاریخ ثبت شده
      const resDate = await this.outcallService.get_LastDate_F().toPromise();
      this.EndDate = resDate.lastDate; // خروجی استرینگ yyyy-MM-dd

      // ۲. تنظیم ۳۰ روز قبل به عنوان شروع
      this.StartDate = format(subDays(new Date(this.EndDate), 30), 'yyyy-MM-dd');

      this.dateform.patchValue({
        StartDate: this.StartDate,
        EndDate: this.EndDate
      });

      await this.fetchStats(this.StartDate, this.EndDate);
    } catch (error: any) {
      this.toast.error({ detail: "خطا", summary: "عدم توانایی در دریافت تاریخ اولیه" });
    } finally {
      this.loading = false;
    }
  }

  async fetchStats(st: string, en: string) {
    this.loading = true;
    this.totalCalls = 0;
    try {
      const dailyRes = await this.outcallService.get_TotalCountDay_F(st, en).toPromise();
      const dates = dailyRes.map((x: any) => x.date);
      const counts = dailyRes.map((x: any) => x.count);

      // استفاده از کپی عمیق ساده برای دور زدن تمام محدودیت‌های تایپ
      this.chartOption = {
        ...this.chartOption,
        xAxis: {
          ...(this.chartOption.xAxis as any),
          data: dates
        },
        series: [
          {
            ...(this.chartOption.series as any)[0],
            data: counts
          }
        ]
      };

      // دریافت آمار موضوعات
      this.subjectsCount = await this.outcallService.get_SubjectsCount_F(st, en).toPromise();
      this.subjectsCount.forEach(s => this.totalCalls += s.count);

      this.st_to_en = `${st} to ${en}`;
    } catch (error: any) {
      this.toast.error({ detail: "خطا", summary: "خطا در بارگذاری اطلاعات" });
    } finally {
      this.loading = false;
    }
  }

  async onUpdateDate() {
    const st = this.dateform.value.StartDate;
    const en = this.dateform.value.EndDate;
    await this.fetchStats(st, en);
  }

  async Popup(item: string){
    this.popup = false;
    try {
      const res = await this.outcallService.get_Description_F(this.StartDate, this.EndDate, item).toPromise();
      this.popup = true;

      if (res && res.length > 0) {
        this.dialog.open(OutCallDialog, {
          width: '1000px',
          data: { title: item, details: res }
        });
      } else {
        this.toast.info({ detail: "اطلاع", summary: "توضیحاتی برای این مورد یافت نشد" });
      }
    }
    catch (error: any) {
      this.toast.error({ detail: "خطا", summary: "خطا در ارتباط با سرور" });
    }
  }
}
