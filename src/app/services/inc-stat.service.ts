import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class IncStatService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}InComingCall_Stat/`;

  get_AllTypes():Observable<any>{
    return this.authService.get(`${this.apiUrl}AllTypes`);
  }

  get_AllDates(type:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}AllDates/${type}`);
  }

  get_IncStats(type:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}IncStats/${type}`);
  }

  get_IncStats_M(type:string, month:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}IncStats_M/${type}/${month}`);
  }
}
