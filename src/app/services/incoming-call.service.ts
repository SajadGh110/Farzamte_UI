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

  get_CountDay(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetCountDay/${StartDate}_${EndDate}`);
  }

  get_TopReasons(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetTopReasons/${StartDate}_${EndDate}`);
  }

  get_PhonecallReasons(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetPhonecallReasons/${StartDate}_${EndDate}`);
  }

  get_ReasonDetail(StartDate:string, EndDate:string, Reason:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetReasonDetail/${StartDate}_${EndDate}?reason=${Reason}`);
  }

  get_Description(StartDate:string, EndDate:string, Detail:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescription/${StartDate}_${EndDate}/${Detail}`);
  }

  get_CountDay_F(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetCountDay_F/${StartDate}_${EndDate}/${Unit}/${Type}/${Branch}`);
  }

  get_TopReasons_F(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetTopReasons_F/${StartDate}_${EndDate}/${Unit}/${Type}/${Branch}`);
  }

  get_PhonecallReasons_F(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetPhonecallReasons_F/${StartDate}_${EndDate}/${Unit}/${Type}/${Branch}`);
  }

  get_ReasonDetail_F(StartDate:string, EndDate:string, Reason:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetReasonDetail_F/${StartDate}_${EndDate}/${Reason}/${Unit}/${Type}/${Branch}`);
  }

  get_Description_F(StartDate:string, EndDate:string, Detail:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescription_F/${StartDate}_${EndDate}/${Detail}/${Unit}/${Type}/${Branch}`);
  }

  get_FilteredExpertsDetails(StartDate:string, EndDate:string, Unit:string, Type:string, Branch:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetFilteredExpertsDetails/${StartDate}_${EndDate}/${Unit}/${Type}/${Branch}`);
  }
}
