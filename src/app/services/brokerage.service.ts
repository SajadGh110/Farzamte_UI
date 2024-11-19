import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BrokerageService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  get_AllDate():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Brokerage/AllDate`,{headers:this.header});
  }

  get_All_Brokers(Date_Monthly:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageCMP/All_Brokers_On_Date?Date_Monthly=${Date_Monthly}`,{headers:this.header});
  }

  Get_Brokerage_Name():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Brokerage/Get_Brokerage_Name`,{headers:this.header});
  }

  get_Top_Brokers(Date_Monthly:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageCMP/Top_Brokers?Date_Monthly=${Date_Monthly}`,{headers:this.header});
  }

  get_totals(Date_Monthly:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Brokerage/Totals?Date_Monthly=${Date_Monthly}`,{headers:this.header});
  }

  get_totals_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageCMP/Totals?Date_Monthly=${Date_Monthly}&id=${id}`,{headers:this.header});
  }

  get_Chart1(Date_Monthly:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Brokerage/Chart1?Date_Monthly=${Date_Monthly}`,{headers:this.header});
  }

  get_Chart1_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageCMP/Chart1?Date_Monthly=${Date_Monthly}&id=${id}`,{headers:this.header});
  }

  get_Chart2(Date_Monthly:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Brokerage/Chart2?Date_Monthly=${Date_Monthly}`,{headers:this.header});
  }

  get_Chart2_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageCMP/Chart2?Date_Monthly=${Date_Monthly}&id=${id}`,{headers:this.header});
  }

  get_Chart3(Date_Monthly:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Brokerage/Chart3?Date_Monthly=${Date_Monthly}`,{headers:this.header});
  }

  get_Chart3_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageCMP/Chart3?Date_Monthly=${Date_Monthly}&id=${id}`,{headers:this.header});
  }

  get_Chart4(Date_Monthly:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Brokerage/Chart4?Date_Monthly=${Date_Monthly}`,{headers:this.header});
  }

  get_Chart4_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageCMP/Chart4?Date_Monthly=${Date_Monthly}&id=${id}`,{headers:this.header});
  }

  get_Chart5(Date_Monthly:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}Brokerage/Chart5?Date_Monthly=${Date_Monthly}`,{headers:this.header});
  }

  get_Chart5_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}BrokerageCMP/Chart5?Date_Monthly=${Date_Monthly}&id=${id}`,{headers:this.header});
  }
}
