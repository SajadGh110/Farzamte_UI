import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class QaService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}QA/`;

  GetAccessibleUnits():Observable<any>{
    return this.authService.get(`${this.apiUrl}GetAccessibleUnits`);
  }

  GetAvailableMonths(unit:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetAvailableMonths/${unit}`);
  }

  GetPortTypes(unit: string, Date_Monthly: string): Observable<any> {
    return this.authService.get(`${this.apiUrl}GetPortTypes/${unit}/${Date_Monthly}`);
  }

  GetAgentScoresSimple(Date_Monthly: string, unit: string, portType: string): Observable<any> {
    return this.authService.get(`${this.apiUrl}GetAgentScoresSimple/${Date_Monthly}/${unit}/${portType}`);
  }

  GetAgentScoresDetailed(Date_Monthly: string, unit: string, portType: string): Observable<any> {
    return this.authService.get(`${this.apiUrl}GetAgentScoresDetailed/${Date_Monthly}/${unit}/${portType}`);
  }

  GetCriticalCallDetails(Date_Monthly: string, unit: string, agent: string): Observable<any> {
    return this.authService.get(`${this.apiUrl}GetCriticalCallDetails/${Date_Monthly}/${unit}/${agent}`);
  }
}
