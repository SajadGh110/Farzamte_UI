import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LeadService} from "../../../../services/lead.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { MatDialog } from '@angular/material/dialog';
import {LeadsDialog, LeadsDialogData} from "./leads-dialog/leads-dialog";
import {format, subDays} from "date-fns";
import {TimeService} from "../../../../services/time.service";
import {Dir} from "@angular/cdk/bidi";
import {OutcallService} from "../../../../services/outcall.service";
import { CallsDialog, CallsDialogData } from "./calls-dialog/calls-dialog";

@Component({
  selector: 'app-leads',
  imports: [
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
    NgIf,
    MatProgressSpinner,
    DecimalPipe,
    Dir,
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgClass
  ],
  providers: [DatePipe],
  templateUrl: './leads.html',
  styleUrl: './leads.scss',
})
export class Leads implements OnInit {
  dateform!: FormGroup;
  protected loading: boolean = false;
  protected flag_total:boolean=false;
  protected flag_stats:boolean=false;
  protected flag_experts: boolean = false;
  protected flag_experts_calls: boolean = false;
  protected flag_calls_status:boolean = false;
  StartDate:string = "";
  EndDate:string = "";
  st_to_en: string = "";
  selected_days:number = 0;
  series_total: any[] = [];
  series_stats: any[] = [];
  series_experts: any[] = [];
  series_experts_calls: any[] = [];
  series_calls_status: any[] = [];
  public constructor(private toast:NgToastService, protected auth:AuthService, private router:Router, private fb:FormBuilder, private datePipe: DatePipe, private getData:LeadService, private getDataCall:OutcallService,private timeService: TimeService, private dialog: MatDialog) {
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
  }

  async ngOnInit(){
    if (!this.auth.hasPermission('marketing.view')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    await this.initData();

  }

  async initData() {
    this.loading = true;
    try {
      const resDate = await this.getData.get_LastDate().toPromise();
      this.EndDate = resDate.lastDate;

      this.StartDate = format(subDays(new Date(this.EndDate), 30), 'yyyy-MM-dd')
      this.selected_days = this.timeService.calc_Diff_Date(this.StartDate, this.EndDate);

      this.dateform.patchValue({
        StartDate: this.StartDate,
        EndDate: this.EndDate
      });

      await this.do(this.StartDate,this.EndDate);
    } catch (error: any) {
      this.toast.error({ detail: "خطا", summary: "عدم توانایی در دریافت تاریخ اولیه" });
    } finally {
      this.loading = false;
    }
  }

  async do(stDate:string,enDate:string){
    this.flag_total = false;
    this.flag_stats = false;
    this.flag_experts = false;
    this.flag_experts_calls = false;
    this.flag_calls_status = false;
    this.series_total = [];
    this.series_stats = [];
    this.series_experts = [];
    this.series_experts_calls = [];
    this.series_calls_status = [];
    try {
      this.series_total = await this.getData.get_TotalCount(stDate, enDate).toPromise();
      this.flag_total = true;
      this.series_stats = await this.getData.get_StatsCount(stDate, enDate).toPromise();
      this.flag_stats = true;
      this.series_experts = await this.getData.get_LeadsCountByExpert(stDate, enDate).toPromise();
      this.flag_experts = true;
      const rawExperts = await this.getDataCall.get_ExpertsCount_M(stDate, enDate).toPromise();
      const totalCalls = (rawExperts || []).reduce((sum: number, e: any) => sum + (e.count || 0), 0);
      this.series_experts_calls = (rawExperts || []).map((e: any) => ({
        ...e,
        percentage: totalCalls > 0 ? Math.round((e.count / totalCalls) * 100) : 0
      }));
      this.flag_experts_calls = true;
      this.series_calls_status = await this.getDataCall.get_StatusCount_M(stDate, enDate).toPromise();
      this.flag_calls_status = true;
    } catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async onUpdateDate() {
    this.StartDate = this.dateform.value.StartDate;
    this.EndDate = this.dateform.value.EndDate;
    this.selected_days = this.timeService.calc_Diff_Date(this.StartDate, this.EndDate);
    await this.do(this.StartDate, this.EndDate);
  }

  async SetTime(days:number){
    let res_date = await this.getData.get_LastDate().toPromise();
    this.EndDate = res_date.lastDate;
    this.StartDate = format(subDays(this.EndDate, days), 'yyyy-MM-dd');
    this.selected_days = this.timeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    await this.do(this.StartDate,this.EndDate);
  }

  openLeadsDialog(status: string, layer: string, title: string, showLayerColumn: boolean = false) {
    const dialogData: LeadsDialogData = {
      title: title,
      status: status,
      layer: layer,
      startDate: this.StartDate,
      endDate: this.EndDate,
      showLayerColumn: showLayerColumn
    };

    this.dialog.open(LeadsDialog, {
      width: '1100px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: dialogData,
      panelClass: 'leads-dialog-panel',
      direction: 'rtl'
    });
  }

  openExpertLeadsDialog(expertName: string) {
    const dialogData: LeadsDialogData = {
      title: `لیست لیدهای ${expertName}`,
      status: '',
      layer: '',
      startDate: this.StartDate,
      endDate: this.EndDate,
      agentName: expertName
    };

    this.dialog.open(LeadsDialog, {
      width: '1100px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: dialogData,
      panelClass: 'leads-dialog-panel',
      direction: 'rtl'
    });
  }

  openExpertCallsDialog(expertName: string) {
    const dialogData: CallsDialogData = {
      title: `لیست تماس‌های ${expertName}`,
      startDate: this.StartDate,
      endDate: this.EndDate,
      expertName: expertName
    };

    this.dialog.open(CallsDialog, {
      width: '1200px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: dialogData,
      panelClass: 'calls-dialog-panel',
      direction: 'rtl'
    });
  }

  openStatusCallsDialog(status: string, statusLabel: string) {
    const dialogData: CallsDialogData = {
      title: `لیست تماس‌های ${statusLabel}`,
      startDate: this.StartDate,
      endDate: this.EndDate,
      status: status,
      statusLabel: statusLabel
    };

    this.dialog.open(CallsDialog, {
      width: '1200px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: dialogData,
      panelClass: 'calls-dialog-panel',
      direction: 'rtl'
    });
  }

  getInitials(name: string): string {
    if (!name || !name.trim()) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].charAt(0);
    return words[0].charAt(0) + words[words.length - 1].charAt(0);
  }

  // مجموع کل تماس‌ها
  get totalCallsCount(): number {
    return (this.series_experts_calls || [])
      .reduce((sum: number, e: any) => sum + (e.count || 0), 0);
  }

// مجموع کل لیدها
  get totalLeadsCount(): number {
    return this.series_total?.[0]?.total_Count || 0;
  }

// میانگین تماس به ازای هر لید
  get avgCallsPerLead(): number {
    const totalLeads = this.totalLeadsCount;
    if (totalLeads === 0) return 0;
    return Math.round((this.totalCallsCount / totalLeads) * 100) / 100;
  }

  get totalStatusCalls(): number {
    return (this.series_calls_status || [])
      .reduce((sum: number, s: any) => sum + (s.count || 0), 0);
  }

  getStatusLabel(status: string): string {
    const key = (status || '').toLowerCase();
    const map: { [key: string]: string } = {
      'made': 'موفق',
      'unsuccessful': 'ناموفق',
      'open': 'باز',
      'recall': 'تماس مجدد',
      'disinclination': 'عدم تمایل'
    };
    return map[key] || status;
  }

  getStatusIcon(status: string): string {
    const key = (status || '').toLowerCase();
    const map: { [key: string]: string } = {
      'made': 'check_circle',
      'unsuccessful': 'cancel',
      'open': 'radio_button_unchecked',
      'recall': 'refresh',
      'disinclination': 'do_not_disturb'
    };
    return map[key] || 'info';
  }

  getStatusColorClass(status: string): string {
    const key = (status || '').toLowerCase();
    const map: { [key: string]: string } = {
      'made': 'status-success',
      'unsuccessful': 'status-danger',
      'open': 'status-info',
      'recall': 'status-warning',
      'disinclination': 'status-neutral'
    };
    return map[key] || 'status-neutral';
  }

  getStatusPercentage(count: number): number {
    const total = this.totalStatusCalls;
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }
}
