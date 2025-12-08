import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-critical-calls-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  providers: [DatePipe],
  templateUrl: './critical-calls-dialog.component.html', // ارجاع به فایل html
  styleUrl: './critical-calls-dialog.component.scss'     // ارجاع به فایل scss
})
export class CriticalCallsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CriticalCallsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { agent: string, month: string, details: any[] }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}