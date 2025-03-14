import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IncomingCallService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_LastDate():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/LastDate`,{headers:this.header});
  }

  get_Total_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Total_Count_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Top_Reasons_Customers(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Top_Reasons_Customers?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Top_Reasons_Others(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Top_Reasons_Others?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Top_Reasons_Totals(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Top_Reasons_Totals?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Phonecall_Reasons_Customers(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Phonecall_Reasons_Customers?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Phonecall_Reasons_Others(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Phonecall_Reasons_Others?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Phonecall_Reasons_Totals(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Phonecall_Reasons_Totals?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Reason_Detail_Customers(StartDate:string, EndDate:string, Reason:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Reason_Detail_Customers?startDate=${StartDate}&endDate=${EndDate}&Reason=${Reason}`,{headers:this.header});
  }

  get_Reason_Detail_Others(StartDate:string, EndDate:string, Reason:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Reason_Detail_Others?startDate=${StartDate}&endDate=${EndDate}&Reason=${Reason}`,{headers:this.header});
  }

  get_Reason_Detail_Totals(StartDate:string, EndDate:string, Reason:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Reason_Detail_Totals?startDate=${StartDate}&endDate=${EndDate}&Reason=${Reason}`,{headers:this.header});
  }

  get_description_Customers(StartDate:string, EndDate:string, Detail:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/description_Customers?startDate=${StartDate}&endDate=${EndDate}&Detail=${Detail}`,{headers:this.header});
  }

  get_description_Others(StartDate:string, EndDate:string, Detail:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/description_Others?startDate=${StartDate}&endDate=${EndDate}&Detail=${Detail}`,{headers:this.header});
  }

  get_description_Totals(StartDate:string, EndDate:string, Detail:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/description_Totals?startDate=${StartDate}&endDate=${EndDate}&Detail=${Detail}`,{headers:this.header});
  }
}
