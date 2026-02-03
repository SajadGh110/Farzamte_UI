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
import { HasPermissionDirective } from '../../../../directives/has-permission.directive';
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-outcall-general',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEchartsDirective,
    MatProgressSpinnerModule,
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
    HasPermissionDirective
  ],
  templateUrl: './outcall-general.html',
  styleUrl: './outcall-general.scss'
})
export class OutcallGeneral implements OnInit {
  dateform!: FormGroup;
  loading: boolean = false;
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
      textStyle: { fontFamily: 'Vazirmatn', fontSize: 18 }
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
    tooltip: { trigger: 'axis', textStyle: { fontFamily: 'Vazirmatn' } },
    xAxis: { type: 'category', data: [], axisLabel: { rotate: 45 } },
    yAxis: { type: 'value' },
    series: [{
      data: [],
      type: 'line',
      smooth: true,
      color: '#3b82f6',
      areaStyle: { opacity: 0.1 },
      symbolSize: 8
    }]
  };

  constructor(
    private fb: FormBuilder,
    private outcallService: OutcallService,
    private timeService: TimeService,
    private toast: NgToastService,
    protected auth: AuthService
  ) {
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
  }

  async ngOnInit() {
    if (!this.auth.hasPermission('outCallT1.view')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    await this.initData();
  }

  async initData() {
    this.loading = true;
    try {
      // ۱. دریافت آخرین تاریخ ثبت شده
      const resDate = await this.outcallService.get_LastDate_G().toPromise();
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
      const dailyRes = await this.outcallService.get_TotalCountDay_G(st, en).toPromise();
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
      this.subjectsCount = await this.outcallService.get_SubjectsCount_G(st, en).toPromise();
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
}
