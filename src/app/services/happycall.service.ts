import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HappycallService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_LastDate():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/LastDate`,{headers:this.header});
  }

  get_Customers_Stats(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/GetCustomersStats?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Total_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Total_Count_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_SuccessfulCalls_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/SuccessfulCalls_Count_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_UnsuccessfulCalls_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/UnsuccessfulCalls_Count_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Customers_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Active_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Active_Customers_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Inactive_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Inactive_Customers_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_SuccessfulCalls_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/SuccessfulCalls_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveAfterCalls_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveAfterCalls_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveInOtherBrokers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveInOtherBrockers_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ExplanationClub_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ExplanationClub_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveIntroduction(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveIntroduction?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_InactiveIntroduction(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/InactiveIntroduction?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveChoosingBrokerage(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveChoosingBrokerage?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_InactiveChoosingBrokerage(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/InactiveChoosingBrokerage?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }
}
