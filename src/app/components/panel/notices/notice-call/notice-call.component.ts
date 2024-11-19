import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NgxEchartsDirective} from "ngx-echarts";
import {DashboardContactComponent} from "../../../Template/dashboard-contact/dashboard-contact.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {EChartsOption} from "echarts";
import {NoticeService} from "../../../../services/notice.service";
import {format, subDays} from "date-fns";
import {TimeService} from "../../../../services/time.service";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notice-call',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    MatProgressSpinner,
    NgIf,
    NgxEchartsDirective,
    DashboardContactComponent,
    ReactiveFormsModule,
    NgForOf
  ],
  providers: [DatePipe],
  templateUrl: './notice-call.component.html',
  styleUrl: './notice-call.component.scss'
})
export class NoticeCallComponent implements OnInit {
  dateform! : FormGroup;
  protected flag_time:boolean = false;
  protected flag_count_day:boolean=false;
  protected flag_noticetype:boolean=false;
  protected flag_capitalincrease:boolean=false;
  protected flag_symbol:boolean=false;
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder, private getData:NoticeService, private datePipe: DatePipe, private TimeService:TimeService) {}
  StartDate:string = "";
  EndDate:string = "";
  selected_days:number = 0;
  st_to_en:string = "";
  series_Noticetype: any[] = [];
  total_Noticetype:number = 0;
  series_data_Noticetype: any[] = [];
  series_data_Symbol: any[] = [];
  total_capitalincrease:number = 0;
  total_symbol:number = 0;
  series_data_capitalincrease: any[] = [];
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

  series_count_day:EChartsOption = {
    title: {text: 'آمار کل تماس های اطلاع رسانی - بر حسب روز', textStyle:this.TitleTextStyle,subtext:this.st_to_en, subtextStyle:{fontFamily:'Bahnschrift'}, right:0, textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    legend: {data: ['کل تماس ها', 'تماس های موفق', 'تماس های ناموفق'],left:'10%',textStyle:this.legendTextStyle},
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
  series_Noticetype_Pie:EChartsOption = {
    tooltip: {trigger: 'item',textStyle:this.tooltipTextStyle},
    title: [{text: 'انواع اطلاع رسانی', left: 'center',textStyle:this.TitleTextStyle}],
    legend: {top: '10%', left: 'center',textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'pie',
        name:'انواع اطلاع رسانی',
        color: this.series_color,
        radius: ['30%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {borderRadius: 4, borderColor: '#fff', borderWidth: 1},
        data: this.series_data_Noticetype,
        label: { show:true , position: 'outer', alignTo: 'labelLine',fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px',
          formatter: (params : any) => {
            const total = this.total_Noticetype;
            const percentage = ((params.value / total) * 100).toFixed(2);
            return `${percentage}% - ${params.name}`;
          }}
      }]
  };
  series_capitalincrease_Pie:EChartsOption = {
    tooltip: {trigger: 'item',textStyle:this.tooltipTextStyle},
    title: [{text: 'انواع افزایش سرمایه', left: 'center',textStyle:this.TitleTextStyle}],
    legend: {top: '10%', left: 'center',textStyle:this.legendTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'pie',
        name:'انواع افزایش سرمایه',
        color: this.series_color,
        radius: ['30%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {borderRadius: 4, borderColor: '#fff', borderWidth: 1},
        data: this.series_data_Noticetype,
        label: { show:true , position: 'outer', alignTo: 'labelLine',fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px',
          formatter: (params : any) => {
            const total = this.total_capitalincrease;
            const percentage = ((params.value / total) * 100).toFixed(2);
            return `${percentage}% - ${params.name}`;
          }}
      }]
  };
  series_Symbol_tmp:EChartsOption = {
    title: { show: false },
    tooltip: {trigger: 'item',textStyle:this.tooltipTextStyle},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        type: 'treemap',
        name:'نماد',
        breadcrumb: {show: false},
        roam: false,
        nodeClick: false,
        label: {
          show: true, fontFamily:'Nazanin',fontWeight:'bold',fontSize:'16px',position:'insideTopLeft', padding:15,
          formatter: (params : any) => {
            const total = this.total_symbol;
            const percentage = ((params.value / total) * 100).toFixed(2) + '%';
            return  `${params.name}\n\n${percentage}`;
          }
        },
        data: this.series_data_Symbol
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
    this.SetTime(30);
  }

  async do(stDate:string,enDate:string){
    this.flag_count_day = false;
    this.flag_noticetype = false;
    this.flag_capitalincrease = false;
    this.flag_symbol = false;
    this.series_data_Noticetype = [];
    this.series_data_capitalincrease = [];
    this.series_data_Symbol = [];
    this.total_Noticetype = 0;
    this.total_capitalincrease = 0;
    this.total_symbol = 0;
    try {
      // Total Calls Day ------------------------------------
      let res1 = await this.getData.get_Count_TotalCalls_Day(stDate,enDate).toPromise();
      let total_calls_date: any[] = [];
      let total_calls_count: any[] = [];
      for (let i = 0; i < res1.length; i++) {
        total_calls_date.push(res1[i].date);
        total_calls_count.push(res1[i].count);
      }
      let std = this.datePipe.transform(total_calls_date[0],'yyyy-MM-dd') || '';
      let end = this.datePipe.transform(total_calls_date[total_calls_date.length-1],'yyyy-MM-dd') || '';
      this.st_to_en = std + ' to ' + end;
      (this.series_count_day.title as any).subtext = this.st_to_en;
      (this.series_count_day.xAxis as any).data = total_calls_date;
      (this.series_count_day.series as any)[0].data = total_calls_count;
      // Successful Calls Day ------------------------------------
      let res2 = await this.getData.get_Count_SuccessfulCalls_Day(stDate,enDate).toPromise();
      let success_calls_count: any[] = [];
      for (let i = 0; i < res2.length; i++)
        success_calls_count.push(res2[i].count);
      (this.series_count_day.series as any)[1].data = success_calls_count;
      // UnSuccessful Calls Day ------------------------------------
      let res3 = await this.getData.get_Count_UnsuccessfulCalls_Day(stDate,enDate).toPromise();
      let unsuccess_calls_count: any[] = [];
      for (let i = 0; i < res3.length; i++)
        unsuccess_calls_count.push(res3[i].count);
      (this.series_count_day.series as any)[2].data = unsuccess_calls_count;
      this.flag_count_day = true;
      // ------------------------------------
      this.series_Noticetype = await this.getData.get_Noticetype_Call(stDate,enDate).toPromise();
      for (let i = 0; i < this.series_Noticetype.length; i++)
      {
        this.series_data_Noticetype.push({ name: this.series_Noticetype[i].noticetype, value: this.series_Noticetype[i].count });
        this.total_Noticetype += this.series_Noticetype[i].count;
      }

      (this.series_Noticetype_Pie.series as any)[0].data = this.series_data_Noticetype;
      this.flag_noticetype = true;
      // ------------------------------------
      let res_capitalincrease = await this.getData.get_capitalincrease_type_Call(stDate,enDate).toPromise();
      for (let i = 0; i < res_capitalincrease.length; i++)
      {
        this.series_data_capitalincrease.push({ name: res_capitalincrease[i].name, value: res_capitalincrease[i].count });
        this.total_capitalincrease += res_capitalincrease[i].count;
      }
      (this.series_capitalincrease_Pie.series as any)[0].data = this.series_data_capitalincrease;
      this.flag_capitalincrease = true;
      // ------------------------------------
      let res_symbol = await this.getData.get_symbol_Call(stDate,enDate).toPromise();
      for (let i = 0; i < res_symbol.length; i++){
        this.series_data_Symbol.push({ name: res_symbol[i].symbol, value: res_symbol[i].count });
        this.total_symbol += res_symbol[i].count;
      }
      (this.series_Symbol_tmp.series as any)[0].data = this.series_data_Symbol;
      this.flag_symbol = true;
    } catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
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
    let res_date = await this.getData.get_LastDate_Call().toPromise();
    this.EndDate = res_date.endDate;
    this.StartDate = format(subDays(this.EndDate, days), 'yyyy-MM-dd');
    this.selected_days = this.TimeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    this.flag_time = true;
    await this.do(this.StartDate,this.EndDate);
  }
}
