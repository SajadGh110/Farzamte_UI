import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TransportToSmartService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_LastDate():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/LastDate`,{headers:this.header});
  }

  get_Total_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Total_Count_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ContinueSmart_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/ContinueSmart_Count_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ReturnTadbir_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/ReturnTadbir_Count_Day?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Total_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Total_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ContinueSmart_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/ContinueSmart_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ReturnTadbir_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/ReturnTadbir_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Successful_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Successful_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Unsuccessful_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Unsuccessful_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Total_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Total_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ContinueSmart_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/ContinueSmart_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_ReturnTadbir_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/ReturnTadbir_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Successful_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Successful_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Unsuccessful_List(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Unsuccessful_List?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Reasons_ContinueSmart_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Reasons_ContinueSmart_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Reasons_ReturnTadbir_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Reasons_ReturnTadbir_Count?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Average_CustomerSatisfaction(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Average_CustomerSatisfaction?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Average_CustomerSatisfaction_Smart(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Average_CustomerSatisfaction_Smart?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_Average_CustomerSatisfaction_Tadbir(StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/Average_CustomerSatisfaction_Tadbir?startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  get_detail_table(id:number):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}TransportToSmart/detail_table?id=${id}`,{headers:this.header});
  }
}
