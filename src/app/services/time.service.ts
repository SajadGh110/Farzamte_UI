import {Injectable} from '@angular/core';
import {addDays, format, subDays} from "date-fns";
import {HappycallService} from "./happycall.service";

@Injectable({
  providedIn: 'root'
})
export class TimeService{

  constructor(private HappyCallService:HappycallService) { }
  StartDate:string = '';
  EndDate:string = '';

  set_Time(StartDate:string,EndDate:string){
    this.StartDate = StartDate;
    this.EndDate = EndDate;
  }

  async get_HappyCall_Date(time:number){
    let res_date = await this.HappyCallService.get_LastDate().toPromise();
    this.EndDate = res_date.endDate;
    this.StartDate = format(subDays(this.EndDate, time), 'yyyy-MM-dd');
    return [this.StartDate, this.EndDate];
  }
}
