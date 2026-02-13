import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class IncomingCallService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}InComingCall/`;

  get_LastDate():Observable<any>{
    return this.authService.get(`${this.apiUrl}LastDate`);
  }

  get_AllUnits(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetAllUnits/${StartDate}_${EndDate}`);
  }

  get_AllBranches(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetAllBranches/${StartDate}_${EndDate}`);
  }

  get_CountDay(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetCountDay/${StartDate}_${EndDate}/${Unit}/${Type}?branch=${Branch}`);
  }

  get_TopReasons(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetTopReasons/${StartDate}_${EndDate}/${Unit}/${Type}?branch=${Branch}`);
  }

  get_PhonecallReasons(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetPhonecallReasons/${StartDate}_${EndDate}/${Unit}/${Type}?branch=${Branch}`);
  }

  get_ReasonDetail(StartDate:string, EndDate:string, Reason:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetReasonDetail/${StartDate}_${EndDate}/${Unit}/${Type}?branch=${Branch}&reason=${Reason}`);
  }

  get_Description(StartDate:string, EndDate:string, Detail:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescription/${StartDate}_${EndDate}/${Unit}/${Type}?branch=${Branch}&detail=${Detail}`);
  }

  get_FilteredExpertsDetails(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetFilteredExpertsDetails/${StartDate}_${EndDate}/${Unit}/${Type}?branch=${Branch}`);
  }
}
