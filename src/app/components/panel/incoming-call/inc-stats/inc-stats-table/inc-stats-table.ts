import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

export interface IncStatRow {
  type: string;
  date: string;
  answered: number;
  avgWait: string;
  avgTalk: string;
}

@Component({
  selector: 'app-inc-stats-table',
  standalone: true,
  imports: [
    MatProgressSpinner,
    NgIf,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './inc-stats-table.html',
  styleUrls: ['./inc-stats-table.scss']
})
export class IncStatsTable implements AfterViewInit {
  @Input() data: IncStatRow[] = [];
  @Input() displayedColumns: string[] = ['type', 'date', 'answered', 'avgWait', 'avgTalk'];

  dataSource = new MatTableDataSource<IncStatRow>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // پرچم‌های پاپ‌آپ
  protected flag_popup: boolean = false;
  protected flag_popup_data: boolean = false;
  selectedRow: IncStatRow | null = null;

  constructor(private toast: NgToastService) {}

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<IncStatRow>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  // وقتی داده از بیرون تغییر می‌کند
  ngOnChanges() {
    if (this.data) {
      this.dataSource.data = this.data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  // کلیک روی سطر جدول
  onRowClick(row: IncStatRow) {
    this.selectedRow = row;
    this.flag_popup = true;
    this.flag_popup_data = true;
  }

  // بستن پاپ‌آپ
  closePopup() {
    this.flag_popup = false;
    this.flag_popup_data = false;
    this.selectedRow = null;
  }
}
