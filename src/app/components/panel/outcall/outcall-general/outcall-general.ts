import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { OutcallService } from "../../../../services/outcall.service";
import { TimeService } from "../../../../services/time.service";
import { NgToastService } from "ng-angular-popup";
import { EChartsOption } from "echarts";
import { format, subDays } from "date-fns";
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { NgxEchartsDirective } from "ngx-echarts";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DashboardSidebarComponent } from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { DashboardTopmenuComponent } from "../../../Template/dashboard-topmenu/dashboard-topmenu.component";
import { HasPermissionDirective } from '../../../../directives/has-permission.directive';
import { AuthService } from "../../../../services/auth.service";
import { MatDialog } from '@angular/material/dialog';
import { OutCallDialog } from "./out-call-dialog/out-call-dialog";

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
  popup: boolean = false;
  StartDate: string = "";
  EndDate: string = "";
  st_to_en: string = "";

  // دیتای باکس‌های موضوعات
  subjectsCount: any[] = [];
  totalCalls: number = 0;
  statusCounts: any[] = [];
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

  analysisChartOption: EChartsOption = {};

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
    if (!this.auth.hasPermission('outCallT1.view')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    await this.initData();
  }

  async initData() {
    this.loading = true;
    try {
      const resDate = await this.outcallService.get_LastDate_G().toPromise();
      this.EndDate = resDate.lastDate;

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

      this.subjectsCount = await this.outcallService.get_SubjectsCount_G(st, en).toPromise();
      this.subjectsCount.forEach(s => this.totalCalls += s.count);
      this.statusCounts = await this.outcallService.get_StatusCount_G(st, en).toPromise();
      this.st_to_en = `${st} to ${en}`;
      const analysisRes = await this.outcallService.get_TitlesAnalysis(st, en).toPromise();
      this.updateAnalysisChart(analysisRes);
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
      const res = await this.outcallService.get_Description_G(this.StartDate, this.EndDate, item).toPromise();
      this.popup = true;

      if (res && res.length > 0) {
        this.dialog.open(OutCallDialog, {
          width: '80vw',
          maxWidth: '95vw',
          maxHeight: '90vh',
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

  updateAnalysisChart(data: any[]) {
    const titles = data.map((x: any) => x.title || 'بدون عنوان');

    const positive = data.map((x: any) => x.positivePercentage);
    const negative = data.map((x: any) => x.negativePercentage);
    const neutral = data.map((x: any) => x.neutralPercentage);

    this.analysisChartOption = {
      title: {
        text: 'تحلیل بازخورد موضوعات (درصد)',
        left: 'center',
        textStyle: { fontFamily: 'Vazirmatn', fontSize: 14 }
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: { fontFamily: 'Vazirmatn', color: '#000' },
        formatter: (params: any) => {
          let res = `<div style="direction: rtl; text-align: right;"><b>${params[0].name}</b><br/>`;
          params.forEach((item: any) => {
            res += `${item.marker} ${item.seriesName}: <b>%${item.value}</b><br/>`;
          });
          return res + `</div>`;
        }
      },
      legend: {
        data: ['مثبت', 'خنثی', 'منفی'],
        bottom: 0,
        textStyle: { fontFamily: 'Vazirmatn' }
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '12%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: { formatter: '{value}%', fontFamily: 'Vazirmatn' }
      },
      yAxis: {
        type: 'category',
        data: titles,
        axisLabel: {
          fontFamily: 'Vazirmatn',
          fontSize: 12,
          width: 120,
          overflow: 'break'
        }
      },
      series: [
        {
          name: 'مثبت',
          type: 'bar',
          stack: 'total',
          color: '#10b981',
          label: { show: true, formatter: '{c}%', fontSize: 12 },
          data: positive
        },
        {
          name: 'خنثی',
          type: 'bar',
          stack: 'total',
          color: '#f59e0b',
          label: { show: true, formatter: '{c}%', fontSize: 12 },
          data: neutral
        },
        {
          name: 'منفی',
          type: 'bar',
          stack: 'total',
          color: '#ef4444',
          label: { show: true, formatter: '{c}%', fontSize: 12 },
          data: negative
        }
      ]
    };
  }

  getStatusDetails(status: string) {
    const st = (status || 'null').toLowerCase().trim();
    switch (st) {
      case 'made':
        return { label: 'موفق', colorClass: 'status-made' };
      case 'unresponsive':
        return { label: 'عدم پاسخگویی', colorClass: 'status-unresponsive' };
      case 'open':
        return { label: 'در جریان (باز)', colorClass: 'status-open' };
      case 'canceled':
        return { label: 'لغو شده', colorClass: 'status-canceled' };
      case 'disinclination':
        return { label: 'عدم تمایل', colorClass: 'status-disinclination' };
      case 'null':
      default:
        return { label: 'نامشخص', colorClass: 'status-unknown' };
    }
  }
}
