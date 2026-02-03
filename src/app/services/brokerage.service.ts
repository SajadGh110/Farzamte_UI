import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class BrokerageService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}`;

  get_AllDate():Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/AllDate`);
  }

  get_All_Brokers(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}BrokerageCMP/All_Brokers_On_Date/${Date_Monthly}`);
  }

  Get_Brokerage_Name():Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Get_Brokerage_Name`);
  }

  get_Top_Brokers(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}BrokerageCMP/Top_Brokers/${Date_Monthly}`);
  }

  get_totals(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Totals/${Date_Monthly}`);
  }

  get_totals_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}BrokerageCMP/Totals/${Date_Monthly}/${id}`);
  }

  get_Chart1(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Chart1/${Date_Monthly}`);
  }

  get_Chart1_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}BrokerageCMP/Chart1/${Date_Monthly}/${id}`);
  }

  get_Chart2(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Chart2/${Date_Monthly}`);
  }

  get_Chart2_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}BrokerageCMP/Chart2/${Date_Monthly}/${id}`);
  }

  get_Chart3(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Chart3/${Date_Monthly}`);
  }

  get_Chart3_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}BrokerageCMP/Chart3/${Date_Monthly}/${id}`);
  }

  get_Chart4(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Chart4/${Date_Monthly}`);
  }

  get_Chart4_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}BrokerageCMP/Chart4/${Date_Monthly}/${id}`);
  }

  get_Chart5(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Chart5/${Date_Monthly}`);
  }

  get_Chart5_CMP(Date_Monthly:string,id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}BrokerageCMP/Chart5/${Date_Monthly}/${id}`);
  }

  GetBrokerageMoshtaghe(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Moshtaghe/${Date_Monthly}`);
  }

  GetBrokerageOnline(Date_Monthly:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Brokerage/Online/${Date_Monthly}`);
  }
}
