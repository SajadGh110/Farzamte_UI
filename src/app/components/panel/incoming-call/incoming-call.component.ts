import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
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
  dateform! : FormGroup;
  protected flag_time:boolean = false;
  protected flag_count:boolean=false;
  protected flag_Ph_Reasons_Customers:boolean=false;
  protected flag_Ph_Reasons_Others:boolean=false;
  protected flag_Ph_Reasons_Totals:boolean=false;
  protected flag_Reason_Detail_Customers:boolean=false;
  protected flag_Reason_Detail_Others:boolean=false;
  protected flag_Reason_Detail_Totals:boolean=false;
  protected flag_popup:boolean=false;
  protected flag_popup_data:boolean=false;
  protected flag_loading:boolean=false;
  protected flag_Top_Reasons:boolean=false;
  public constructor(private toast:NgToastService,private auth:AuthService, private router:Router, private fb:FormBuilder, private getData:IncomingCallService, private TimeService:TimeService, private datePipe: DatePipe) {}
  StartDate:string = "";
  EndDate:string = "";
  st_to_en:string = "";
  selected_days:number = 0;
  top_reason_Customers:string = "";
  top_reason_Others:string = "";
  top_reason_Totals:string = "";
  reason_selected_Customers = "";
  reason_selected_Others = "";
  reason_selected_Totals = "";
  total_Phonecall_Reasons_Customers: number = 0;
  total_Phonecall_Reasons_Others: number = 0;
  total_Phonecall_Reasons_Totals: number = 0;
  total_Reason_Detail_Customers: number = 0;
  total_Reason_Detail_Others: number = 0;
  total_Reason_Detail_Totals: number = 0;
  series_Popup_List: any[] = [];
  series_Phonecall_Reasons_Customers: any[] = [];
  series_Phonecall_Reasons_Others: any[] = [];
  series_Phonecall_Reasons_Totals: any[] = [];
  series_color = ['#3ebeed','#EC7063','#004e75','#f1c40f','#7f6487','#42b3a1'];
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
  series_Top_Reasons_bar_Customers:EChartsOption = {
      tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
      legend: {left:'2%', top:0, textStyle:this.legendTextStyle},
      dataset: {
        source: []
      },
      toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }},
      xAxis: {
        type: 'category',
        axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14},
      },
      yAxis: {type: 'value'},
      series: [{ type: 'bar',color:this.series_color[0] }, { type: 'bar',color:this.series_color[1] }, { type: 'bar',color:this.series_color[2] }]
    };
  series_Top_Reasons_bar_Others:EChartsOption = {
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {left:'2%', top:0, textStyle:this.legendTextStyle},
    dataset: {
      source: []
    },
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14},
    },
    yAxis: {type: 'value'},
    series: [{ type: 'bar',color:this.series_color[0] }, { type: 'bar',color:this.series_color[1] }, { type: 'bar',color:this.series_color[2] }]
  };
  series_Top_Reasons_bar_Totals:EChartsOption = {
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, textStyle:this.tooltipTextStyle},
    legend: {left:'2%', top:0, textStyle:this.legendTextStyle},
    dataset: {
      source: []
    },
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }},
    xAxis: {
      type: 'category',
      axisLabel:{show:true,fontFamily:'Nazanin',fontWeight:'bold',fontSize:14},
    },
    yAxis: {type: 'value'},
    series: [{ type: 'bar',color:this.series_color[0] }, { type: 'bar',color:this.series_color[1] }, { type: 'bar',color:this.series_color[2] }]
  };
  series_Phonecall_Reasons_tmp_Customers:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      formatter: (params : any) => {
        const total = this.total_Phonecall_Reasons_Customers;
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
            const total = this.total_Phonecall_Reasons_Customers;
            const percentage = ((params.value / total) * 100).toFixed(2) + '%';
            return  `${params.name}\n\n${percentage}`;
          }
        },
        data: this.series_Phonecall_Reasons_Customers
      }
    ]
  };
  series_Phonecall_Reasons_tmp_Others:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      formatter: (params : any) => {
        const total = this.total_Phonecall_Reasons_Others;
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
            const total = this.total_Phonecall_Reasons_Others;
            const percentage = ((params.value / total) * 100).toFixed(2) + '%';
            return  `${params.name}\n\n${percentage}`;
          }
        },
        data: this.series_Phonecall_Reasons_Others
      }
    ]
  };
  series_Phonecall_Reasons_tmp_Totals:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      formatter: (params : any) => {
        const total = this.total_Phonecall_Reasons_Totals;
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
            const total = this.total_Phonecall_Reasons_Totals;
            const percentage = ((params.value / total) * 100).toFixed(2) + '%';
            return  `${params.name}\n\n${percentage}`;
          }
        },
        data: this.series_Phonecall_Reasons_Totals
      }
    ]
  };
  series_Reason_Detail_bar_Customers:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      axisPointer: {type: 'shadow'},
      formatter: (params : any) => {
        const total = this.total_Reason_Detail_Customers;
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
            const total = this.total_Reason_Detail_Customers;
            const percentage = ((params.value / total) * 100).toFixed(2);
            return `${percentage}%`;
          }},
        barWidth: '60%',
        data: []
      }]
  };
  series_Reason_Detail_bar_Others:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      axisPointer: {type: 'shadow'},
      formatter: (params : any) => {
        const total = this.total_Reason_Detail_Others;
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
            const total = this.total_Reason_Detail_Others;
            const percentage = ((params.value / total) * 100).toFixed(2);
            return `${percentage}%`;
          }},
        barWidth: '60%',
        data: []
      }]
  };
  series_Reason_Detail_bar_Totals:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item',
      textStyle:this.tooltipTextStyle,
      axisPointer: {type: 'shadow'},
      formatter: (params : any) => {
        const total = this.total_Reason_Detail_Totals;
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
            const total = this.total_Reason_Detail_Totals;
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
    if (this.getBroker() == 'Mobin' || this.getBroker() == 'Pishro' || this.getBroker() == 'Pouyan' || this.getBroker() == 'demo')
      this.SetTime(30);
  }

  async do(stDate:string,enDate:string) {
    this.flag_count = false;
    this.flag_Ph_Reasons_Customers = false;
    this.flag_Ph_Reasons_Others = false;
    this.flag_Ph_Reasons_Totals = false;
    this.flag_Reason_Detail_Customers = false;
    this.flag_Reason_Detail_Others = false;
    this.flag_Reason_Detail_Totals = false;
    this.flag_Top_Reasons = false;
    this.total_Phonecall_Reasons_Customers = 0;
    this.total_Phonecall_Reasons_Others = 0;
    this.total_Phonecall_Reasons_Totals = 0;
    this.total_Reason_Detail_Customers = 0;
    this.total_Reason_Detail_Others = 0;
    this.total_Reason_Detail_Totals = 0;
    this.series_Phonecall_Reasons_Customers = [];
    this.series_Phonecall_Reasons_Others = [];
    this.series_Phonecall_Reasons_Totals = [];
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
      let res_top_reasons_Customers = await this.getData.get_Top_Reasons_Customers(stDate,enDate).toPromise();
      (this.series_Top_Reasons_bar_Customers.dataset as any).source = res_top_reasons_Customers;
      let res_top_reasons_Others = await this.getData.get_Top_Reasons_Others(stDate,enDate).toPromise();
      (this.series_Top_Reasons_bar_Others.dataset as any).source = res_top_reasons_Others;
      let res_top_reasons_Totals = await this.getData.get_Top_Reasons_Totals(stDate,enDate).toPromise();
      (this.series_Top_Reasons_bar_Totals.dataset as any).source = res_top_reasons_Totals;
      this.flag_Top_Reasons = true;
      let res2_Customers = await this.getData.get_Phonecall_Reasons_Customers(stDate,enDate).toPromise();
      for (let i = 0; i < res2_Customers.length; i++){
        this.series_Phonecall_Reasons_Customers.push({ name: res2_Customers[i].reason, value: res2_Customers[i].count });
        this.total_Phonecall_Reasons_Customers += res2_Customers[i].count;
      }
      this.top_reason_Customers = this.series_Phonecall_Reasons_Customers[0].name;
      (this.series_Phonecall_Reasons_tmp_Customers.series as any)[0].data = this.series_Phonecall_Reasons_Customers;
      this.flag_Ph_Reasons_Customers = true;
      let res2_Others = await this.getData.get_Phonecall_Reasons_Others(stDate,enDate).toPromise();
      for (let i = 0; i < res2_Others.length; i++){
        this.series_Phonecall_Reasons_Others.push({ name: res2_Others[i].reason, value: res2_Others[i].count });
        this.total_Phonecall_Reasons_Others += res2_Others[i].count;
      }
      this.top_reason_Others = this.series_Phonecall_Reasons_Others[0].name;
      (this.series_Phonecall_Reasons_tmp_Others.series as any)[0].data = this.series_Phonecall_Reasons_Others;
      this.flag_Ph_Reasons_Others = true;
      let res2_Totals = await this.getData.get_Phonecall_Reasons_Totals(stDate,enDate).toPromise();
      for (let i = 0; i < res2_Totals.length; i++){
        this.series_Phonecall_Reasons_Totals.push({ name: res2_Totals[i].reason, value: res2_Totals[i].count });
        this.total_Phonecall_Reasons_Totals += res2_Totals[i].count;
      }
      this.top_reason_Totals = this.series_Phonecall_Reasons_Totals[0].name;
      (this.series_Phonecall_Reasons_tmp_Totals.series as any)[0].data = this.series_Phonecall_Reasons_Totals;
      this.flag_Ph_Reasons_Totals = true;

      let res3_Customers = await this.getData.get_Reason_Detail_Customers(this.StartDate,this.EndDate,this.top_reason_Customers).toPromise();
      let series_lbl_Customers: any[] = [];
      let series_count_Customers: any[] = [];
      for (let i = 0; i < res3_Customers.length; i++){
        series_lbl_Customers.push(res3_Customers[i].reasonDetail);
        series_count_Customers.push(res3_Customers[i].count);
        this.total_Reason_Detail_Customers += res3_Customers[i].count;
      }
      this.reason_selected_Customers = this.top_reason_Customers;
      (this.series_Reason_Detail_bar_Customers.yAxis as any)[0].data = series_lbl_Customers;
      (this.series_Reason_Detail_bar_Customers.series as any)[0].data = series_count_Customers;
      this.flag_Reason_Detail_Customers = true;
      let res3_Others = await this.getData.get_Reason_Detail_Others(this.StartDate,this.EndDate,this.top_reason_Customers).toPromise();
      let series_lbl_Others: any[] = [];
      let series_count_Others: any[] = [];
      for (let i = 0; i < res3_Others.length; i++){
        series_lbl_Others.push(res3_Others[i].reasonDetail);
        series_count_Others.push(res3_Others[i].count);
        this.total_Reason_Detail_Others += res3_Others[i].count;
      }
      this.reason_selected_Others = this.top_reason_Others;
      (this.series_Reason_Detail_bar_Others.yAxis as any)[0].data = series_lbl_Others;
      (this.series_Reason_Detail_bar_Others.series as any)[0].data = series_count_Others;
      this.flag_Reason_Detail_Others = true;
      let res3_Totals = await this.getData.get_Reason_Detail_Totals(this.StartDate,this.EndDate,this.top_reason_Totals).toPromise();
      let series_lbl_Totals: any[] = [];
      let series_count_Totals: any[] = [];
      for (let i = 0; i < res3_Totals.length; i++){
        series_lbl_Totals.push(res3_Totals[i].reasonDetail);
        series_count_Totals.push(res3_Totals[i].count);
        this.total_Reason_Detail_Totals += res3_Totals[i].count;
      }
      this.reason_selected_Totals = this.top_reason_Totals;
      (this.series_Reason_Detail_bar_Totals.yAxis as any)[0].data = series_lbl_Totals;
      (this.series_Reason_Detail_bar_Totals.series as any)[0].data = series_count_Totals;
      this.flag_Reason_Detail_Totals = true;
    }catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async chart_click_Customers(event:any){
    if (event.name){
      this.flag_Reason_Detail_Customers = false;
      this.total_Reason_Detail_Customers = 0;
      let res = await this.getData.get_Reason_Detail_Customers(this.StartDate,this.EndDate,event.name).toPromise();
      let series_lbl: any[] = [];
      let series_count: any[] = [];
      for (let i = 0; i < res.length; i++){
        series_lbl.push(res[i].reasonDetail);
        series_count.push(res[i].count);
        this.total_Reason_Detail_Customers += res[i].count;
      }
      this.reason_selected_Customers = event.name;
      (this.series_Reason_Detail_bar_Customers.yAxis as any)[0].data = series_lbl;
      (this.series_Reason_Detail_bar_Customers.series as any)[0].data = series_count;
    }
    this.flag_Reason_Detail_Customers = true;
  }

  async chart_click_Others(event:any){
    if (event.name){
      this.flag_Reason_Detail_Others = false;
      this.total_Reason_Detail_Others = 0;
      let res = await this.getData.get_Reason_Detail_Others(this.StartDate,this.EndDate,event.name).toPromise();
      let series_lbl: any[] = [];
      let series_count: any[] = [];
      for (let i = 0; i < res.length; i++){
        series_lbl.push(res[i].reasonDetail);
        series_count.push(res[i].count);
        this.total_Reason_Detail_Others += res[i].count;
      }
      this.reason_selected_Others = event.name;
      (this.series_Reason_Detail_bar_Others.yAxis as any)[0].data = series_lbl;
      (this.series_Reason_Detail_bar_Others.series as any)[0].data = series_count;
    }
    this.flag_Reason_Detail_Others = true;
  }

  async chart_click_Totals(event:any){
    if (event.name){
      this.flag_Reason_Detail_Totals = false;
      this.total_Reason_Detail_Totals = 0;
      let res = await this.getData.get_Reason_Detail_Totals(this.StartDate,this.EndDate,event.name).toPromise();
      let series_lbl: any[] = [];
      let series_count: any[] = [];
      for (let i = 0; i < res.length; i++){
        series_lbl.push(res[i].reasonDetail);
        series_count.push(res[i].count);
        this.total_Reason_Detail_Totals += res[i].count;
      }
      this.reason_selected_Totals = event.name;
      (this.series_Reason_Detail_bar_Totals.yAxis as any)[0].data = series_lbl;
      (this.series_Reason_Detail_bar_Totals.series as any)[0].data = series_count;
    }
    this.flag_Reason_Detail_Totals = true;
  }

  async Popup_List_Customers(event:any){
    this.flag_loading = true;
    this.series_Popup_List = await this.getData.get_description_Customers(this.StartDate,this.EndDate,event.name).toPromise();
    this.flag_loading = false;
    if (this.series_Popup_List.length > 0){
      this.flag_popup = true;
      this.flag_popup_data = true;
    } else {
      this.toast.warning({ detail: "پیام", summary: 'توضیحاتی در این قسمت پیدا نشد!', duration: 1000, position: 'topRight' });
    }
  }

  async Popup_List_Others(event:any){
    this.flag_loading = true;
    this.series_Popup_List = await this.getData.get_description_Others(this.StartDate,this.EndDate,event.name).toPromise();
    this.flag_loading = false;
    if (this.series_Popup_List.length > 0){
      this.flag_popup = true;
      this.flag_popup_data = true;
    } else {
      this.toast.warning({ detail: "پیام", summary: 'توضیحاتی در این قسمت پیدا نشد!', duration: 1000, position: 'topRight' });
    }
  }

  async Popup_List_Totals(event:any){
    this.flag_loading = true;
    this.series_Popup_List = await this.getData.get_description_Totals(this.StartDate,this.EndDate,event.name).toPromise();
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

  getBroker(){
    return this.auth.getUserBroker();
  }

  @ViewChildren('Quick, Target_Customers, Target_Others, Target_Totals, Customers, Others, Totals') sections!: QueryList<ElementRef>;

  ScrollTo(sectionName: string) {
    console.log(sectionName);
    let section:any = this.sections.find(sec => sec.nativeElement.id == sectionName);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
