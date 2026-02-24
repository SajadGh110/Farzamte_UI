import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-out-call-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './out-call-dialog.html',
  styleUrl: './out-call-dialog.scss',
})
export class OutCallDialog implements OnInit{
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredDetails: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<OutCallDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, details: any[] }
  ) {}

  ngOnInit() {
    this.filteredDetails = [...this.data.details];
  }

  close(): void {
    this.dialogRef.close();
  }

  filterData() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredDetails = [...this.data.details];
    } else {
      this.filteredDetails = this.data.details.filter(item =>
        (item.expertName?.toLowerCase().includes(term)) ||
        (item.unit?.toLowerCase().includes(term)) ||
        (item.phoneNumber?.includes(term)) ||
        (item.description?.toLowerCase().includes(term))
      );
    }
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredDetails.sort((a, b) => {
      let valA = a[column] || '';
      let valB = b[column] || '';

      let res = valA.toString().localeCompare(valB.toString(), 'fa', { numeric: true });
      return this.sortDirection === 'asc' ? res : -res;
    });
  }

  exportExcel() {
    const dataToExport = this.filteredDetails.map((item, index) => ({
      'ردیف': index + 1,
      'کارشناس': item.expertName,
      'واحد': item.unit,
      'شماره مقصد': item.phoneNumber,
      'وضعیت': this.getStatusLabel(item.status),
      'نتیجه': item.callResult,
      'تاریخ': item.date,
      'توضیحات': item.description
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OutCall_Details');
    XLSX.writeFile(wb, `Details_${this.data.title}.xlsx`);
  }

  calculatePercentage(type: string): number {
    if (!this.data.details || this.data.details.length === 0) return 0;
    const count = this.data.details.filter((item: any) => item.callResult === type).length;
    return Math.round((count / this.data.details.length) * 100);
  }

  getStatusLabel(status: string): string {
    const s = (status || 'null').toLowerCase().trim();
    const mapping: any = {
      'made': 'موفق',
      'unresponsive': 'عدم پاسخ',
      'open': 'باز',
      'canceled': 'لغو شده',
      'disinclination': 'عدم تمایل',
      'null': 'نامشخص'
    };
    return mapping[s] || 'نامشخص';
  }

  getStatusClass(status: string): string {
    return 'st-' + (status || 'null').toLowerCase().trim();
  }
}
