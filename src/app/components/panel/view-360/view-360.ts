import {Component, OnInit} from '@angular/core';
import {BarChartModule, LineChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {View360Dialog} from "./view360-dialog/view360-dialog";

@Component({
    selector: 'app-view-360',
  imports: [
    BarChartModule,
    PieChartModule,
    LineChartModule,
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
    MatDialogModule,
  ],
    templateUrl: './view-360.html',
    styleUrl: './view-360.scss'
})
export class View360 implements OnInit {
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder, private dialog:MatDialog) { }
  async ngOnInit() {

  }

  openDialog(sectionKey: string) {
    const sectionMap: { [key: string]: { title: string; icon: string; route: string } } = {
      'تماس ورودی': { title: 'تماس ورودی', icon: 'call_received', route: '/call_in' },
      'هپی کال': { title: 'هپی کال', icon: 'sentiment_satisfied', route: '/happy_call' },
      'عمومی': { title: 'تماس خروجی - عمومی', icon: 'people', route: '/call_out/general' },
      'پیگیری شعب': { title: 'تماس خروجی - پیگیری شعب', icon: 'trending_up', route: '/call_out/followup' },
      'گزارش ماهانه': { title: 'گزارش ماهانه', icon: 'assessment', route: '/brokerages' },
      'مارکتینگ': { title: 'مارکتینگ', icon: 'trending_up', route: '/marketing' },
      'پیامک': { title: 'اطلاع رسانی - پیامک', icon: 'sms', route: '/notices/sms' },
      'تماس': { title: 'اطلاع رسانی - تماس', icon: 'phone_in_talk', route: '/notices/call' },
      'تیکت': { title: 'تیکت', icon: 'confirmation_number', route: '/ticket' }
    };

    const data = sectionMap[sectionKey];
    if (!data) return;

    this.dialog.open(View360Dialog, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      data: {
        sectionKey: sectionKey,
        title: data.title,
        icon: data.icon,
        route: data.route,
      },
      panelClass: 'view360-dialog-panel',
      direction: 'rtl'
    });
  }
}
