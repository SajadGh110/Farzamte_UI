import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DashboardContactComponent} from "../../../Template/dashboard-contact/dashboard-contact.component";
import {DashboardSidebarComponent} from "../../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../../services/auth.service";
import {TimeService} from "../../../../services/time.service";
import {IncUnitService} from "../../../../services/inc-unit.service";
import {EChartsOption} from "echarts";
import {format, subDays} from "date-fns";
import {NgxEchartsDirective} from "ngx-echarts";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-inc-unit',
  standalone: true,
  imports: [
    DashboardContactComponent,
    DashboardSidebarComponent,
    FormsModule,
    MatProgressSpinner,
    NgIf,
    ReactiveFormsModule,
    NgxEchartsDirective,
    NgForOf,
    CommonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButton,
    MatSlideToggleModule
  ],
  providers: [DatePipe],
  templateUrl: './inc-unit.component.html',
  styleUrl: './inc-unit.component.scss'
})
export class IncUnitComponent implements OnInit {
  dateform! : FormGroup;
  Units: string[] = [];
  Types: string[] = ['تجمیع','مشتریان','سایرین','هیچکدام'];
  Branchs: string[] = [];
  selectedUnit: string = '';
  selectedType: string = this.Types[0];
  selectedBranch: string = '';
  filterForm = new FormGroup({
    flag_filter_type: new FormControl(false),
    flag_filter_unit: new FormControl(false),
    flag_filter_branch: new FormControl(false)
  });
  get flag_filter_type() { return this.filterForm.get('flag_filter_type')?.value; }
  get flag_filter_unit() { return this.filterForm.get('flag_filter_unit')?.value; }
  get flag_filter_branch() { return this.filterForm.get('flag_filter_branch')?.value; }
  protected flag_time:boolean = false;
  protected flag_toggle_filter:boolean = false;
  protected flag_filter:boolean = false;
  protected flag_count:boolean=false;
  protected flag_Ph_Reasons_Totals:boolean=false;
  protected flag_Reason_Detail_Totals:boolean=false;
  protected flag_popup:boolean=false;
  protected flag_popup_data:boolean=false;
  protected flag_loading:boolean=false;
  protected flag_Top_Reasons:boolean=false;
  public constructor(private toast:NgToastService,private auth:AuthService, private fb:FormBuilder, private getData:IncUnitService, private TimeService:TimeService, private datePipe: DatePipe) {}
  StartDate:string = "";
  EndDate:string = "";
  st_to_en:string = "";
  selected_days:number = 0;
  top_reason_Totals:string = "";
  reason_selected_Totals = "";
  total_Phonecall_Reasons_Totals: number = 0;
  total_Reason_Detail_Totals: number = 0;
  series_Popup_List: any[] = [];
  series_Phonecall_Reasons_Totals: any[] = [];
  series_color = ['#3ebeed','#EC7063','#004e75','#f1c40f','#7f6487','#42b3a1'];
  TitleTextStyle: any= {fontFamily: 'Nazanin', fontSize: '20px',};
  tooltipTextStyle: any = {fontFamily: 'Nazanin', fontWeight: 'bold'};
  legendTextStyle: any = {fontFamily: 'Nazanin', fontWeight: 'bold', fontSize:'14px'};
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
    if (this.getBroker() == 'Mobin' || this.getBroker() == 'Pishro'){
      await this.SetTime(30);
    }
  }
  async GetData(stDate:string, enDate:string):Promise<any> {
    this.flag_count = false;
    this.flag_Ph_Reasons_Totals = false;
    this.flag_Reason_Detail_Totals = false;
    this.flag_Top_Reasons = false;
    this.total_Phonecall_Reasons_Totals = 0;
    this.total_Reason_Detail_Totals = 0;
    this.series_Phonecall_Reasons_Totals = [];
    try {
      let res1 = await this.getData.get_CountDay(stDate, enDate).toPromise();
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

      let res_top_reasons_Totals = await this.getData.get_TopReasons(stDate, enDate).toPromise();
      (this.series_Top_Reasons_bar_Totals.dataset as any).source = res_top_reasons_Totals;
      this.flag_Top_Reasons = true;

      let res2_Totals = await this.getData.get_PhonecallReasons(stDate, enDate).toPromise();
      for (let i = 0; i < res2_Totals.length; i++){
        this.series_Phonecall_Reasons_Totals.push({ name: res2_Totals[i].reason, value: res2_Totals[i].count });
        this.total_Phonecall_Reasons_Totals += res2_Totals[i].count;
      }
      this.top_reason_Totals = this.series_Phonecall_Reasons_Totals[0].name;
      (this.series_Phonecall_Reasons_tmp_Totals.series as any)[0].data = this.series_Phonecall_Reasons_Totals;
      this.flag_Ph_Reasons_Totals = true;

      let res3_Totals = await this.getData.get_ReasonDetail(this.StartDate, this.EndDate, this.top_reason_Totals).toPromise();
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
    } catch (error:any) {
      this.toast.error({detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight'});
    }
  }
  async GetData_F(stDate:string, enDate:string, selectedUnit:string, selectedType:string, selectedBranch:string):Promise<any> {
    this.flag_count = false;
    this.flag_Ph_Reasons_Totals = false;
    this.flag_Reason_Detail_Totals = false;
    this.flag_Top_Reasons = false;
    this.total_Phonecall_Reasons_Totals = 0;
    this.total_Reason_Detail_Totals = 0;
    this.series_Phonecall_Reasons_Totals = [];
    try {
      let res1 = await this.getData.get_CountDay_F(stDate, enDate, selectedUnit, selectedType, selectedBranch).toPromise();
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

      let res_top_reasons_Totals = await this.getData.get_TopReasons_F(stDate, enDate, selectedUnit, selectedType, selectedBranch).toPromise();
      (this.series_Top_Reasons_bar_Totals.dataset as any).source = res_top_reasons_Totals;
      this.flag_Top_Reasons = true;

      let res2_Totals = await this.getData.get_PhonecallReasons_F(stDate, enDate, selectedUnit, selectedType, selectedBranch).toPromise();
      for (let i = 0; i < res2_Totals.length; i++){
        this.series_Phonecall_Reasons_Totals.push({ name: res2_Totals[i].reason, value: res2_Totals[i].count });
        this.total_Phonecall_Reasons_Totals += res2_Totals[i].count;
      }
      this.top_reason_Totals = this.series_Phonecall_Reasons_Totals[0].name;
      (this.series_Phonecall_Reasons_tmp_Totals.series as any)[0].data = this.series_Phonecall_Reasons_Totals;
      this.flag_Ph_Reasons_Totals = true;

      let res3_Totals = await this.getData.get_ReasonDetail_F(this.StartDate, this.EndDate, this.top_reason_Totals, selectedUnit, selectedType, selectedBranch).toPromise();
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
    } catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }

  async chart_click_Totals(event:any){
    if (event.name){
      this.flag_Reason_Detail_Totals = false;
      this.total_Reason_Detail_Totals = 0;
      let res = await this.getData.get_ReasonDetail_F(this.StartDate, this.EndDate, event.name, this.selectedUnit, this.selectedType, this.selectedBranch).toPromise();
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

  async Popup_List_Totals(event:any){
    this.flag_loading = true;
    this.series_Popup_List = await this.getData.get_Description_F(this.StartDate, this.EndDate, event.name, this.selectedUnit, this.selectedType, this.selectedBranch).toPromise();
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
    await this.do_fillter();
    if(!this.flag_toggle_filter)
      await this.GetData(this.StartDate,this.EndDate);
    else
      await this.GetData_F(this.StartDate,this.EndDate,this.selectedUnit, this.selectedType, this.selectedBranch);
  }

  async SetTime(days:number){
    let res_endDate= await this.getData.get_LastDate().toPromise();
    this.EndDate = res_endDate.endDate;
    this.StartDate = format(subDays(this.EndDate, days), 'yyyy-MM-dd');
    this.selected_days = this.TimeService.calc_Diff_Date(this.StartDate, this.EndDate);
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    this.flag_time = true;
    await this.do_fillter();
    if(!this.flag_toggle_filter)
      await this.GetData(this.StartDate,this.EndDate);
    else
      await this.GetData_F(this.StartDate,this.EndDate,this.selectedUnit, this.selectedType, this.selectedBranch);
  }

  async do_fillter(){
    this.Units = [];
    this.Branchs = [];
    this.selectedUnit = '';
    this.selectedBranch = '';
    this.flag_filter = false;
    this.Units = await this.getData.get_AllUnits(this.StartDate, this.EndDate).toPromise();
    if (this.Units.length > 0)
      this.selectedUnit = this.Units[0];
    this.Branchs = await this.getData.get_AllBranchs(this.StartDate, this.EndDate).toPromise();
    if (this.Branchs.length > 0)
      this.selectedBranch = this.Branchs[0];
    this.flag_filter = true;
  }

  getBroker(){
    return this.auth.getUserBroker();
  }

  @ViewChildren('Quick, Target_Totals, Totals') sections!: QueryList<ElementRef>;

  ScrollTo(sectionName: string) {
    let section:any = this.sections.find(sec => sec.nativeElement.id == sectionName);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  async onSearchClicked() {
    if(!this.flag_toggle_filter)
      this.flag_toggle_filter = true;
    await this.GetData_F(this.StartDate,this.EndDate,this.selectedUnit, this.selectedType, this.selectedBranch);
  }

  async check_filter(){
    this.flag_toggle_filter = !(!this.flag_filter_type && !this.flag_filter_unit && !this.flag_filter_branch);
    if(!this.flag_filter_type)
      this.selectedType = this.Types[0];
    if(!this.flag_filter_unit)
      this.selectedUnit = this.Units[0];
    if(!this.flag_filter_branch)
      this.selectedBranch = this.Branchs[0];
  }
}
