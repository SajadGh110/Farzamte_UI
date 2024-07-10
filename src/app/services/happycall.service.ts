import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HappycallService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_Total_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Total_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_SuccessfulCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/SuccessfulCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_UnsuccessfulCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/UnsuccessfulCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_All(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/All?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }
}
