import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-incoming-call-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './incoming-call-dialog.html',
  styleUrl: './incoming-call-dialog.scss',
})
export class IncomingCallDialog {
  constructor(
    public dialogRef: MatDialogRef<IncomingCallDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, details: any[] }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
