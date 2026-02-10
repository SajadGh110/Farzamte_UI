import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DashboardSidebarComponent } from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { DashboardTopmenuComponent } from '../../Template/dashboard-topmenu/dashboard-topmenu.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgToastService } from "ng-angular-popup";
import { NgForOf, NgIf } from "@angular/common";
import { BrokerageService } from "../../../services/brokerage.service";
import { EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from "../../../services/auth.service";
import { GenerateBarChart } from "../../Template/bar-chart/GenerateBarChart";
import { GenerateRadarChart } from "../../Template/radar-chart/GenerateRadarChart";
import { GenerateStackedBarChart } from "../../Template/bar-stacked-chart/GenerateStackedBarChart";

@Component({
  selector: 'app-brokerages',
  templateUrl: './brokerages.html',
  standalone: true,
  imports: [
    DashboardSidebarComponent, DashboardTopmenuComponent, ReactiveFormsModule,
    NgForOf, FormsModule, NgxEchartsDirective, MatProgressSpinner, NgIf, MatTabsModule
  ],
  styleUrls: ['./brokerages.scss']
})
export class Brokerages implements OnInit {
  public constructor(private toast: NgToastService, private getData: BrokerageService, protected auth: AuthService) { }

  series_date: any = [];
  years: any = [];
  selected_date: any = [];
  brokerage_name: any = '';
  brokerage_logo: any = '';
  Moshtaghe_Table_Data: any[] = [];
  Online_Table_Data: any[] = [];

  label: any = { show: true, fontSize: 14, fontWeight: 'bold', fontFamily: 'Nazanin', position: 'top',
    formatter: (params: any) => { return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  };
  currentMode_Brokerage: 'brokerage' | 'total' = 'brokerage';
  currentMode_BOBT: 'brokerage' | 'total' = 'brokerage';
  currentMode_FI: 'brokerage' | 'total' = 'brokerage';
  currentMode_BKI: 'brokerage' | 'total' = 'brokerage';
  currentMode_BEI: 'brokerage' | 'total' = 'brokerage';
  currentMode_Moshtaghe: 'brokerage' | 'total' = 'brokerage';
  currentMode_Online: 'brokerage' | 'total' = 'brokerage';
  protected flag_date: boolean = false;
  protected Flag_Brokerage: boolean = false;
  protected flag_BOBT: boolean = false;
  protected flag_FI: boolean = false;
  protected flag_BKI: boolean = false;
  protected Flag_BEI: boolean = false;
  protected Flag_Moshtaghe: boolean = false;
  protected Flag_Online: boolean = false;
  // Brokerage
  Brokerage_Radar_Indicator: any = [{ name: 'بورس' }, { name: 'فرابورس' }, { name: 'بورس و فرابورس' }, { name: 'بورس کالا' }, { name: 'بورس انرژی' }, { name: 'ارزش کل معاملات' }];
  get Brokerage_Bar_Categories(): string[] { return this.Brokerage_Radar_Indicator.map((ind: any) => ind.name) };
  Series_Brokerage_Radar: EChartsOption = {};
  Series_Brokerage_Bar: EChartsOption = {};
  Series_Brokerage_Total_Bar: EChartsOption = {};
  activeSeries_Brokerage: EChartsOption = {};
  Series_Brokerage_Share: EChartsOption = {};
  // BOBT
  BOBT_Radar_Indicator: any = [{ name: 'اوراق بدهی' }, { name: 'اوراق مشتقه' }, { name: 'سرمایه‌گذار حرفه‌ای' }, { name: 'بازار سهام' }, { name: 'کل بورس' }];
  get BOBT_Bar_Categories(): string[] { return this.BOBT_Radar_Indicator.map((ind: any) => ind.name) }
  Series_BOBT_Radar: EChartsOption = {};
  Series_BOBT_Bar: EChartsOption = {};
  Series_BOBT_Total_Bar: EChartsOption = {};
  activeSeries_BOBT: EChartsOption = {};
  Series_BOBT_Share: EChartsOption = {};
  // FI
  FI_Radar_Indicator: any = [{ name: 'ایستگاه کارگزاری' }, { name: 'برخط عادی' }, { name: 'برخط گروهی' }, { name: 'سایر برخط' }, { name: 'کل فرابورس' }];
  get FI_Bar_Categories(): string[] { return this.FI_Radar_Indicator.map((ind: any) => ind.name) }
  Series_FI_Radar: EChartsOption = {};
  Series_FI_Bar: EChartsOption = {};
  Series_FI_Total_Bar: EChartsOption = {};
  activeSeries_FI: EChartsOption = {};
  Series_FI_Share: EChartsOption = {};
  // BKI
  BKI_Radar_Indicator: any = [{ name: 'فیزیکی' }, { name: 'سلف موازی' }, { name: 'آتی' }, { name: 'اختیار معامله' }, { name: 'کل بورس کالا' }];
  get BKI_Bar_Categories(): string[] { return this.BKI_Radar_Indicator.map((ind: any) => ind.name) }
  Series_BKI_Radar: EChartsOption = {};
  Series_BKI_Bar: EChartsOption = {};
  Series_BKI_Total_Bar: EChartsOption = {};
  activeSeries_BKI: EChartsOption = {};
  Series_BKI_Share: EChartsOption = {};
  // BEI
  BEI_Radar_Indicator: any = [{ name: 'بازار فیزیکی' }, { name: 'بازار مشتقه' }, { name: 'سایر اوراق' }, { name: 'کل بورس انرژی' }];
  get BEI_Bar_Categories(): string[] { return this.BEI_Radar_Indicator.map((ind: any) => ind.name) }
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
    if (!this.auth.hasPermission('brokerage.view')) return;

    let res_brokerage_name = await this.getData.Get_Brokerage_Name().toPromise();
    this.brokerage_name = "کارگزاری " + res_brokerage_name.name;
    this.brokerage_logo = "assets/images/brokers/" + res_brokerage_name.logo;

    this.series_date = await this.getData.get_AllDate().toPromise();
    this.series_date = this.series_date.sort((a: any, b: any) => {
      let [yA, mA] = a.split('-').map(Number);
      let [yB, mB] = b.split('-').map(Number);
      return yA === yB ? mA - mB : yA - yB;
    });

    this.years = this.series_date.reduce((acc: any, date: any) => {
      let [year] = date.split('-');
      if (!acc[year]) acc[year] = [];
      acc[year].push(date);
      return acc;
    }, {});

    if (this.series_date.length >= 2) {
      this.selected_date = [this.series_date[this.series_date.length - 1], this.series_date[this.series_date.length - 2]];
      this.flag_date = true;
      await this.do(this.selected_date);
    }
  }

  async do(selected_date: any[]) {
    this.resetFlags();
    selected_date.sort((a, b) => a.localeCompare(b));
    this.Moshtaghe_Table_Data = [];
    this.Online_Table_Data = [];
    try {
      let B_Radar_Max = 0, BOBT_Radar_Max = 0, FI_Radar_Max = 0, BKI_Radar_Max = 0, BEI_Radar_Max = 0;
      let B_Radar_Data: any[] = [], BOBT_Radar_Data: any[] = [], FI_Radar_Data: any[] = [], BKI_Radar_Data: any[] = [], BEI_Radar_Data: any[] = [];
      let Legend_Dates: any[] = [];

      let B_Bar_Brokerage: any[] = [], B_Bar_Total: any[] = [], B_SBar_Brokerage: any[] = [], B_SBar_Total: any[] = [];
      let BOBT_Bar_Brokerage: any[] = [], BOBT_Bar_Total: any[] = [], BOBT_SBar_Brokerage: any[] = [], BOBT_SBar_Total: any[] = [];
      let FI_Bar_Brokerage: any[] = [], FI_Bar_Total: any[] = [], FI_SBar_Brokerage: any[] = [], FI_SBar_Total: any[] = [];
      let BKI_Bar_Brokerage: any[] = [], BKI_Bar_Total: any[] = [], BKI_SBar_Brokerage: any[] = [], BKI_SBar_Total: any[] = [];
      let BEI_Bar_Brokerage: any[] = [], BEI_Bar_Total: any[] = [], BEI_SBar_Brokerage: any[] = [], BEI_SBar_Total: any[] = [];
      let M_Bar_Brokerage: any[] = [], M_Bar_Total: any[] = [], M_SBar_Brokerage: any[] = [], M_SBar_Total: any[] = [];
      let O_Bar_Brokerage: any[] = [], O_Bar_Total: any[] = [], O_SBar_Brokerage: any[] = [], O_SBar_Total: any[] = [];

      for (let date of selected_date) {
        Legend_Dates.push(date);
        // ۱. پردازش Chart 1 (Brokerage)
        let res1 = await this.getData.get_Chart1(date).toPromise();
        let rank1 = [res1.bobt?.rank || 0, res1.fi?.rank || 0, res1.bobT_AND_FI?.rank || 0, res1.bki?.rank || 0, res1.bei?.rank || 0, res1.all?.rank || 0];
        let value1 = [res1.bobt?.value || 0, res1.fi?.value || 0, res1.bobT_AND_FI?.value || 0, res1.bki?.value || 0, res1.bei?.value || 0, res1.all?.value || 0];
        let total1 = [res1.bobt?.total || 0, res1.fi?.total || 0, res1.bobT_AND_FI?.total || 0, res1.bki?.total || 0, res1.bei?.total || 0, res1.all?.total || 0];
        B_Radar_Max = Math.max(B_Radar_Max, ...rank1);
        B_Radar_Data.push({ name: date, value: rank1 });
        B_Bar_Brokerage.push({ name: date, type: 'bar', data: value1 , label: this.label });
        B_Bar_Total.push({ name: date, type: 'bar', data: total1, label: this.label });
        B_SBar_Brokerage.push(value1);
        B_SBar_Total.push(total1);
        // ۲. پردازش Chart 2 (BOBT)
        let res2 = await this.getData.get_Chart2(date).toPromise();
        let rank2 = [res2.bobT_Oragh_Bedehi?.rank || 0, res2.bobT_Moshtaghe?.rank || 0, res2.bobT_Sarmaye_Herfei?.rank || 0, res2.bobT_Saham?.rank || 0, res2.bobT_Total?.rank || 0];
        let value2 = [res2.bobT_Oragh_Bedehi?.value || 0, res2.bobT_Moshtaghe?.value || 0, res2.bobT_Sarmaye_Herfei?.value || 0, res2.bobT_Saham?.value || 0, res2.bobT_Total?.value || 0];
        let total2 = [res2.bobT_Oragh_Bedehi?.total || 0, res2.bobT_Moshtaghe?.total || 0, res2.bobT_Sarmaye_Herfei?.total || 0, res2.bobT_Saham?.total || 0, res2.bobT_Total?.total || 0];
        BOBT_Radar_Max = Math.max(BOBT_Radar_Max, ...rank2);
        BOBT_Radar_Data.push({ name: date, value: rank2 });
        BOBT_Bar_Brokerage.push({ name: date, type: 'bar', data: value2, label: this.label });
        BOBT_Bar_Total.push({ name: date, type: 'bar', data: total2, label: this.label });
        BOBT_SBar_Brokerage.push(value2);
        BOBT_SBar_Total.push(total2);
        // ۳. پردازش Chart 3 (FI)
        let res3 = await this.getData.get_Chart3(date).toPromise();
        let rank3 = [res3.fI_Brokerage_Station?.rank || 0, res3.fI_Online_Normal?.rank || 0, res3.fI_Online_Group?.rank || 0, res3.fI_Online_Other?.rank || 0, res3.fI_Total?.rank || 0];
        let value3 = [res3.fI_Brokerage_Station?.value || 0, res3.fI_Online_Normal?.value || 0, res3.fI_Online_Group?.value || 0, res3.fI_Online_Other?.value || 0, res3.fI_Total?.value || 0];
        let total3 = [res3.fI_Brokerage_Station?.total || 0, res3.fI_Online_Normal?.total || 0, res3.fI_Online_Group?.total || 0, res3.fI_Online_Other?.total || 0, res3.fI_Total?.total || 0];
        FI_Radar_Max = Math.max(FI_Radar_Max, ...rank3);
        FI_Radar_Data.push({ name: date, value: rank3 });
        FI_Bar_Brokerage.push({ name: date, type: 'bar', data: value3, label: this.label });
        FI_Bar_Total.push({ name: date, type: 'bar', data: total3, label: this.label });
        FI_SBar_Brokerage.push(value3);
        FI_SBar_Total.push(total3);
        // ۴. پردازش Chart 4 (BKI)
        let res4 = await this.getData.get_Chart4(date).toPromise();
        let rank4 = [res4.bkI_Physical?.rank || 0, res4.bkI_Self?.rank || 0, res4.bkI_Ati?.rank || 0, res4.bkI_Ekhtiar?.rank || 0, res4.bkI_Total?.rank || 0];
        let value4 = [res4.bkI_Physical?.value || 0, res4.bkI_Self?.value || 0, res4.bkI_Ati?.value || 0, res4.bkI_Ekhtiar?.value || 0, res4.bkI_Total?.value || 0];
        let total4 = [res4.bkI_Physical?.total || 0, res4.bkI_Self?.total || 0, res4.bkI_Ati?.total || 0, res4.bkI_Ekhtiar?.total || 0, res4.bkI_Total?.total || 0];
        BKI_Radar_Max = Math.max(BKI_Radar_Max, ...rank4);
        BKI_Radar_Data.push({ name: date, value: rank4 });
        BKI_Bar_Brokerage.push({ name: date, type: 'bar', data: value4, label: this.label });
        BKI_Bar_Total.push({ name: date, type: 'bar', data: total4, label: this.label });
        BKI_SBar_Brokerage.push(value4);
        BKI_SBar_Total.push(total4);
        // ۵. پردازش Chart 5 (BEI)
        let res5 = await this.getData.get_Chart5(date).toPromise();
        let rank5 = [res5.beI_Physical?.rank || 0, res5.beI_Moshtaghe?.rank || 0, res5.beI_Other?.rank || 0, res5.beI_Total?.rank || 0];
        let value5 = [res5.beI_Physical?.value || 0, res5.beI_Moshtaghe?.value || 0, res5.beI_Other?.value || 0, res5.beI_Total?.value || 0];
        let total5 = [res5.beI_Physical?.total || 0, res5.beI_Moshtaghe?.total || 0, res5.beI_Other?.total || 0, res5.beI_Total?.total || 0];
        BEI_Radar_Max = Math.max(BEI_Radar_Max, ...rank5);
        BEI_Radar_Data.push({ name: date, value: rank5 });
        BEI_Bar_Brokerage.push({ name: date, type: 'bar', data: value5, label: this.label });
        BEI_Bar_Total.push({ name: date, type: 'bar', data: total5, label: this.label });
        BEI_SBar_Brokerage.push(value5);
        BEI_SBar_Total.push(total5);
        // مشتقه
        let resM = await this.getData.GetBrokerageMoshtaghe(date).toPromise();
        resM.date = date;
        this.Moshtaghe_Table_Data.push(resM);
        let value_m = [resM.brokerage_BOBT_Moshtaghe_Normal, resM.brokerage_BOBT_Moshtaghe_Online, resM.brokerage_FI_Moshtaghe_Station, resM.brokerage_FI_Moshtaghe_Normal, resM.brokerage_FI_Moshtaghe_Group, resM.brokerage_FI_Moshtaghe_Other, resM.brokerage_TotalMoshtaghe];
        let total_m = [resM.bobT_Moshtaghe_Normal, resM.bobT_Moshtaghe_Online, resM.fI_Moshtaghe_Station, resM.fI_Moshtaghe_Normal, resM.fI_Moshtaghe_Group, resM.fI_Moshtaghe_Other, resM.totalMoshtaghe];
        M_Bar_Brokerage.push({ name: date, type: 'bar', data: value_m, label: this.label });
        M_Bar_Total.push({ name: date, type: 'bar', data: total_m, label: this.label });
        M_SBar_Brokerage.push(value_m);
        M_SBar_Total.push(total_m);
        // آنلاین
        let resO = await this.getData.GetBrokerageOnline(date).toPromise();
        resO.date = date;
        this.Online_Table_Data.push(resO);
        let value_o = [resO.brokerage_BOBT_Oragh_Bedehi_Online, resO.brokerage_BOBT_Moshtaghe_Online, resO.brokerage_BOBT_Sarmaye_Herfei_Online, resO.brokerage_BOBT_Sarmaye_Herfei_Algorithm, resO.brokerage_BOBT_saham_Online, resO.brokerage_BOBT_saham_Algorithm, resO.brokerage_BOBT_Sandogh_Online, resO.brokerage_BOBT_Sandogh_Algorithm, resO.brokerage_FI_Online_Normal, resO.brokerage_FI_Online_Group, resO.brokerage_FI_Online_Other, resO.brokerage_TotalOnline];
        let total_o = [resO.bobT_Oragh_Bedehi_Online, resO.bobT_Moshtaghe_Online, resO.bobT_Sarmaye_Herfei_Online, resO.bobT_Sarmaye_Herfei_Algorithm, resO.bobT_saham_Online, resO.bobT_saham_Algorithm, resO.bobT_Sandogh_Online, resO.bobT_Sandogh_Algorithm, resO.fI_Online_Normal, resO.fI_Online_Group, resO.fI_Online_Other, resO.totalOnline];
        O_Bar_Brokerage.push({ name: date, type: 'bar', data: value_o, label: this.label });
        O_Bar_Total.push({ name: date, type: 'bar', data: total_o, label: this.label });
        O_SBar_Brokerage.push(value_o);
        O_SBar_Total.push(total_o);
      }
      this.Brokerage_Radar_Indicator.forEach((i: any) => i.max = B_Radar_Max + 5);
      this.Series_Brokerage_Radar = GenerateRadarChart('رتبه کارگزاری', this.Brokerage_Radar_Indicator, B_Radar_Data, Legend_Dates);

      this.BOBT_Radar_Indicator.forEach((i: any) => i.max = BOBT_Radar_Max + 5);
      this.Series_BOBT_Radar = GenerateRadarChart('رتبه بورس', this.BOBT_Radar_Indicator, BOBT_Radar_Data, Legend_Dates);

      this.FI_Radar_Indicator.forEach((i: any) => i.max = FI_Radar_Max + 5);
      this.Series_FI_Radar = GenerateRadarChart('رتبه فرابورس', this.FI_Radar_Indicator, FI_Radar_Data, Legend_Dates);

      this.BKI_Radar_Indicator.forEach((i: any) => i.max = BKI_Radar_Max + 5);
      this.Series_BKI_Radar = GenerateRadarChart('رتبه کالا', this.BKI_Radar_Indicator, BKI_Radar_Data, Legend_Dates);

      this.BEI_Radar_Indicator.forEach((i: any) => i.max = BEI_Radar_Max + 5);
      this.Series_BEI_Radar = GenerateRadarChart('رتبه انرژی', this.BEI_Radar_Indicator, BEI_Radar_Data, Legend_Dates);

      this.Series_Brokerage_Bar = GenerateBarChart('ارزش کارگزاری', Legend_Dates, this.Brokerage_Bar_Categories, B_Bar_Brokerage);
      this.Series_Brokerage_Total_Bar = GenerateBarChart('ارزش کل', Legend_Dates, this.Brokerage_Bar_Categories, B_Bar_Total);
      this.Series_Brokerage_Share = GenerateStackedBarChart('سهم از بازار: نگاه کلی', ['بورس','فرابورس','بورس و فرابورس','کالا','انرژی','کل'], this.selected_date, B_SBar_Brokerage, B_SBar_Total);
      this.activeSeries_Brokerage = this.Series_Brokerage_Bar;
      this.Flag_Brokerage = true;

      this.Series_BOBT_Bar = GenerateBarChart('بورس-کارگزاری', Legend_Dates, this.BOBT_Bar_Categories, BOBT_Bar_Brokerage);
      this.Series_BOBT_Total_Bar = GenerateBarChart('بورس-کل', Legend_Dates, this.BOBT_Bar_Categories, BOBT_Bar_Total);
      this.Series_BOBT_Share = GenerateStackedBarChart('سهم از بازار: بورس', ['اوراق بدهی','اوراق مشتقه','سرمایه‌گذار حرفه‌ای','بازار سهام','کل بورس'], this.selected_date, BOBT_SBar_Brokerage, BOBT_SBar_Total);
      this.activeSeries_BOBT = this.Series_BOBT_Bar;
      this.flag_BOBT = true;

      this.Series_FI_Bar = GenerateBarChart('فرابورس-کارگزاری', Legend_Dates, this.FI_Bar_Categories, FI_Bar_Brokerage);
      this.Series_FI_Total_Bar = GenerateBarChart('فرابورس-کل', Legend_Dates, this.FI_Bar_Categories, FI_Bar_Total);
      this.Series_FI_Share = GenerateStackedBarChart('سهم از بازار: فرابورس', ['ایستگاه کارگزاری','برخط عادی','برخط گروهی','سایر برخط','کل فرابورس'], this.selected_date, FI_SBar_Brokerage, FI_SBar_Total);
      this.activeSeries_FI = this.Series_FI_Bar;
      this.flag_FI = true;

      this.Series_BKI_Bar = GenerateBarChart('کالا-کارگزاری', Legend_Dates, this.BKI_Bar_Categories, BKI_Bar_Brokerage);
      this.Series_BKI_Total_Bar = GenerateBarChart('کالا-کل', Legend_Dates, this.BKI_Bar_Categories, BKI_Bar_Total);
      this.Series_BKI_Share = GenerateStackedBarChart('سهم از بازار: بورس کالا', ['فیزیکی','سلف موازی','آتی','اختیار معامله','کل بورس کالا'], this.selected_date, BKI_SBar_Brokerage, BKI_SBar_Total);
      this.activeSeries_BKI = this.Series_BKI_Bar;
      this.flag_BKI = true;

      this.Series_BEI_Bar = GenerateBarChart('انرژی-کارگزاری', Legend_Dates, this.BEI_Bar_Categories, BEI_Bar_Brokerage);
      this.Series_BEI_Total_Bar = GenerateBarChart('انرژی-کل', Legend_Dates, this.BEI_Bar_Categories, BEI_Bar_Total);
      this.Series_BEI_Share = GenerateStackedBarChart('سهم از بازار: بورس انرژی', ['بازار فیزیکی','بازار مشتقه','سایر اوراق','کل بورس انرژی'], this.selected_date, BEI_SBar_Brokerage, BEI_SBar_Total);
      this.activeSeries_BEI = this.Series_BEI_Bar;
      this.Flag_BEI = true;

      this.Series_Moshtaghe_Bar = GenerateBarChart('مشتقات-کارگزاری', Legend_Dates, this.Moshtaghe_Bar_Categories, M_Bar_Brokerage);
      this.Series_Moshtaghe_Total_Bar = GenerateBarChart('مشتقات-کل', Legend_Dates, this.Moshtaghe_Bar_Categories, M_Bar_Total);
      this.Series_Moshtaghe_Share = GenerateStackedBarChart('سهم از بازار: مشتقه', this.Moshtaghe_Bar_Categories, this.selected_date, M_SBar_Brokerage, M_SBar_Total);
      this.activeSeries_Moshtaghe = this.Series_Moshtaghe_Bar;
      this.Flag_Moshtaghe = true;

      this.Series_Online_Bar = GenerateBarChart('آنلاین-کارگزاری', Legend_Dates, this.Online_Bar_Categories, O_Bar_Brokerage);
      this.Series_Online_Total_Bar = GenerateBarChart('آنلاین-کل', Legend_Dates, this.Online_Bar_Categories, O_Bar_Total);
      this.Series_Online_Share = GenerateStackedBarChart('سهم از بازار: آنلاین', this.Online_Bar_Categories, this.selected_date, O_SBar_Brokerage, O_SBar_Total);
      this.activeSeries_Online = this.Series_Online_Bar;
      this.Flag_Online = true;

    } catch (e: any) { this.toast.error({ detail: "ERROR", summary: e.message });console.log(e) }
  }

  private resetFlags() {
    this.Flag_Brokerage = this.flag_BOBT = this.flag_FI = this.flag_BKI = this.Flag_BEI = this.Flag_Moshtaghe = this.Flag_Online = false;
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

  onCheckboxChange(e: any, item: any) {
    if (e.target.checked) {
      if (this.selected_date.length >= 5) { this.toast.warning({ detail: "Warning", summary: 'حداکثر ۵ تاریخ' }); e.target.checked = false; return; }
      if (!this.selected_date.includes(item)) this.selected_date.push(item);
    } else {
      let i = this.selected_date.indexOf(item);
      if (i > -1) this.selected_date.splice(i, 1);
    }
  }

  @ViewChildren('select_date, view, bob, fi, bki, bei, moshtaghe, online') sections!: QueryList<ElementRef>;
  ScrollTo(id: string) {
    let s: any = this.sections.find(sec => sec.nativeElement.id == id);
    if (s) s.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  protected readonly Object = Object;
}
