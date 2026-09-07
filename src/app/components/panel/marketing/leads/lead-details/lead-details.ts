import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgToastService } from 'ng-angular-popup';
import { LeadService } from '../../../../../services/lead.service';

export interface LeadDetailData {
  leadId: number;
}

@Component({
  selector: 'app-leads-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './lead-details.html',
  styleUrl: './lead-details.scss',
})
export class LeadDetails implements OnInit {
  protected loading: boolean = false;
  protected leadDetail: any = null;

  constructor(
    public dialogRef: MatDialogRef<LeadDetails>,
    @Inject(MAT_DIALOG_DATA) public data: LeadDetailData,
    private leadService: LeadService,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.loadLeadDetail();
  }

  async loadLeadDetail() {
    this.loading = true;
    this.leadDetail = null;

    try {
      const result = await this.leadService.get_Lead(this.data.leadId).toPromise();
      this.leadDetail = result;
    } catch (error: any) {
      this.toast.error({detail: 'خطا', summary: error?.message || 'دریافت اطلاعات لید با مشکل مواجه شد.', duration: 5000, position: 'topRight'});
    } finally {
      this.loading = false;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
