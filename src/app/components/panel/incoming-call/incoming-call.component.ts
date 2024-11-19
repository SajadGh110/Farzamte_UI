import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DatePipe} from '@angular/common';
import {NgForOf, NgIf} from "@angular/common";
import {NgxEchartsDirective} from "ngx-echarts";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {TimeService} from "../../../services/time.service";
import {EChartsOption} from "echarts";
import {IncomingCallService} from "../../../services/incoming-call.service";
import {DashboardContactComponent} from "../../Template/dashboard-contact/dashboard-contact.component";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {format, subDays} from "date-fns";

@Component({
  selector: 'app-incoming-call',
  standalone: true,
  imports: [
    DashboardTopmenuComponent,
    DashboardSidebarComponent,
    MatProgressSpinner,
    NgIf,
    NgForOf,
    NgxEchartsDirective,
    DashboardContactComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  templateUrl: './incoming-call.component.html',
  styleUrl: './incoming-call.component.scss'
})
export class IncomingCallComponent implements OnInit {
  @ViewChild('target') target!: ElementRef;
  dateform! : FormGroup;
  protected flag_time:boolean = false;
  protected flag_count:boolean=false;
  protected flag_Ph_Reasons:boolean=false;
  protected flag_Reason_Detail:boolean=false;
  protected flag_popup:boolean=false;
  protected flag_popup_data:boolean=false;
  protected flag_loading:boolean=false;
  public constructor(private toast:NgToastService,private auth:AuthService, private router:Router, private fb:FormBuilder, private getData:IncomingCallService, private TimeService:TimeService, private datePipe: DatePipe) {}
  StartDate:string = "";
  EndDate:string = "";
  st_to_en:string = "";
  selected_days:number = 0;
  top_reason:string = "";
  reason_selected = "";
  total_Phonecall_Reasons: number = 0;
  total_Reason_Detail: number = 0;
  series_Popup_List: any[] = [];
  series_Phonecall_Reasons: any[] = [];
  series_color = ['#3ebeed','#EC7063','#42b3a1','#7f6487','#004e75'];
  TitleTextStyle: any= {
    fontFamily: 'Nazanin', fontSize: '20px',
  };
  tooltipTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold'
  }
  legendTextStyle: any = {
    fontFamily: 'Nazanin', fontWeight: 'bold', fontSize:'14px'
  }

  series_calls_count_day:EChartsOption = {
    title: {text: 'آمار کل تماس های ورودی - بر حسب روز', textStyle:this.TitleTextStyle,subtext:this.st_to_en, subtextStyle:{fontFamily:'Bahnschrift'}, right:0, textAlign:'center'},
    tooltip: {trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}},textStyle:this.tooltipTextStyle},
    xAxis: {type: 'category', data: [], axisLabel: { interval: 0, rotate: 45 }},
    yAxis: {type: 'value'},
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    series: [{name: 'تماس ورودی',data: [], type: 'line', color: '#3498DB', symbolSize: 10}]
  };
  series_Phonecall_Reasons_tmp:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      formatter: (params : any) => {
        const total = this.total_Phonecall_Reasons;
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
        name:'دلایل تماس ورودی',
        breadcrumb: {show: false},
        roam: false,
        nodeClick: false,
        label: {
          show: true,
          fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px',position:'insideTopLeft', padding:15,
          formatter: (params : any) => {
            const total = this.total_Phonecall_Reasons;
            const percentage = ((params.value / total) * 100).toFixed(2) + '%';
            return  `${params.name}\n\n${percentage}`;
          }
        },
        data: this.series_Phonecall_Reasons
      }
    ]
  };
  series_Reason_Detail_bar:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      axisPointer: {type: 'shadow'},
      formatter: (params : any) => {
        const total = this.total_Reason_Detail;
        const percentage = ((params.value / total) * 100).toFixed(2);
        return  `${percentage}% - ${params.name}`;
      }},
    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
    xAxis: [{type: 'value'}],
    yAxis: [{type: 'category', data: [], inverse:true, axisLabel:{fontFamily:'Nazanin',fontSize:16,fontWeight:'bold',color:'#000000',interval:0}, axisTick: {alignWithLabel: true}}],
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [
      {
        name: 'جزئیات دلیل تماس ورودی',
        type: 'bar',
        color:this.series_color,
        label: { show:true , position:'right', fontFamily:'Nazanin', fontSize:'14px', fontWeight:"bold", formatter: (params : any) => {
            const total = this.total_Reason_Detail;
            const percentage = ((params.value / total) * 100).toFixed(2);
            return `${percentage}%`;
          }},
        barWidth: '60%',
        data: []
      }]
  };

  async ngOnInit(){
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
    this.SetTime(30);
  }

  async do(stDate:string,enDate:string) {
    this.flag_count = false;
    this.flag_Ph_Reasons = false;
    this.flag_Reason_Detail = false;
    this.total_Phonecall_Reasons = 0;
    this.total_Reason_Detail = 0;
    this.series_Phonecall_Reasons = [];
    try {
      let res1 = await this.getData.get_Total_Count_Day(stDate, enDate).toPromise();
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
      this.flag_count = true;
      let res2 = await this.getData.get_Phonecall_Reasons(stDate,enDate).toPromise();
      for (let i = 0; i < res2.length; i++){
        this.series_Phonecall_Reasons.push({ name: res2[i].reason, value: res2[i].count });
        this.total_Phonecall_Reasons += res2[i].count;
      }
      this.top_reason = this.series_Phonecall_Reasons[0].name;
      (this.series_Phonecall_Reasons_tmp.series as any)[0].data = this.series_Phonecall_Reasons;
      this.flag_Ph_Reasons = true;

      let res3 = await this.getData.get_Reason_Detail(this.StartDate,this.EndDate,this.top_reason).toPromise();
      let series_lbl: any[] = [];
      let series_count: any[] = [];
      for (let i = 0; i < res3.length; i++){
        series_lbl.push(res3[i].reasonDetail);
        series_count.push(res3[i].count);
        this.total_Reason_Detail += res3[i].count;
      }
      this.reason_selected = this.top_reason;
      (this.series_Reason_Detail_bar.yAxis as any)[0].data = series_lbl;
      (this.series_Reason_Detail_bar.series as any)[0].data = series_count;
      this.flag_Reason_Detail = true;
    }catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async chart_click(event:any){
    if (event.name){
      this.flag_Reason_Detail = false;
      this.total_Reason_Detail = 0;
      let res = await this.getData.get_Reason_Detail(this.StartDate,this.EndDate,event.name).toPromise();
      let series_lbl: any[] = [];
      let series_count: any[] = [];
      for (let i = 0; i < res.length; i++){
        series_lbl.push(res[i].reasonDetail);
        series_count.push(res[i].count);
        this.total_Reason_Detail += res[i].count;
      }
      this.reason_selected = event.name;
      (this.series_Reason_Detail_bar.yAxis as any)[0].data = series_lbl;
      (this.series_Reason_Detail_bar.series as any)[0].data = series_count;
    }
    this.flag_Reason_Detail = true;
  }

  async Popup_List(event:any){
    this.flag_loading = true;
    this.series_Popup_List = await this.getData.get_description(this.StartDate,this.EndDate,event.name).toPromise();
    this.flag_loading = false;
    if (this.series_Popup_List.length > 0){
      this.flag_popup = true;
      this.flag_popup_data = true;
    } else {
      this.toast.warning({ detail: "پیام", summary: 'توضیحاتی در این قسمت پیدا نشد!', duration: 1000, position: 'topRight' });
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
    this.EndDate = res_date.endDate;
    this.StartDate = format(subDays(this.EndDate, days), 'yyyy-MM-dd');
    this.selected_days = this.TimeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    this.flag_time = true;
    await this.do(this.StartDate,this.EndDate);
  }

  scroll(){ this.target.nativeElement.scrollIntoView({ behavior: 'smooth' }); }
}
