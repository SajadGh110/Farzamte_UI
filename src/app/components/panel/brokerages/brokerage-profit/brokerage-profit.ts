import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";
import {BrokerageProfitService} from "../../../../services/brokerage-profit.service";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";


@Component({
  selector: 'app-brokerage-profit',
  imports: [
    DashboardSidebarComponent,
    MatProgressSpinner,
    NgForOf,
    NgIf,
    DecimalPipe
  ],
  templateUrl: './brokerage-profit.html',
  styleUrl: './brokerage-profit.scss'
})
export class BrokerageProfit implements OnInit {
  public constructor(private auth:AuthService, private getData:BrokerageProfitService, private router:Router, private toast:NgToastService) {}
  protected flag_data:boolean=false;
  series_data:any = [];
  Columns_b1_part1: string[] = ['b_1_1', 'b_1_2', 'b_1_3', 'b_1_4'];
  Columns_b1_part2: string[] = ['b_1_5', 'b_1_6', 'b_1_7'];
  Columns_b1_part3: string[] = ['b_1_8', 'b_1_9', 'b_1_10'];
  Columns_b1_part4: string[] = ['b_1_T_1', 'b_1_T_2', 'b_1_T_3', 'b_1_T_4'];
  Columns_b2_part1: string[] = ['b_2_1', 'b_2_2', 'b_2_3', 'b_2_4'];
  Columns_b2_part2: string[] = ['b_2_5', 'b_2_6', 'b_2_7', 'b_2_8'];
  Columns_b2_part3: string[] = ['b_2_9', 'b_2_10'];
  Columns_b2_part4: string[] = ['b_2_11', 'b_2_12'];
  Columns_b2_part5: string[] = ['b_2_T_1', 'b_2_T_2', 'b_2_T_3', 'b_2_T_4'];
  Columns_b3_part1: string[] = ['b_3_1', 'b_3_2', 'b_3_3', 'b_3_4'];
  Columns_b3_part2: string[] = ['b_3_T_1', 'b_3_T_2', 'b_3_T_3', 'b_3_T_4'];
  Columns_b4_part1: string[] = ['b_4_1', 'b_4_2', 'b_4_3', 'b_4_4'];
  Columns_b4_part2: string[] = ['b_4_5', 'b_4_6', 'b_4_7', 'b_4_8'];
  Columns_b4_part3: string[] = ['b_4_T_1', 'b_4_T_2', 'b_4_T_3', 'b_4_T_4'];
  Columns_b5: string[] = ['b_5_1', 'b_5_2', 'b_5_3', 'b_5_4'];
  Columns_bt: string[] = ['bt'];
  candidateColumns_f: string[] = [
    'f_1_1',
    'f_1_2',
    'f_1_3',
    'f_1_4',
    'f_1_T'
  ];
  candidateColumns_k: string[] = [
    'k_1',
    'k_2',
    'k_3',
    'k_4',
    'kt'
  ];
  columnTitles_b1_part1: { [key: string]: string } = {b_1_1: "آنلاین", b_1_2: "آنلاین گروهی", b_1_3: "آنلاین الگوریتمی", b_1_4: "معمولی"};
  columnTitles_b1_part2: { [key: string]: string } = {b_1_5: "آنلاین", b_1_6: "آنلاین گروهی", b_1_7: "معمولی"};
  columnTitles_b1_part3: { [key: string]: string } = {b_1_8: "آنلاین", b_1_9: "آنلاین گروهی", b_1_10: "معمولی"};
  columnTitles_b1_part4: { [key: string]: string } = {b_1_T_1: "آنلاین", b_1_T_2: "آنلاین گروهی", b_1_T_3: "آنلاین الگوریتمی", b_1_T_4: "معمولی"};
  columnTitles_b2_part1: { [key: string]: string } = {b_2_1: "آنلاین", b_2_2: "آنلاین گروهی", b_2_3: "معاملات الگوریتمی", b_2_4: "معمولی"};
  columnTitles_b2_part2: { [key: string]: string } = {b_2_5: "آنلاین", b_2_6: "آنلاین گروهی", b_2_7: "معاملات الگوریتمی", b_2_8: "معمولی"};
  columnTitles_b2_part3: { [key: string]: string } = {b_2_9: "آنلاین", b_2_10: "معمولی"};
  columnTitles_b2_part4: { [key: string]: string } = {b_2_11: "آنلاین", b_2_12: "معمولی"};
  columnTitles_b2_part5: { [key: string]: string } = {b_2_T_1: "آنلاین", b_2_T_2: "آنلاین گروهی", b_2_T_3: "معاملات الگوریتمی", b_2_T_4: "معمولی"};
  columnTitles_b3_part1: { [key: string]: string } = {b_3_1: "آنلاین", b_3_2: "آنلاین گروهی", b_3_3: "بازارگردان الگوریتمی", b_3_4: "معمولی"};
  columnTitles_b3_part2: { [key: string]: string } = {b_3_T_1: "آنلاین", b_3_T_2: "آنلاین گروهی", b_3_T_3: "بازارگردان الگوریتمی", b_3_T_4: "معمولی"};
  columnTitles_b4_part1: { [key: string]: string } = {b_4_1: "آنلاین", b_4_2: "آنلاین گروهی", b_4_3: "بازارگردان الگوریتمی", b_4_4: "معمولی"};
  columnTitles_b4_part2: { [key: string]: string } = {b_4_5: "آنلاین", b_4_6: "آنلاین گروهی", b_4_7: "بازارگردان الگوریتمی", b_4_8: "معمولی"};
  columnTitles_b4_part3: { [key: string]: string } = {b_4_T_1: "آنلاین", b_4_T_2: "آنلاین گروهی", b_4_T_3: "بازارگردان الگوریتمی", b_4_T_4: "معمولی"};
  columnTitles_b5: { [key: string]: string } = {b_5_1: "آنلاین", b_5_2: "آنلاین گروهی", b_5_3: "بازارگردان الگوریتمی", b_5_4: "معمولی"};
  columnTitles_bt: { [key: string]: string } = {bt: "کل معاملات بورس اوراق بهادار"};
  columnTitles_f: { [key: string]: string } = {
    f_1_1: "ایستگاه کارگزاری - سهام",
    f_1_2: "ایستگاه کارگزاری - اوراق مالی اسلامی",
    f_1_3: "ایستگاه کارگزاری - صندوق سرمایه‌گذاری",
    f_1_4: "ایستگاه کارگزاری - گواهی تسهیلات مسکن",
    f_1_5: "ایستگاه کارگزاری - ابزارهای مشتقه",
    f_1_T: "جمع کل ایستگاه کارگزاری"
  }
  columnTitles_k: { [key: string]: string } = {
    k_1: "معاملات فیزیکی",
    k_2: "معاملات سلف موازی",
    k_3: "معاملات آتی",
    k_4: "معاملات اختیار معامله",
    kt: "جمع کل معاملات بورس کالا"
  }

  async ngOnInit() {
    if (this.auth.getUserRole() !== "Owner" && this.auth.getUserName() !== 'Mobin.CEO' && this.auth.getUserName() !== 'Pishro.CEO' && this.auth.getUserName() !== 'Khobregan.CEO' && this.auth.getUserName() !== 'Pouyan.CEO') {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }
    this.series_data.push(await this.getData.GetProfit("1404-04").toPromise());
    this.flag_data = true;
    this.toast.info({detail: "تغییرات ظاهری", summary: "درحال حاضر شما در حال مشاهده نسخه بتا این صفحه میباشید و بزودی تغییرات ظاهری اعمال خواهد شد، باتشکر", duration: 5000, position: 'topRight'});
  }

  protected readonly Object = Object;
}
