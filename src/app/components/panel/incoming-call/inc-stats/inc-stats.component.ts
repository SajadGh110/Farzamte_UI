import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardSidebarComponent } from '../../../Template/dashboard-sidebar/dashboard-sidebar.component';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IncStatRow } from '../../../../models/inc-stat.model';
import { IncStatService } from '../../../../services/inc-stat.service';
import { NgToastService } from 'ng-angular-popup';
import { IncStatsChartComponent } from './inc-stats-chart/inc-stats-chart.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {DashboardTopmenuComponent} from "../../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {IncStatsTable} from "./inc-stats-table/inc-stats-table";

@Component({
  selector: 'app-inc-stats',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    NgIf,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    IncStatsChartComponent,
    MatProgressSpinner,
    ReactiveFormsModule,
    DashboardTopmenuComponent,
    IncStatsTable,
  ],
  templateUrl: './inc-stats.component.html',
  styleUrls: ['./inc-stats.component.scss']
})
export class IncStatsComponent implements OnInit {
  // پرچم‌های وضعیت
  protected flag_data: boolean = false;
  protected flag_loading: boolean = false;

  // داده‌های نمودار
  chartData: { type: string; date: string; answered: number }[] = [];

  // تمام داده‌های خام (ذخیره برای فیلتر)
  allData: IncStatRow[] = [];

  // لیست انواع صف‌ها
  types: string[] = [];

  // نوع انتخاب‌شده فعلی
  selectedType: string = '';

  // ستون‌های نمایش داده‌شده در جدول
  displayedColumns: string[] = ['type', 'date', 'answered', 'avgWait', 'avgTalk'];

  // DataSource جدول
  dataSource = new MatTableDataSource<IncStatRow>([]);

  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // مجوزهای دسترسی
  protected INCPermissions: string[] = [
    'incomingCall.crm.view',
    'incomingCall.etebar.view',
    'incomingCall.online.view',
    'incomingCall.paziresh.view',
    'incomingCall.qa.view',
    'incomingCall.toseebazar.view'
  ];

  constructor(
    protected auth: AuthService,
    private service: IncStatService,
    private toast: NgToastService
  ) {}

  // ==============================================
  //  مقداردهی اولیه
  // ==============================================
  async ngOnInit() {
    // بررسی دسترسی
    if (!this.auth.hasAnyPermission(this.INCPermissions)) {
      console.warn('دسترسی محدود: درخواستی ارسال نشد.');
      return;
    }

    try {
      // ۱. دریافت لیست انواع صف‌ها
      this.types = await this.service.get_AllTypes().toPromise();

      if (!this.types || this.types.length === 0) {
        this.toast.warning({
          detail: 'توجه',
          summary: 'هیچ نوع صفی برای نمایش وجود ندارد.',
          duration: 4000,
          position: 'topRight'
        });
        return;
      }

      // انتخاب اولین نوع به‌عنوان پیش‌فرض
      this.selectedType = this.types[0];

      // ۲. دریافت همه داده‌ها
      await this.loadAllData();

    } catch (error: any) {
      this.toast.error({
        detail: 'خطا',
        summary: error?.message || 'مشکلی در بارگذاری اولیه به وجود آمد.',
        duration: 5000,
        position: 'topRight'
      });
    }
  }

  // ==============================================
  //  دریافت همه داده‌ها از سرور
  // ==============================================
  async loadAllData() {
    this.flag_loading = true;
    this.flag_data = false;

    try {
      const allRows: IncStatRow[] = [];

      // حلقه روی همه انواع صف‌ها
      for (const type of this.types) {
        const rawData = await this.service.get_IncStats(type).toPromise();

        if (rawData && rawData.length > 0) {
          for (const item of rawData) {
            allRows.push({
              type: this.convertTypeToFarsi(item.type),
              date: item.month,
              answered: item.answered,
              avgWait: this.formatSeconds(item.avg_Wait),
              avgTalk: this.formatSeconds(item.avg_Talk)
            });
          }
        }
      }

      // ذخیره همه داده‌ها
      this.allData = allRows;

      // فیلتر بر اساس نوع انتخاب‌شده
      this.applyFilter();

      // آماده‌سازی داده‌های نمودار (همه نوع‌ها)
      this.chartData = allRows.map(item => ({
        type: item.type,
        date: item.date,
        answered: item.answered
      }));

      // تنظیم Paginator
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }

      this.flag_data = true;

      // اگر داده‌ای وجود نداشت، پیام نشان بده
      if (allRows.length === 0) {
        this.toast.info({
          detail: 'اطلاعات',
          summary: 'هیچ داده‌ای برای نمایش وجود ندارد.',
          duration: 4000,
          position: 'topRight'
        });
      }

    } catch (error: any) {
      this.toast.error({
        detail: 'خطا',
        summary: error?.message || 'دریافت داده‌ها با مشکل مواجه شد.',
        duration: 5000,
        position: 'topRight'
      });
    } finally {
      this.flag_loading = false;
    }
  }

  // ==============================================
  //  تغییر نوع صف (توسط کاربر)
  // ==============================================
  async onTypeChange() {
    if (!this.selectedType) return;
    this.applyFilter();

    // اگر Paginator موجود باشد، به صفحه اول برو
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // ==============================================
  //  اعمال فیلتر روی داده‌ها بر اساس نوع انتخاب‌شده
  // ==============================================
  private applyFilter() {
    const farsiType = this.convertTypeToFarsi(this.selectedType);
    this.dataSource.data = this.allData.filter(
      item => item.type === farsiType
    );
  }

  // ==============================================
  //  تبدیل ثانیه به قالب HH:MM:SS
  // ==============================================
  formatSeconds(seconds: number): string {
    if (!seconds || seconds < 0) return '00:00:00';

    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  // ==============================================
  //  تبدیل نام نوع صف به فارسی
  // ==============================================
  convertTypeToFarsi(type: string): string {
    const map: { [key: string]: string } = {
      'Silver': 'نقره‌ای',
      'Gold': 'طلایی',
      'Support': 'پشتیبانی',
      'Evening shift': 'شیفت عصر',
      'Club': 'باشگاه'
    };
    return map[type] ?? type;
  }

  // ==============================================
  //  (اختیاری) رفرش دستی داده‌ها
  // ==============================================
  async refreshData() {
    await this.loadAllData();
    this.toast.success({
      detail: 'انجام شد',
      summary: 'داده‌ها با موفقیت به‌روزرسانی شدند.',
      duration: 3000,
      position: 'topRight'
    });
  }
}
