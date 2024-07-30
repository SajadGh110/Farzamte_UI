import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }
  //private currentDate:Date = new Date();
  //StartDate:string = format(subDays(this.currentDate, 30), 'yyyy-MM-dd');
  //EndDate:string = format(this.currentDate, 'yyyy-MM-dd');
  StartDate:string = "2024-04-01";
  EndDate:string = "2024-06-01";
  set_Time(StartDate:string,EndDate:string){
    this.StartDate = StartDate;
    this.EndDate = EndDate;
  }
}
