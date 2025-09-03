import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";
import {BrokerageService} from "../../../../services/brokerage.service";
import {BrokerageProfitService} from "../../../../services/brokerage-profit.service";
import {findIndex} from "rxjs";

@Component({
  selector: 'app-brokerage-profit-cmp',
  imports: [
    DashboardSidebarComponent,
    MatProgressSpinner,
    MatTab,
    MatTabGroup,
    NgForOf,
    NgIf,
    DecimalPipe
  ],
  providers: [DatePipe],
  templateUrl: './brokerage-profit-cmp.component.html',
  styleUrl: './brokerage-profit-cmp.component.scss'
})
export class BrokerageProfitCmpComponent implements OnInit {
  public constructor(private auth:AuthService, private getData:BrokerageProfitService, private getDataBrokerage:BrokerageService, private router:Router, private toast:NgToastService) {}
  series_date:any = [];
  selected_date:any = [];
  series_data:any = [];
  brokerage_name:any = '';
  brokerage_logo:any = '';
  protected flag_date:boolean=false;
  protected flag_data:boolean=false;
  protected flag_all_brokers:boolean=false;
  years:any = [];
  all_brokers:any[] = [];
  comparison_list:any[] = [];
  list:any[]=[];

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
  Columns_f1: string[] = ['f_1_1', 'f_1_2', 'f_1_3', 'f_1_4', 'f_1_T'];
  Columns_f2: string[] = ['f_2_1', 'f_2_2', 'f_2_3', 'f_2_4', 'f_2_T'];
  Columns_f3: string[] = ['f_3_1', 'f_3_2', 'f_3_3', 'f_3_4', 'f_3_T'];
  Columns_f4: string[] = ['f_4_1', 'f_4_2', 'f_4_3', 'f_4_4', 'f_4_T'];
  Columns_ft: string[] = ['ft'];
  Columns_bft: string[] = ['bft'];
  Columns_k: string[] = ['k_1', 'k_2', 'k_3', 'k_4', 'kt'];
  Columns_kt: string[] = ['kt'];
  Columns_t: string[] = ['t'];

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
  columnTitles_f1: { [key: string]: string } = {f_1_1: "سهام", f_1_2: "اوراق مالی اسلامی", f_1_3: "صندوق سرمایه‌گذاری", f_1_4: "گواهی تسهیلات مسکن", f_1_5: "ابزارهای مشتقه", f_1_T: "جمع کل"}
  columnTitles_f2: { [key: string]: string } = {f_2_1: "سهام", f_2_2: "اوراق مالی اسلامی", f_2_3: "صندوق سرمایه‌گذاری", f_2_4: "گواهی تسهیلات مسکن", f_2_5: "ابزارهای مشتقه", f_2_T: "جمع کل"}
  columnTitles_f3: { [key: string]: string } = {f_3_1: "سهام", f_3_2: "اوراق مالی اسلامی", f_3_3: "صندوق سرمایه‌گذاری", f_3_4: "گواهی تسهیلات مسکن", f_3_5: "ابزارهای مشتقه", f_3_T: "جمع کل"}
  columnTitles_f4: { [key: string]: string } = {f_4_1: "سهام", f_4_2: "اوراق مالی اسلامی", f_4_3: "صندوق سرمایه‌گذاری", f_4_4: "گواهی تسهیلات مسکن", f_4_5: "ابزارهای مشتقه", f_4_T: "جمع کل"}
  columnTitles_ft: { [key: string]: string } = {ft: "کل معاملات فرابورس"};
  columnTitles_bft: { [key: string]: string } = {bft: "کل معاملات بورس و فرابورس"};
  columnTitles_k: { [key: string]: string } = {k_1: "معاملات فیزیکی", k_2: "معاملات سلف موازی", k_3: "معاملات آتی", k_4: "معاملات اختیار معامله", kt: "جمع کل"}
  columnTitles_kt: { [key: string]: string } = {kt: "کل معاملات بورس کالا"}
  columnTitles_t: { [key: string]: string } = {t: "کل معاملات در بورس‌ها و فرابورس"}


  async ngOnInit(){
    if (this.auth.getUserRole() !== "Owner" && this.auth.getUserName() !== 'Mobin.CEO' && this.auth.getUserName() !== 'Pishro.CEO' && this.auth.getUserName() !== 'Khobregan.CEO' && this.auth.getUserName() !== 'Pouyan.CEO' && this.auth.getUserName() !== 'Hosseinpoor.Pishro' && this.auth.getUserName() !== 'Zafarani.pishro') {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }
    if (this.auth.getUserName() == 'nouri.mobin'){
      this.toast.error({ detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight' });
      await this.router.navigate(['profile']);
    }
    let res_brokerage_name = await this.getDataBrokerage.Get_Brokerage_Name().toPromise();
    this.brokerage_name = res_brokerage_name[0].name;
    this.brokerage_logo = "assets/images/brokers/" + res_brokerage_name[0].logo;
    this.series_date = await this.getData.GetDateList().toPromise();
    this.series_date = this.series_date.sort((a:any, b:any) => {
      let [yearA, monthA] = a.split('-').map(Number);
      let [yearB, monthB] = b.split('-').map(Number);
      if (yearA === yearB) {
        return monthA - monthB;
      } else {
        return yearA - yearB;
      }
    });
    this.years = this.series_date.reduce((acc:any, date:any) => {
      const [year] = date.split('-');
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(date);
      return acc;
    }, {});
    if (this.series_date.length == 0){
      this.toast.error({ detail: "ERROR", summary: 'Your Selected Brokerage, Don\'t Have a Data', duration: 5000, position: 'topRight' });
    }
    if (this.series_date.length >= 1){
      this.selected_date.push(this.series_date[this.series_date.length-1]);
      this.flag_date = true;
      await this.do(this.selected_date);
    }
    this.onShowAllBrokers(this.selected_date);
  }

  async do(selected_date:string){
    this.flag_data = false;
    this.series_data = [];
    this.list = [];
    this.series_data.push(await this.getData.GetProfit(selected_date).toPromise());
    this.list.push(this.brokerage_name);
    for (const item of this.comparison_list)
    {
      this.series_data.push(await this.getData.GetProfitById(item.id,selected_date).toPromise());
      this.list.push(item.name);
    }
    this.flag_data = true;
  }

  onCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      if (this.selected_date.length > 0){
        const index = this.selected_date.indexOf(item);
        this.selected_date.splice(index, 1);
      }
      if (!this.selected_date.includes(item)) {
        this.selected_date.push(item);
      }
    } else {
      const index = this.selected_date.indexOf(item);
      if (index > -1) {
        this.selected_date.splice(index, 1);
      }
    }
    this.onShowAllBrokers(this.selected_date[0]);
    this.comparison_list = [];
  }

  async onShowAllBrokers(selected_date:string){
    this.flag_all_brokers = false;
    this.all_brokers = await this.getData.GetBrokersOnDate(selected_date).toPromise();
    const self_broker = this.all_brokers.find(t => t.name === this.brokerage_name);
    this.all_brokers = this.all_brokers.filter(t => t !== self_broker);
    this.flag_all_brokers = true;
  }

  addToComparison(broker: any) {
    if (this.comparison_list.length < 3) {
      const index = this.all_brokers.indexOf(broker);
      if (index !== -1) {
        this.all_brokers.splice(index, 1);
        this.comparison_list.push(broker);
      }
    } else {
      this.toast.warning({ detail: "هشدار", summary: 'نمیتوانید بیشتر از سه کارگزاری را در لیست مقایسه اضافه کنید!', duration: 1500, position: 'topRight' });
    }
  }

  removeFromComparison(broker: any) {
    const index = this.comparison_list.indexOf(broker);
    if (index !== -1) {
      this.comparison_list.splice(index, 1);
      this.all_brokers.push(broker);
    }
  }

  protected readonly Object = Object;
  protected readonly findIndex = findIndex;
}
