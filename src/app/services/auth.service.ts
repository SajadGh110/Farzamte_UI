import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {JwtHelperService} from "./jwt-helper.service";
import {AppConfigService} from "./app-config.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService, private appConfigService: AppConfigService) { }
  
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    
    if (this.appConfigService.getApiKey()) {
      headers = headers.append("api-key", this.appConfigService.getApiKey());
    }
    
    const token = this.getToken();
    if (token) {
      headers = headers.append("Authorization", `Bearer ${token}`);
    }
    
    return headers;
  }

  get(url: string) {
    return this.http.get(url, { headers: this.getHeaders() });
  }

  post(url: string, data: any) {
    return this.http.post(url, data, { headers: this.getHeaders() });
  }
  
  put(url: string, data: any) {
    return this.http.put(url, data, { headers: this.getHeaders() });
  }
  
  delete(url: string) {
    return this.http.delete(url, { headers: this.getHeaders() });
  }

  login(userObj: any) {
    const url = `${this.appConfigService.getApiUrl()}Users/Login`;
    return this.http.post<any>(url, userObj, { 
      headers: new HttpHeaders().append("api-key", this.appConfigService.getApiKey()) 
    });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem(this.tokenKey, tokenValue);
    this.decodeAndStoreUserInfo(tokenValue);
  }

  private decodeAndStoreUserInfo(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      
      const userInfo = {
        id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        userName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        firstName: decodedToken['FirstName'] || '',
        lastName: decodedToken['LastName'] || ''
      };
      
      localStorage.setItem(this.userKey, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getTokenDecoded(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserId(): number | null {
    const token = this.getTokenDecoded();
    if (!token) return null;
    return parseInt(token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']) || null;
  }

  getUserName(): string | null {
    const token = this.getTokenDecoded();
    if (!token) return null;
    return token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
  }

  getUserFirstName(): string {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.firstName || '';
    }
    return '';
  }

  getUserLastName(): string {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.lastName || '';
    }
    return '';
  }

  getFullName(): string {
    const firstName = this.getUserFirstName();
    const lastName = this.getUserLastName();
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else {
      return this.getUserName() || '';
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.jwtHelper.tokenExpired(token);
  }

  addAuthHeader(headers: HttpHeaders): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
