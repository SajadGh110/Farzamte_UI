import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private SiteUrl: string = "https://farzamte.com/";
  private ApiUrl: string = "https://api.farzamte.com/";
  private Token:string = "bearer " + localStorage.getItem('token');
  private ApiKey:string = "DWV1PdzszOW3BLen";

  constructor() { }

  getApiUrl():string {
    return this.ApiUrl;
  }

  getSiteUrl():string {
    return this.SiteUrl;
  }

  getToken():string {
    return this.Token;
  }

  getApiKey():string {
    return this.ApiKey;
  }
}
