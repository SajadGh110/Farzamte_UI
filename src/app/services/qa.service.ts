import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QaService {

  constructor(private http : HttpClient, private appConfigService: AppConfigService) { }
  header = new HttpHeaders().append("api-key",this.appConfigService.getApiKey()).append("Authorization",this.appConfigService.getToken());

  GetAccessibleUnits():Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetAccessibleUnits`,{headers:this.header});
  }

  GetAvailableMonths(unit:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetAvailableMonths?unit=${unit}`,{headers:this.header});
  }

  GetPortTypes(unit:string, StartDate:string, EndDate:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetPortTypes?unit=${unit}&startDate=${StartDate}&endDate=${EndDate}`,{headers:this.header});
  }

  GetAgentScoresSimple(StartDate:string, EndDate:string, unit:string, portType:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetAgentScoresSimple?startDate=${StartDate}&endDate=${EndDate}&unit=${unit}&portType=${portType}`,{headers:this.header});
  }

  GetAgentScoresDetailed(StartDate:string, EndDate:string, unit:string, portType:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetAgentScoresDetailed?startDate=${StartDate}&endDate=${EndDate}&unit=${unit}&portType=${portType}`,{headers:this.header});
  }

  GetAgentDetail(StartDate:string, EndDate:string, unit:string, agent:string):Observable<any>{
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetAgentDetail?startDate=${StartDate}&endDate=${EndDate}&unit=${unit}&agent=${agent}`,{headers:this.header});
  }
}
