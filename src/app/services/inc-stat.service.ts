import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IncStatService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_AllTypes():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Stat/AllTypes`,{headers:this.header});
  }

  get_AllDates(type:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Stat/AllDates?type=${type}`,{headers:this.header});
  }

  get_IncStats(type:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Stat/IncStats?type=${type}`,{headers:this.header});
  }

  get_IncStats_M(type:string, month:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}InComingCall_Stat/IncStats_M?type=${type}&month=${month}`,{headers:this.header});
  }
}
