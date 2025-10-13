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

  get_AllUnits(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetAllUnits?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_AllBranchs(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetAllBranchs?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_CountDay(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetCountDay?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_TopReasons(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetTopReasons?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_PhonecallReasons(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetPhonecallReasons?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ReasonDetail(StartDate:string, EndDate:string, Reason:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetReasonDetail?startDate=${StartDate}&endDate=${EndDate}&Reason=${Reason}`,{headers:this.header});
  }

  get_Description(StartDate:string, EndDate:string, Detail:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetDescription?startDate=${StartDate}&endDate=${EndDate}&Detail=${Detail}`,{headers:this.header});
  }

  get_CountDay_F(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetCountDay_F?startDate=${StartDate}&endDate=${EndDate}&unit=${Unit}&type=${Type}&branch=${Branch}`,{headers:this.header});
  }

  get_TopReasons_F(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetTopReasons_F?startDate=${StartDate}&endDate=${EndDate}&unit=${Unit}&type=${Type}&branch=${Branch}`,{headers:this.header});
  }

  get_PhonecallReasons_F(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetPhonecallReasons_F?startDate=${StartDate}&endDate=${EndDate}&unit=${Unit}&type=${Type}&branch=${Branch}`,{headers:this.header});
  }

  get_ReasonDetail_F(StartDate:string, EndDate:string, Reason:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetReasonDetail_F?startDate=${StartDate}&endDate=${EndDate}&Reason=${Reason}&unit=${Unit}&type=${Type}&branch=${Branch}`,{headers:this.header});
  }

  get_Description_F(StartDate:string, EndDate:string, Detail:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Unit/GetDescription_F?startDate=${StartDate}&endDate=${EndDate}&Detail=${Detail}&unit=${Unit}&type=${Type}&branch=${Branch}`,{headers:this.header});
  }
}
