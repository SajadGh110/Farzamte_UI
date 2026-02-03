import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class TransportToSmartService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}TransportToSmart/`;

  get_Date():Observable<any>{
    return this.authService.get(`${this.apiUrl}Date`);
  }

  get_Total_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Total_Count_Day/${StartDate}_${EndDate}`);
  }

  get_ContinueSmart_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ContinueSmart_Count_Day/${StartDate}_${EndDate}`);
  }

  get_ReturnTadbir_Count_Day(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ReturnTadbir_Count_Day/${StartDate}_${EndDate}`);
  }

  get_Total_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Total_Count/${StartDate}_${EndDate}`);
  }

  get_ContinueSmart_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ContinueSmart_Count/${StartDate}_${EndDate}`);
  }

  get_ReturnTadbir_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ReturnTadbir_Count/${StartDate}_${EndDate}`);
  }

  get_Successful_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Successful_Count/${StartDate}_${EndDate}`);
  }

  get_Unsuccessful_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Unsuccessful_Count/${StartDate}_${EndDate}`);
  }

  get_Total_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Total_List/${StartDate}_${EndDate}`);
  }

  get_ContinueSmart_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ContinueSmart_List/${StartDate}_${EndDate}`);
  }

  get_ReturnTadbir_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}ReturnTadbir_List/${StartDate}_${EndDate}`);
  }

  get_Successful_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Successful_List/${StartDate}_${EndDate}`);
  }

  get_Unsuccessful_List(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Unsuccessful_List/${StartDate}_${EndDate}`);
  }

  get_Reasons_ContinueSmart_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Reasons_ContinueSmart_Count/${StartDate}_${EndDate}`);
  }

  get_Reasons_ReturnTadbir_Count(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Reasons_ReturnTadbir_Count/${StartDate}_${EndDate}`);
  }

  get_Average_CustomerSatisfaction(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Average_CustomerSatisfaction/${StartDate}_${EndDate}`);
  }

  get_Average_CustomerSatisfaction_Smart(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Average_CustomerSatisfaction_Smart/${StartDate}_${EndDate}`);
  }

  get_Average_CustomerSatisfaction_Tadbir(StartDate:string, EndDate:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}Average_CustomerSatisfaction_Tadbir/${StartDate}_${EndDate}`);
  }

  get_detail_table(id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}detail_table/${id}`);
  }
}
