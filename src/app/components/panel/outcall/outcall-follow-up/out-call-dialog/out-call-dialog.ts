import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-out-call-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './out-call-dialog.html',
  styleUrl: './out-call-dialog.scss',
})
export class OutCallDialog {
  constructor(
    public dialogRef: MatDialogRef<OutCallDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, details: any[] }
  ) {}

  close(): void {
    this.dialogRef.close();
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
