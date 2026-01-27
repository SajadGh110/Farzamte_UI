import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DashboardSidebarComponent } from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { DashboardTopmenuComponent } from '../../Template/dashboard-topmenu/dashboard-topmenu.component';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { DecimalPipe, NgForOf, NgIf } from "@angular/common";
import { NgxEchartsDirective } from "ngx-echarts";
import { NgToastService } from "ng-angular-popup";
import { BrokerageService } from "../../../services/brokerage.service";
import { EChartsOption } from "echarts";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { FormsModule } from '@angular/forms';
import { GenerateBarChart } from "../../Template/bar-chart/GenerateBarChart";
import { GenerateRadarChart } from "../../Template/radar-chart/GenerateRadarChart";

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
    DecimalPipe,
    FormsModule
  ],
  styleUrl: './brokerage-cmp.scss'
})
export class BrokerageCmp implements OnInit {
  
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private getData: BrokerageService
  ) {}

  series_date: string[] = [];
  years: any = {};
  selected_date: string[] = [];
  all_brokers: any[] = [];
  filtered_brokers: any[] = [];
  searchTerm: string = '';
  comparison_list: any[] = [];
  
  protected flag_top6: boolean = false;
  protected flag_chart1: boolean = false;
  protected flag_chart2: boolean = false;
  protected flag_chart3: boolean = false;
  protected flag_chart4: boolean = false;
  protected flag_chart5: boolean = false;
  protected flag_date: boolean = false;
  protected flag_all_brokers: boolean = false;
  protected flag_totals: boolean = false;
  protected Flag_Brokerage: boolean = false;
  protected flag_BOBT: boolean = false;
  protected flag_FI: boolean = false;
  protected flag_BKI: boolean = false;
  protected Flag_BEI: boolean = false;
  
  brokerage_name: string = '';
  brokerage_logo: string = '';
  series_totals: any[] = [];

  last6_date: string[] = [];
  last6_top: any[] = [];
  
  series_Chart1_radar: EChartsOption = {};
  series_Chart1_bar: EChartsOption = {};
  series_Chart1_bar_total: EChartsOption = {};
  
  series_Chart2_radar: EChartsOption = {};
  series_Chart2_bar: EChartsOption = {};
  series_Chart2_bar_total: EChartsOption = {};
  
  series_Chart3_radar: EChartsOption = {};
  series_Chart3_bar: EChartsOption = {};
  series_Chart3_bar_total: EChartsOption = {};
  
  series_Chart4_radar: EChartsOption = {};
  series_Chart4_bar: EChartsOption = {};
  series_Chart4_bar_total: EChartsOption = {};
  
  series_Chart5_radar: EChartsOption = {};
  series_Chart5_bar: EChartsOption = {};
  series_Chart5_bar_total: EChartsOption = {};
  
  TitleTextStyle: any = {
    fontFamily: 'Nazanin', fontSize: '20px',
  };
  
  tooltipTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold'
  }
  
  legendTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold', fontSize: '14px'
  }
  
  label: any = {
    show: true,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Nazanin',
    position: 'top',
    formatter: (params: any) => {
      return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };
  
  colors: string[] = ['#3ebeed', '#EC7063', '#42b3a1', '#7f6487', '#004e75'];

  // Chart 1 - Brokerage Overview
  Brokerage_Radar_Title: string = 'رتبه کارگزاری';
  Brokerage_Bar_Title: string = 'ارزش معاملات کارگزاری';
  Brokerage_Total_Bar_Title: string = 'ارزش کل معاملات';
  Brokerage_Radar_Indicator: any = [
    { name: 'بورس اوراق بهادار', min: 1 },
    { name: 'فرابورس', min: 1 },
    { name: 'تجمیع بورس اوراق بهادار و فرابورس', min: 1 },
    { name: 'بورس کالا', min: 1 },
    { name: 'بورس انرژی', min: 1 },
    { name: 'ارزش کل معاملات (بورس و فرابورس)', min: 1 }
  ];
  
  get Brokerage_Bar_Categories(): string[] {
    return this.Brokerage_Radar_Indicator.map((ind: any) => ind.name);
  }
  
  Series_Brokerage_Radar: EChartsOption = {};
  Series_Brokerage_Bar: EChartsOption = {};
  Series_Brokerage_Total_Bar: EChartsOption = {};

  // Chart 2 - BOBT
  BOBT_Radar_Title: string = 'رتبه بورس اوراق بهادار';
  BOBT_Radar_Indicator: any = [
    { name: 'بازار اوراق بدهی', min: 1 },
    { name: 'بازار اوراق مشتقه', min: 1 },
    { name: 'بازار سرمایه‌گذار حرفه‌ای', min: 1 },
    { name: 'بازار سهام', min: 1 },
    { name: 'کل بورس اوراق بهادار', min: 1 }
  ];
  
  get BOBT_Bar_Categories(): string[] {
    return this.BOBT_Radar_Indicator.map((ind: any) => ind.name);
  }
  
  Series_BOBT_Radar: EChartsOption = {};
  Series_BOBT_Bar: EChartsOption = {};
  Series_BOBT_Total_Bar: EChartsOption = {};

  // Chart 3 - FI
  FI_Radar_Title: string = 'رتبه فرابورس';
  FI_Radar_Indicator: any = [
    { name: 'معاملات ایستگاه کارگزاری', min: 1 },
    { name: 'معاملات برخط عادی', min: 1 },
    { name: 'معاملات برخط گروهی', min: 1 },
    { name: 'معاملات سایر برخط', min: 1 },
    { name: 'کل فرابورس', min: 1 }
  ];
  
  get FI_Bar_Categories(): string[] {
    return this.FI_Radar_Indicator.map((ind: any) => ind.name);
  }
  
  Series_FI_Radar: EChartsOption = {};
  Series_FI_Bar: EChartsOption = {};
  Series_FI_Total_Bar: EChartsOption = {};

  // Chart 4 - BKI
  BKI_Radar_Title: string = 'رتبه بورس کالا';
  BKI_Radar_Indicator: any = [
    { name: 'معاملات فیزیکی', min: 1 },
    { name: 'معاملات سلف موازی', min: 1 },
    { name: 'معاملات آتی', min: 1 },
    { name: 'معاملات اختیار معامله', min: 1 },
    { name: 'کل بورس کالا', min: 1 }
  ];
  
  get BKI_Bar_Categories(): string[] {
    return this.BKI_Radar_Indicator.map((ind: any) => ind.name);
  }
  
  Series_BKI_Radar: EChartsOption = {};
  Series_BKI_Bar: EChartsOption = {};
  Series_BKI_Total_Bar: EChartsOption = {};

  // Chart 5 - BEI
  BEI_Radar_Title: string = 'رتبه بورس انرژی';
  BEI_Radar_Indicator: any = [
    { name: 'بازار فیزیکی', min: 1 },
    { name: 'بازار مشتقه', min: 1 },
    { name: 'بازار سایر اوراق بهادار', min: 1 },
    { name: 'کل بورس انرژی', min: 1 }
  ];
  
  get BEI_Bar_Categories(): string[] {
    return this.BEI_Radar_Indicator.map((ind: any) => ind.name);
  }
  
  Series_BEI_Radar: EChartsOption = {};
  Series_BEI_Bar: EChartsOption = {};
  Series_BEI_Total_Bar: EChartsOption = {};

  async ngOnInit() {
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

    this.flag_totals = false;
    this.Flag_Brokerage = false;
    this.flag_BOBT = false;
    this.flag_FI = false;
    this.flag_BKI = false;
    this.Flag_BEI = false;
    this.flag_chart1 = false;
    this.flag_chart2 = false;
    this.flag_chart3 = false;
    this.flag_chart4 = false;
    this.flag_chart5 = false;
    
    this.series_totals = [];

    this.series_Chart1_radar = {};
    this.series_Chart1_bar = {};
    this.series_Chart1_bar_total = {};
    this.series_Chart2_radar = {};
    this.series_Chart2_bar = {};
    this.series_Chart2_bar_total = {};
    this.series_Chart3_radar = {};
    this.series_Chart3_bar = {};
    this.series_Chart3_bar_total = {};
    this.series_Chart4_radar = {};
    this.series_Chart4_bar = {};
    this.series_Chart4_bar_total = {};
    this.series_Chart5_radar = {};
    this.series_Chart5_bar = {};
    this.series_Chart5_bar_total = {};
      
    this.Series_Brokerage_Bar = {};
    this.Series_Brokerage_Total_Bar = {};
    this.Series_BOBT_Bar = {};
    this.Series_BOBT_Total_Bar = {};
    this.Series_FI_Bar = {};
    this.Series_FI_Total_Bar = {};
    this.Series_BKI_Bar = {};
    this.Series_BKI_Total_Bar = {};
    this.Series_BEI_Bar = {};
    this.Series_BEI_Total_Bar = {};
    
    try {
      const current_date = this.selected_date[0];
      
      // Brokerage Vars
      let Brokerage_Radar_Data: any = [];
      let Brokerage_Radar_LegendData: any = [];
      let Brokerage_Radar_Max_Rank: number = 1;
      let Brokerage_Radar_Max_List: number[] = [];
      let Brokerage_Bar_Data: any = [];
      let Brokerage_Bar_Legend: any = [];
      let Brokerage_Total_Bar_Data: any = [];
      let Brokerage_Total_Bar_Legend: any = [];
      
      // BOBT Vars
      let BOBT_Radar_Data: any = [];
      let BOBT_Radar_LegendData: any = [];
      let BOBT_Radar_Max_Rank: number = 1;
      let BOBT_Radar_Max_List: number[] = [];
      let BOBT_Bar_Data: any = [];
      let BOBT_Bar_Legend: any = [];
      let BOBT_Total_Bar_Data: any = [];
      let BOBT_Total_Bar_Legend: any = [];
      
      // FI Vars
      let FI_Radar_Data: any = [];
      let FI_Radar_LegendData: any = [];
      let FI_Radar_Max_Rank: number = 1;
      let FI_Radar_Max_List: number[] = [];
      let FI_Bar_Data: any = [];
      let FI_Bar_Legend: any = [];
      let FI_Total_Bar_Data: any = [];
      let FI_Total_Bar_Legend: any = [];
      
      // BKI Vars
      let BKI_Radar_Data: any = [];
      let BKI_Radar_LegendData: any = [];
      let BKI_Radar_Max_Rank: number = 1;
      let BKI_Radar_Max_List: number[] = [];
      let BKI_Bar_Data: any = [];
      let BKI_Bar_Legend: any = [];
      let BKI_Total_Bar_Data: any = [];
      let BKI_Total_Bar_Legend: any = [];
      
      // BEI Vars
      let BEI_Radar_Data: any = [];
      let BEI_Radar_LegendData: any = [];
      let BEI_Radar_Max_Rank: number = 1;
      let BEI_Radar_Max_List: number[] = [];
      let BEI_Bar_Data: any = [];
      let BEI_Bar_Legend: any = [];
      let BEI_Total_Bar_Data: any = [];
      let BEI_Total_Bar_Legend: any = [];
      
      // برای کارگزاری اصلی - Chart 1
      let primary_res = await this.getData.get_Chart1(current_date).toPromise();
      let primary_rank = [
        primary_res.bobt?.rank ?? 0,
        primary_res.fi?.rank ?? 0,
        primary_res.bobT_AND_FI?.rank ?? 0,
        primary_res.bki?.rank ?? 0,
        primary_res.bei?.rank ?? 0,
        primary_res.all?.rank ?? 0
      ];
      
      Brokerage_Radar_Max_List.push(Math.max(...primary_rank));
      
      let primary_brokerage_value = [
        primary_res.bobt?.value ?? 0,
        primary_res.fi?.value ?? 0,
        primary_res.bobT_AND_FI?.value ?? 0,
        primary_res.bki?.value ?? 0,
        primary_res.bei?.value ?? 0,
        primary_res.all?.value ?? 0
      ];
      
      let primary_total_value = [
        primary_res.bobt?.total ?? 0,
        primary_res.fi?.total ?? 0,
        primary_res.bobT_AND_FI?.total ?? 0,
        primary_res.bki?.total ?? 0,
        primary_res.bei?.total ?? 0,
        primary_res.all?.total ?? 0
      ];
      
      Brokerage_Radar_Data.push({ name: this.brokerage_name, value: primary_rank });
      Brokerage_Radar_LegendData.push(this.brokerage_name);
      
      Brokerage_Bar_Data.push({
        name: this.brokerage_name,
        type: 'bar',
        data: primary_brokerage_value,
        label: this.label,
        itemStyle: { color: this.colors[0] }
      });
      Brokerage_Bar_Legend.push(this.brokerage_name);
      
      Brokerage_Total_Bar_Data.push({
        name: current_date,
        type: 'bar',
        data: primary_total_value,
        label: this.label,
        itemStyle: { color: this.colors[4] }
      });
      Brokerage_Total_Bar_Legend.push(current_date);
      
      // برای کارگزاری‌های مقایسه‌ای - Chart 1
      for (let i = 0; i < this.comparison_list.length; i++) {
        let broker = this.comparison_list[i];
        let cmp_res = await this.getData.get_Chart1_CMP(current_date, broker.id).toPromise();
        
        let cmp_rank = [
          cmp_res.bobt?.rank ?? 0,
          cmp_res.fi?.rank ?? 0,
          cmp_res.bobT_AND_FI?.rank ?? 0,
          cmp_res.bki?.rank ?? 0,
          cmp_res.bei?.rank ?? 0,
          cmp_res.all?.rank ?? 0
        ];
        
        Brokerage_Radar_Max_List.push(Math.max(...cmp_rank));
        
        let cmp_brokerage_value = [
          cmp_res.bobt?.value ?? 0,
          cmp_res.fi?.value ?? 0,
          cmp_res.bobT_AND_FI?.value ?? 0,
          cmp_res.bki?.value ?? 0,
          cmp_res.bei?.value ?? 0,
          cmp_res.all?.value ?? 0
        ];
        
        Brokerage_Radar_Data.push({ name: broker.name, value: cmp_rank });
        Brokerage_Radar_LegendData.push(broker.name);
        
        Brokerage_Bar_Data.push({
          name: broker.name,
          type: 'bar',
          data: cmp_brokerage_value,
          label: this.label,
          itemStyle: { color: this.colors[(i + 1) % this.colors.length] }
        });
        Brokerage_Bar_Legend.push(broker.name);
      }
      
      Brokerage_Radar_Max_Rank = Math.max(...Brokerage_Radar_Max_List) + 5;
      this.Brokerage_Radar_Indicator.forEach((ind: any) => ind.max = Brokerage_Radar_Max_Rank);
      
      this.series_Chart1_radar = GenerateRadarChart(
        this.Brokerage_Radar_Title,
        this.Brokerage_Radar_Indicator,
        Brokerage_Radar_Data,
        Brokerage_Radar_LegendData
      );
      
      this.series_Chart1_bar = GenerateBarChart(
        this.Brokerage_Bar_Title,
        Brokerage_Bar_Legend,
        this.Brokerage_Bar_Categories,
        Brokerage_Bar_Data
      );
      
      this.series_Chart1_bar_total = GenerateBarChart(
        this.Brokerage_Total_Bar_Title,
        Brokerage_Total_Bar_Legend,
        this.Brokerage_Bar_Categories,
        Brokerage_Total_Bar_Data
      );
      this.flag_chart1 = true;
      this.Flag_Brokerage = true;
      
      // BOBT Service - Chart 2
      let primary_bobt = await this.getData.get_Chart2(current_date).toPromise();
      let primary_bobt_rank = [
        primary_bobt.bobT_Oragh_Bedehi?.rank ?? 0,
        primary_bobt.bobT_Moshtaghe?.rank ?? 0,
        primary_bobt.bobT_Sarmaye_Herfei?.rank ?? 0,
        primary_bobt.bobT_Saham?.rank ?? 0,
        primary_bobt.bobT_Total?.rank ?? 0
      ];
      
      BOBT_Radar_Max_List.push(Math.max(...primary_bobt_rank));
      
      let primary_bobt_value = [
        primary_bobt.bobT_Oragh_Bedehi?.value ?? 0,
        primary_bobt.bobT_Moshtaghe?.value ?? 0,
        primary_bobt.bobT_Sarmaye_Herfei?.value ?? 0,
        primary_bobt.bobT_Saham?.value ?? 0,
        primary_bobt.bobT_Total?.value ?? 0
      ];
      
      let primary_bobt_total = [
        primary_bobt.bobT_Oragh_Bedehi?.total ?? 0,
        primary_bobt.bobT_Moshtaghe?.total ?? 0,
        primary_bobt.bobT_Sarmaye_Herfei?.total ?? 0,
        primary_bobt.bobT_Saham?.total ?? 0,
        primary_bobt.bobT_Total?.total ?? 0
      ];
      
      BOBT_Radar_Data.push({ name: this.brokerage_name, value: primary_bobt_rank });
      BOBT_Radar_LegendData.push(this.brokerage_name);
      
      BOBT_Bar_Data.push({
        name: this.brokerage_name,
        type: 'bar',
        data: primary_bobt_value,
        label: this.label,
        itemStyle: { color: this.colors[0] }
      });
      BOBT_Bar_Legend.push(this.brokerage_name);
      
      BOBT_Total_Bar_Data.push({
        name: current_date,
        type: 'bar',
        data: primary_bobt_total,
        label: this.label,
        itemStyle: { color: this.colors[4] }
      });
      BOBT_Total_Bar_Legend.push(current_date);
      
      // BOBT مقایسه‌ای
      for (let i = 0; i < this.comparison_list.length; i++) {
        let broker = this.comparison_list[i];
        let cmp_bobt = await this.getData.get_Chart2_CMP(current_date, broker.id).toPromise();
        
        let cmp_bobt_rank = [
          cmp_bobt.bobT_Oragh_Bedehi?.rank ?? 0,
          cmp_bobt.bobT_Moshtaghe?.rank ?? 0,
          cmp_bobt.bobT_Sarmaye_Herfei?.rank ?? 0,
          cmp_bobt.bobT_Saham?.rank ?? 0,
          cmp_bobt.bobT_Total?.rank ?? 0
        ];
        
        BOBT_Radar_Max_List.push(Math.max(...cmp_bobt_rank));
        
        let cmp_bobt_value = [
          cmp_bobt.bobT_Oragh_Bedehi?.value ?? 0,
          cmp_bobt.bobT_Moshtaghe?.value ?? 0,
          cmp_bobt.bobT_Sarmaye_Herfei?.value ?? 0,
          cmp_bobt.bobT_Saham?.value ?? 0,
          cmp_bobt.bobT_Total?.value ?? 0
        ];
        
        BOBT_Radar_Data.push({ name: broker.name, value: cmp_bobt_rank });
        BOBT_Radar_LegendData.push(broker.name);
        
        BOBT_Bar_Data.push({
          name: broker.name,
          type: 'bar',
          data: cmp_bobt_value,
          label: this.label,
          itemStyle: { color: this.colors[(i + 1) % this.colors.length] }
        });
        BOBT_Bar_Legend.push(broker.name);
      }
      
      BOBT_Radar_Max_Rank = Math.max(...BOBT_Radar_Max_List) + 5;
      this.BOBT_Radar_Indicator.forEach((ind: any) => ind.max = BOBT_Radar_Max_Rank);
      
      this.series_Chart2_radar = GenerateRadarChart(
        this.BOBT_Radar_Title,
        this.BOBT_Radar_Indicator,
        BOBT_Radar_Data,
        BOBT_Radar_LegendData
      );
      
      this.series_Chart2_bar = GenerateBarChart(
        this.Brokerage_Bar_Title,
        BOBT_Bar_Legend,
        this.BOBT_Bar_Categories,
        BOBT_Bar_Data
      );
      
      this.series_Chart2_bar_total = GenerateBarChart(
        this.Brokerage_Total_Bar_Title,
        BOBT_Total_Bar_Legend,
        this.BOBT_Bar_Categories,
        BOBT_Total_Bar_Data
      );
      this.flag_chart2 = true;
      this.flag_BOBT = true;
      
      // FI (فرابورس) - Chart 3
      let primary_fi = await this.getData.get_Chart3(current_date).toPromise();
      let primary_fi_rank = [
        primary_fi.fI_Brokerage_Station?.rank ?? 0,
        primary_fi.fI_Online_Normal?.rank ?? 0,
        primary_fi.fI_Online_Group?.rank ?? 0,
        primary_fi.fI_Online_Other?.rank ?? 0,
        primary_fi.fI_Total?.rank ?? 0
      ];
      
      FI_Radar_Max_List.push(Math.max(...primary_fi_rank));
      
      let primary_fi_value = [
        primary_fi.fI_Brokerage_Station?.value ?? 0,
        primary_fi.fI_Online_Normal?.value ?? 0,
        primary_fi.fI_Online_Group?.value ?? 0,
        primary_fi.fI_Online_Other?.value ?? 0,
        primary_fi.fI_Total?.value ?? 0
      ];
      
      let primary_fi_total = [
        primary_fi.fI_Brokerage_Station?.total ?? 0,
        primary_fi.fI_Online_Normal?.total ?? 0,
        primary_fi.fI_Online_Group?.total ?? 0,
        primary_fi.fI_Online_Other?.total ?? 0,
        primary_fi.fI_Total?.total ?? 0
      ];
      
      FI_Radar_Data.push({ name: this.brokerage_name, value: primary_fi_rank });
      FI_Radar_LegendData.push(this.brokerage_name);
      
      FI_Bar_Data.push({
        name: this.brokerage_name,
        type: 'bar',
        data: primary_fi_value,
        label: this.label,
        itemStyle: { color: this.colors[0] }
      });
      FI_Bar_Legend.push(this.brokerage_name);
      
      FI_Total_Bar_Data.push({
        name: current_date,
        type: 'bar',
        data: primary_fi_total,
        label: this.label,
        itemStyle: { color: this.colors[4] }
      });
      FI_Total_Bar_Legend.push(current_date);
      
      // FI مقایسه‌ای
      for (let i = 0; i < this.comparison_list.length; i++) {
        let broker = this.comparison_list[i];
        let cmp_fi = await this.getData.get_Chart3_CMP(current_date, broker.id).toPromise();
        
        let cmp_fi_rank = [
          cmp_fi.fI_Brokerage_Station?.rank ?? 0,
          cmp_fi.fI_Online_Normal?.rank ?? 0,
          cmp_fi.fI_Online_Group?.rank ?? 0,
          cmp_fi.fI_Online_Other?.rank ?? 0,
          cmp_fi.fI_Total?.rank ?? 0
        ];
        
        FI_Radar_Max_List.push(Math.max(...cmp_fi_rank));
        
        let cmp_fi_value = [
          cmp_fi.fI_Brokerage_Station?.value ?? 0,
          cmp_fi.fI_Online_Normal?.value ?? 0,
          cmp_fi.fI_Online_Group?.value ?? 0,
          cmp_fi.fI_Online_Other?.value ?? 0,
          cmp_fi.fI_Total?.value ?? 0
        ];
        
        FI_Radar_Data.push({ name: broker.name, value: cmp_fi_rank });
        FI_Radar_LegendData.push(broker.name);
        
        FI_Bar_Data.push({
          name: broker.name,
          type: 'bar',
          data: cmp_fi_value,
          label: this.label,
          itemStyle: { color: this.colors[(i + 1) % this.colors.length] }
        });
        FI_Bar_Legend.push(broker.name);
      }
      
      FI_Radar_Max_Rank = Math.max(...FI_Radar_Max_List) + 5;
      this.FI_Radar_Indicator.forEach((ind: any) => ind.max = FI_Radar_Max_Rank);
      
      this.series_Chart3_radar = GenerateRadarChart(
        this.FI_Radar_Title,
        this.FI_Radar_Indicator,
        FI_Radar_Data,
        FI_Radar_LegendData
      );
      
      this.series_Chart3_bar = GenerateBarChart(
        this.Brokerage_Bar_Title,
        FI_Bar_Legend,
        this.FI_Bar_Categories,
        FI_Bar_Data
      );
      
      this.series_Chart3_bar_total = GenerateBarChart(
        this.Brokerage_Total_Bar_Title,
        FI_Total_Bar_Legend,
        this.FI_Bar_Categories,
        FI_Total_Bar_Data
      );
      this.flag_chart3 = true;
      this.flag_FI = true;
      
      // BKI (بورس کالا) - Chart 4
      let primary_bki = await this.getData.get_Chart4(current_date).toPromise();
      let primary_bki_rank = [
        primary_bki.bkI_Physical?.rank ?? 0,
        primary_bki.bkI_Self?.rank ?? 0,
        primary_bki.bkI_Ati?.rank ?? 0,
        primary_bki.bkI_Ekhtiar?.rank ?? 0,
        primary_bki.bkI_Total?.rank ?? 0
      ];
      
      BKI_Radar_Max_List.push(Math.max(...primary_bki_rank));
      
      let primary_bki_value = [
        primary_bki.bkI_Physical?.value ?? 0,
        primary_bki.bkI_Self?.value ?? 0,
        primary_bki.bkI_Ati?.value ?? 0,
        primary_bki.bkI_Ekhtiar?.value ?? 0,
        primary_bki.bkI_Total?.value ?? 0
      ];
      
      let primary_bki_total = [
        primary_bki.bkI_Physical?.total ?? 0,
        primary_bki.bkI_Self?.total ?? 0,
        primary_bki.bkI_Ati?.total ?? 0,
        primary_bki.bkI_Ekhtiar?.total ?? 0,
        primary_bki.bkI_Total?.total ?? 0
      ];
      
      BKI_Radar_Data.push({ name: this.brokerage_name, value: primary_bki_rank });
      BKI_Radar_LegendData.push(this.brokerage_name);
      
      BKI_Bar_Data.push({
        name: this.brokerage_name,
        type: 'bar',
        data: primary_bki_value,
        label: this.label,
        itemStyle: { color: this.colors[0] }
      });
      BKI_Bar_Legend.push(this.brokerage_name);
      
      BKI_Total_Bar_Data.push({
        name: current_date,
        type: 'bar',
        data: primary_bki_total,
        label: this.label,
        itemStyle: { color: this.colors[4] }
      });
      BKI_Total_Bar_Legend.push(current_date);
      
      // BKI مقایسه‌ای
      for (let i = 0; i < this.comparison_list.length; i++) {
        let broker = this.comparison_list[i];
        let cmp_bki = await this.getData.get_Chart4_CMP(current_date, broker.id).toPromise();
        
        let cmp_bki_rank = [
          cmp_bki.bkI_Physical?.rank ?? 0,
          cmp_bki.bkI_Self?.rank ?? 0,
          cmp_bki.bkI_Ati?.rank ?? 0,
          cmp_bki.bkI_Ekhtiar?.rank ?? 0,
          cmp_bki.bkI_Total?.rank ?? 0
        ];
        
        BKI_Radar_Max_List.push(Math.max(...cmp_bki_rank));
        
        let cmp_bki_value = [
          cmp_bki.bkI_Physical?.value ?? 0,
          cmp_bki.bkI_Self?.value ?? 0,
          cmp_bki.bkI_Ati?.value ?? 0,
          cmp_bki.bkI_Ekhtiar?.value ?? 0,
          cmp_bki.bkI_Total?.value ?? 0
        ];
        
        BKI_Radar_Data.push({ name: broker.name, value: cmp_bki_rank });
        BKI_Radar_LegendData.push(broker.name);
        
        BKI_Bar_Data.push({
          name: broker.name,
          type: 'bar',
          data: cmp_bki_value,
          label: this.label,
          itemStyle: { color: this.colors[(i + 1) % this.colors.length] }
        });
        BKI_Bar_Legend.push(broker.name);
      }
      
      BKI_Radar_Max_Rank = Math.max(...BKI_Radar_Max_List) + 5;
      this.BKI_Radar_Indicator.forEach((ind: any) => ind.max = BKI_Radar_Max_Rank);
      
      this.series_Chart4_radar = GenerateRadarChart(
        this.BKI_Radar_Title,
        this.BKI_Radar_Indicator,
        BKI_Radar_Data,
        BKI_Radar_LegendData
      );
      
      this.series_Chart4_bar = GenerateBarChart(
        this.Brokerage_Bar_Title,
        BKI_Bar_Legend,
        this.BKI_Bar_Categories,
        BKI_Bar_Data
      );
      
      this.series_Chart4_bar_total = GenerateBarChart(
        this.Brokerage_Total_Bar_Title,
        BKI_Total_Bar_Legend,
        this.BKI_Bar_Categories,
        BKI_Total_Bar_Data
      );
      this.flag_chart4 = true;
      this.flag_BKI = true;
      
      // BEI (بورس انرژی) - Chart 5
      let primary_bei = await this.getData.get_Chart5(current_date).toPromise();
      let primary_bei_rank = [
        primary_bei.beI_Physical?.rank ?? 0,
        primary_bei.beI_Moshtaghe?.rank ?? 0,
        primary_bei.beI_Other?.rank ?? 0,
        primary_bei.beI_Total?.rank ?? 0
      ];
      
      BEI_Radar_Max_List.push(Math.max(...primary_bei_rank));
      
      let primary_bei_value = [
        primary_bei.beI_Physical?.value ?? 0,
        primary_bei.beI_Moshtaghe?.value ?? 0,
        primary_bei.beI_Other?.value ?? 0,
        primary_bei.beI_Total?.value ?? 0
      ];
      
      let primary_bei_total = [
        primary_bei.beI_Physical?.total ?? 0,
        primary_bei.beI_Moshtaghe?.total ?? 0,
        primary_bei.beI_Other?.total ?? 0,
        primary_bei.beI_Total?.total ?? 0
      ];
      
      BEI_Radar_Data.push({ name: this.brokerage_name, value: primary_bei_rank });
      BEI_Radar_LegendData.push(this.brokerage_name);
      
      BEI_Bar_Data.push({
        name: this.brokerage_name,
        type: 'bar',
        data: primary_bei_value,
        label: this.label,
        itemStyle: { color: this.colors[0] }
      });
      BEI_Bar_Legend.push(this.brokerage_name);
      
      BEI_Total_Bar_Data.push({
        name: current_date,
        type: 'bar',
        data: primary_bei_total,
        label: this.label,
        itemStyle: { color: this.colors[4] }
      });
      BEI_Total_Bar_Legend.push(current_date);
      
      // BEI مقایسه‌ای
      for (let i = 0; i < this.comparison_list.length; i++) {
        let broker = this.comparison_list[i];
        let cmp_bei = await this.getData.get_Chart5_CMP(current_date, broker.id).toPromise();
        
        let cmp_bei_rank = [
          cmp_bei.beI_Physical?.rank ?? 0,
          cmp_bei.beI_Moshtaghe?.rank ?? 0,
          cmp_bei.beI_Other?.rank ?? 0,
          cmp_bei.beI_Total?.rank ?? 0
        ];
        
        BEI_Radar_Max_List.push(Math.max(...cmp_bei_rank));
        
        let cmp_bei_value = [
          cmp_bei.beI_Physical?.value ?? 0,
          cmp_bei.beI_Moshtaghe?.value ?? 0,
          cmp_bei.beI_Other?.value ?? 0,
          cmp_bei.beI_Total?.value ?? 0
        ];
        
        BEI_Radar_Data.push({ name: broker.name, value: cmp_bei_rank });
        BEI_Radar_LegendData.push(broker.name);
        
        BEI_Bar_Data.push({
          name: broker.name,
          type: 'bar',
          data: cmp_bei_value,
          label: this.label,
          itemStyle: { color: this.colors[(i + 1) % this.colors.length] }
        });
        BEI_Bar_Legend.push(broker.name);
      }
      
      BEI_Radar_Max_Rank = Math.max(...BEI_Radar_Max_List) + 5;
      this.BEI_Radar_Indicator.forEach((ind: any) => ind.max = BEI_Radar_Max_Rank);
      
      this.series_Chart5_radar = GenerateRadarChart(
        this.BEI_Radar_Title,
        this.BEI_Radar_Indicator,
        BEI_Radar_Data,
        BEI_Radar_LegendData
      );
      
      this.series_Chart5_bar = GenerateBarChart(
        this.Brokerage_Bar_Title,
        BEI_Bar_Legend,
        this.BEI_Bar_Categories,
        BEI_Bar_Data
      );
      
      this.series_Chart5_bar_total = GenerateBarChart(
        this.Brokerage_Total_Bar_Title,
        BEI_Total_Bar_Legend,
        this.BEI_Bar_Categories,
        BEI_Total_Bar_Data
      );
      this.flag_chart5 = true;
      this.Flag_BEI = true;
      
      // Load totals data
      // Primary totals
      let primary_totals = await this.getData.get_totals(current_date).toPromise();
      primary_totals.name = this.brokerage_name;
      primary_totals.isPrimary = true;
      this.series_totals.push(primary_totals);
      
      // Comparison totals
      for (let broker of this.comparison_list) {
        let cmp_totals = await this.getData.get_totals_CMP(current_date, broker.id).toPromise();
        cmp_totals.name = broker.name;
        cmp_totals.isPrimary = false;
        this.series_totals.push(cmp_totals);
      }
      
      this.flag_totals = true;
      
    } catch (error: any) {
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
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
      // فقط یک تاریخ قابل انتخاب است
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

  @ViewChildren('top, select_date, view, totals, bob, fi, bki, bei') sections!: QueryList<ElementRef>;

  ScrollTo(sectionName: string) {
    let section: any = this.sections.find(sec => sec.nativeElement.id == sectionName);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  protected readonly Object = Object;
}