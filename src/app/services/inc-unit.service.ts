import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IncUnitService {
  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_LastDate():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/LastDate`,{headers:this.header});
  }

  get_AllTypes():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetAllTypes`,{headers:this.header});
  }

  get_Total_Count_Day(StartDate:string, EndDate:string, Unit:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/Total_Count_Day?startDate=${StartDate}&endDate=${EndDate}&endDate=${EndDate}&unit=${Unit}`,{headers:this.header});
  }

  get_Top_Reasons_Totals(StartDate:string, EndDate:string, Unit:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/Top_Reasons_Totals?startDate=${StartDate}&endDate=${EndDate}&endDate=${EndDate}&unit=${Unit}`,{headers:this.header});
  }

  get_Phonecall_Reasons_Totals(StartDate:string, EndDate:string, Unit:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/Phonecall_Reasons_Totals?startDate=${StartDate}&endDate=${EndDate}&endDate=${EndDate}&unit=${Unit}`,{headers:this.header});
  }

  get_Reason_Detail_Totals(StartDate:string, EndDate:string, Reason:string, Unit:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/Reason_Detail_Totals?startDate=${StartDate}&endDate=${EndDate}&endDate=${EndDate}&unit=${Unit}&Reason=${Reason}`,{headers:this.header});
  }

  get_description_Totals(StartDate:string, EndDate:string, Detail:string, Unit:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/description_Totals?startDate=${StartDate}&endDate=${EndDate}&endDate=${EndDate}&unit=${Unit}&Detail=${Detail}`,{headers:this.header});
  }
}
