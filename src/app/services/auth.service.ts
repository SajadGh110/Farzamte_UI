import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = "http://localhost:44397/api/Users/"
  constructor(private http : HttpClient) { }

  register(userObj:any){
    return this.http.post<any>(`${this.baseUrl}Register`,userObj);
  }

  login(userObj:any){
    return this.http.post<any>(`${this.baseUrl}Login`,userObj);
  }
}
