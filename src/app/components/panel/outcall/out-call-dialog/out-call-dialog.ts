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
  styleUrl: './out-call-dialog.scss', // می‌توانید از فایل scss قبلی استفاده کنید
})
export class OutCallDialog {
  constructor(
    public dialogRef: MatDialogRef<OutCallDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, details: any[] }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
