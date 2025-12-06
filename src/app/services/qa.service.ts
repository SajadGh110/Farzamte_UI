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

  GetPortTypes(unit: string, Date_Monthly: string): Observable<any> {
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetPortTypes?unit=${unit}&Date_Monthly=${Date_Monthly}`, { headers: this.header });
  }

  GetAgentScoresSimple(Date_Monthly: string, unit: string, portType: string): Observable<any> {
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetAgentScoresSimple?Date_Monthly=${Date_Monthly}&unit=${unit}&portType=${portType}`, { headers: this.header });
  }

  GetAgentScoresDetailed(Date_Monthly: string, unit: string, portType: string): Observable<any> {
    return this.http.get(`${this.appConfigService.getApiUrl()}QA/GetAgentScoresDetailed?Date_Monthly=${Date_Monthly}&unit=${unit}&portType=${portType}`, { headers: this.header });
  }
}
