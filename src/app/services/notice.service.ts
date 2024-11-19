import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_LastDate_SMS():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/LastDate_SMS`,{headers:this.header});
  }

  get_LastDate_Call():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/LastDate_Call`,{headers:this.header});
  }

  get_Count_SMS_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/Count_SMS_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Count_TotalCalls_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/Count_TotalCalls_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Count_SuccessfulCalls_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/Count_SuccessfulCalls_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Count_UnsuccessfulCalls_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/Count_UnsuccessfulCalls_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Noticetype_SMS(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/Noticetype_SMS?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Noticetype_Call(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/Noticetype_Call?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_capitalincrease_type_SMS(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/capitalincrease_type_SMS?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_capitalincrease_type_Call(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/capitalincrease_type_Call?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_symbol_SMS(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/symbol_SMS?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_symbol_Call(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Notice/symbol_Call?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }
}
