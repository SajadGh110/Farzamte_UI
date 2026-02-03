import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}Notice/`;

  get_LastDate_SMS():Observable<any>{
    return this.authService.get(`${this.apiUrl}LastDate_SMS`);
  }

  get_LastDate_Call():Observable<any>{
    return this.authService.get(`${this.apiUrl}LastDate_Call`);
  }

  get_Count_SMS_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Count_SMS_Day/${StartDate}_${EndDate}`);
  }

  get_Count_TotalCalls_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Count_TotalCalls_Day/${StartDate}_${EndDate}`);
  }

  get_Count_SuccessfulCalls_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Count_SuccessfulCalls_Day/${StartDate}_${EndDate}`);
  }

  get_Count_UnsuccessfulCalls_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Count_UnsuccessfulCalls_Day/${StartDate}_${EndDate}`);
  }

  get_Noticetype_SMS(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Noticetype_SMS/${StartDate}_${EndDate}`);
  }

  get_Noticetype_Call(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Noticetype_Call/${StartDate}_${EndDate}`);
  }

  get_capitalincrease_type_SMS(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}capitalincrease_type_SMS/${StartDate}_${EndDate}`);
  }

  get_capitalincrease_type_Call(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}capitalincrease_type_Call/${StartDate}_${EndDate}`);
  }

  get_symbol_SMS(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}symbol_SMS/${StartDate}_${EndDate}`);
  }

  get_symbol_Call(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}symbol_Call/${StartDate}_${EndDate}`);
  }
}
