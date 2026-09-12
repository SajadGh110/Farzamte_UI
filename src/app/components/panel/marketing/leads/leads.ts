import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DatePipe, DecimalPipe, NgIf} from "@angular/common";
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
    ReactiveFormsModule
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
  StartDate:string = "";
  EndDate:string = "";
  st_to_en: string = "";
  selected_days:number = 0;
  series_total: any[] = [];
  series_stats: any[] = [];
  public constructor(private toast:NgToastService, protected auth:AuthService, private router:Router, private fb:FormBuilder, private datePipe: DatePipe, private getData:LeadService,private timeService: TimeService, private dialog: MatDialog) {
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
    this.series_total = [];
    this.series_stats = [];
    try {
      this.series_total = await this.getData.get_TotalCount(stDate, enDate).toPromise();
      this.flag_total = true;
      this.series_stats = await this.getData.get_StatsCount(stDate, enDate).toPromise();
      this.flag_stats = true;
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

  openLeadsDialog(status: string, layer: string, title: string) {
    const dialogData: LeadsDialogData = {
      title: title,
      status: status,
      layer: layer,
      startDate: this.StartDate,
      endDate: this.EndDate
    };

    this.dialog.open(LeadsDialog, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: dialogData,
      panelClass: 'leads-dialog-panel',
      direction: 'rtl'
    });
  }
}
