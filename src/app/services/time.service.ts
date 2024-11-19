import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService{

  constructor() { }
  StartDate:string = '';
  EndDate:string = '';
  available_days:number = 0;

  async transfer_days(days:number){
    this.available_days = days;
  }
  calc_Diff_Date(StartDate:string, EndDate:string) :number {
    if (StartDate && EndDate) {
      const start = new Date(StartDate);
      const end = new Date(EndDate);
      const timeDiff = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      return 0;
    }
  }
}
