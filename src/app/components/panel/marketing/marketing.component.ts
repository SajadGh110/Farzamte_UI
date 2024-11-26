import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {NgToastService} from "ng-angular-popup";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {TimeService} from "../../../services/time.service";
import {DashboardContactComponent} from "../../Template/dashboard-contact/dashboard-contact.component";
import {EChartsOption} from "echarts";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgxEchartsDirective} from "ngx-echarts";
import {TransportToSmartService} from "../../../services/transport-to-smart.service";
import {ListTableComponent} from "./list-table/list-table.component";
import {AllTicketsTableComponent} from "../ticket/all-tickets-table/all-tickets-table.component";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {format, subDays} from "date-fns";

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
    DashboardContactComponent,
    MatProgressSpinner,
    NgIf,
    NgxEchartsDirective,
    NgForOf,
    DatePipe,
    ListTableComponent,
    AllTicketsTableComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  templateUrl: './marketing.component.html',
  styleUrl: './marketing.component.scss'
})
export class MarketingComponent implements OnInit {
  dateform! : FormGroup;
  protected flag_time:boolean = false;
  protected flag_daily:boolean=false;
  protected flag_count:boolean=false;
  protected flag_reasons:boolean=false;
  protected flag_avg_satisfaction:boolean=false;
  protected flag_avg_satisfaction_s:boolean=false;
  protected flag_avg_satisfaction_t:boolean=false;
  protected flag_table:boolean=false;
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder, private getData:TransportToSmartService, private TimeService:TimeService, private datePipe: DatePipe) {}
  StartDate:string = "";
  EndDate:string = "";
  st_to_en:string = "";
  selected_days:number = 0;
  selectedButton: string = 'total';
  Total_Count:Number = 0;
  ContinueSmart_Count:Number = 0;
  ReturnTadbir_Count:Number = 0;
  Successful_Count:Number = 0;
  Unsuccessful_Count:Number = 0;
  series_TTSR_Smart: any[] = [];
  series_TTSR_Tadbir: any[] = [];
  series_All_Table: any[] = [];
  series_color = ['#3ebeed','#EC7063','#73c6b6','#a569bd','#f7dc6f','#aeb6bf'];
  TitleTextStyle: any= {
    fontFamily: 'Nazanin', fontSize: '20px',
  };
  tooltipTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold'
  }
  legendTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold', fontSize:'14px'
  }

  /*
  series_tts_day:EChartsOption = {
    title: {text: 'آمار تماس های ترابرد - بر حسب روز', textStyle:this.TitleTextStyle,subtext:this.st_to_en, subtextStyle:{fontFamily:'Bahnschrift'}, right:0, textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['کل تماس های موفق', 'ادامه با اسمارت', 'برگشت به تدبیر'],left:'10%',textStyle:this.legendTextStyle},
    xAxis: {type: 'category', data: [], axisLabel: { interval: 0, rotate: 45 }},
    yAxis: {type: 'value'},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [{name: 'کل تماس های موفق',data: [], type: 'line', color: '#3498DB', symbolSize: 10},{name: 'ادامه با اسمارت',data: [], type: 'line', color: '#1ABC9C', symbolSize: 10},{name: 'برگشت به تدبیر',data: [], type: 'line', color: '#E74C3C', symbolSize: 10},]
  };
   */
  series_TTSR_Smart_Pie:EChartsOption = {
    tooltip: {trigger: 'item',textStyle:this.tooltipTextStyle},
    legend: {top: '10%', left: 'center',textStyle:this.legendTextStyle},
    title: [{text: 'ادامه با اسمارت', left: 'center',textStyle:this.TitleTextStyle}],
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'pie',
        name:'ادامه با اسمارت',
        radius: ['30%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {borderRadius: 4, borderColor: '#fff', borderWidth: 1},
        data: this.series_TTSR_Smart,
        color:this.series_color,
        label: {position: 'outer', alignTo: 'labelLine',fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px'}
      }]
  };
  series_TTSR_Tadbir_Pie:EChartsOption = {
    tooltip: {trigger: 'item',textStyle:this.tooltipTextStyle},
    legend: {top: '10%', left: 'center',textStyle:this.legendTextStyle},
    title: [{text: 'بازگشت به تدبیر', left: 'center',textStyle:this.TitleTextStyle}],
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'pie',
        name: 'بازگشت به تدبیر',
        radius: ['30%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {borderRadius: 4, borderColor: '#fff', borderWidth: 1},
        data: this.series_TTSR_Tadbir,
        color:this.series_color,
        label: {position: 'outer', alignTo: 'labelLine',fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px'}
      }]
  };
  Series_AVG_Satisfaction:EChartsOption = {
    title: [{text: 'میانگین کل', left: 'center',textStyle:this.TitleTextStyle}],
    tooltip: {textStyle:this.tooltipTextStyle,formatter: '{a}<br/>{b} : %{c}'},
    series: [
      {
        name: 'میانگین میزان رضایت مشتریان',
        type: 'gauge',
        color: '#3498DB',
        progress: {show: true},
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        data: [{value: 0, name: 'امتیاز'}]
      }]
  };
  Series_AVG_Satisfaction_Smart:EChartsOption = {
    title: [{text: 'ادامه با اسمارت', left: 'center',textStyle:this.TitleTextStyle}],
    tooltip: {textStyle:this.tooltipTextStyle,formatter: '{a}<br/>{b} : %{c}'},
    series: [
      {
        name: 'میانگین میزان رضایت مشتریان',
        type: 'gauge',
        color: '#1ABC9C',
        progress: {show: true},
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        data: [{value: 0, name: 'امتیاز'}]
      }]
  };
  Series_AVG_Satisfaction_Tadbir:EChartsOption = {
    title: [{text: 'بازگشت به تدبیر', left: 'center',textStyle:this.TitleTextStyle}],
    tooltip: {textStyle:this.tooltipTextStyle,formatter: '{a}<br/>{b} : %{c}'},
    series: [
      {
        name: 'میانگین میزان رضایت مشتریان',
        type: 'gauge',
        color: '#E74C3C',
        progress: {show: true},
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        data: [{value: 0, name: 'امتیاز'}]
      }]
  };

  async ngOnInit(){
    if(this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin"){
      this.toast.error({ detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight' });
      await this.router.navigate(['profile']);
    }
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
    if (this.getBroker() == 'Mobin')
      this.DefaultTime();
  }

  async do(stDate:string,enDate:string){
  this.flag_daily=false;
  this.flag_count=false;
  this.flag_reasons=false;
  this.flag_avg_satisfaction=false;
  this.flag_avg_satisfaction_s=false;
  this.flag_avg_satisfaction_t=false;
  this.series_TTSR_Smart = [];
  this.series_TTSR_Tadbir = [];
  this.series_All_Table = [];
    try {
      // Total Calls Day ------------------------------------
      /*
      let res1 = await this.getData.get_Total_Count_Day(stDate,enDate).toPromise();
      let total_calls_date: any[] = [];
      let total_calls_count: any[] = [];
      for (let i = 0; i < res1.length; i++) {
        total_calls_date.push(res1[i].date);
        total_calls_count.push(res1[i].count);
      }
      let std = this.datePipe.transform(total_calls_date[0],'yyyy-MM-dd') || '';
      let end = this.datePipe.transform(total_calls_date[total_calls_date.length-1],'yyyy-MM-dd') || '';
      this.st_to_en = std + ' to ' + end;
      (this.series_tts_day.title as any).subtext = this.st_to_en;
      (this.series_tts_day.xAxis as any).data = total_calls_date;
      (this.series_tts_day.series as any)[0].data = total_calls_count;
      // ContinueSmart Day ------------------------------------
      let res2 = await this.getData.get_ContinueSmart_Count_Day(stDate,enDate).toPromise();
      let ContinueSmart_count: any[] = [];
      for (let i = 0; i < res2.length; i++)
        ContinueSmart_count.push(res2[i].count);
      (this.series_tts_day.series as any)[1].data = ContinueSmart_count;
      // ReturnTadbir Day ------------------------------------
      let res3 = await this.getData.get_ReturnTadbir_Count_Day(stDate,enDate).toPromise();
      let ReturnTadbir_count: any[] = [];
      for (let i = 0; i < res3.length; i++)
        ReturnTadbir_count.push(res3[i].count);
      (this.series_tts_day.series as any)[2].data = ReturnTadbir_count;
      this.flag_daily = true;
      */
      // ------------------------------------
      this.Total_Count = await this.getData.get_Total_Count(stDate,enDate).toPromise();
      this.ContinueSmart_Count = await this.getData.get_ContinueSmart_Count(stDate,enDate).toPromise();
      this.ReturnTadbir_Count = await this.getData.get_ReturnTadbir_Count(stDate,enDate).toPromise();
      this.Successful_Count = await  this.getData.get_Successful_Count(stDate,enDate).toPromise();
      this.Unsuccessful_Count = await this.getData.get_Unsuccessful_Count(stDate,enDate).toPromise();
      this.flag_count = true;
      // ------------------------------------
      let res_ttsr_smart = await this.getData.get_Reasons_ContinueSmart_Count(stDate,enDate).toPromise();
      for (let i = 0; i < res_ttsr_smart.length; i++)
        this.series_TTSR_Smart.push({ name: res_ttsr_smart[i].reason, value: res_ttsr_smart[i].count });
      let res_ttsr_tadbir = await this.getData.get_Reasons_ReturnTadbir_Count(stDate,enDate).toPromise();
      for (let i = 0; i < res_ttsr_tadbir.length; i++)
        this.series_TTSR_Tadbir.push({ name: res_ttsr_tadbir[i].reason, value: res_ttsr_tadbir[i].count });
      if (this.series_TTSR_Smart.length == 0)
        this.series_TTSR_Smart.push({ name: 'هیچ دلیلی ثبت نشده است', value: 0 });
      if (this.series_TTSR_Tadbir.length == 0)
        this.series_TTSR_Tadbir.push({ name: 'هیچ دلیلی ثبت نشده است', value: 0 });
      (this.series_TTSR_Smart_Pie.series as any)[0].data = this.series_TTSR_Smart;
      (this.series_TTSR_Tadbir_Pie.series as any)[0].data = this.series_TTSR_Tadbir;
      this.flag_reasons = true;
      // ------------------------------------
      let res_AVG_S = await this.getData.get_Average_CustomerSatisfaction_Smart(stDate, enDate).toPromise();
      if (res_AVG_S > 0){
        (this.Series_AVG_Satisfaction_Smart.series as any)[0].data[0].value = res_AVG_S;
        this.flag_avg_satisfaction_s = true;
      }
      let res_AVG_T = await this.getData.get_Average_CustomerSatisfaction_Tadbir(stDate, enDate).toPromise();
      if (res_AVG_T > 0){
        (this.Series_AVG_Satisfaction_Tadbir.series as any)[0].data[0].value = res_AVG_T;
        this.flag_avg_satisfaction_t = true;
      }
      let res_AVG_Total = await this.getData.get_Average_CustomerSatisfaction(stDate, enDate).toPromise();
      if (res_AVG_Total > 0){
        (this.Series_AVG_Satisfaction.series as any)[0].data[0].value = res_AVG_Total;
        this.flag_avg_satisfaction = true;
      }
      // ------------------------------------
      this.series_All_Table = await this.getData.get_Total_List(stDate,enDate).toPromise();
      this.flag_table = true;
    } catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async ft_table(item:string){
    if (this.selectedButton !== item){
      switch(item){
        case "total":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_Total_List(this.StartDate,this.EndDate).toPromise();
          break;
        case "smart":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_ContinueSmart_List(this.StartDate,this.EndDate).toPromise();
          break;
        case "tadbir":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_ReturnTadbir_List(this.StartDate,this.EndDate).toPromise();
          break;
        case "Successful":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_Successful_List(this.StartDate,this.EndDate).toPromise();
          break;
        case "Unsuccessful":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_Unsuccessful_List(this.StartDate,this.EndDate).toPromise();
          break;
      }
      this.flag_table = true;
      this.selectedButton = item;
    }
  }

  isSelected(item: string): boolean {
    return this.selectedButton === item;
  }

  async OnUpdateDate(){
    this.flag_time = false;
    this.StartDate = this.dateform.controls['StartDate'].value;
    this.EndDate = this.dateform.controls['EndDate'].value;
    this.selected_days = this.TimeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    this.flag_time = true;
    await this.do(this.StartDate,this.EndDate);
  }

  async SetTime(days:number){
    let res_date = await this.getData.get_Date().toPromise();
    this.EndDate = res_date.lastDate;
    this.StartDate = format(subDays(this.EndDate, days), 'yyyy-MM-dd');
    this.selected_days = this.TimeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    this.flag_time = true;
    await this.do(this.StartDate,this.EndDate);
  }

  async DefaultTime(){
    let res_date = await this.getData.get_Date().toPromise();
    this.EndDate = res_date.lastDate;
    this.StartDate = res_date.startDate;
    this.selected_days = this.TimeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    this.flag_time = true;
    await this.do(this.StartDate,this.EndDate);
  }

  getBroker(){
    return this.auth.getUserBroker();
  }
}
