import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { IncomingCallService } from '../../../../services/incoming-call.service';
import {EChartsOption} from "echarts";
import * as echarts from "echarts";
import {NgxEchartsDirective} from "ngx-echarts";

export interface DialogData {
  sectionKey: string;
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-view360-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinner,
    NgxEchartsDirective
  ],
  templateUrl: './view360-dialog.html',
  styleUrl: './view360-dialog.scss',
})
export class View360Dialog implements OnInit {
  loading = true;
  protected flag_inc = false;
  sectionTitle = '';
  sectionIcon = '';

  // داده‌های نمایشی
  description = '';
  error = false;

  StartDate = "2026-07-24";
  EndDate = "2026-08-23";
  selected_days = 0;

  series_calls_count_day: EChartsOption = {};

  constructor(
    public dialogRef: MatDialogRef<View360Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private incomingCallService: IncomingCallService,
    // ... سایر سرویس‌ها
    private toast: NgToastService
  ) {
    this.sectionTitle = data.title;
    this.sectionIcon = data.icon;
  }

  async ngOnInit() {
    await this.initCharts();
    await this.loadSectionData();
  }

  private async loadSectionData() {
    this.loading = true;
    this.error = false;

    try {
      switch (this.data.sectionKey) {
        case 'تماس ورودی':
          await this.loadIncomingCallData();
          this.description = 'گزارش‌های کامل تماس‌های ورودی شامل آمار، نمودارها و تحلیل‌های دقیق.';
          break;
        case 'هپی کال':
          await this.loadHappyCallData();
          this.description = 'بررسی میزان رضایت مشتریان از تماس‌های انجام شده.';
          break;
        case 'عمومی':
          await this.loadOutgoingGeneralData();
          this.description = 'گزارش تماس‌های خروجی عمومی با مشتریان.';
          break;
        case 'پیگیری شعب':
          await this.loadOutgoingFollowupData();
          this.description = 'پیگیری و گزارش‌دهی تماس‌های انجام شده با شعب.';
          break;
        case 'گزارش ماهانه':
          await this.loadMonthlyReportData();
          this.description = 'گزارش‌های جامع ماهانه از تمام بخش‌ها.';
          break;
        case 'مارکتینگ':
          await this.loadMarketingData();
          this.description = 'گزارش‌های مربوط به فعالیت‌های بازاریابی.';
          break;
        case 'پیامک':
          await this.loadSmsData();
          this.description = 'گزارش پیامک‌های اطلاع رسانی.';
          break;
        case 'تماس':
          await this.loadNoticeCallData();
          this.description = 'گزارش تماس‌های اطلاع‌رسانی.';
          break;
        case 'تیکت':
          await this.loadTicketData();
          this.description = 'مدیریت و گزارش تیکت‌های ثبت شده.';
          break;
        default:
          this.description = '';
          break;
      }
    } catch (err) {
      this.error = true;
      this.toast.error({
        detail: 'خطا',
        summary: 'دریافت اطلاعات با مشکل مواجه شد.'
      });
    } finally {
      this.loading = false;
    }
  }

  // ============================
  //  هر بخش، متد مخصوص خودش
  // ============================

  private async loadIncomingCallData() {
    this.flag_inc = false;
    const unitParam = 'همه واحد ها';
    const typeParam = 'همه';
    const branchParam = 'همه شعب';

    try {
      const [resCount, resReasons] = await Promise.all([
        this.incomingCallService.get_CountDay(this.StartDate, this.EndDate, unitParam, typeParam, branchParam).toPromise(),
        this.incomingCallService.get_PhonecallReasons(this.StartDate, this.EndDate, unitParam, typeParam, branchParam).toPromise(),
      ]);

      this.updateIncChart(resCount);

      if (resReasons && resReasons.length > 0) {

      } else {

      }

      this.flag_inc = true;
    } catch (err) {
      this.toast.error({ detail: "خطا", summary: "خطا در دریافت اطلاعات از سرور - تماس ورودی" });
    }
  }

  private async loadHappyCallData() {

  }

  private async loadOutgoingGeneralData() {

  }

  private async loadOutgoingFollowupData() {

  }

  private async loadMonthlyReportData() {

  }

  private async loadMarketingData() {

  }

  private async loadSmsData() {

  }

  private async loadNoticeCallData() {

  }

  private async loadTicketData() {

  }

  navigateToRoute(): void {
    this.dialogRef.close();
    if (this.data.route) {
      this.router.navigate([this.data.route]);
    }
  }

  close(): void {
    this.dialogRef.close();
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
  }

  private updateIncChart(data: any[]) {
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
}
