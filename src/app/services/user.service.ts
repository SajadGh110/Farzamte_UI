import { Injectable } from '@angular/core';
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";
import { AuthService } from './auth.service';

export interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface RegisterUser {
  userName: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  password?: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}Users/`;

  login(credentials: { userName: string, password: string }): Observable<any> {
    return this.authService.login(credentials);
  }

  getProfile(): Observable<any> {
    return this.authService.get(`${this.apiUrl}GetProfile`);
  }

  updateProfile(updateData: UpdateUser): Observable<any> {
    return this.authService.put(`${this.apiUrl}UpdateProfile`, updateData);
  }

  changePassword(passwordData: ChangePassword): Observable<any> {
    return this.authService.put(`${this.apiUrl}ChangePassword`, passwordData);
  }

  getAllUsers(): Observable<any> {
    return this.authService.get(`${this.apiUrl}GetAllUsers`);
  }

  getUserById(id: number): Observable<any> {
    return this.authService.get(`${this.apiUrl}GetUserById/${id}`);
  }

  createUser(userData: any): Observable<any> {
    return this.authService.post(`${this.apiUrl}CreateUser`, userData);
  }

  updateUser(id: number, updateData: any): Observable<any> {
    return this.authService.put(`${this.apiUrl}UpdateUser/${id}`, updateData);
  }

  deleteUser(id: number): Observable<any> {
    return this.authService.delete(`${this.apiUrl}DeleteUser/${id}`);
  }

  toggleUserStatus(id: number, isActive: boolean): Observable<any> {
    return this.authService.put(`${this.apiUrl}ToggleUserStatus/${id}`, isActive);
  }

  checkUserNameExists(userName: string): Observable<any> {
    return this.authService.get(`${this.apiUrl}CheckUserNameExists/${userName}`);
  }

  checkEmailExists(email: string): Observable<any> {
    return this.authService.get(`${this.apiUrl}CheckEmailExists/${email}`);
  }
}
