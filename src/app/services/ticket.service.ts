import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}CaseReport/`;

  get_LastDate():Observable<any>{
    return this.authService.get(`${this.apiUrl}LastDate`);
  }

  get_Ticket_Reasons(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Ticket_Reasons/${StartDate}_${EndDate}`);
  }

  get_Reason_Detail(StartDate:string, EndDate:string, Reason:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Reason_Detail/${StartDate}_${EndDate}/${Reason}`);
  }

  get_Ticket_Status(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Ticket_Status/${StartDate}_${EndDate}`);
  }

  get_casetype_detail(StartDate:string, EndDate:string, casetype:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}casetype_detail/${StartDate}_${EndDate}/${casetype}`);
  }

  get_Total_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Total_List/${StartDate}_${EndDate}`);
  }

  get_Solved_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Solved_List/${StartDate}_${EndDate}`);
  }

  get_InProgress_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}InProgress_List/${StartDate}_${EndDate}`);
  }

  get_Cancelled_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Cancelled_List/${StartDate}_${EndDate}`);
  }

  get_InfoProvided_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}InfoProvided_List/${StartDate}_${EndDate}`);
  }

  get_detail_table(id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}detail_table/${id}`);
  }
}
