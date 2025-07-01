import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {Menu1Component} from "../../Template/menu1/menu1.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardContactComponent} from "../../Template/dashboard-contact/dashboard-contact.component";
import {NgToastService} from "ng-angular-popup";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {BrokerageService} from "../../../services/brokerage.service";
import {EChartsOption} from "echarts";
import {NgxEchartsDirective} from "ngx-echarts";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTabsModule} from '@angular/material/tabs';
import {last} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {GenerateBarChart} from "../../Template/bar-chart/GenerateBarChart";
import {GenerateRadarChart} from "../../Template/radar-chart/GenerateRadarChart";

@Component({
    selector: 'app-brokerages',
    templateUrl: './brokerages.html',
  imports: [
    DashboardSidebarComponent,
    Menu1Component,
    ReactiveFormsModule,
    DashboardContactComponent,
    NgForOf,
    FormsModule,
    NgxEchartsDirective,
    MatProgressSpinner,
    NgIf,
    MatTabsModule,
    NgStyle
  ],
    styleUrls: ['./brokerages.scss']
})
export class Brokerages implements OnInit {
  public constructor(private router:Router,private toast:NgToastService, private getData:BrokerageService, private auth:AuthService) {}
  series_date:any = [];
  years:any = [];
  selected_date:any = [];
  protected flag_date:boolean=false;
  protected flag_totals:boolean=false;
  protected Flag_Brokerage:boolean=false;
  protected flag_BOBT:boolean=false;
  protected flag_FI:boolean=false;
  protected flag_BKI:boolean=false;
  protected Flag_BEI:boolean=false;
  protected Flag_Moshtaghe:boolean=false;
  protected Flag_Online:boolean=false;
  brokerage_name:any = '';
  brokerage_logo:any = '';
  series_totals:any = [];
  TitleTextStyle: any= {
    fontFamily: 'Nazanin', fontSize: '20px',
  };
  tooltipTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold'
  }
  legendTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold', fontSize:'14px'
  }
  label: any = {show:true,fontSize:14,fontWeight:'bold',fontFamily:'Nazanin',position:'top',formatter: (params:any) => {return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');}};
  colors: string[] = ['#3ebeed', '#EC7063', '#42b3a1', '#7f6487', '#004e75'];
  // Brokerage
  Brokerage_Radar_Title :string = 'رتبه کارگزاری';
  Brokerage_Bar_Title :string = 'ارزش معاملات کارگزاری';
  Brokerage_Total_Bar_Title :string = 'ارزش کل معاملات';
  Brokerage_Radar_Indicator :any = [{ name: 'بورس اوراق بهادار',min:1}, { name: 'فرابورس',min:1}, { name: 'تجمیع بورس اوراق بهادار و فرابورس',min:1}, { name: 'بورس کالا',min:1}, { name: 'بورس انرژی',min:1}, { name: 'ارزش کل معاملات (بورس و فرابورس)',min:1}];
  get Brokerage_Bar_Categories(): string[] { return this.Brokerage_Radar_Indicator.map((ind:any) => ind.name)}
  Series_Brokerage_Radar: EChartsOption = {};
  Series_Brokerage_Bar: EChartsOption = {};
  Series_Brokerage_Total_Bar: EChartsOption = {};
  // BOBT
  BOBT_Radar_Title :string = 'رتبه بورس اوراق بهادار';
  BOBT_Radar_Indicator :any = [{ name: 'بازار اوراق بدهی',min:1}, { name: 'بازار اوراق مشتقه',min:1}, { name: 'بازار سرمایه‌گذار حرفه‌ای',min:1}, { name: 'بازار سهام',min:1}, { name: 'کل بورس اوراق بهادار',min:1}];
  get BOBT_Bar_Categories(): string[] { return this.BOBT_Radar_Indicator.map((ind:any) => ind.name)}
  Series_BOBT_Radar: EChartsOption = {};
  Series_BOBT_Bar: EChartsOption = {};
  Series_BOBT_Total_Bar: EChartsOption = {};
  // FI
  FI_Radar_Title :string = 'رتبه فرابورس';
  FI_Radar_Indicator :any = [{ name: 'معاملات ایستگاه کارگزاری',min:1}, { name: 'معاملات برخط عادی',min:1}, { name: 'معاملات برخط گروهی',min:1}, { name: 'معاملات سایر برخط',min:1}, { name: 'کل فرابورس',min:1}];
  get FI_Bar_Categories(): string[] { return this.FI_Radar_Indicator.map((ind:any) => ind.name)}
  Series_FI_Radar: EChartsOption = {};
  Series_FI_Bar: EChartsOption = {};
  Series_FI_Total_Bar: EChartsOption = {};
  // BKI
  BKI_Radar_Title :string = 'رتبه بورس کالا';
  BKI_Radar_Indicator :any = [{ name: 'معاملات فیزیکی',min:1}, { name: 'معاملات سلف موازی',min:1}, { name: 'معاملات آتی',min:1}, { name: 'معاملات اختیار معامله',min:1}, { name: 'کل بورس کالا',min:1}];
  get BKI_Bar_Categories(): string[] { return this.BKI_Radar_Indicator.map((ind:any) => ind.name)}
  Series_BKI_Radar: EChartsOption = {};
  Series_BKI_Bar: EChartsOption = {};
  Series_BKI_Total_Bar: EChartsOption = {};
  // BEI
  BEI_Radar_Title :string = 'رتبه بورس انرژی';
  BEI_Radar_Indicator :any = [{ name: 'بازار فیزیکی',min:1}, { name: 'بازار مشتقه',min:1}, { name: 'بازار سایر اوراق بهادار',min:1}, { name: 'کل بورس انرژی',min:1}];
  get BEI_Bar_Categories(): string[] { return this.BEI_Radar_Indicator.map((ind:any) => ind.name)}
  Series_BEI_Radar: EChartsOption = {};
  Series_BEI_Bar: EChartsOption = {};
  Series_BEI_Total_Bar: EChartsOption = {};
  // Moshtaghe
  Moshtaghe_Cards: any[] = [
    { key: 'رتبه معاملات مشتقه معمولی (بورس)', value: 'brokerage_Rank_BOBT_Moshtaghe_Normal' },
    { key: 'رتبه معاملات مشتقه آنلاین (بورس)', value: 'brokerage_Rank_BOBT_Moshtaghe_Online' },
    { key: 'رتبه معاملات مشتقه ایستگاه کارگزاری (فرابورس)', value: 'brokerage_Rank_FI_Moshtaghe_Station' },
    { key: 'رتبه معاملات مشتقه برخط عادی (فرابورس)', value: 'brokerage_Rank_FI_Moshtaghe_Normal' },
    { key: 'رتبه معاملات مشتقه برخط گروهی (فرابورس)', value: 'brokerage_Rank_FI_Moshtaghe_Group' },
    { key: 'رتبه معاملات مشتقه سایر برخط (فرابورس)', value: 'brokerage_Rank_FI_Moshtaghe_Other' }
  ];
  Moshtaghe_Table_Data :any = [];
  Moshtaghe_Bar_Categories: string[] = ['ارزش کل معاملات مشتقه بورس - معمولی', 'ارزش کل معاملات مشتقه بورس - آنلاین', 'معاملات مشتقه ایستگاه کارگزاری فرابورس', 'معاملات مشتقه برخط عادی فرابورس', 'معاملات مشتقه برخط گروهی فرابورس', 'معاملات مشتقه سایر برخط فرابورس', 'کل معلاملات مشتقه'];
  Series_Moshtaghe_Bar: EChartsOption = {};
  Series_Moshtaghe_Total_Bar: EChartsOption = {};
  // Online
  Online_Cards: any[] = [
    { key: 'رتبه بازار اوراق بدهی (آنلاین)', value: 'brokerage_Rank_BOBT_Oragh_Bedehi_Online' },
    { key: 'رتبه بازار اوراق مشتقه (آنلاین)', value: 'brokerage_Rank_BOBT_Moshtaghe_Online' },
    { key: 'رتبه بازار سرمایه‌گذار حرفه‌ای (آنلاین)', value: 'brokerage_Rank_BOBT_Sarmaye_Herfei_Online' },
    { key: 'رتبه بازار سرمایه‌گذار حرفه‌ای (بازارگردان)', value: 'brokerage_Rank_BOBT_Sarmaye_Herfei_Algorithm' },
    { key: 'رتبه بازار سهام (آنلاین)', value: 'brokerage_Rank_BOBT_saham_Online' },
    { key: 'رتبه بازار سهام (بازارگردان)', value: 'brokerage_Rank_BOBT_saham_Algorithm' },
    { key: 'رتبه بازار صندوق‌های سرمایه‌گذاری (آنلاین)', value: 'brokerage_Rank_BOBT_Sandogh_Online' },
    { key: 'رتبه بازار صندوق‌های سرمایه‌گذاری (بازارگردان)', value: 'brokerage_Rank_BOBT_Sandogh_Algorithm' },
    { key: 'رتبه معاملات برخط عادی (فرابورس)', value: 'brokerage_Rank_FI_Online_Normal' },
    { key: 'رتبه معاملات برخط گروهی (فرابورس)', value: 'brokerage_Rank_FI_Online_Group' },
    { key: 'رتبه سایر معاملات برخط (فرابورس)', value: 'brokerage_Rank_FI_Online_Other' }
  ];
  Online_Table_Data :any = [];
  Online_Bar_Categories: string[] = ['بازار اوراق بدهی - آنلاین', 'بازار اوراق مشتقه - آنلاین', 'بازار سرمایه‌گذار حرفه‌ای - آنلاین', 'بازار سرمایه‌گذار حرفه‌ای - بازارگردان', 'بازار سهام - آنلاین', 'بازار سهام - بازارگردان', 'بازار صندوق های سرمایه‌گذاری - آنلاین', 'بازار صندوق های سرمایه‌گذاری - بازارگردان', 'معاملات برخط عادی - فرابورس', 'معاملات برخط گروهی - فرابورس', 'سایر معاملات برخط - فرابورس', 'کل معاملات آنلاین'];
  Series_Online_Bar: EChartsOption = {};
  Series_Online_Total_Bar: EChartsOption = {};

  series_Chart1_line:EChartsOption = {
    title: {text: 'رتبه کارگزاری', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['بورس اوراق بهادار','فرابورس','تجمیع بورس اوراق بهادار و فرابورس','بورس کالا','بورس انرژی','ارزش کل معاملات (بورس و فرابورس)'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'بورس اوراق بهادار',data: [], type: 'line', symbolSize: 10},
      {name: 'فرابورس',data: [], type: 'line', symbolSize: 10},
      {name: 'تجمیع بورس اوراق بهادار و فرابورس',data: [], type: 'line', symbolSize: 10},
      {name: 'بورس کالا',data: [], type: 'line', symbolSize: 10},
      {name: 'بورس انرژی',data: [], type: 'line', symbolSize: 10},
      {name: 'ارزش کل معاملات (بورس و فرابورس)',data: [], type: 'line', symbolSize: 10},
    ]
  };
  // ---------------------------------------------
  series_Chart2_line:EChartsOption = {
    title: {text: 'رتبه بورس اوراق بهادار', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['بازار اوراق بدهی','بازار اوراق مشتقه','بازار سرمایه‌گذار حرفه‌ای','بازار سهام','کل بورس اوراق بهادار'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'بازار اوراق بدهی',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار اوراق مشتقه',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار سرمایه‌گذار حرفه‌ای',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار سهام',data: [], type: 'line', symbolSize: 10},
      {name: 'کل بورس اوراق بهادار',data: [], type: 'line', symbolSize: 10},
    ]
  }
  // ---------------------------------------------
  series_Chart3_line:EChartsOption = {
    title: {text: 'رتبه فرابورس', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['معاملات ایستگاه کارگزاری','معاملات برخط عادی','معاملات برخط گروهی','معاملات سایر برخط','کل فرابورس'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'معاملات ایستگاه کارگزاری',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات برخط عادی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات برخط گروهی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات سایر برخط',data: [], type: 'line', symbolSize: 10},
      {name: 'کل فرابورس',data: [], type: 'line', symbolSize: 10},
    ]
  };
  // ---------------------------------------------
  series_Chart4_line:EChartsOption = {
    title: {text: 'رتبه بورس کالا', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['معاملات فیزیکی','معاملات سلف موازی','معاملات آتی','معاملات اختیار معامله','کل بورس کالا'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'معاملات فیزیکی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات سلف موازی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات آتی',data: [], type: 'line', symbolSize: 10},
      {name: 'معاملات اختیار معامله',data: [], type: 'line', symbolSize: 10},
      {name: 'کل بورس کالا',data: [], type: 'line', symbolSize: 10},
    ]
  };
  // ---------------------------------------------
  series_Chart5_line:EChartsOption = {
    title: {text: 'رتبه بورس انرژی', textStyle:this.TitleTextStyle,right:'10%', textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['بازار فیزیکی','بازار مشتقه','بازار سایر اوراق بهادار','کل بورس انرژی'],left:'2%', bottom:0, textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: []},
    yAxis: {type: 'value',inverse:true},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [
      {name: 'بازار فیزیکی',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار مشتقه',data: [], type: 'line', symbolSize: 10},
      {name: 'بازار سایر اوراق بهادار',data: [], type: 'line', symbolSize: 10},
      {name: 'کل بورس انرژی',data: [], type: 'line', symbolSize: 10}
    ]
  };
  async ngOnInit(){
    if(this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin"){
      this.toast.error({ detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight' });
      await this.router.navigate(['profile']);
    }
    let res_brokerage_name = await this.getData.Get_Brokerage_Name().toPromise();
    this.brokerage_name = "کارگزاری " + res_brokerage_name[0].name;
    this.brokerage_logo = "assets/images/brokers/" + res_brokerage_name[0].logo;
    this.series_date = await this.getData.get_AllDate().toPromise();
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
      let [year] = date.split('-');
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(date);
      return acc;
    }, {});
    if (this.series_date.length == 0){
      this.toast.error({ detail: "ERROR", summary: 'Your Selected Brokerage, Don\'t Have a Data', duration: 5000, position: 'topRight' });
    }
    if (this.series_date.length == 1){
      this.selected_date.push(this.series_date[0]);
      this.flag_date = true;
      await this.do(this.selected_date);
    }
    if (this.series_date.length >= 2){
      this.selected_date.push(this.series_date[this.series_date.length-1]);
      this.selected_date.push(this.series_date[this.series_date.length-2]);
      this.flag_date = true;
      await this.do(this.selected_date);
    }
  }

  async do(selected_date:[]){
    this.flag_totals = false;
    this.Flag_Brokerage = false;
    this.flag_BOBT = false;
    this.flag_FI = false;
    this.flag_BKI = false;
    this.Flag_BEI = false;
    this.Flag_Moshtaghe = false;
    this.Flag_Online = false;
    this.series_totals = [];
    this.Moshtaghe_Table_Data = [];
    this.Online_Table_Data = [];
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
    this.Series_Moshtaghe_Bar = {};
    this.Series_Moshtaghe_Total_Bar = {};
    this.Series_Online_Bar = {};
    this.Series_Online_Total_Bar = {};
    (this.series_Chart1_line.series as any)[0].data = [];
    (this.series_Chart1_line.series as any)[1].data = [];
    (this.series_Chart1_line.series as any)[2].data = [];
    (this.series_Chart1_line.series as any)[3].data = [];
    (this.series_Chart1_line.series as any)[4].data = [];
    (this.series_Chart1_line.series as any)[5].data = [];
    (this.series_Chart1_line.xAxis as any).data = [];
    (this.series_Chart2_line.series as any)[0].data = [];
    (this.series_Chart2_line.series as any)[1].data = [];
    (this.series_Chart2_line.series as any)[2].data = [];
    (this.series_Chart2_line.series as any)[3].data = [];
    (this.series_Chart2_line.series as any)[4].data = [];
    (this.series_Chart2_line.xAxis as any).data = [];
    (this.series_Chart3_line.series as any)[0].data = [];
    (this.series_Chart3_line.series as any)[1].data = [];
    (this.series_Chart3_line.series as any)[2].data = [];
    (this.series_Chart3_line.series as any)[3].data = [];
    (this.series_Chart3_line.series as any)[4].data = [];
    (this.series_Chart3_line.xAxis as any).data = [];
    (this.series_Chart4_line.series as any)[0].data = [];
    (this.series_Chart4_line.series as any)[1].data = [];
    (this.series_Chart4_line.series as any)[2].data = [];
    (this.series_Chart4_line.series as any)[3].data = [];
    (this.series_Chart4_line.series as any)[4].data = [];
    (this.series_Chart4_line.xAxis as any).data = [];
    (this.series_Chart5_line.series as any)[0].data = [];
    (this.series_Chart5_line.series as any)[1].data = [];
    (this.series_Chart5_line.series as any)[2].data = [];
    (this.series_Chart5_line.series as any)[3].data = [];
    (this.series_Chart5_line.xAxis as any).data = [];
    selected_date = selected_date.sort((a:any, b:any) => {
      let [yearA, monthA] = a.split('-').map(Number);
      let [yearB, monthB] = b.split('-').map(Number);
      if (yearA === yearB) {
        return monthA - monthB;
      } else {
        return yearA - yearB;
      }
    });
    try {
      // Brokerage Vars
      let Brokerage_Radar_Data:any = [];
      let Brokerage_Radar_LegendData:any = [];
      let Brokerage_Radar_Max_Rank:number = 1;
      let Brokerage_Radar_Max_List = [];
      let Brokerage_Bar_Data:any = [];
      let Brokerage_Bar_Legend:any = [];
      let Brokerage_Total_Bar_Data:any = [];
      let Brokerage_Total_Bar_Legend:any = [];
      // BOBT Vars
      let BOBT_Radar_Data:any = [];
      let BOBT_Radar_LegendData:any = [];
      let BOBT_Radar_Max_Rank:number = 1;
      let BOBT_Radar_Max_List = [];
      let BOBT_Bar_Data:any = [];
      let BOBT_Bar_Legend:any = [];
      let BOBT_Total_Bar_Data:any = [];
      let BOBT_Total_Bar_Legend:any = [];
      // FI Vars
      let FI_Radar_Data:any = [];
      let FI_Radar_LegendData:any = [];
      let FI_Radar_Max_Rank:number = 1;
      let FI_Radar_Max_List = [];
      let FI_Bar_Data:any = [];
      let FI_Bar_Legend:any = [];
      let FI_Total_Bar_Data:any = [];
      let FI_Total_Bar_Legend:any = [];
      // BKI Vars
      let BKI_Radar_Data:any = [];
      let BKI_Radar_LegendData:any = [];
      let BKI_Radar_Max_Rank:number = 1;
      let BKI_Radar_Max_List = [];
      let BKI_Bar_Data:any = [];
      let BKI_Bar_Legend:any = [];
      let BKI_Total_Bar_Data:any = [];
      let BKI_Total_Bar_Legend:any = [];
      // BEI Vars
      let BEI_Radar_Data:any = [];
      let BEI_Radar_LegendData:any = [];
      let BEI_Radar_Max_Rank:number = 1;
      let BEI_Radar_Max_List = [];
      let BEI_Bar_Data:any = [];
      let BEI_Bar_Legend:any = [];
      let BEI_Total_Bar_Data:any = [];
      let BEI_Total_Bar_Legend:any = [];
      // Moshtaghe Vars
      let Moshtaghe_Radar_Max_List = [];
      let Moshtaghe_Bar_Data:any = [];
      let Moshtaghe_Bar_Legend:any = [];
      let Moshtaghe_Total_Bar_Data:any = [];
      let Moshtaghe_Total_Bar_Legend:any = [];
      // Online Vars
      let Online_Bar_Data:any = [];
      let Online_Bar_Legend:any = [];
      let Online_Total_Bar_Data:any = [];
      let Online_Total_Bar_Legend:any = [];
      // Brokerage Service
      for (let date of selected_date){
        let res = await this.getData.get_Chart1(date).toPromise();
        let rank = [
          res.bobT_Brokerage_Rank,
          res.fI_Brokerage_Rank,
          res.bobT_AND_FI_Brokerage_Rank,
          res.bkI_Brokerage_Rank,
          res.beI_Brokerage_Rank,
          res.all_Brokerage_Rank
        ];
        Brokerage_Radar_Max_List.push(Math.max(...rank));
        let brokerage_value = [
          res.bobT_Brokerage_Value,
          res.fI_Brokerage_Value,
          res.bobT_AND_FI_Brokerage_Value,
          res.bkI_Brokerage_Value,
          res.beI_Brokerage_Value,
          res.all_Brokerage_Value
        ];
        let total_value = [
          res.bobT_Total_Value,
          res.fI_Total_Value,
          res.bobT_AND_FI_Total_Value,
          res.bkI_Total_Value,
          res.beI_Total_Value,
          res.all_Total_Value
        ];
        Brokerage_Radar_Data.push({name:date, value:rank});
        Brokerage_Radar_LegendData.push(date);
        Brokerage_Bar_Data.push({name: date, type: 'bar', data: brokerage_value, label: this.label,});
        Brokerage_Bar_Legend.push(date);
        Brokerage_Total_Bar_Data.push({name:date, type:'bar', data:total_value, label:this.label});
        Brokerage_Total_Bar_Legend.push(date);
        (this.series_Chart1_line.series as any)[0].data.push(rank[0]);
        (this.series_Chart1_line.series as any)[1].data.push(rank[1]);
        (this.series_Chart1_line.series as any)[2].data.push(rank[2]);
        (this.series_Chart1_line.series as any)[3].data.push(rank[3]);
        (this.series_Chart1_line.series as any)[4].data.push(rank[4]);
        (this.series_Chart1_line.series as any)[5].data.push(rank[5]);
        (this.series_Chart1_line.xAxis as any).data.push(date);
        this.series_totals.push(await this.getData.get_totals(date).toPromise());
      }
      Brokerage_Radar_Max_Rank = Math.max(...Brokerage_Radar_Max_List) + 5;
      this.Brokerage_Radar_Indicator.forEach((ind:any) => ind.max = Brokerage_Radar_Max_Rank);
      this.Series_Brokerage_Radar = GenerateRadarChart(this.Brokerage_Radar_Title, this.Brokerage_Radar_Indicator, Brokerage_Radar_Data, Brokerage_Radar_LegendData);
      this.Series_Brokerage_Bar = GenerateBarChart(this.Brokerage_Bar_Title, Brokerage_Bar_Legend, this.Brokerage_Bar_Categories, Brokerage_Bar_Data);
      this.Series_Brokerage_Total_Bar = GenerateBarChart(this.Brokerage_Total_Bar_Title, Brokerage_Total_Bar_Legend, this.Brokerage_Bar_Categories, Brokerage_Total_Bar_Data);
      this.Flag_Brokerage = true;
      this.flag_totals = true;
      // BOBT Service
      for (let date of selected_date) {
        let res = await this.getData.get_Chart2(date).toPromise();
        let rank = [
          res.bobT_Oragh_Bedehi_Rank,
          res.bobT_Moshtaghe_Rank,
          res.bobT_Sarmaye_Herfei_Rank,
          res.bobT_saham_Rank,
          res.bobT_Brokerage_Rank
        ];
        BOBT_Radar_Max_List.push(Math.max(...rank));
        let brokerage_value = [
          res.bobT_Oragh_Bedehi,
          res.bobT_Moshtaghe,
          res.bobT_Sarmaye_Herfei,
          res.bobT_saham,
          res.bobT_Brokerage_Value
        ];
        let total_value = [
          res.bobT_Oragh_Bedehi_Total,
          res.bobT_Moshtaghe_Total,
          res.bobT_Sarmaye_Herfei_Total,
          res.bobT_saham_Total,
          res.bobT_Total_Value
        ];
        BOBT_Radar_Data.push({name:date, value:rank});
        BOBT_Radar_LegendData.push(date);
        BOBT_Bar_Data.push({name:date, type:'bar', data:brokerage_value, label:this.label});
        BOBT_Bar_Legend.push(date);
        BOBT_Total_Bar_Data.push({name:date, type:'bar', data:total_value, label:this.label});
        BOBT_Total_Bar_Legend.push(date);
        (this.series_Chart2_line.series as any)[0].data.push(rank[0]);
        (this.series_Chart2_line.series as any)[1].data.push(rank[1]);
        (this.series_Chart2_line.series as any)[2].data.push(rank[2]);
        (this.series_Chart2_line.series as any)[3].data.push(rank[3]);
        (this.series_Chart2_line.series as any)[4].data.push(rank[4]);
        (this.series_Chart2_line.xAxis as any).data.push(date);
      }
      BOBT_Radar_Max_Rank = Math.max(...BOBT_Radar_Max_List) + 5;
      this.BOBT_Radar_Indicator.forEach((ind:any) => ind.max = BOBT_Radar_Max_Rank);
      this.Series_BOBT_Radar = GenerateRadarChart(this.BOBT_Radar_Title, this.BOBT_Radar_Indicator, BOBT_Radar_Data, BOBT_Radar_LegendData);
      this.Series_BOBT_Bar = GenerateBarChart(this.Brokerage_Bar_Title, BOBT_Bar_Legend, this.BOBT_Bar_Categories, BOBT_Bar_Data);
      this.Series_BOBT_Total_Bar = GenerateBarChart(this.Brokerage_Total_Bar_Title, BOBT_Total_Bar_Legend, this.BOBT_Bar_Categories, BOBT_Total_Bar_Data);
      this.flag_BOBT = true;
      // FI
      for (let date of selected_date) {
        let res = await this.getData.get_Chart3(date).toPromise();
        let rank = [
          res.fI_Brokerage_Station_Rank,
          res.fI_Online_Normal_Rank,
          res.fI_Online_Group_Rank,
          res.fI_Online_Other_Rank,
          res.fI_Brokerage_Value_Rank
        ];
        FI_Radar_Max_List.push(Math.max(...rank));
        let brokerage_value = [
          res.fI_Brokerage_Station,
          res.fI_Online_Normal,
          res.fI_Online_Group,
          res.fI_Online_Other,
          res.fI_Brokerage_Value
        ];
        let total_value = [
          res.fI_Brokerage_Station_Total,
          res.fI_Online_Normal_Total,
          res.fI_Online_Group_Total,
          res.fI_Online_Other_Total,
          res.fI_Total_Value
        ];
        FI_Radar_Data.push({name:date, value:rank});
        FI_Radar_LegendData.push(date);
        FI_Bar_Data.push({name:date, type:'bar', data:brokerage_value, label:this.label});
        FI_Bar_Legend.push(date);
        FI_Total_Bar_Data.push({name:date, type:'bar', data:total_value, label:this.label});
        FI_Total_Bar_Legend.push(date);
        (this.series_Chart3_line.series as any)[0].data.push(rank[0]);
        (this.series_Chart3_line.series as any)[1].data.push(rank[1]);
        (this.series_Chart3_line.series as any)[2].data.push(rank[2]);
        (this.series_Chart3_line.series as any)[3].data.push(rank[3]);
        (this.series_Chart3_line.series as any)[4].data.push(rank[4]);
        (this.series_Chart3_line.xAxis as any).data.push(date);
      }
      FI_Radar_Max_Rank = Math.max(...FI_Radar_Max_List) + 5;
      this.FI_Radar_Indicator.forEach((ind:any) => ind.max = FI_Radar_Max_Rank);
      this.Series_FI_Radar = GenerateRadarChart(this.FI_Radar_Title, this.FI_Radar_Indicator, FI_Radar_Data, FI_Radar_LegendData);
      this.Series_FI_Bar = GenerateBarChart(this.Brokerage_Bar_Title, FI_Bar_Legend, this.FI_Bar_Categories, FI_Bar_Data);
      this.Series_FI_Total_Bar = GenerateBarChart(this.Brokerage_Total_Bar_Title, FI_Total_Bar_Legend, this.FI_Bar_Categories, FI_Total_Bar_Data);
      this.flag_FI = true;
      // BKI
      for (let date of selected_date) {
        let res = await this.getData.get_Chart4(date).toPromise();
        let rank = [
          res.bkI_Physical_Rank,
          res.bkI_Self_Rank,
          res.bkI_Ati_Rank,
          res.bkI_Ekhtiar_Rank,
          res.bkI_Brokerage_Value_Rank
        ];
        BKI_Radar_Max_List.push(Math.max(...rank));
        let brokerage_value = [
          res.bkI_Physical,
          res.bkI_Self,
          res.bkI_Ati,
          res.bkI_Ekhtiar,
          res.bkI_Brokerage_Value
        ];
        let total_value = [
          res.bkI_Physical_Total,
          res.bkI_Self_Total,
          res.bkI_Ati_Total,
          res.bkI_Ekhtiar_Total,
          res.bkI_Total_Value
        ];
        BKI_Radar_Data.push({name:date, value:rank});
        BKI_Radar_LegendData.push(date);
        BKI_Bar_Data.push({name:date, type:'bar', data:brokerage_value, label:this.label});
        BKI_Bar_Legend.push(date);
        BKI_Total_Bar_Data.push({name:date, type:'bar', data:total_value, label:this.label});
        BKI_Total_Bar_Legend.push(date);
        (this.series_Chart4_line.series as any)[0].data.push(rank[0]);
        (this.series_Chart4_line.series as any)[1].data.push(rank[1]);
        (this.series_Chart4_line.series as any)[2].data.push(rank[2]);
        (this.series_Chart4_line.series as any)[3].data.push(rank[3]);
        (this.series_Chart4_line.series as any)[4].data.push(rank[4]);
        (this.series_Chart4_line.xAxis as any).data.push(date);
      }
      BKI_Radar_Max_Rank = Math.max(...BKI_Radar_Max_List) + 5;
      this.BKI_Radar_Indicator.forEach((ind:any) => ind.max = BKI_Radar_Max_Rank);
      this.Series_BKI_Radar = GenerateRadarChart(this.BKI_Radar_Title, this.BKI_Radar_Indicator, BKI_Radar_Data, BKI_Radar_LegendData);
      this.Series_BKI_Bar = GenerateBarChart(this.Brokerage_Bar_Title, BKI_Bar_Legend, this.BKI_Bar_Categories, BKI_Bar_Data);
      this.Series_BKI_Total_Bar = GenerateBarChart(this.Brokerage_Total_Bar_Title, BKI_Total_Bar_Legend, this.BKI_Bar_Categories, BKI_Total_Bar_Data);
      this.flag_BKI = true;
      // BEI
      for (let date of selected_date) {
        let res = await this.getData.get_Chart5(date).toPromise();
        let rank = [
          res.beI_Physical_Rank,
          res.beI_Moshtaghe_Rank,
          res.beI_Other_Rank,
          res.beI_Brokerage_Value_Rank
        ]
        BEI_Radar_Max_List.push(Math.max(...rank));
        let brokerage_value = [
          res.beI_Physical,
          res.beI_Moshtaghe,
          res.beI_Other,
          res.beI_Brokerage_Value
        ];
        let total_value = [
          res.beI_Physical_Total,
          res.beI_Moshtaghe_Total,
          res.beI_Other_Total,
          res.beI_Total_Value
        ];
        BEI_Radar_Data.push({ name: date, value: rank });
        BEI_Radar_LegendData.push(date);
        BEI_Bar_Data.push({name:date, type:'bar', data:brokerage_value, label:this.label});
        BEI_Bar_Legend.push(date);
        BEI_Total_Bar_Data.push({name:date, type:'bar', data:total_value, label:this.label});
        BEI_Total_Bar_Legend.push(date);
        (this.series_Chart5_line.series as any)[0].data.push(rank[0]);
        (this.series_Chart5_line.series as any)[1].data.push(rank[1]);
        (this.series_Chart5_line.series as any)[2].data.push(rank[2]);
        (this.series_Chart5_line.series as any)[3].data.push(rank[3]);
        (this.series_Chart5_line.xAxis as any).data.push(date);
      }
      BEI_Radar_Max_Rank = Math.max(...BEI_Radar_Max_List) + 5;
      this.BEI_Radar_Indicator.forEach((ind:any) => ind.max = BEI_Radar_Max_Rank);
      this.Series_BEI_Radar = GenerateRadarChart(this.BEI_Radar_Title, this.BEI_Radar_Indicator, BEI_Radar_Data, BEI_Radar_LegendData);
      this.Series_BEI_Bar = GenerateBarChart(this.Brokerage_Bar_Title, BEI_Bar_Legend, this.BEI_Bar_Categories, BEI_Bar_Data);
      this.Series_BEI_Total_Bar = GenerateBarChart(this.Brokerage_Total_Bar_Title, BEI_Total_Bar_Legend, this.BEI_Bar_Categories, BEI_Total_Bar_Data);
      this.Flag_BEI = true;
      // Moshtaghe
      for (let date of selected_date) {
        let res = await this.getData.GetBrokerageMoshtaghe(date).toPromise();
        let brokerage_value = [
          res.brokerage_BOBT_Moshtaghe_Normal,
          res.brokerage_BOBT_Moshtaghe_Online,
          res.brokerage_FI_Moshtaghe_Station,
          res.brokerage_FI_Moshtaghe_Normal,
          res.brokerage_FI_Moshtaghe_Group,
          res.brokerage_FI_Moshtaghe_Other,
          res.brokerage_TotalMoshtaghe
        ];
        let total_value = [
          res.bobT_Moshtaghe_Normal,
          res.bobT_Moshtaghe_Online,
          res.fI_Moshtaghe_Station,
          res.fI_Moshtaghe_Normal,
          res.fI_Moshtaghe_Group,
          res.fI_Moshtaghe_Other,
          res.totalMoshtaghe
        ];
        this.Moshtaghe_Table_Data.push(res);
        Moshtaghe_Bar_Data.push({name:date, type:'bar', data:brokerage_value, label:this.label});
        Moshtaghe_Bar_Legend.push(date);
        Moshtaghe_Total_Bar_Data.push({name:date, type:'bar', data:total_value, label:this.label});
        Moshtaghe_Total_Bar_Legend.push(date);
      }
      this.Series_Moshtaghe_Bar = GenerateBarChart(this.Brokerage_Bar_Title, Moshtaghe_Bar_Legend, this.Moshtaghe_Bar_Categories, Moshtaghe_Bar_Data);
      this.Series_Moshtaghe_Total_Bar = GenerateBarChart(this.Brokerage_Total_Bar_Title, Moshtaghe_Bar_Legend, this.Moshtaghe_Bar_Categories, Moshtaghe_Total_Bar_Data);
      this.Flag_Moshtaghe = true;
      // Online
      for (let date of selected_date) {
        let res = await this.getData.GetBrokerageOnline(date).toPromise();
        let brokerage_value = [
          res.brokerage_BOBT_Oragh_Bedehi_Online,
          res.brokerage_BOBT_Moshtaghe_Online,
          res.brokerage_BOBT_Sarmaye_Herfei_Online,
          res.brokerage_BOBT_Sarmaye_Herfei_Algorithm,
          res.brokerage_BOBT_saham_Online,
          res.brokerage_BOBT_saham_Algorithm,
          res.brokerage_BOBT_Sandogh_Online,
          res.brokerage_BOBT_Sandogh_Algorithm,
          res.brokerage_FI_Online_Normal,
          res.brokerage_FI_Online_Group,
          res.brokerage_FI_Online_Other,
          res.brokerage_TotalOnline
        ];
        let total_value = [
          res.bobT_Oragh_Bedehi_Online,
          res.bobT_Moshtaghe_Online,
          res.bobT_Sarmaye_Herfei_Online,
          res.bobT_Sarmaye_Herfei_Algorithm,
          res.bobT_saham_Online,
          res.bobT_saham_Algorithm,
          res.bobT_Sandogh_Online,
          res.bobT_Sandogh_Algorithm,
          res.fI_Online_Normal,
          res.fI_Online_Group,
          res.fI_Online_Other,
          res.totalOnline
        ];
        this.Online_Table_Data.push(res);
        Online_Bar_Data.push({name:date, type:'bar', data:brokerage_value, label:this.label});
        Online_Bar_Legend.push(date);
        Online_Total_Bar_Data.push({name:date, type:'bar', data:total_value, label:this.label});
        Online_Total_Bar_Legend.push(date);
      }
      this.Series_Online_Bar = GenerateBarChart(this.Brokerage_Bar_Title, Online_Bar_Legend, this.Online_Bar_Categories, Online_Bar_Data);
      this.Series_Online_Total_Bar = GenerateBarChart(this.Brokerage_Total_Bar_Title, Online_Total_Bar_Legend, this.Online_Bar_Categories, Online_Total_Bar_Data);
      this.Flag_Online = true;
    }catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  onCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      if (this.getBroker() != 'Khobregan'){
        if (this.selected_date.length > 4){
          this.toast.warning({ detail: "Warning", summary: 'Cant Select More Than 5 Date!', duration: 1500, position: 'topRight' });
          let index = this.selected_date.indexOf(item);
          this.selected_date.splice(index, 1);
        }
      }
      if (!this.selected_date.includes(item)) {
        this.selected_date.push(item);
      }
    } else {
      let index = this.selected_date.indexOf(item);
      if (index > -1) {
        this.selected_date.splice(index, 1);
      }
    }
  }

  getBroker(){
    return this.auth.getUserBroker();
  }

  @ViewChildren('select_date, view, totals, bob, fi, bki, bei, moshtaghe, online') sections!: QueryList<ElementRef>;

  ScrollTo(sectionName: string) {
    let section:any = this.sections.find(sec => sec.nativeElement.id == sectionName);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected readonly Object = Object;
  protected readonly last = last;
}
