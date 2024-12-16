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
import {DashboardContactComponent} from "../../Template/dashboard-contact/dashboard-contact.component";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {format, subDays} from "date-fns";

@Component({
  selector: 'app-happy-call',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    ReactiveFormsModule,
    MatProgressSpinner,
    NgIf,
    NgForOf,
    NgxEchartsDirective,
    DashboardContactComponent
  ],
  providers: [DatePipe],
  templateUrl: './happy-call.component.html',
  styleUrl: './happy-call.component.scss'
})
export class HappyCallComponent implements OnInit {
  dateform! : FormGroup;
  protected flag_time:boolean = false;
  protected flag_count:boolean=false;
  protected flag_g1:boolean=false;
  protected flag_g4:boolean=false;
  protected flag_Introduction:boolean=false;
  protected flag_ChoosingBrokerage:boolean=false;
  protected flag_popup:boolean=false;
  protected flag_popup_data:boolean=false;
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder, private getData:HappycallService, private TimeService:TimeService, private datePipe: DatePipe) {}
  StartDate:string = "";
  EndDate:string = "";
  st_to_en:string = "";
  selected_days:number = 0;
  available_days:number = 0;
  total_ActiveChoosingBrokerage: number = 0;
  series_ActiveChoosingBrokerage: any[] = [];
  total_InactiveChoosingBrokerage: number = 0;
  series_InactiveChoosingBrokerage: any[] = [];
  AllCalls_Count:Number = 0;
  Customers_Count:Number = 0;
  series_Popup_List: any[] = [];
  Active_Customers_Count:Number = 0;
  Inactive_Customers_Count:Number = 0;
  SuccessfulCalls_Count:Number = 0;
  ActiveAfterCalls_Count:Number = 0;
  ActiveInOtherBrokers_Count:Number = 0;
  ExplanationClub_Count:Number = 0;
  ActiveSuccessfulCalls_Count:Number = 0;
  InactiveSuccessfulCalls_Count:Number = 0;
  UnsuccessfulCalls_Count:Number = 0;
  ReCalls_Count:Number = 0;
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

  series_calls_count_day:EChartsOption = {
    title: {text: 'آمار کل تماس های هپی کال - بر حسب روز', textStyle:this.TitleTextStyle,subtext:this.st_to_en, subtextStyle:{fontFamily:'Bahnschrift'}, right:0, textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['کل تماس ها', 'تماس های موفق', 'تماس های ناموفق'],textStyle:this.legendTextStyle,left:'10%'},
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
    tooltip: {trigger: 'item',textStyle:this.tooltipTextStyle},
    legend: {top: '10%', left: 'center',textStyle:this.legendTextStyle},
    title: [{text: 'مسیر آشنایی با کارگزاری', left: 'center',textStyle:this.TitleTextStyle},
      {subtext: 'مشتریان فعال', bottom:'15%', left:'75%', textAlign: 'center',subtextStyle:{fontFamily:'Nazanin',fontSize:'16px',fontWeight:'bold',color:'#000000'}},
      {subtext: 'مشتریان غیرفعال', bottom:'15%', left:'25%', textAlign: 'center',subtextStyle:{fontFamily:'Nazanin',fontSize:'16px',fontWeight:'bold',color:'#000000'}},
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
        label: {position: 'outer', alignTo: 'labelLine',fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px'},
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
        label: {position: 'outer', alignTo: 'labelLine',fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px'},
        left: 0,
        right: '50%',
        top: 0,
        bottom: 0}
    ]
  };
  series_ChoosingBrokerage_Active_tmp:EChartsOption = {
    title: {text: 'مشتریان فعال', textStyle:this.TitleTextStyle, right:0, textAlign:'center'},
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      formatter: (params : any) => {
        const total = this.total_ActiveChoosingBrokerage;
        const percentage = ((params.value / total) * 100).toFixed(2);
        return  `${percentage}% - ${params.name}`;
      }},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'treemap',
        name:'مشتریان فعال',
        roam: false,
        nodeClick: false,
        label: {
          show: true,
          fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px',position:'insideTopLeft', padding:15,
          formatter: (params : any) => {
            const total = this.total_ActiveChoosingBrokerage;
            const percentage = ((params.value / total) * 100).toFixed(2) + '%';;
            return  `${params.name}\n\n${percentage}`;
          }
        },
        data: this.series_ActiveChoosingBrokerage
      }
    ]
  };
  series_ChoosingBrokerage_Inactive_tmp:EChartsOption = {
    title: {text: 'مشتریان غیرفعال', textStyle:this.TitleTextStyle, right:0, textAlign:'center'},
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      formatter: (params : any) => {
        const total = this.total_InactiveChoosingBrokerage;
        const percentage = ((params.value / total) * 100).toFixed(2);
        return  `${percentage}% - ${params.name}`;
      }},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'treemap',
        name:'مشتریان غیرفعال',
        roam: false,
        nodeClick: false,
        label: {
          show: true,
          fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px',position:'insideTopLeft', padding:15,
          formatter: (params : any) => {
            const total = this.total_InactiveChoosingBrokerage;
            const percentage = ((params.value / total) * 100).toFixed(2) + '%';;
            return  `${params.name}\n\n${percentage}`;
          }
        },
        data: this.series_InactiveChoosingBrokerage
      }
    ]
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
    this.DefaultTime();
  }

  async do(stDate:string,enDate:string){
    this.flag_count = false;
    this.flag_g1 = false;
    this.flag_g4 = false;
    this.flag_Introduction = false;
    this.flag_ChoosingBrokerage = false;
    this.available_days = 0;
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
        this.available_days += 1;
      }
      let std = this.datePipe.transform(total_calls_date[0],'yyyy-MM-dd') || '';
      let end = this.datePipe.transform(total_calls_date[total_calls_date.length-1],'yyyy-MM-dd') || '';
      this.st_to_en = std + ' to ' + end;
      this.TimeService.transfer_days(this.available_days);
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
      for (let i = 0; i < res_ActiveChoosingBrokerage.length; i++){
        this.series_ActiveChoosingBrokerage.push({ name: res_ActiveChoosingBrokerage[i].choosingBrokerage, value: res_ActiveChoosingBrokerage[i].count });
        this.total_ActiveChoosingBrokerage += res_ActiveChoosingBrokerage[i].count;
      }
      let res_InactiveChoosingBrokerage = await this.getData.get_InactiveChoosingBrokerage(stDate,enDate).toPromise();
      for (let i = 0; i < res_InactiveChoosingBrokerage.length; i++){
        this.series_InactiveChoosingBrokerage.push({ name: res_InactiveChoosingBrokerage[i].choosingBrokerage, value: res_InactiveChoosingBrokerage[i].count });
        this.total_InactiveChoosingBrokerage += res_InactiveChoosingBrokerage[i].count;
      }
      (this.series_ChoosingBrokerage_Active_tmp.series as any)[0].data = this.series_ActiveChoosingBrokerage;
      (this.series_ChoosingBrokerage_Inactive_tmp.series as any)[0].data = this.series_InactiveChoosingBrokerage;
      this.flag_ChoosingBrokerage = true;

      this.AllCalls_Count = await this.getData.get_AllCalls_Count(stDate,enDate).toPromise();
      this.ActiveSuccessfulCalls_Count = await this.getData.get_ActiveSuccessfulCalls_Count(stDate,enDate).toPromise();
      this.InactiveSuccessfulCalls_Count = await this.getData.get_InactiveSuccessfulCalls_Count(stDate,enDate).toPromise();
      this.UnsuccessfulCalls_Count = await this.getData.get_UnsuccessfulCalls_Count(stDate,enDate).toPromise();
      this.ReCalls_Count = await this.getData.get_ReCalls_Count(stDate,enDate).toPromise();
      this.flag_g4 = true;

    }catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async Popup_List(List:string){
    this.flag_popup = true;
    switch(List){
      case "Customers":
        this.series_Popup_List = await this.getData.get_Customers_List(this.StartDate,this.EndDate).toPromise();
        this.flag_popup_data = true;
        break;
      case "Active_Customers":
        this.series_Popup_List = await this.getData.get_Active_Customers_List(this.StartDate,this.EndDate).toPromise();
        this.flag_popup_data = true;
        break;
      case "Inactive_Customers":
        this.series_Popup_List = await this.getData.get_Inactive_Customers_List(this.StartDate,this.EndDate).toPromise();
        this.flag_popup_data = true;
        break;
      case "SuccessfulCalls":
        this.series_Popup_List = await this.getData.get_SuccessfulCalls_List(this.StartDate,this.EndDate).toPromise();
        this.flag_popup_data = true;
        break;
      case "ActiveAfterCalls":
        this.series_Popup_List = await this.getData.get_ActiveAfterCalls_List(this.StartDate,this.EndDate).toPromise();
        this.flag_popup_data = true;
        break;
      case "ActiveInOtherBrockers":
        this.series_Popup_List = await this.getData.get_ActiveInOtherBrokers_List(this.StartDate,this.EndDate).toPromise();
        this.flag_popup_data = true;
        break;
      case "ExplanationClub":
        this.series_Popup_List = await this.getData.get_ExplanationClub_List(this.StartDate,this.EndDate).toPromise();
        this.flag_popup_data = true;
        break;
    }
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
    let res_date = await this.getData.get_LastDate().toPromise();
    this.EndDate = res_date.lastDate;
    this.StartDate = format(subDays(this.EndDate, days), 'yyyy-MM-dd');
    this.selected_days = this.TimeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    this.flag_time = true;
    await this.do(this.StartDate,this.EndDate);
  }

  async DefaultTime(){
    let res_date = await this.getData.get_LastDate().toPromise();
    this.EndDate = res_date.lastDate;
    this.StartDate = res_date.startDate;
    this.selected_days = this.TimeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    this.flag_time = true;
    await this.do(this.StartDate,this.EndDate);
  }
}
