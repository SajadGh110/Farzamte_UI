import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = "http://localhost:5097/api/Users/"
  constructor(private http : HttpClient, private router : Router) { }

  register(userObj:any){
    return this.http.post<any>(`${this.baseUrl}Register`,userObj);
  }

  login(userObj:any){
    return this.http.post<any>(`${this.baseUrl}Login`,userObj);
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeToken(TokenValue:string){
    localStorage.setItem('token',TokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }
}
