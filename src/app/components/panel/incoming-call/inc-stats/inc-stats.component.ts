import { Component } from '@angular/core';
import { DashboardSidebarComponent } from '../../../Template/dashboard-sidebar/dashboard-sidebar.component';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { DashboardContactComponent } from '../../../Template/dashboard-contact/dashboard-contact.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IncStatRow } from '../../../../models/inc-stat.model';

@Component({
  selector: 'app-inc-stats',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    NgIf,
    CommonModule,
    DashboardContactComponent,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './inc-stats.component.html',
  styleUrls: ['./inc-stats.component.scss']
})
export class IncStatsComponent {
  data: IncStatRow[] = [
    { type: 'نقره‌ای', date: '2025-05-12', answered: 120, avgWait: '00:00:45', avgTalk: '00:03:10' },
    { type: 'طلایی', date: '2025-05-12', answered: 98, avgWait: '00:00:35', avgTalk: '00:02:05' },
    // … ردیف‌های دیگر
  ];

  selectedType: string = '';
  selectedDate: Date | null = null;

  types = ['نقره‌ای', 'طلایی', 'شیفت عصر', 'پشتیبانی'];

  // Columns to display in the table
  displayedColumns: string[] = ['type', 'date', 'answered', 'avgWait', 'avgTalk'];

  get filteredData(): IncStatRow[] {
    return this.data.filter(item =>
      (!this.selectedType || item.type === this.selectedType) &&
      (!this.selectedDate || item.date === this.selectedDate.toISOString().split('T')[0])
    );
  }

  constructor(private auth: AuthService) {}

  getBroker() {
    return this.auth.getUserBroker();
  }
}
