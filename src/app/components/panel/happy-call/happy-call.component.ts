import {Component, OnInit} from '@angular/core';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {format, subDays} from "date-fns";
import {BarChartModule, LineChartModule, ScaleType} from "@swimlane/ngx-charts";
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
    NgForOf
  ],
  templateUrl: './happy-call.component.html',
  styleUrl: './happy-call.component.scss'
})
export class HappyCallComponent implements OnInit {
  protected readonly ScaleType = ScaleType;
  protected readonly customcolor = [{name: 'کل تماس ها', value: '#9cfcff'},{name: 'تماس های موفق', value: '#69ff79'},{name: 'تماس های ناموفق', value: '#ff8181'}];
  private currentDate:Date = new Date();
  dateform! : FormGroup;
  protected flag_count:boolean=false;
  protected flag_data:boolean=false;
  public constructor(private toast:NgToastService, private fb:FormBuilder, private getData:HappycallService) {}
  //StartDate:string = format(subDays(this.currentDate, 30), 'yyyy-MM-dd');
  //EndDate:string = format(this.currentDate, 'yyyy-MM-dd');
  StartDate:string = "2024-04-01";
  EndDate:string = "2024-06-01";
  series_happycalls: any[] = [{ name: "کل تماس ها", series: [] }, { name: "تماس های موفق", series: [] }, { name: "تماس های ناموفق", series: [] }];
  data: any[] = [];
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
      let res1 = await this.getData.get_Total_Count(stDate,enDate).toPromise();
      this.series_happycalls[0].name = "کل تماس ها";
      let series_Total: any[] = [];
      for (let i = 0; i < res1.length; i++) {
        series_Total.push({ name: res1[i].date, value: res1[i].count });
      }
      this.series_happycalls[0].series = series_Total;
      // ------------------------------------
      let res2 = await this.getData.get_SuccessfulCalls_Count(stDate,enDate).toPromise();
      this.series_happycalls[1].name = "تماس های موفق";
      let series_SuccessfulCalls: any[] = [];
      for (let i = 0; i < res2.length; i++) {
        series_SuccessfulCalls.push({ name: res2[i].date, value: res2[i].count });
      }
      this.series_happycalls[1].series = series_SuccessfulCalls;
      // ------------------------------------
      let res3 = await this.getData.get_UnsuccessfulCalls_Count(stDate,enDate).toPromise();
      this.series_happycalls[2].name = "تماس های ناموفق";
      let series_UnsuccessfulCalls: any[] = [];
      for (let i = 0; i < res3.length; i++) {
        series_UnsuccessfulCalls.push({ name: res3[i].date, value: res3[i].count });
      }
      this.series_happycalls[2].series = series_UnsuccessfulCalls;
      this.flag_count = true;

      let res4 = await this.getData.get_All(stDate,enDate).toPromise();
      this.data = res4;
      this.flag_data = true;

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
