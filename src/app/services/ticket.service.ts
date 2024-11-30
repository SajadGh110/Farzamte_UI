import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_LastDate():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/LastDate`,{headers:this.header});
  }

  get_Ticket_Reasons(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/Ticket_Reasons?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Reason_Detail(StartDate:string, EndDate:string, Reason:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/Reason_Detail?startDate=${StartDate}&endDate=${EndDate}&Reason=${Reason}`,{headers:this.header});
  }

  get_Ticket_Status(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/Ticket_Status?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_casetype_detail(StartDate:string, EndDate:string, casetype:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/casetype_detail?startDate=${StartDate}&endDate=${EndDate}&casetype=${casetype}`,{headers:this.header});
  }

  get_Total_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/Total_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Solved_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/Solved_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_InProgress_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/InProgress_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Cancelled_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/Cancelled_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_InfoProvided_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/InfoProvided_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_detail_table(id:number):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}CaseReport/detail_table?id=${id}`,{headers:this.header});
  }
}
