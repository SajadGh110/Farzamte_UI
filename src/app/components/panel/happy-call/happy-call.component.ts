import {Component, OnInit} from '@angular/core';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {format, subDays} from "date-fns";
import {BarChartModule, LineChartModule, NumberCardModule, ScaleType} from "@swimlane/ngx-charts";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {HappycallService} from "../../../services/happycall.service";

@Component({
  selector: 'app-happy-call',
  standalone: true,
  imports: [
    DashboardTopmenuComponent,
    DashboardSidebarComponent,
    ReactiveFormsModule,
    MatProgressSpinner,
    BarChartModule,
    NgIf,
    LineChartModule,
    NgForOf,
    NumberCardModule
  ],
  templateUrl: './happy-call.component.html',
  styleUrl: './happy-call.component.scss'
})
export class HappyCallComponent implements OnInit {
  protected readonly ScaleType = ScaleType;
  protected readonly linecharts_colors = [{name: 'کل تماس ها', value: '#9cfcff'},{name: 'تماس های موفق', value: '#69ff79'},{name: 'تماس های ناموفق', value: '#ff8181'}];
  protected readonly series_nubmercards_labels = ['تعداد مشتریان','مشتریان فعال','مشتریان غیرفعال','تماس موفق','فعال شدن پس از هپی کال','فعالیت در سایر کارگزاری ها','معرفی باشگاه مشتریان']
  protected readonly numbercards_colors = [{name:this.series_nubmercards_labels[0],value:'#8cff7f'},{name:this.series_nubmercards_labels[1],value:'#66d9ff'},{name:this.series_nubmercards_labels[2],value: '#ff7c5a'},{name:this.series_nubmercards_labels[3],value: '#d586ff'},{name:this.series_nubmercards_labels[4],value: '#ffd56d'},{name:this.series_nubmercards_labels[5],value: '#adadad'},{name:this.series_nubmercards_labels[6],value: '#93fff4'}];
  private currentDate:Date = new Date();
  dateform! : FormGroup;
  protected flag_count:boolean=false;
  protected flag_g1:boolean=false;
  public constructor(private toast:NgToastService, private fb:FormBuilder, private getData:HappycallService) {}
  //StartDate:string = format(subDays(this.currentDate, 30), 'yyyy-MM-dd');
  //EndDate:string = format(this.currentDate, 'yyyy-MM-dd');
  StartDate:string = "2024-04-01";
  EndDate:string = "2024-06-01";
  series_happycalls: any[] = [{ name: "کل تماس ها", series: [] }, { name: "تماس های موفق", series: [] }, { name: "تماس های ناموفق", series: [] }];
  series_numbercards: any[] = [];
  Customers_Count:Number = 0;
  Active_Customers_Count:Number = 0;
  Inactive_Customers_Count:Number = 0;
  SuccessfulCalls_Count:Number = 0;
  ActiveAfterCalls_Count:Number = 0;
  ActiveInOtherBrockers_Count:Number = 0;
  ExplanationClub_Count:Number = 0;
  async ngOnInit(){
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    await this.do(this.StartDate,this.EndDate);
  }

  async do(stDate:string,enDate:string){
    this.flag_count = false;
    this.series_happycalls = [{ name: "کل تماس ها", series: [] }, { name: "تماس های موفق", series: [] }, { name: "تماس های ناموفق", series: [] }];
    try {
      // ------------------------------------
      let res1 = await this.getData.get_Total_Count_Day(stDate,enDate).toPromise();
      this.series_happycalls[0].name = "کل تماس ها";
      let series_Total: any[] = [];
      for (let i = 0; i < res1.length; i++) {
        series_Total.push({ name: res1[i].date, value: res1[i].count });
      }
      this.series_happycalls[0].series = series_Total;
      // ------------------------------------
      let res2 = await this.getData.get_SuccessfulCalls_Count_Day(stDate,enDate).toPromise();
      this.series_happycalls[1].name = "تماس های موفق";
      let series_SuccessfulCalls: any[] = [];
      for (let i = 0; i < res2.length; i++) {
        series_SuccessfulCalls.push({ name: res2[i].date, value: res2[i].count });
      }
      this.series_happycalls[1].series = series_SuccessfulCalls;
      // ------------------------------------
      let res3 = await this.getData.get_UnsuccessfulCalls_Count_Day(stDate,enDate).toPromise();
      this.series_happycalls[2].name = "تماس های ناموفق";
      let series_UnsuccessfulCalls: any[] = [];
      for (let i = 0; i < res3.length; i++) {
        series_UnsuccessfulCalls.push({ name: res3[i].date, value: res3[i].count });
      }
      this.series_happycalls[2].series = series_UnsuccessfulCalls;
      this.flag_count = true;
      // ------------------------------------
      this.Customers_Count = await this.getData.get_Customers_Count(stDate,enDate).toPromise();
      this.Active_Customers_Count = await this.getData.get_Active_Customers_Count(stDate,enDate).toPromise();
      this.Inactive_Customers_Count = await this.getData.get_Inactive_Customers_Count(stDate,enDate).toPromise();
      this.SuccessfulCalls_Count = await this.getData.get_SuccessfulCalls_Count(stDate,enDate).toPromise();
      this.ActiveAfterCalls_Count = await this.getData.get_ActiveAfterCalls_Count(stDate,enDate).toPromise();
      this.ActiveInOtherBrockers_Count = await this.getData.get_ActiveInOtherBrockers_Count(stDate,enDate).toPromise();
      this.ExplanationClub_Count = await this.getData.get_ExplanationClub_Count(stDate,enDate).toPromise();
      this.series_numbercards = [
        {
          "name": this.series_nubmercards_labels[0],
          "value": this.Customers_Count
        },
        {
          "name": this.series_nubmercards_labels[1],
          "value": this.Active_Customers_Count
        },
        {
          "name": this.series_nubmercards_labels[2],
          "value": this.Inactive_Customers_Count
        },
        {
          "name": this.series_nubmercards_labels[3],
          "value": this.SuccessfulCalls_Count
        },
        {
          "name": this.series_nubmercards_labels[4],
          "value": this.ActiveAfterCalls_Count
        },
        {
          "name": this.series_nubmercards_labels[5],
          "value": this.ActiveInOtherBrockers_Count
        },
        {
          "name": this.series_nubmercards_labels[6],
          "value": this.ExplanationClub_Count
        }
        ]

      this.flag_g1 = true;
    }catch (error:any){
      this.toast.error({ detail: "ERROR", summary: error.message, duration: 5000, position: 'topRight' });
    }
  }


  async OnUpdateDate(){
    this.StartDate = this.dateform.controls['StartDate'].value;
    this.EndDate = this.dateform.controls['EndDate'].value;
    await this.do(this.StartDate,this.EndDate);
  }
}
