import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private SiteUrl: string = "http://192.168.38.4/";
  private ApiUrl: string = "https://localhost:7108/";
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
