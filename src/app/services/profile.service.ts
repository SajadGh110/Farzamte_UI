import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private token: string = "bearer " + localStorage.getItem('token');

  private baseUrl:string = "https://localhost:7108/api/Users/";

  constructor(private http : HttpClient, private router : Router) { }

  getinfo(id:number):Observable<any>{
    let header = new HttpHeaders();
    header = header.append("api-key","DWV1PdzszOW3BLen").append("Authorization",this.token);
    return this.http.get(`${this.baseUrl}GetUser?id=${id}`,{headers:header});
  }

  useredit(user:any):Observable<any>{
    let header = new HttpHeaders();
    header = header.append("api-key","DWV1PdzszOW3BLen").append("Authorization",this.token);
    return this.http.put(`${this.baseUrl}EditUser`,user,{headers:header});
  }
}
