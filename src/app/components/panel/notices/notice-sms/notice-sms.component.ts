import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NgxEchartsDirective} from "ngx-echarts";
import {DashboardContactComponent} from "../../../Template/dashboard-contact/dashboard-contact.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TimeService} from "../../../../services/time.service";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {NoticeService} from "../../../../services/notice.service";
import {EChartsOption} from "echarts";
import {format, subDays} from "date-fns";

@Component({
  selector: 'app-notice-sms',
  standalone: true,
    imports: [
        DashboardSidebarComponent,
        MatProgressSpinner,
        NgIf,
        NgxEchartsDirective,
        DashboardContactComponent,
        NgForOf,
        ReactiveFormsModule
    ],
  providers: [DatePipe],
  templateUrl: './notice-sms.component.html',
  styleUrl: './notice-sms.component.scss'
})
export class NoticeSMSComponent implements OnInit {
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
  series_color = ['#3ebeed','#EC7063','#73c6b6','#a569bd','#f7dc6f','#aeb6bf','#6a89eb','#fc8452','#3ba272','#ea7ccc','#3ebeed','#EC7063','#73c6b6','#a569bd','#f7dc6f','#aeb6bf','#6a89eb','#fc8452','#3ba272','#ea7ccc','#3ebeed','#EC7063','#73c6b6','#a569bd','#f7dc6f','#aeb6bf','#6a89eb','#fc8452','#3ba272','#ea7ccc'];
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
    title: {text: 'آمار کل پیامک های اطلاع رسانی - بر حسب روز', textStyle:this.TitleTextStyle,subtext:this.st_to_en, subtextStyle:{fontFamily:'Bahnschrift'}, right:0, textAlign:'center'},
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
    series: [{name: 'پیامک ها',data: [], type: 'line', color: '#3498DB', symbolSize: 10}]
  };
  series_Noticetype_Pie:EChartsOption = {
    tooltip: {trigger: 'item',textStyle:this.tooltipTextStyle},
    title: [{text: 'انواع اطلاع رسانی', left: 'center',textStyle:this.TitleTextStyle}],
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle:this.legendTextStyle
    },
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
        center: ['30%', 'center'],
        avoidLabelOverlap: false,
        itemStyle: {borderRadius: 4, borderColor: '#fff', borderWidth: 1},
        data: this.series_data_Noticetype,
        label: { show:true , position: 'outside', alignTo: 'labelLine',fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px',
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
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle:this.legendTextStyle
    },
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
        center: ['30%', 'center'],
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
          show: true, fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px',position:'insideTopLeft', padding:15,
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
    if (this.getBroker() == 'Mobin' || this.getBroker() == 'Pishro' || this.getBroker() == 'Khobregan' || this.getBroker() == 'demo')
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
      // SMS Day ------------------------------------
      let res1 = await this.getData.get_Count_SMS_Day(stDate,enDate).toPromise();
      console.log("111");
      let sms_date: any[] = [];
      let sms_count: any[] = [];
      for (let i = 0; i < res1.length; i++) {
        sms_date.push(res1[i].date);
        sms_count.push(res1[i].count);
      }
      let std = this.datePipe.transform(sms_date[0],'yyyy-MM-dd') || '';
      let end = this.datePipe.transform(sms_date[sms_date.length-1],'yyyy-MM-dd') || '';
      this.st_to_en = std + ' to ' + end;
      (this.series_count_day.title as any).subtext = this.st_to_en;
      (this.series_count_day.xAxis as any).data = sms_date;
      (this.series_count_day.series as any)[0].data = sms_count;
      this.flag_count_day = true;
      // ------------------------------------
      this.series_Noticetype = await this.getData.get_Noticetype_SMS(stDate,enDate).toPromise();
      for (let i = 0; i < this.series_Noticetype.length; i++)
      {
        this.series_data_Noticetype.push({ name: this.series_Noticetype[i].noticetype, value: this.series_Noticetype[i].count });
        this.total_Noticetype += this.series_Noticetype[i].count;
      }
      (this.series_Noticetype_Pie.series as any)[0].data = this.series_data_Noticetype;
      this.flag_noticetype = true;
      // ------------------------------------
      let res_capitalincrease = await this.getData.get_capitalincrease_type_SMS(stDate,enDate).toPromise();
      for (let i = 0; i < res_capitalincrease.length; i++)
      {
        this.series_data_capitalincrease.push({ name: res_capitalincrease[i].name, value: res_capitalincrease[i].count });
        this.total_capitalincrease += res_capitalincrease[i].count;
      }
      (this.series_capitalincrease_Pie.series as any)[0].data = this.series_data_capitalincrease;
      this.flag_capitalincrease = true;
      // ------------------------------------
      let res_symbol = await this.getData.get_symbol_SMS(stDate,enDate).toPromise();
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
    let res_date = await this.getData.get_LastDate_SMS().toPromise();
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
}
