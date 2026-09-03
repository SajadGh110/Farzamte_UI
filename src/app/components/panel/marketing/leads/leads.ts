import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DatePipe, DecimalPipe, NgIf} from "@angular/common";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {LeadService} from "../../../../services/lead.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import { MatDialog } from '@angular/material/dialog';
import {LeadsDialog, LeadsDialogData} from "./leads-dialog/leads-dialog";

@Component({
  selector: 'app-leads',
  imports: [
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
    NgIf,
    MatProgressSpinner,
    DecimalPipe
  ],
  providers: [DatePipe],
  templateUrl: './leads.html',
  styleUrl: './leads.scss',
})
export class Leads implements OnInit {
  protected flag_total:boolean=false;
  protected flag_stats:boolean=false;
  StartDate:string = "2026-02-01";
  EndDate:string = "2026-09-01";
  series_total: any[] = [];
  series_stats: any[] = [];
  public constructor(private toast:NgToastService, protected auth:AuthService, private router:Router, private fb:FormBuilder, private datePipe: DatePipe, private getData:LeadService, private dialog: MatDialog) {}

  async ngOnInit(){
    if (!this.auth.hasPermission('marketing.view')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    await this.do(this.StartDate,this.EndDate);
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
