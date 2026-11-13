import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgToastService } from 'ng-angular-popup';
import { FormsModule } from '@angular/forms';
import { OutcallService } from "../../../../../services/outcall.service";
import * as XLSX from 'xlsx';

export interface CallsDialogData {
  title: string;
  startDate: string;
  endDate: string;
  expertName?: string;   // حالت ۱: فیلتر کارشناس
  status?: string;       // حالت ۲: فیلتر وضعیت
  statusLabel?: string;  // برای نمایش در subtitle (مثلاً "موفق")
}

@Component({
  selector: 'app-calls-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './calls-dialog.html',
  styleUrl: './calls-dialog.scss',
})
export class CallsDialog implements OnInit {
  protected loading: boolean = false;
  protected callsList: any[] = [];
  protected searchTerm: string = '';
  protected sortColumn: string = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    public dialogRef: MatDialogRef<CallsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CallsDialogData,
    private outcallService: OutcallService,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.loadCallsList();
  }

  async loadCallsList() {
    this.loading = true;
    this.callsList = [];

    try {
      let result: any[];

      if (this.data.expertName) {
        // ─── حالت کارشناس ───
        result = await this.outcallService
          .get_DescriptionByExpert_M(this.data.startDate, this.data.endDate, this.data.expertName)
          .toPromise();
      } else if (this.data.status) {
        // ─── حالت وضعیت ───
        result = await this.outcallService
          .get_DescriptionByStatus_M(this.data.startDate, this.data.endDate, this.data.status)
          .toPromise();
      } else {
        // حالت نامعتبر
        result = [];
      }

      this.callsList = result || [];
    } catch (error: any) {
      this.toast.error({
        detail: 'خطا',
        summary: error?.message || 'دریافت لیست تماس‌ها با مشکل مواجه شد.',
        duration: 5000,
        position: 'topRight'
      });
    } finally {
      this.loading = false;
    }
  }

  // ============================
  //  Search
  // ============================
  get filteredCalls() {
    if (!this.searchTerm.trim()) return this.callsList;

    const term = this.searchTerm.toLowerCase().trim();
    return this.callsList.filter(call =>
      call.expertName?.toLowerCase().includes(term) ||
      call.phoneNumber?.includes(term) ||
      call.title?.toLowerCase().includes(term) ||
      call.description?.toLowerCase().includes(term) ||
      call.from?.toLowerCase().includes(term)
    );
  }

  // ============================
  //  Status Helpers
  // ============================
  getStatusLabel(status: string): string {
    const key = (status || '').toLowerCase();
    const map: { [key: string]: string } = {
      'made': 'موفق',
      'unsuccessful': 'ناموفق',
      'open': 'باز',
      'recall': 'تماس مجدد',
      'disinclination': 'عدم تمایل'
    };
    return map[key] || status || '-';
  }

  getStatusClass(status: string): string {
    const key = (status || '').toLowerCase();
    const map: { [key: string]: string } = {
      'made': 'status-success',
      'unsuccessful': 'status-danger',
      'open': 'status-info',
      'recall': 'status-warning',
      'disinclination': 'status-neutral'
    };
    return map[key] || 'status-neutral';
  }

  // ============================
  //  Sort
  // ============================
  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.callsList.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (valA == null) valA = '';
      if (valB == null) valB = '';

      // ستون تاریخ
      if (column === 'date') {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        if (dateA < dateB) return this.sortDirection === 'asc' ? -1 : 1;
        if (dateA > dateB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      }

      // ستون‌های رشته‌ای
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // ============================
  //  Excel
  // ============================
  exportToExcel() {
    if (!this.filteredCalls || this.filteredCalls.length === 0) {
      this.toast.warning({
        detail: 'هشدار',
        summary: 'داده‌ای برای خروجی گرفتن وجود ندارد',
        duration: 3000,
        position: 'topRight'
      });
      return;
    }

    const dataToExport = this.filteredCalls.map((call, index) => ({
      'ردیف': index + 1,
      'تاریخ': call.date || '-',
      'کارشناس': call.expertName || '-',
      'شماره تماس': call.phoneNumber || '-',
      'موضوع': call.title || '-',
      'وضعیت': this.getStatusLabel(call.status),
      'نتیجه': call.callResult || '-',
      'واحد': call.unit || '-',
      'توضیحات': call.description || '-'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'لیست تماس‌ها');

    ws['!cols'] = [
      { wch: 8 },   // ردیف
      { wch: 18 },  // تاریخ
      { wch: 20 },  // کارشناس
      { wch: 15 },  // شماره
      { wch: 25 },  // موضوع
      { wch: 12 },  // وضعیت
      { wch: 12 },  // نتیجه
      { wch: 15 },  // واحد
      { wch: 40 }   // توضیحات
    ];

    const suffix = this.data.expertName
      ? `Expert_${this.data.expertName}`
      : `Status_${this.data.statusLabel || this.data.status}`;

    const fileName = `لیست_تماس‌ها_${suffix}_${new Date().toLocaleDateString('fa-IR')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    this.toast.success({
      detail: 'موفق',
      summary: 'فایل اکسل با موفقیت دانلود شد',
      duration: 3000,
      position: 'topRight'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
