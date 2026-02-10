import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DashboardSidebarComponent } from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { DashboardTopmenuComponent } from '../../Template/dashboard-topmenu/dashboard-topmenu.component';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { NgForOf, NgIf } from "@angular/common";
import { NgxEchartsDirective } from "ngx-echarts";
import { NgToastService } from "ng-angular-popup";
import { BrokerageService } from "../../../services/brokerage.service";
import { EChartsOption } from "echarts";
import { AuthService } from "../../../services/auth.service";
import { FormsModule } from '@angular/forms';
import { GenerateBarChart } from "../../Template/bar-chart/GenerateBarChart";
import { GenerateRadarChart } from "../../Template/radar-chart/GenerateRadarChart";
import { GenerateStackedBarChart } from "../../Template/bar-stacked-chart/GenerateStackedBarChart";

@Component({
  selector: 'app-brokerage-cmp',
  templateUrl: './brokerage-cmp.html',
  imports: [
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
    MatProgressSpinner,
    MatTab,
    MatTabGroup,
    NgForOf,
    NgIf,
    NgxEchartsDirective,
    FormsModule
  ],
  styleUrl: './brokerage-cmp.scss'
})
export class BrokerageCmp implements OnInit {

  constructor(protected auth: AuthService, private toast: NgToastService, private getData: BrokerageService) {}

  series_date: string[] = [];
  years: any = {};
  selected_date: string[] = [];
  all_brokers: any[] = [];
  brokers_list: any[] = [];
  filtered_brokers: any[] = [];
  searchTerm: string = '';
  comparison_list: any[] = [];
  brokerage_name: string = '';
  brokerage_logo: string = '';
  last6_date: string[] = [];
  last6_top: any[] = [];
  Moshtaghe_Table_Data: any[] = [];
  Online_Table_Data: any[] = [];

  label: any = { show: true, fontSize: 14, fontWeight: 'bold', fontFamily: 'Nazanin', position: 'top',
    formatter: (params: any) => {return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');}
  };

  currentMode_Brokerage: 'brokerage' | 'total' = 'brokerage';
  currentMode_BOBT: 'brokerage' | 'total' = 'brokerage';
  currentMode_FI: 'brokerage' | 'total' = 'brokerage';
  currentMode_BKI: 'brokerage' | 'total' = 'brokerage';
  currentMode_BEI: 'brokerage' | 'total' = 'brokerage';
  currentMode_Moshtaghe: 'brokerage' | 'total' = 'brokerage';
  currentMode_Online: 'brokerage' | 'total' = 'brokerage';

  protected flag_top6: boolean = false;
  protected flag_date: boolean = false;
  protected flag_all_brokers: boolean = false;
  protected Flag_Brokerage: boolean = false;

  // Brokerage
  Brokerage_Radar_Indicator: any = [{ name: 'بورس اوراق بهادار', min: 1 }, { name: 'فرابورس', min: 1 }, { name: 'تجمیع بورس اوراق بهادار و فرابورس', min: 1 }, { name: 'بورس کالا', min: 1 }, { name: 'بورس انرژی', min: 1 }, { name: 'ارزش کل معاملات (بورس و فرابورس)', min: 1 }];
  get Brokerage_Bar_Categories(): string[] { return this.Brokerage_Radar_Indicator.map((ind: any) => ind.name) };
  Series_Brokerage_Radar: EChartsOption = {};
  Series_Brokerage_Bar: EChartsOption = {};
  Series_Brokerage_Total_Bar: EChartsOption = {};
  activeSeries_Brokerage: EChartsOption = {};
  Series_Brokerage_Share: EChartsOption = {};
  // BOBT
  BOBT_Radar_Indicator: any = [{ name: 'بازار اوراق بدهی', min: 1 }, { name: 'بازار اوراق مشتقه', min: 1 }, { name: 'بازار سرمایه‌گذار حرفه‌ای', min: 1 }, { name: 'بازار سهام', min: 1 }, { name: 'کل بورس اوراق بهادار', min: 1 }];
  get BOBT_Bar_Categories(): string[] {return this.BOBT_Radar_Indicator.map((ind: any) => ind.name);}
  Series_BOBT_Radar: EChartsOption = {};
  Series_BOBT_Bar: EChartsOption = {};
  Series_BOBT_Total_Bar: EChartsOption = {};
  activeSeries_BOBT: EChartsOption = {};
  Series_BOBT_Share: EChartsOption = {};
  // FI
  FI_Radar_Indicator: any = [{ name: 'معاملات ایستگاه کارگزاری', min: 1 }, { name: 'معاملات برخط عادی', min: 1 }, { name: 'معاملات برخط گروهی', min: 1 }, { name: 'معاملات سایر برخط', min: 1 }, { name: 'کل فرابورس', min: 1 }];
  get FI_Bar_Categories(): string[] {return this.FI_Radar_Indicator.map((ind: any) => ind.name);}
  Series_FI_Radar: EChartsOption = {};
  Series_FI_Bar: EChartsOption = {};
  Series_FI_Total_Bar: EChartsOption = {};
  activeSeries_FI: EChartsOption = {};
  Series_FI_Share: EChartsOption = {};
  // BKI
  BKI_Radar_Indicator: any = [{ name: 'معاملات فیزیکی', min: 1 }, { name: 'معاملات سلف موازی', min: 1 }, { name: 'معاملات آتی', min: 1 }, { name: 'معاملات اختیار معامله', min: 1 }, { name: 'کل بورس کالا', min: 1 }];
  get BKI_Bar_Categories(): string[] {return this.BKI_Radar_Indicator.map((ind: any) => ind.name);}
  Series_BKI_Radar: EChartsOption = {};
  Series_BKI_Bar: EChartsOption = {};
  Series_BKI_Total_Bar: EChartsOption = {};
  activeSeries_BKI: EChartsOption = {};
  Series_BKI_Share: EChartsOption = {};
  // BEI
  BEI_Radar_Indicator: any = [{ name: 'بازار فیزیکی', min: 1 }, { name: 'بازار مشتقه', min: 1 }, { name: 'بازار سایر اوراق بهادار', min: 1 }, { name: 'کل بورس انرژی', min: 1 }];
  get BEI_Bar_Categories(): string[] {return this.BEI_Radar_Indicator.map((ind: any) => ind.name);}
  Series_BEI_Radar: EChartsOption = {};
  Series_BEI_Bar: EChartsOption = {};
  Series_BEI_Total_Bar: EChartsOption = {};
  activeSeries_BEI: EChartsOption = {};
  Series_BEI_Share: EChartsOption = {};
  // Moshtaghe
  Moshtaghe_Bar_Categories: string[] = ['مشتقه بورس-معمولی', 'مشتقه بورس-آنلاین', 'مشتقه فرابورس-ایستگاه', 'مشتقه فرابورس-عادی', 'مشتقه فرابورس-گروهی', 'مشتقه فرابورس-سایر', 'کل مشتقه'];
  Series_Moshtaghe_Bar: EChartsOption = {};
  Series_Moshtaghe_Total_Bar: EChartsOption = {};
  activeSeries_Moshtaghe: EChartsOption = {};
  Series_Moshtaghe_Share: EChartsOption = {};
  // Online
  Online_Bar_Categories: string[] = ['بدهی-آنلاین', 'مشتقه-آنلاین', 'حرفه‌ای-آنلاین', 'حرفه‌ای-الگوریتم', 'سهام-آنلاین', 'سهام-الگوریتم', 'صندوق-آنلاین', 'صندوق-الگوریتم', 'فرابورس-عادی', 'فرابورس-گروهی', 'فرابورس-سایر', 'کل آنلاین'];
  Series_Online_Bar: EChartsOption = {};
  Series_Online_Total_Bar: EChartsOption = {};
  activeSeries_Online: EChartsOption = {};
  Series_Online_Share: EChartsOption = {};

  async ngOnInit() {
    if (!this.auth.hasPermission('brokerageCMP.view')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    try {
      let res_brokerage_name = await this.getData.Get_Brokerage_Name().toPromise();
      this.brokerage_name = "کارگزاری " + res_brokerage_name.name;
      this.brokerage_logo = "assets/images/brokers/" + res_brokerage_name.logo;
      this.series_date = await this.getData.get_AllDate().toPromise();
      this.series_date = this.series_date.sort((a: string, b: string) => {
        let [yearA, monthA] = a.split('-').map(Number);
        let [yearB, monthB] = b.split('-').map(Number);
        if (yearA === yearB) {
          return monthA - monthB;
        } else {
          return yearA - yearB;
        }
      });

      this.last6_date = this.series_date.slice(-6).reverse();
      for (const date of this.last6_date) {
        const topData = await this.getData.get_Top_Brokers(date).toPromise();
        this.last6_top.push(topData);
      }
      this.flag_top6 = true;

      this.years = this.series_date.reduce((acc: any, date: string) => {
        let [year] = date.split('-');
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(date);
        return acc;
      }, {});

      if (this.series_date.length == 0) {
        this.toast.error({ detail: "ERROR", summary: 'Your Selected Brokerage, Don\'t Have a Data', duration: 5000, position: 'topRight' });
      }

      if (this.series_date.length >= 1) {
        this.selected_date.push(this.series_date[this.series_date.length - 1]);
        this.flag_date = true;
        await this.loadAllBrokers();
        await this.do();
      }
    } catch (error: any) {
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async do() {
    if (this.selected_date.length === 0) {
      this.toast.warning({ detail: "هشدار", summary: 'لطفا یک تاریخ انتخاب کنید', duration: 3000, position: 'topRight' });
      return;
    }
    try {
      this.Flag_Brokerage = false;
      this.brokers_list = [this.brokerage_name.replace('کارگزاری ', '')];

      this.Series_Brokerage_Radar = {};
      this.Series_Brokerage_Bar = {};
      this.Series_Brokerage_Total_Bar = {};
      this.Series_Brokerage_Share = {};
      this.Series_BOBT_Radar = {};
      this.Series_BOBT_Bar = {};
      this.Series_BOBT_Total_Bar = {};
      this.Series_FI_Radar = {};
      this.Series_FI_Bar = {};
      this.Series_FI_Total_Bar = {};
      this.Series_BKI_Radar = {};
      this.Series_BKI_Bar = {};
      this.Series_BKI_Total_Bar = {};
      this.Series_BEI_Radar = {};
      this.Series_BEI_Bar = {};
      this.Series_BEI_Total_Bar = {};
      this.Moshtaghe_Table_Data = [];
      this.Online_Table_Data = [];

      const current_date = this.selected_date[0];
      const [
        resB, resBOBT, resFI, resBKI, resBEI, resM, resO,
        cmpB, cmpBOBT, cmpFI, cmpBKI, cmpBEI, cmpM, cmpO
      ] = await Promise.all([
        // Primary
        this.getData.get_Chart1(current_date).toPromise(),
        this.getData.get_Chart2(current_date).toPromise(),
        this.getData.get_Chart3(current_date).toPromise(),
        this.getData.get_Chart4(current_date).toPromise(),
        this.getData.get_Chart5(current_date).toPromise(),
        this.getData.GetBrokerageMoshtaghe(current_date).toPromise(),
        this.getData.GetBrokerageOnline(current_date).toPromise(),
        // Comparison
        this.fetchComparisonData(current_date, this.comparison_list, (d, id) => this.getData.get_Chart1_CMP(d, id)),
        this.fetchComparisonData(current_date, this.comparison_list, (d, id) => this.getData.get_Chart2_CMP(d, id)),
        this.fetchComparisonData(current_date, this.comparison_list, (d, id) => this.getData.get_Chart3_CMP(d, id)),
        this.fetchComparisonData(current_date, this.comparison_list, (d, id) => this.getData.get_Chart4_CMP(d, id)),
        this.fetchComparisonData(current_date, this.comparison_list, (d, id) => this.getData.get_Chart5_CMP(d, id)),
        this.fetchComparisonData(current_date, this.comparison_list, (d, id) => this.getData.GetBrokerageCMPMoshtaghe(d, id)),
        this.fetchComparisonData(current_date, this.comparison_list, (d, id) => this.getData.GetBrokerageCMPOnline(d, id))
      ]);

      if (this.comparison_list.length >= 1)
        for (let i = 0; i < this.comparison_list.length; i++)
          this.brokers_list.push(this.comparison_list[i].name);

      // Brokerage
      let B_Radar_Data = [], B_Radar_Max_List = [], B_Bar_Data = [], B_Bar_Legend = [], B_SBar_Data = [], B_SBar_Total_Data= [];
      const RankB = [resB.bobt?.rank || 0, resB.fi?.rank || 0, resB.bobT_AND_FI?.rank || 0, resB.bki?.rank || 0, resB.bei?.rank || 0, resB.all?.rank || 0];
      const ValueB = [resB.bobt?.value || 0, resB.fi?.value || 0, resB.bobT_AND_FI?.value || 0, resB.bki?.value || 0, resB.bei?.value || 0, resB.all?.value || 0];
      const TotalB = [resB.bobt?.total || 0, resB.fi?.total || 0, resB.bobT_AND_FI?.total || 0, resB.bki?.total || 0, resB.bei?.total || 0, resB.all?.total || 0];
      B_Radar_Data.push({ name: this.brokerage_name, value: RankB });
      B_Radar_Max_List.push(Math.max(...RankB));
      B_Bar_Data.push({ name: this.brokerage_name, type: 'bar', data: ValueB, label: this.label });
      B_Bar_Legend.push(this.brokerage_name);
      B_SBar_Data.push(ValueB);
      B_SBar_Total_Data.push(TotalB);
      cmpB.forEach((res, i) => {
        const cRank = [res.bobt?.rank || 0, res.fi?.rank || 0, res.bobT_AND_FI?.rank || 0, res.bki?.rank || 0, res.bei?.rank || 0, res.all?.rank || 0];
        B_Radar_Data.push({ name: this.comparison_list[i].name, value: cRank });
        B_Radar_Max_List.push(Math.max(...cRank));
        B_Bar_Data.push({ name: this.comparison_list[i].name, type: 'bar', data: [res.bobt?.value || 0, res.fi?.value || 0, res.bobT_AND_FI?.value || 0, res.bki?.value || 0, res.bei?.value || 0, res.all?.value || 0], label: this.label });
        B_SBar_Data.push([res.bobt?.value || 0, res.fi?.value || 0, res.bobT_AND_FI?.value || 0, res.bki?.value || 0, res.bei?.value || 0, res.all?.value || 0]);
        B_SBar_Total_Data.push([res.bobt?.total || 0, res.fi?.total || 0, res.bobT_AND_FI?.total || 0, res.bki?.total || 0, res.bei?.total || 0, res.all?.total || 0]);
        B_Bar_Legend.push(this.comparison_list[i].name);
      });
      this.Brokerage_Radar_Indicator.forEach((ind: any) => ind.max = Math.max(...B_Radar_Max_List) + 5);
      this.Series_Brokerage_Radar = GenerateRadarChart('رتبه کارگزاری', this.Brokerage_Radar_Indicator, B_Radar_Data, B_Bar_Legend);
      this.Series_Brokerage_Bar = GenerateBarChart('ارزش کارگزاری', B_Bar_Legend, this.Brokerage_Bar_Categories, B_Bar_Data);
      this.Series_Brokerage_Total_Bar = GenerateBarChart('ارزش کل', [current_date], this.Brokerage_Bar_Categories, [{name: current_date, type: 'bar', data: TotalB, label: this.label}]);
      this.Series_Brokerage_Share = GenerateStackedBarChart('سهم از بازار: نگاه کلی', ['بورس','فرابورس','بورس و فرابورس','کالا','انرژی','کل'], this.brokers_list, B_SBar_Data, B_SBar_Total_Data);
      this.activeSeries_Brokerage = this.Series_Brokerage_Bar;
      // BOBT
      let BOBT_Radar_Data = [], BOBT_Radar_Max_List = [], BOBT_Bar_Data = [], BOBT_Bar_Legend = [], BOBT_SBar_Data = [], BOBT_SBar_Total_Data = [];
      const RankBOBT = [resBOBT.bobT_Oragh_Bedehi?.rank || 0, resBOBT.bobT_Moshtaghe?.rank || 0, resBOBT.bobT_Sarmaye_Herfei?.rank || 0, resBOBT.bobT_Saham?.rank || 0, resBOBT.bobT_Total?.rank || 0];
      const ValueBOBT = [resBOBT.bobT_Oragh_Bedehi?.value || 0, resBOBT.bobT_Moshtaghe?.value || 0, resBOBT.bobT_Sarmaye_Herfei?.value || 0, resBOBT.bobT_Saham?.value || 0, resBOBT.bobT_Total?.value || 0];
      const TotalBOBT = [resBOBT.bobT_Oragh_Bedehi?.total || 0, resBOBT.bobT_Moshtaghe?.total || 0, resBOBT.bobT_Sarmaye_Herfei?.total || 0, resBOBT.bobT_Saham?.total || 0, resBOBT.bobT_Total?.total || 0];
      BOBT_Radar_Data.push({ name: this.brokerage_name, value: RankBOBT });
      BOBT_Radar_Max_List.push(Math.max(...RankBOBT));
      BOBT_Bar_Data.push({ name: this.brokerage_name, type: 'bar', data: ValueBOBT, label: this.label });
      BOBT_Bar_Legend.push(this.brokerage_name);
      BOBT_SBar_Data.push(ValueBOBT);
      BOBT_SBar_Total_Data.push(TotalBOBT);
      cmpBOBT.forEach((res, i) => {
        const cRank = [res.bobT_Oragh_Bedehi?.rank || 0, res.bobT_Moshtaghe?.rank || 0, res.bobT_Sarmaye_Herfei?.rank || 0, res.bobT_Saham?.rank || 0, res.bobT_Total?.rank || 0];
        const cVal = [res.bobT_Oragh_Bedehi?.value || 0, res.bobT_Moshtaghe?.value || 0, res.bobT_Sarmaye_Herfei?.value || 0, res.bobT_Saham?.value || 0, res.bobT_Total?.value || 0];
        const cTot = [res.bobT_Oragh_Bedehi?.total || 0, res.bobT_Moshtaghe?.total || 0, res.bobT_Sarmaye_Herfei?.total || 0, res.bobT_Saham?.total || 0, res.bobT_Total?.total || 0];
        BOBT_Radar_Data.push({ name: this.comparison_list[i].name, value: cRank });
        BOBT_Radar_Max_List.push(Math.max(...cRank));
        BOBT_Bar_Data.push({ name: this.comparison_list[i].name, type: 'bar', data: cVal, label: this.label });
        BOBT_Bar_Legend.push(this.comparison_list[i].name);
        BOBT_SBar_Data.push(cVal);
        BOBT_SBar_Total_Data.push(cTot);
      });
      this.BOBT_Radar_Indicator.forEach((ind: any) => ind.max = Math.max(...BOBT_Radar_Max_List) + 5);
      this.Series_BOBT_Radar = GenerateRadarChart('رتبه بورس اوراق', this.BOBT_Radar_Indicator, BOBT_Radar_Data, BOBT_Bar_Legend);
      this.Series_BOBT_Bar = GenerateBarChart('ارزش بورس اوراق', BOBT_Bar_Legend, this.BOBT_Bar_Categories, BOBT_Bar_Data);
      this.Series_BOBT_Total_Bar = GenerateBarChart('ارزش کل بورس اوراق', [current_date], this.BOBT_Bar_Categories, [{name: current_date, type: 'bar', data: TotalBOBT, label: this.label}]);
      this.Series_BOBT_Share = GenerateStackedBarChart('سهم از بازار: بورس اوراق', this.BOBT_Bar_Categories, BOBT_Bar_Legend, BOBT_SBar_Data, BOBT_SBar_Total_Data);
      this.activeSeries_BOBT = this.Series_BOBT_Bar;
      // FI
      let FI_Radar_Data = [], FI_Radar_Max_List = [], FI_Bar_Data = [], FI_Bar_Legend = [], FI_SBar_Data = [], FI_SBar_Total_Data = [];
      const RankFI = [resFI.fI_Brokerage_Station?.rank || 0, resFI.fI_Online_Normal?.rank || 0, resFI.fI_Online_Group?.rank || 0, resFI.fI_Online_Other?.rank || 0, resFI.fI_Total?.rank || 0];
      const ValueFI = [resFI.fI_Brokerage_Station?.value || 0, resFI.fI_Online_Normal?.value || 0, resFI.fI_Online_Group?.value || 0, resFI.fI_Online_Other?.value || 0, resFI.fI_Total?.value || 0];
      const TotalFI = [resFI.fI_Brokerage_Station?.total || 0, resFI.fI_Online_Normal?.total || 0, resFI.fI_Online_Group?.total || 0, resFI.fI_Online_Other?.total || 0, resFI.fI_Total?.total || 0];
      FI_Radar_Data.push({ name: this.brokerage_name, value: RankFI });
      FI_Radar_Max_List.push(Math.max(...RankFI));
      FI_Bar_Data.push({ name: this.brokerage_name, type: 'bar', data: ValueFI, label: this.label });
      FI_Bar_Legend.push(this.brokerage_name);
      FI_SBar_Data.push(ValueFI);
      FI_SBar_Total_Data.push(TotalFI);
      cmpFI.forEach((res, i) => {
        const cRank = [res.fI_Brokerage_Station?.rank || 0, res.fI_Online_Normal?.rank || 0, res.fI_Online_Group?.rank || 0, res.fI_Online_Other?.rank || 0, res.fI_Total?.rank || 0];
        const cVal = [res.fI_Brokerage_Station?.value || 0, res.fI_Online_Normal?.value || 0, res.fI_Online_Group?.value || 0, res.fI_Online_Other?.value || 0, res.fI_Total?.value || 0];
        const cTot = [res.fI_Brokerage_Station?.total || 0, res.fI_Online_Normal?.total || 0, res.fI_Online_Group?.total || 0, res.fI_Online_Other?.total || 0, res.fI_Total?.total || 0];
        FI_Radar_Data.push({ name: this.comparison_list[i].name, value: cRank });
        FI_Radar_Max_List.push(Math.max(...cRank));
        FI_Bar_Data.push({ name: this.comparison_list[i].name, type: 'bar', data: cVal, label: this.label });
        FI_Bar_Legend.push(this.comparison_list[i].name);
        FI_SBar_Data.push(cVal);
        FI_SBar_Total_Data.push(cTot);
      });
      this.FI_Radar_Indicator.forEach((ind: any) => ind.max = Math.max(...FI_Radar_Max_List) + 5);
      this.Series_FI_Radar = GenerateRadarChart('رتبه فرابورس', this.FI_Radar_Indicator, FI_Radar_Data, FI_Bar_Legend);
      this.Series_FI_Bar = GenerateBarChart('ارزش فرابورس', FI_Bar_Legend, this.FI_Bar_Categories, FI_Bar_Data);
      this.Series_FI_Total_Bar = GenerateBarChart('ارزش کل فرابورس', [current_date], this.FI_Bar_Categories, [{name: current_date, type: 'bar', data: TotalFI, label: this.label}]);
      this.Series_FI_Share = GenerateStackedBarChart('سهم از بازار: فرابورس', this.FI_Bar_Categories, FI_Bar_Legend, FI_SBar_Data, FI_SBar_Total_Data);
      this.activeSeries_FI = this.Series_FI_Bar;
      // BKI
      let BKI_Radar_Data = [], BKI_Radar_Max_List = [], BKI_Bar_Data = [], BKI_Bar_Legend = [], BKI_SBar_Data = [], BKI_SBar_Total_Data = [];
      const RankBKI = [resBKI.bkI_Physical?.rank || 0, resBKI.bkI_Self?.rank || 0, resBKI.bkI_Ati?.rank || 0, resBKI.bkI_Ekhtiar?.rank || 0, resBKI.bkI_Total?.rank || 0];
      const ValueBKI = [resBKI.bkI_Physical?.value || 0, resBKI.bkI_Self?.value || 0, resBKI.bkI_Ati?.value || 0, resBKI.bkI_Ekhtiar?.value || 0, resBKI.bkI_Total?.value || 0];
      const TotalBKI = [resBKI.bkI_Physical?.total || 0, resBKI.bkI_Self?.total || 0, resBKI.bkI_Ati?.total || 0, resBKI.bkI_Ekhtiar?.total || 0, resBKI.bkI_Total?.total || 0];
      BKI_Radar_Data.push({ name: this.brokerage_name, value: RankBKI });
      BKI_Radar_Max_List.push(Math.max(...RankBKI));
      BKI_Bar_Data.push({ name: this.brokerage_name, type: 'bar', data: ValueBKI, label: this.label });
      BKI_Bar_Legend.push(this.brokerage_name);
      BKI_SBar_Data.push(ValueBKI);
      BKI_SBar_Total_Data.push(TotalBKI);
      cmpBKI.forEach((res, i) => {
        const cRank = [res.bkI_Physical?.rank || 0, res.bkI_Self?.rank || 0, res.bkI_Ati?.rank || 0, res.bkI_Ekhtiar?.rank || 0, res.bkI_Total?.rank || 0];
        const cVal = [res.bkI_Physical?.value || 0, res.bkI_Self?.value || 0, res.bkI_Ati?.value || 0, res.bkI_Ekhtiar?.value || 0, res.bkI_Total?.value || 0];
        const cTot = [res.bkI_Physical?.total || 0, res.bkI_Self?.total || 0, res.bkI_Ati?.total || 0, res.bkI_Ekhtiar?.total || 0, res.bkI_Total?.total || 0];
        BKI_Radar_Data.push({ name: this.comparison_list[i].name, value: cRank });
        BKI_Radar_Max_List.push(Math.max(...cRank));
        BKI_Bar_Data.push({ name: this.comparison_list[i].name, type: 'bar', data: cVal, label: this.label });
        BKI_Bar_Legend.push(this.comparison_list[i].name);
        BKI_SBar_Data.push(cVal);
        BKI_SBar_Total_Data.push(cTot);
      });
      this.BKI_Radar_Indicator.forEach((ind: any) => ind.max = Math.max(...BKI_Radar_Max_List) + 5);
      this.Series_BKI_Radar = GenerateRadarChart('رتبه بورس کالا', this.BKI_Radar_Indicator, BKI_Radar_Data, BKI_Bar_Legend);
      this.Series_BKI_Bar = GenerateBarChart('ارزش بورس کالا', BKI_Bar_Legend, this.BKI_Bar_Categories, BKI_Bar_Data);
      this.Series_BKI_Total_Bar = GenerateBarChart('ارزش کل بورس کالا', [current_date], this.BKI_Bar_Categories, [{name: current_date, type: 'bar', data: TotalBKI, label: this.label}]);
      this.Series_BKI_Share = GenerateStackedBarChart('سهم از بازار: بورس کالا', this.BKI_Bar_Categories, BKI_Bar_Legend, BKI_SBar_Data, BKI_SBar_Total_Data);
      this.activeSeries_BKI = this.Series_BKI_Bar;
      // BEI
      let BEI_Radar_Data = [], BEI_Radar_Max_List = [], BEI_Bar_Data = [], BEI_Bar_Legend = [], BEI_SBar_Data = [], BEI_SBar_Total_Data = [];
      const RankBEI = [resBEI.beI_Physical?.rank || 0, resBEI.beI_Moshtaghe?.rank || 0, resBEI.beI_Other?.rank || 0, resBEI.beI_Total?.rank || 0];
      const ValueBEI = [resBEI.beI_Physical?.value || 0, resBEI.beI_Moshtaghe?.value || 0, resBEI.beI_Other?.value || 0, resBEI.beI_Total?.value || 0];
      const TotalBEI = [resBEI.beI_Physical?.total || 0, resBEI.beI_Moshtaghe?.total || 0, resBEI.beI_Other?.total || 0, resBEI.beI_Total?.total || 0];
      BEI_Radar_Data.push({ name: this.brokerage_name, value: RankBEI });
      BEI_Radar_Max_List.push(Math.max(...RankBEI));
      BEI_Bar_Data.push({ name: this.brokerage_name, type: 'bar', data: ValueBEI, label: this.label });
      BEI_Bar_Legend.push(this.brokerage_name);
      BEI_SBar_Data.push(ValueBEI);
      BEI_SBar_Total_Data.push(TotalBEI);
      cmpBEI.forEach((res, i) => {
        const cRank = [res.beI_Physical?.rank || 0, res.beI_Moshtaghe?.rank || 0, res.beI_Other?.rank || 0, res.beI_Total?.rank || 0];
        const cVal = [res.beI_Physical?.value || 0, res.beI_Moshtaghe?.value || 0, res.beI_Other?.value || 0, res.beI_Total?.value || 0];
        const cTot = [res.beI_Physical?.total || 0, res.beI_Moshtaghe?.total || 0, res.beI_Other?.total || 0, res.beI_Total?.total || 0];
        BEI_Radar_Data.push({ name: this.comparison_list[i].name, value: cRank });
        BEI_Radar_Max_List.push(Math.max(...cRank));
        BEI_Bar_Data.push({ name: this.comparison_list[i].name, type: 'bar', data: cVal, label: this.label });
        BEI_Bar_Legend.push(this.comparison_list[i].name);
        BEI_SBar_Data.push(cVal);
        BEI_SBar_Total_Data.push(cTot);
      });
      this.BEI_Radar_Indicator.forEach((ind: any) => ind.max = Math.max(...BEI_Radar_Max_List) + 5);
      this.Series_BEI_Radar = GenerateRadarChart('رتبه بورس انرژی', this.BEI_Radar_Indicator, BEI_Radar_Data, BEI_Bar_Legend);
      this.Series_BEI_Bar = GenerateBarChart('ارزش بورس انرژی', BEI_Bar_Legend, this.BEI_Bar_Categories, BEI_Bar_Data);
      this.Series_BEI_Total_Bar = GenerateBarChart('ارزش کل بورس انرژی', [current_date], this.BEI_Bar_Categories, [{name: current_date, type: 'bar', data: TotalBEI, label: this.label}]);
      this.Series_BEI_Share = GenerateStackedBarChart('سهم از بازار: بورس انرژی', this.BEI_Bar_Categories, BEI_Bar_Legend, BEI_SBar_Data, BEI_SBar_Total_Data);
      this.activeSeries_BEI = this.Series_BEI_Bar;
      // Moshtaghe
      let M_Bar_Data = [],M_Bar_Total_Data = [], M_Bar_Legend = [], M_SBar_Data = [], M_SBar_Total_Data = [];
      const Value_M = [resM.brokerage_BOBT_Moshtaghe_Normal, resM.brokerage_BOBT_Moshtaghe_Online, resM.brokerage_FI_Moshtaghe_Station, resM.brokerage_FI_Moshtaghe_Normal, resM.brokerage_FI_Moshtaghe_Group, resM.brokerage_FI_Moshtaghe_Other, resM.brokerage_TotalMoshtaghe];
      const Total_M = [resM.bobT_Moshtaghe_Normal, resM.bobT_Moshtaghe_Online, resM.fI_Moshtaghe_Station, resM.fI_Moshtaghe_Normal, resM.fI_Moshtaghe_Group, resM.fI_Moshtaghe_Other, resM.totalMoshtaghe];
      M_Bar_Data.push({ name: this.brokerage_name, type: 'bar', data: Value_M, label: this.label });
      M_Bar_Total_Data.push({name: current_date, type: 'bar', data: Total_M, label: this.label});
      M_Bar_Legend.push(this.brokerage_name);
      M_SBar_Data.push(Value_M);
      M_SBar_Total_Data.push(Total_M);
      resM.name = this.brokerage_name;
      this.Moshtaghe_Table_Data.push(resM);
      cmpM.forEach((res, i) => {
        const Cval = [res.brokerage_BOBT_Moshtaghe_Normal, res.brokerage_BOBT_Moshtaghe_Online, res.brokerage_FI_Moshtaghe_Station, res.brokerage_FI_Moshtaghe_Normal, res.brokerage_FI_Moshtaghe_Group, res.brokerage_FI_Moshtaghe_Other, res.brokerage_TotalMoshtaghe];
        const CTot = [res.bobT_Moshtaghe_Normal, res.bobT_Moshtaghe_Online, res.fI_Moshtaghe_Station, res.fI_Moshtaghe_Normal, res.fI_Moshtaghe_Group, res.fI_Moshtaghe_Other, res.totalMoshtaghe];
        M_Bar_Data.push({ name: this.comparison_list[i].name, type: 'bar', data: Cval, label: this.label });
        M_Bar_Legend.push(this.comparison_list[i].name);
        M_SBar_Data.push(Cval);
        M_SBar_Total_Data.push(CTot);
        res.name = this.comparison_list[i].name;
        this.Moshtaghe_Table_Data.push(res);
      });
      this.Series_Moshtaghe_Bar = GenerateBarChart('مشتقات-کارگزاری', M_Bar_Legend, this.Moshtaghe_Bar_Categories, M_Bar_Data);
      this.Series_Moshtaghe_Total_Bar = GenerateBarChart('مشتقات-کل', [current_date], this.Moshtaghe_Bar_Categories, M_Bar_Total_Data);
      this.Series_Moshtaghe_Share = GenerateStackedBarChart('سهم از بازار: مشتقه', this.Moshtaghe_Bar_Categories, M_Bar_Legend, M_SBar_Data, M_SBar_Total_Data);
      this.activeSeries_Moshtaghe = this.Series_Moshtaghe_Bar;
      // Online
      let O_Bar_Data = [],O_Bar_Total_Data = [], O_Bar_Legend = [], O_SBar_Data = [], O_SBar_Total_Data = [];
      const Value_O = [resO.brokerage_BOBT_Oragh_Bedehi_Online, resO.brokerage_BOBT_Moshtaghe_Online, resO.brokerage_BOBT_Sarmaye_Herfei_Online, resO.brokerage_BOBT_Sarmaye_Herfei_Algorithm, resO.brokerage_BOBT_saham_Online, resO.brokerage_BOBT_saham_Algorithm, resO.brokerage_BOBT_Sandogh_Online, resO.brokerage_BOBT_Sandogh_Algorithm, resO.brokerage_FI_Online_Normal, resO.brokerage_FI_Online_Group, resO.brokerage_FI_Online_Other, resO.brokerage_TotalOnline];
      const Total_O = [resO.bobT_Oragh_Bedehi_Online, resO.bobT_Moshtaghe_Online, resO.bobT_Sarmaye_Herfei_Online, resO.bobT_Sarmaye_Herfei_Algorithm, resO.bobT_saham_Online, resO.bobT_saham_Algorithm, resO.bobT_Sandogh_Online, resO.bobT_Sandogh_Algorithm, resO.fI_Online_Normal, resO.fI_Online_Group, resO.fI_Online_Other, resO.totalOnline];
      O_Bar_Data.push({ name: this.brokerage_name, type: 'bar', data: Value_O, label: this.label });
      O_Bar_Total_Data.push({name: current_date, type: 'bar', data: Total_O, label: this.label});
      O_Bar_Legend.push(this.brokerage_name);
      O_SBar_Data.push(Value_O);
      O_SBar_Total_Data.push(Total_O);
      resO.name = this.brokerage_name;
      this.Online_Table_Data.push(resO);
      cmpO.forEach((res, i) => {
        const Cval = [res.brokerage_BOBT_Oragh_Bedehi_Online, res.brokerage_BOBT_Moshtaghe_Online, res.brokerage_BOBT_Sarmaye_Herfei_Online, res.brokerage_BOBT_Sarmaye_Herfei_Algorithm, res.brokerage_BOBT_saham_Online, res.brokerage_BOBT_saham_Algorithm, res.brokerage_BOBT_Sandogh_Online, res.brokerage_BOBT_Sandogh_Algorithm, res.brokerage_FI_Online_Normal, res.brokerage_FI_Online_Group, res.brokerage_FI_Online_Other, res.brokerage_TotalOnline];
        const CTot = [res.bobT_Oragh_Bedehi_Online, res.bobT_Moshtaghe_Online, res.bobT_Sarmaye_Herfei_Online, res.bobT_Sarmaye_Herfei_Algorithm, res.bobT_saham_Online, res.bobT_saham_Algorithm, res.bobT_Sandogh_Online, res.bobT_Sandogh_Algorithm, res.fI_Online_Normal, res.fI_Online_Group, res.fI_Online_Other, res.totalOnline];
        O_Bar_Data.push({ name: this.comparison_list[i].name, type: 'bar', data: Cval, label: this.label });
        O_Bar_Legend.push(this.comparison_list[i].name);
        O_SBar_Data.push(Cval);
        O_SBar_Total_Data.push(CTot);
        res.name = this.comparison_list[i].name;
        this.Online_Table_Data.push(res);
      })
      this.Series_Online_Bar = GenerateBarChart('آنلاین-کارگزاری', O_Bar_Legend, this.Online_Bar_Categories, O_Bar_Data);
      this.Series_Online_Total_Bar = GenerateBarChart('آنلاین-کل', [current_date], this.Online_Bar_Categories, O_Bar_Total_Data);
      this.Series_Online_Share = GenerateStackedBarChart('سهم از بازار: آنلاین', this.Online_Bar_Categories, O_Bar_Legend, O_SBar_Data, O_SBar_Total_Data);
      this.activeSeries_Online = this.Series_Online_Bar;
      this.Flag_Brokerage = true;
    } catch (error: any) {
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async fetchComparisonData(date: string, list: any[], apiFunc: (d: string, id: number) => any) {
    const promises = list.map(broker => apiFunc(date, broker.id).toPromise());
    return await Promise.all(promises);
  }

  toggleSectionMode(section: string, mode: 'brokerage' | 'total') {
    switch (section) {
      case 'brokerage': this.currentMode_Brokerage = mode; this.activeSeries_Brokerage = (mode === 'brokerage' ? this.Series_Brokerage_Bar : this.Series_Brokerage_Total_Bar); break;
      case 'bobt': this.currentMode_BOBT = mode; this.activeSeries_BOBT = (mode === 'brokerage' ? this.Series_BOBT_Bar : this.Series_BOBT_Total_Bar); break;
      case 'fi': this.currentMode_FI = mode; this.activeSeries_FI = (mode === 'brokerage' ? this.Series_FI_Bar : this.Series_FI_Total_Bar); break;
      case 'bki': this.currentMode_BKI = mode; this.activeSeries_BKI = (mode === 'brokerage' ? this.Series_BKI_Bar : this.Series_BKI_Total_Bar); break;
      case 'bei': this.currentMode_BEI = mode; this.activeSeries_BEI = (mode === 'brokerage' ? this.Series_BEI_Bar : this.Series_BEI_Total_Bar); break;
      case 'moshtaghe': this.currentMode_Moshtaghe = mode; this.activeSeries_Moshtaghe = (mode === 'brokerage' ? this.Series_Moshtaghe_Bar : this.Series_Moshtaghe_Total_Bar); break;
      case 'online': this.currentMode_Online = mode; this.activeSeries_Online = (mode === 'brokerage' ? this.Series_Online_Bar : this.Series_Online_Total_Bar); break;
    }
  }

  async loadAllBrokers() {
    this.flag_all_brokers = false;

    if (this.selected_date.length === 0) return;

    this.all_brokers = await this.getData.get_All_Brokers(this.selected_date[0]).toPromise();

    // Remove primary brokerage from list
    const selfBroker = this.all_brokers.find((t: any) => t.name === this.brokerage_name.replace('کارگزاری ', ''));
    if (selfBroker) {
      this.all_brokers = this.all_brokers.filter((t: any) => t !== selfBroker);
    }

    // Remove already added brokers
    this.all_brokers = this.all_brokers.filter((broker: any) =>
      !this.comparison_list.some((cmp: any) => cmp.id === broker.id)
    );

    this.filtered_brokers = [...this.all_brokers];
    this.flag_all_brokers = true;
  }

  onCheckboxChange(event: any, item: string) {
    if (event.target.checked) {
      this.selected_date = [item];
      this.flag_date = true;
      this.loadAllBrokers();
      this.do();
    }
  }

  filterBrokers() {
    if (!this.searchTerm) {
      this.filtered_brokers = [...this.all_brokers];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filtered_brokers = this.all_brokers.filter((broker: any) =>
      broker.name.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filtered_brokers = [...this.all_brokers];
  }

  addToComparison(broker: any) {
    if (this.comparison_list.length < 3) {
      const index = this.all_brokers.indexOf(broker);
      if (index !== -1) {
        this.all_brokers.splice(index, 1);
        this.filterBrokers();
        this.comparison_list.push(broker);
      }
    } else {
      this.toast.warning({
        detail: "هشدار",
        summary: 'نمیتوانید بیشتر از سه کارگزاری را در لیست مقایسه اضافه کنید!',
        duration: 1500,
        position: 'topRight'
      });
    }
  }

  removeFromComparison(broker: any) {
    const index = this.comparison_list.indexOf(broker);
    if (index !== -1) {
      this.comparison_list.splice(index, 1);
      this.all_brokers.push(broker);
      this.filterBrokers();
    }
  }

  @ViewChildren('top, select_date, view, bob, fi, bki, bei, moshtaghe, online') sections!: QueryList<ElementRef>;

  ScrollTo(sectionName: string) {
    let section: any = this.sections.find(sec => sec.nativeElement.id == sectionName);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected readonly Object = Object;
  protected readonly Math = Math;
}
