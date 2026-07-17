import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class OutcallService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}OutCall/`;

  get_LastDate_G():Observable<any>{
    return this.authService.get(`${this.apiUrl}LastDate_T1`);
  }

  get_LastDate_F():Observable<any>{
    return this.authService.get(`${this.apiUrl}LastDate_T2`);
  }

  get_TotalCountDay_G(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetTotalCountDay_T1/${StartDate}_${EndDate}`);
  }

  get_TotalCountDay_F(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetTotalCountDay_T2/${StartDate}_${EndDate}`);
  }

  get_SubjectsCount_G(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetSubjectsCount_T1/${StartDate}_${EndDate}`);
  }

  get_SubjectsCount_F(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetSubjectsCount_T2/${StartDate}_${EndDate}`);
  }

  get_ExpertsCount_G(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetExpertsCount_T1/${StartDate}_${EndDate}`);
  }

  get_ExpertsCount_F(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetExpertsCount_T2/${StartDate}_${EndDate}`);
  }

  get_UnitsCount_G(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetUnitsCount_T1/${StartDate}_${EndDate}`);
  }

  get_UnitsCount_F(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetUnitsCount_T2/${StartDate}_${EndDate}`);
  }

  get_Description_G(StartDate:string, EndDate:string, Subject:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescription_T1/${StartDate}_${EndDate}?subject=${Subject}`);
  }

  get_Description_F(StartDate:string, EndDate:string, Subject:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescription_T2/${StartDate}_${EndDate}?subject=${Subject}`);
  }

  get_DescriptionByExpert_G(StartDate:string, EndDate:string, expertName:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescriptionByExpert_T1/${StartDate}_${EndDate}?expertName=${expertName}`);
  }

  get_DescriptionByExpert_F(StartDate:string, EndDate:string, expertName:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescriptionByExpert_T2/${StartDate}_${EndDate}?expertName=${expertName}`);
  }

  get_DescriptionByUnit_G(StartDate:string, EndDate:string, unit:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescriptionByUnit_T1/${StartDate}_${EndDate}?unit=${unit}`);
  }

  get_DescriptionByUnit_F(StartDate:string, EndDate:string, unit:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetDescriptionByUnit_T2/${StartDate}_${EndDate}?unit=${unit}`);
  }

  get_TitlesAnalysis(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetTitlesAnalysis/${StartDate}_${EndDate}`);
  }

  get_StatusCount_G(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetStatusCount_T1/${StartDate}_${EndDate}`);
  }

  get_StatusCount_F(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetStatusCount_T2/${StartDate}_${EndDate}`);
  }
}
