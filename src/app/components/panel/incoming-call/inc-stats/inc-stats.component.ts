import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardSidebarComponent} from '../../../Template/dashboard-sidebar/dashboard-sidebar.component';
import {CommonModule, NgIf} from '@angular/common';
import {AuthService} from '../../../../services/auth.service';
import {DashboardContactComponent} from '../../../Template/dashboard-contact/dashboard-contact.component';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {IncStatRow} from "../../../../models/inc-stat.model";
import {IncStatService} from "../../../../services/inc-stat.service";
import {NgToastService} from "ng-angular-popup";


@Component({
  selector: 'app-inc-stats',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    NgIf,
    CommonModule,
    DashboardContactComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './inc-stats.component.html',
  styleUrls: ['./inc-stats.component.scss']
})
export class IncStatsComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private Service: IncStatService,
    private toast: NgToastService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<IncStatRow>([]);

  selectedType: string = '';

  types: string[] = [];

  displayedColumns: string[] = ['type', 'date', 'answered', 'avgWait', 'avgTalk'];

  async ngOnInit() {
    try {
      this.types = await this.Service.get_AllTypes().toPromise();
      this.selectedType = this.types[0] ?? '';

      await this.GetData(this.selectedType);
    } catch (error: any) {
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async onTypeChange() {
    await this.GetData(this.selectedType);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async GetData(type: string) {
    try {
      const result: any[] = await this.Service.get_IncStats(type).toPromise();

      this.dataSource.data = result.map(item => ({
        type: this.convertTypeToFarsi(item.type),
        date: item.month,
        answered: item.answered,
        avgWait: this.formatSeconds(item.avg_Wait),
        avgTalk: this.formatSeconds(item.avg_Talk)
      }));

      if (this.paginator)
        this.paginator.firstPage();

      this.dataSource.paginator = this.paginator;

    } catch (error: any) {
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  convertTypeToFarsi(type: string): string {
    const map: { [key: string]: string } = {
      'Silver': 'نقره‌ای',
      'Gold': 'طلایی',
      'Support': 'پشتیبانی',
      'Evening shift': 'شیفت عصر',
      'Club': 'باشگاه'
    };
    return map[type] ?? type;
  }

  getBroker() {
    return this.auth.getUserBroker();
  }
}
