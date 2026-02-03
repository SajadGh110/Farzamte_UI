import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class BrokerageProfitService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}BrokerageProfit/`;

  GetDateList(): Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDateList`);
  }

  GetProfit(month:string): Observable<any>{
    return this.authService.get(`${this.apiUrl}GetProfit/${month}`);
  }

  GetProfitById(brokerageID:number, month:string): Observable<any>{
    return this.authService.get(`${this.apiUrl}GetProfitById/${brokerageID}/${month}`);
  }

  GetBrokersOnDate(month:string): Observable<any>{
    return this.authService.get(`${this.apiUrl}GetBrokersOnDate/${month}`);
  }
}
