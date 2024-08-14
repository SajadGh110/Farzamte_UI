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

  get_LastDate():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/LastDate`,{headers:this.header});
  }

  get_Customers_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Customers_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Customers_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Active_Customers_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Active_Customers_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Active_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Active_Customers_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Inactive_Customers_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Inactive_Customers_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Inactive_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/Inactive_Customers_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_SuccessfulCalls_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/SuccessfulCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveAfterCalls_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveAfterCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveInOtherBrokers_Count(StartDate:string, EndDate:string):Observable<any>{
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

  get_AllCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/AllCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveIntroduction(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveIntroduction?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_InactiveIntroduction(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/InactiveIntroduction?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveChoosingBrokerage(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveChoosingBrokerage?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_InactiveChoosingBrokerage(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/InactiveChoosingBrokerage?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ActiveSuccessfulCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ActiveSuccessfulCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_InactiveSuccessfulCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/InactiveSuccessfulCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_DisinclinationCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/DisinclinationCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ReCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/ReCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_LackInfoCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/LackInfoCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_RepeatCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/RepeatCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_UnResponsiveCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/UnResponsiveCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_OffCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/OffCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_RejectCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/RejectCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_UnavailableCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/UnavailableCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_BusyCalls_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/BusyCalls_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_UserRequests_Count(StartDate:string,EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}HappyCall/UserRequests_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }
}
