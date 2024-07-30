import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import { DatePipe } from '@angular/common';
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {HappycallService} from "../../../services/happycall.service";
import {TimeService} from "../../../services/time.service";
import {EChartsOption} from "echarts";
import {NgxEchartsDirective} from "ngx-echarts";

@Component({
  selector: 'app-happy-call',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    ReactiveFormsModule,
    MatProgressSpinner,
    NgIf,
    NgForOf,
    NgxEchartsDirective
  ],
  providers: [DatePipe],
  templateUrl: './happy-call.component.html',
  styleUrl: './happy-call.component.scss'
})
export class HappyCallComponent implements OnInit {
  dateform! : FormGroup;
  protected flag_count:boolean=false;
  protected flag_g1:boolean=false;
  protected flag_g4:boolean=false;
  protected flag_Introduction:boolean=false;
  protected flag_ChoosingBrokerage:boolean=false;
  public constructor(private toast:NgToastService, private fb:FormBuilder, private getData:HappycallService, private TimeService:TimeService, private datePipe: DatePipe) {}
  StartDate:string = "";
  EndDate:string = "";
  st_to_en:string = "";
  series_ActiveChoosingBrokerage: any[] = [];
  series_InactiveChoosingBrokerage: any[] = [];
  AllCalls_Count:Number = 0;
  Customers_Count:Number = 0;
  Active_Customers_Count:Number = 0;
  Inactive_Customers_Count:Number = 0;
  SuccessfulCalls_Count:Number = 0;
  ActiveAfterCalls_Count:Number = 0;
  ActiveInOtherBrokers_Count:Number = 0;
  ExplanationClub_Count:Number = 0;
  ActiveSuccessfulCalls_Count:Number = 0;
  InactiveSuccessfulCalls_Count:Number = 0;
  DisinclinationCalls_Count:Number = 0;
  ReCalls_Count:Number = 0;
  LackInfoCalls_Count:Number = 0;
  RepeatCalls_Count:Number = 0;
  UnResponsiveCalls_Count:Number = 0;
  OffCalls_Count:Number = 0;
  RejectCalls_Count:Number = 0;
  UnavailableCalls_Count:Number = 0;
  BusyCalls_Count:Number = 0;
  UserRequests_Count:Number = 0;
  series_calls_count_day:EChartsOption = {
    title: {text: 'آمار کل تماس های هپی کال - بر حسب روز', textStyle:{fontFamily:'Yekan'},subtext:this.st_to_en, subtextStyle:{fontFamily:'Bahnschrift'}, right:0, textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}}},
    legend: {data: ['کل تماس ها', 'تماس های موفق', 'تماس های ناموفق'],left:'10%'},
    xAxis: {type: 'category', data: [], axisLabel: { interval: 0, rotate: 45 }},
    yAxis: {type: 'value'},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [{name: 'کل تماس ها',data: [], type: 'line', color: '#3498DB', symbolSize: 10},{name: 'تماس های موفق',data: [], type: 'line', color: '#1ABC9C', symbolSize: 10},{name: 'تماس های ناموفق',data: [], type: 'line', color: '#E74C3C', symbolSize: 10},]
  };
  series_ActiveIntroduction: any[] = [];
  series_InactiveIntroduction: any[] = [];
  series_Introduction:EChartsOption = {
    tooltip: {trigger: 'item'},
    legend: {top: '10%', left: 'center'},
    title: [{text: 'مسیر آشنایی با کارگزاری', left: 'center',textStyle:{fontFamily:'Yekan'}},
      {subtext: 'مشتریان فعال', bottom:'15%', left:'75%', textAlign: 'center',subtextStyle:{fontFamily:'Yekan',fontSize:'16px',color:'#000000'}},
      {subtext: 'مشتریان غیرفعال', bottom:'15%', left:'25%', textAlign: 'center',subtextStyle:{fontFamily:'Yekan',fontSize:'16px',color:'#000000'}},
      {subtext: this.st_to_en, bottom:'5%', left:'50%', textAlign: 'center',subtextStyle:{fontFamily:'Bahnschrift',fontSize:'14px',color:'#000000'}}],
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [{
        type: 'pie',
        name:'مشتریان فعال',
        radius: ['30%', '45%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {borderRadius: 4, borderColor: '#fff', borderWidth: 1},
        data: this.series_ActiveIntroduction,
        label: {position: 'outer', alignTo: 'labelLine'},
        left: '50%',
        right: 0,
        top: 0,
        bottom: 0},
      {
        type: 'pie',
        name: 'مشتریان غیرفعال',
        radius: ['30%', '45%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {borderRadius: 4, borderColor: '#fff', borderWidth: 1},
        data: this.series_InactiveIntroduction,
        label: {position: 'outer', alignTo: 'labelLine'},
        left: 0,
        right: '50%',
        top: 0,
        bottom: 0}
    ]
  };
  series_ChoosingBrokerage_Active_tmp:EChartsOption = {
    title: {text: 'مشتریان فعال', textStyle:{fontFamily:'Yekan'}, right:0, textAlign:'center'},
    tooltip: {trigger: 'item'},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'treemap',
        name:'مشتریان فعال',
        data: this.series_ActiveChoosingBrokerage
      }
    ]
  };
  series_ChoosingBrokerage_Inactive_tmp:EChartsOption = {
    title: {text: 'مشتریان غیرفعال', textStyle:{fontFamily:'Yekan'}, right:0, textAlign:'center'},
    tooltip: {trigger: 'item'},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'treemap',
        name:'مشتریان غیرفعال',
        data: this.series_InactiveChoosingBrokerage
      }
    ]
  };

  async ngOnInit(){
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
    this.StartDate = this.TimeService.StartDate;
    this.EndDate = this.TimeService.EndDate;
    await this.do(this.StartDate,this.EndDate);
  }

  async do(stDate:string,enDate:string){
    this.flag_count = false;
    this.flag_g1 = false;
    this.flag_Introduction = false;
    this.flag_ChoosingBrokerage = false;
    this.series_ActiveIntroduction = [];
    this.series_InactiveIntroduction = [];
    this.series_ActiveChoosingBrokerage = [];
    this.series_InactiveChoosingBrokerage = [];
    try {
      // Total Calls Day ------------------------------------
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
      (this.series_calls_count_day.title as any).subtext = this.st_to_en;
      (this.series_calls_count_day.xAxis as any).data = total_calls_date;
      (this.series_calls_count_day.series as any)[0].data = total_calls_count;
      // Successful Calls Day ------------------------------------
      let res2 = await this.getData.get_SuccessfulCalls_Count_Day(stDate,enDate).toPromise();
      let success_calls_count: any[] = [];
      for (let i = 0; i < res2.length; i++)
        success_calls_count.push(res2[i].count);
      (this.series_calls_count_day.series as any)[1].data = success_calls_count;
      // UnSuccessful Calls Day ------------------------------------
      let res3 = await this.getData.get_UnsuccessfulCalls_Count_Day(stDate,enDate).toPromise();
      let unsuccess_calls_count: any[] = [];
      for (let i = 0; i < res3.length; i++)
        unsuccess_calls_count.push(res3[i].count);
      (this.series_calls_count_day.series as any)[2].data = unsuccess_calls_count;
      this.flag_count = true;
      // ------------------------------------
      this.Customers_Count = await this.getData.get_Customers_Count(stDate,enDate).toPromise();
      this.Active_Customers_Count = await this.getData.get_Active_Customers_Count(stDate,enDate).toPromise();
      this.Inactive_Customers_Count = await this.getData.get_Inactive_Customers_Count(stDate,enDate).toPromise();
      this.SuccessfulCalls_Count = await this.getData.get_SuccessfulCalls_Count(stDate,enDate).toPromise();
      this.ActiveAfterCalls_Count = await this.getData.get_ActiveAfterCalls_Count(stDate,enDate).toPromise();
      this.ActiveInOtherBrokers_Count = await this.getData.get_ActiveInOtherBrokers_Count(stDate,enDate).toPromise();
      this.ExplanationClub_Count = await this.getData.get_ExplanationClub_Count(stDate,enDate).toPromise();
      this.flag_g1 = true;

      let res_ActiveIntroduction = await this.getData.get_ActiveIntroduction(stDate,enDate).toPromise();
      for (let i = 0; i < res_ActiveIntroduction.length; i++)
        this.series_ActiveIntroduction.push({ name: res_ActiveIntroduction[i].introduction, value: res_ActiveIntroduction[i].count });
      let res_InactiveIntroduction = await this.getData.get_InactiveIntroduction(stDate,enDate).toPromise();
      for (let i = 0; i < res_InactiveIntroduction.length; i++)
        this.series_InactiveIntroduction.push({ name: res_InactiveIntroduction[i].introduction, value: res_InactiveIntroduction[i].count });
      (this.series_Introduction.title as any)[3].subtext = this.st_to_en;
      (this.series_Introduction.series as any)[0].data = this.series_ActiveIntroduction;
      (this.series_Introduction.series as any)[1].data = this.series_InactiveIntroduction;
      this.flag_Introduction = true;

      let res_ActiveChoosingBrokerage = await this.getData.get_ActiveChoosingBrokerage(stDate,enDate).toPromise();
      for (let i = 0; i < res_ActiveChoosingBrokerage.length; i++)
        this.series_ActiveChoosingBrokerage.push({ name: res_ActiveChoosingBrokerage[i].choosingBrokerage, value: res_ActiveChoosingBrokerage[i].count });
      let res_InactiveChoosingBrokerage = await this.getData.get_InactiveChoosingBrokerage(stDate,enDate).toPromise();
      for (let i = 0; i < res_InactiveChoosingBrokerage.length; i++)
        this.series_InactiveChoosingBrokerage.push({ name: res_InactiveChoosingBrokerage[i].choosingBrokerage, value: res_InactiveChoosingBrokerage[i].count });
      (this.series_ChoosingBrokerage_Active_tmp.series as any)[0].data = this.series_ActiveChoosingBrokerage;
      (this.series_ChoosingBrokerage_Inactive_tmp.series as any)[0].data = this.series_InactiveChoosingBrokerage;
      this.flag_ChoosingBrokerage = true;

      this.AllCalls_Count = await this.getData.get_AllCalls_Count(stDate,enDate).toPromise();
      this.ActiveSuccessfulCalls_Count = await this.getData.get_ActiveSuccessfulCalls_Count(stDate,enDate).toPromise();
      this.InactiveSuccessfulCalls_Count = await this.getData.get_InactiveSuccessfulCalls_Count(stDate,enDate).toPromise();
      this.DisinclinationCalls_Count = await this.getData.get_DisinclinationCalls_Count(stDate,enDate).toPromise();
      this.ReCalls_Count = await this.getData.get_ReCalls_Count(stDate,enDate).toPromise();
      this.LackInfoCalls_Count = await this.getData.get_LackInfoCalls_Count(stDate,enDate).toPromise();
      this.RepeatCalls_Count = await this.getData.get_RepeatCalls_Count(stDate,enDate).toPromise();
      this.UnResponsiveCalls_Count = await this.getData.get_UnResponsiveCalls_Count(stDate,enDate).toPromise();
      this.OffCalls_Count = await this.getData.get_OffCalls_Count(stDate,enDate).toPromise();
      this.RejectCalls_Count = await this.getData.get_RejectCalls_Count(stDate,enDate).toPromise();
      this.UnavailableCalls_Count = await this.getData.get_UnavailableCalls_Count(stDate,enDate).toPromise();
      this.BusyCalls_Count = await this.getData.get_BusyCalls_Count(stDate,enDate).toPromise();
      this.flag_g4 = true;

    }catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async OnUpdateDate(){
    this.StartDate = this.TimeService.StartDate;
    this.EndDate = this.TimeService.EndDate;
    await this.do(this.StartDate,this.EndDate);
  }
}
