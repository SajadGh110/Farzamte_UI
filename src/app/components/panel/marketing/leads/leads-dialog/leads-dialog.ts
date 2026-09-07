import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgToastService } from 'ng-angular-popup';
import { FormsModule } from '@angular/forms';
import {LeadService} from "../../../../../services/lead.service";
import {LeadDetails} from "../lead-details/lead-details";
import * as XLSX from 'xlsx';

export interface LeadsDialogData {
  title: string;
  status: string;
  layer: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-leads-dialog',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule],
  templateUrl: './leads-dialog.html',
  styleUrl: './leads-dialog.scss',
})
export class LeadsDialog implements OnInit {
  protected loading: boolean = false;
  protected leadsList: any[] = [];
  protected searchTerm: string = '';
  protected sortColumn: string = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  displayedColumns: string[] = ['fullName', 'nationalCode', 'createdOn', 'branchName', 'tradingDays', 'brokerCommission'];

  constructor(
    public dialogRef: MatDialogRef<LeadsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LeadsDialogData,
    private leadService: LeadService,
    private toast: NgToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadLeadsList();
  }

  async loadLeadsList() {
    this.loading = true;
    this.leadsList = [];

    try {
      const result = await this.leadService
        .get_LeadsList(this.data.startDate, this.data.endDate, this.data.status, this.data.layer)
        .toPromise();

      this.leadsList = result || [];
    } catch (error: any) {
      this.toast.error({
        detail: 'خطا',
        summary: error?.message || 'دریافت لیست لیدها با مشکل مواجه شد.',
        duration: 5000,
        position: 'topRight'
      });
    } finally {
      this.loading = false;
    }
  }

  get filteredLeads() {
    if (!this.searchTerm.trim()) return this.leadsList;

    const term = this.searchTerm.toLowerCase().trim();
    return this.leadsList.filter(lead =>
      lead.fullName?.toLowerCase().includes(term) ||
      lead.nationalCode?.includes(term) ||
      lead.branchName?.toLowerCase().includes(term)
    );
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.leadsList.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (valA == null) valA = '';
      if (valB == null) valB = '';

      if (column === 'tradingDays' || column === 'brokerCommissionInPeriod') {
        const numA = parseFloat(String(valA).replace(/,/g, '')) || 0;
        const numB = parseFloat(String(valB).replace(/,/g, '')) || 0;

        if (numA < numB) return this.sortDirection === 'asc' ? -1 : 1;
        if (numA > numB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      }

      if (column === 'createdOn') {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();

        if (dateA < dateB) return this.sortDirection === 'asc' ? -1 : 1;
        if (dateA > dateB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  exportToExcel() {
    if (!this.filteredLeads || this.filteredLeads.length === 0) {
      this.toast.warning({
        detail: 'هشدار',
        summary: 'داده‌ای برای خروجی گرفتن وجود ندارد',
        duration: 3000,
        position: 'topRight'
      });
      return;
    }

    // آماده‌سازی داده برای اکسل
    const dataToExport = this.filteredLeads.map((lead, index) => ({
      'ردیف': index + 1,
      'نام و نام خانوادگی': lead.fullName || '-',
      'کد ملی': lead.nationalCode || '-',
      'تاریخ ایجاد': lead.createdOn ? new Date(lead.createdOn).toLocaleDateString('fa-IR') : '-',
      'شعبه': lead.branchName || '-',
      'روزهای معاملاتی': lead.tradingDays || '۰',
      'کارمزد 3 ماهه اخیر(ریال)': lead.brokerCommissionInPeriod || '۰'
    }));

    // ساخت فایل اکسل
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'لیست لیدها');

    // تنظیم عرض ستون‌ها
    const colWidths = [
      { wch: 8 },   // ردیف
      { wch: 20 },  // نام لید
      { wch: 15 },  // کد ملی
      { wch: 20 },  // تاریخ ایجاد
      { wch: 18 },  // شعبه
      { wch: 18 },  // روزهای معاملاتی
      { wch: 22 }   // کارمزد
    ];
    ws['!cols'] = colWidths;

    // دانلود فایل
    const fileName = `لیست_لیدها_${this.data.status}_${this.data.layer}_${new Date().toLocaleDateString('fa-IR')}.xlsx`;
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

  openLeadDetail(leadId: number) {
    this.dialog.open(LeadDetails, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { leadId: leadId },
      panelClass: 'lead-detail-panel',
      direction: 'rtl'
    });
  }
}
