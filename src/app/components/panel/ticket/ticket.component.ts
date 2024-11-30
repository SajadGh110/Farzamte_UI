import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {TimeService} from "../../../services/time.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {TicketService} from "../../../services/ticket.service";
import {DashboardContactComponent} from "../../Template/dashboard-contact/dashboard-contact.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgxEchartsDirective} from "ngx-echarts";
import {EChartsOption} from "echarts";
import {AllTicketsTableComponent} from "./all-tickets-table/all-tickets-table.component";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {format, subDays} from "date-fns";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [DashboardSidebarComponent, DashboardTopmenuComponent, DashboardContactComponent, MatProgressSpinner, NgIf, NgxEchartsDirective, AllTicketsTableComponent, NgForOf, DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent implements OnInit {
  @ViewChild('target') target!: ElementRef;
  dateform! : FormGroup;
  protected flag_time:boolean = false;
  protected flag_TK_Reasons:boolean=false;
  protected flag_Reason_Detail:boolean=false;
  protected flag_CaseType_Detail:boolean=false;
  protected flag_CaseType_Popup:boolean=false;
  protected flag_TK_Status:boolean=false;
  protected flag_table:boolean=false;
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder, private getData:TicketService, private TimeService:TimeService) {}
  StartDate:string = "";
  EndDate:string = "";
  selected_days:number = 0;
  top_reason:string = "";
  reason_selected = "";
  casetype_selected = "";
  total_TK_Reasons: number = 0;
  total_Reason_Detail: number = 0;
  total_TK_Status: number = 0;
  series_TK_Reasons: any[] = [];
  series_CT_Detail: any[] = [];
  series_TK_Status: any[] = [];
  series_All_Table: any[] = [];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  selectedButton: string = 'total';
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

  series_TK_Reasons_tmp:EChartsOption = {
    title: { show: false },
    tooltip: {
      trigger: 'item', textStyle:this.tooltipTextStyle,
      formatter: (params : any) => {
        const total = this.total_TK_Reasons;
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
        name:'عناوین اصلی تیکت',
        breadcrumb: {show: false},
        roam: false,
        nodeClick: false,
        label: {
          show: true,
          fontFamily:'Nazanin',fontWeight:'bold',fontSize:'16px',position:'insideTopLeft', padding:15,
          formatter: (params : any) => {
            const total = this.total_TK_Reasons;
            const percentage = ((params.value / total) * 100).toFixed(2) + '%';
            return  `${params.name}\n\n${percentage}`;
          }
        },
        data: this.series_TK_Reasons
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
        name: 'جزئیات عناوین تیکت ها',
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
  series_TK_Status_Pie:EChartsOption = {
    tooltip: {trigger: 'item',textStyle:this.tooltipTextStyle,
      formatter: (params : any) => {
        const total = this.total_TK_Status;
        const percentage = ((params.value / total) * 100).toFixed(2);
        return  `${percentage}% - ${params.name}`;
      }},
    legend: {top: '10%', left: 'center',textStyle:this.legendTextStyle},
    title: [{text: 'وضعیت تیکت ها', left: 'center',textStyle:this.TitleTextStyle},],
    toolbox: {show: true, orient: 'vertical', left: 'right', top: 'center', feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        saveAsImage: { show: true }
      }},
    series: [{
      type: 'pie',
      name:'وضعیت تیکت ها',
      radius: ['30%', '45%'],
      color:this.series_color,
      avoidLabelOverlap: false,
      itemStyle: {borderRadius: 4, borderColor: '#fff', borderWidth: 1},
      data: this.series_TK_Status,
      label: {show:true, position: 'outer', alignTo: 'labelLine',fontFamily:'Nazanin',fontWeight:'bold',fontSize:'14px',
        formatter: (params : any) => {
          const total = this.total_TK_Status;
          const percentage = ((params.value / total) * 100).toFixed(2);
          return `${percentage}% - ${params.name}`;
        }},
    }]
  };

  async ngOnInit(){
    if (this.auth.getUserRole() !== "Owner" && this.auth.getUserRole() !== "Admin") {
      this.toast.error({detail: "ERROR", summary: "Access Denied!", duration: 5000, position: 'topRight'});
      await this.router.navigate(['profile']);
    }
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
    if (this.getBroker() == 'Mobin')
      this.SetTime(30);
  }

  async do(stDate:string,enDate:string) {
    this.flag_TK_Reasons = false;
    this.flag_Reason_Detail = false;
    this.flag_CaseType_Detail = false;
    this.flag_TK_Status = false;
    this.total_TK_Reasons = 0;
    this.total_Reason_Detail = 0;
    this.total_TK_Status = 0;
    this.series_TK_Reasons = [];
    this.series_TK_Status = [];
    this.series_All_Table = [];
    try {
      let res1 = await this.getData.get_Ticket_Reasons(stDate,enDate).toPromise();
      for (let i = 0; i < res1.length; i++){
        this.series_TK_Reasons.push({ name: res1[i].reason, value: res1[i].count });
        this.total_TK_Reasons += res1[i].count;
      }
      this.top_reason = this.series_TK_Reasons[0].name;
      (this.series_TK_Reasons_tmp.series as any)[0].data = this.series_TK_Reasons;
      this.flag_TK_Reasons = true;

      let res2 = await this.getData.get_Reason_Detail(this.StartDate,this.EndDate,this.top_reason).toPromise();
      let series_lbl: any[] = [];
      let series_count: any[] = [];
      for (let i = 0; i < res2.length; i++){
        series_lbl.push(res2[i].reasonDetail);
        series_count.push(res2[i].count);
        this.total_Reason_Detail += res2[i].count;
      }
      this.reason_selected = this.top_reason;
      (this.series_Reason_Detail_bar.yAxis as any)[0].data = series_lbl;
      (this.series_Reason_Detail_bar.series as any)[0].data = series_count;
      this.flag_Reason_Detail = true;
      let res3 = await this.getData.get_Ticket_Status(this.StartDate,this.EndDate).toPromise();
      for (let i = 0; i < res3.length; i++){
        this.series_TK_Status.push({ name: res3[i].status, value: res3[i].count });
        this.total_TK_Status += res3[i].count;
      }
      (this.series_TK_Status_Pie.series as any)[0].data = this.series_TK_Status;
      this.flag_TK_Status = true;

      this.series_All_Table = await this.getData.get_Total_List(this.StartDate,this.EndDate).toPromise();
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
        case "Solved":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_Solved_List(this.StartDate,this.EndDate).toPromise();
          break;
        case "InProgress":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_InProgress_List(this.StartDate,this.EndDate).toPromise();
          break;
        case "Cancelled":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_Cancelled_List(this.StartDate,this.EndDate).toPromise();
          break;
        case "InfoProvided":
          this.flag_table = false;
          this.series_All_Table = await this.getData.get_InfoProvided_List(this.StartDate,this.EndDate).toPromise();
          break;
      }
      this.flag_table = true;
      this.selectedButton = item;
    }
  }

  isSelected(item: string): boolean {
    return this.selectedButton === item;
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

  async popup_casetype_detail(event:any){
    this.casetype_selected = event.name;
    this.flag_CaseType_Popup = true;
    this.series_CT_Detail = await this.getData.get_casetype_detail(this.StartDate,this.EndDate,event.name).toPromise();
    this.flag_CaseType_Detail = true;
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
  exportToExcel(){
    const dataToExport = this.series_All_Table.map(row => {
      return {
        'کد': row.id,
        'ایجاد کننده تیکت': row.owner,
        'تاریخ ایجاد': new Date(row.createdon).toLocaleDateString() + ' ' + new Date(row.createdon).toLocaleTimeString(),
        'تاریخ بررسی تیکت': row.caseResolutionCreatedOn,
        'شخص بررسی کننده تیکت': row.caseResolutionsolver,
        'وضعیت': row.status,
      };
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'report');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);
  }

  getBroker(){
    return this.auth.getUserBroker();
  }

  scroll(){ this.target.nativeElement.scrollIntoView({ behavior: 'smooth' }); }
}
