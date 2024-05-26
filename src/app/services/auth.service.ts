import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {JwtHelperService} from "./jwt-helper.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = "https://localhost:7108/api/Users/"

  constructor(private http : HttpClient, private router : Router, private jwt : JwtHelperService) { }

  register(userObj:any){
    return this.http.post<any>(`${this.baseUrl}Register`,userObj);
  }

  login(userObj:any){
    let header = new HttpHeaders();
    header = header.append("api-key","DWV1PdzszOW3BLen");
    return this.http.post<any>(`${this.baseUrl}Login`,userObj,{headers:header});
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeToken(TokenValue:string){
    localStorage.setItem('token',TokenValue);
  }

  getToken():string{
    return jwtDecode(localStorage.getItem('token')+"");
  }

  getUserID():number{
    var tokken_string = JSON.stringify(this.getToken());
    return parseInt(tokken_string.split(',')[2].split('"')[3]);
  }

  getUserName():string{
    var tokken_string = JSON.stringify(this.getToken());
    return tokken_string.split(',')[1].split('"')[3];
  }

  getUserRole():string{
    var tokken_string = JSON.stringify(this.getToken());
    return tokken_string.split(',')[0].split('"')[3];
  }

  isLoggedIn():boolean{
    if (localStorage.getItem('token')){
      let token: string = localStorage.getItem('token') + "";
      return !this.jwt.tokenExpired(token);
    }
    else
      return false;
  }
}
