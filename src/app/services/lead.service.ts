import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}Lead/`;

  get_LastDate():Observable<any>{
    return this.authService.get(`${this.apiUrl}LastDate`);
  }

  get_TotalCount(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}TotalCount/${StartDate}_${EndDate}`);
  }

  get_StatsCount(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}StatsCount/${StartDate}_${EndDate}`);
  }

  get_LeadsList(StartDate:string, EndDate:string, status:string, layer:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}LeadsList/${StartDate}_${EndDate}/${status}/${layer}`);
  }
}
