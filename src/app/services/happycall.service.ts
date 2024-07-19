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

  get_Customers_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Customers_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_UniqueCustomers(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/UniqueCustomers?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Active_Customers_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Active_Customers_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Inactive_Customers_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Inactive_Customers_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_SuccessfulCalls_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/SuccessfulCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveAfterCalls_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveAfterCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveInOtherBrockers_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveInOtherBrockers_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ExplanationClub_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ExplanationClub_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
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

  get_All(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/All?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }
}
