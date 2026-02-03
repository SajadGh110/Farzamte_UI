import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class HappycallService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}HappyCall/`;

  get_LastDate():Observable<any>{
    return this.authService.get(`${this.apiUrl}LastDate`);
  }

  get_Customers_Stats(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetCustomersStats/${StartDate}_${EndDate}`);
  }

  get_Total_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Total_Count_Day/${StartDate}_${EndDate}`);
  }

  get_SuccessfulCalls_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}SuccessfulCalls_Count_Day/${StartDate}_${EndDate}`);
  }

  get_UnsuccessfulCalls_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}UnsuccessfulCalls_Count_Day/${StartDate}_${EndDate}`);
  }

  get_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Customers_List/${StartDate}_${EndDate}`);
  }

  get_Active_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Active_Customers_List/${StartDate}_${EndDate}`);
  }

  get_Inactive_Customers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Inactive_Customers_List/${StartDate}_${EndDate}`);
  }

  get_SuccessfulCalls_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}SuccessfulCalls_List/${StartDate}_${EndDate}`);
  }

  get_ActiveAfterCalls_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ActiveAfterCalls_List/${StartDate}_${EndDate}`);
  }

  get_ActiveInOtherBrokers_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ActiveInOtherBrockers_List/${StartDate}_${EndDate}`);
  }

  get_ExplanationClub_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ExplanationClub_List/${StartDate}_${EndDate}`);
  }

  get_ActiveIntroduction(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ActiveIntroduction/${StartDate}_${EndDate}`);
  }

  get_InactiveIntroduction(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}InactiveIntroduction/${StartDate}_${EndDate}`);
  }

  get_ActiveChoosingBrokerage(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ActiveChoosingBrokerage/${StartDate}_${EndDate}`);
  }

  get_InactiveChoosingBrokerage(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}InactiveChoosingBrokerage/${StartDate}_${EndDate}`);
  }
}
