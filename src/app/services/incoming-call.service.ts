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

  get_Phonecall_Reasons(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Phonecall_Reasons?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Reason_Detail(StartDate:string, EndDate:string, Reason:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/Reason_Detail?startDate=${StartDate}&endDate=${EndDate}&Reason=${Reason}`,{headers:this.header});
  }

  get_description(StartDate:string, EndDate:string, Detail:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall/description?startDate=${StartDate}&endDate=${EndDate}&Detail=${Detail}`,{headers:this.header});
  }
}
