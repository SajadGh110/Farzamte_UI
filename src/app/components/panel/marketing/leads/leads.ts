import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DatePipe, NgIf} from "@angular/common";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-leads',
  imports: [
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
    NgIf
  ],
  providers: [DatePipe],
  templateUrl: './leads.html',
  styleUrl: './leads.scss',
})
export class Leads implements OnInit {
  public constructor(private toast:NgToastService, protected auth:AuthService, private router:Router, private fb:FormBuilder, private datePipe: DatePipe) {}

  async ngOnInit(){
    if (!this.auth.hasPermission('marketing.view')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
  }
}
