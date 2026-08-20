import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { IncomingCallService } from '../../../../services/incoming-call.service';

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
    MatProgressSpinner
  ],
  templateUrl: './view360-dialog.html',
  styleUrl: './view360-dialog.scss',
})
export class View360Dialog implements OnInit {
  loading = true;
  sectionTitle = '';
  sectionIcon = '';

  // داده‌های نمایشی
  description = '';
  stats: any[] = [];
  chartData: any = null;
  tableData: any[] = [];
  error = false;

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
}
