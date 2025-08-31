import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BrokerageProfitService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  GetProfit(month:string): Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageProfit/GetProfit?month=${month}`,{headers:this.header});
  }
}
