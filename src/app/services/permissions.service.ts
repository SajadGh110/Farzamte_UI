import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {AppConfigService} from "./app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private authService: AuthService, private appConfigService: AppConfigService) { }
  private apiUrl = `${this.appConfigService.getApiUrl()}Authorization/`;

  GetAllRoles():Observable<any>{
    return this.authService.get(`${this.apiUrl}GetAllRoles`);
  }

  GetRoleById(id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetRoleById/${id}`);
  }

  GetRoleWithDetails(id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetRoleWithDetails/${id}`);
  }

  CreateRole(id:number, Role:any):Observable<any>{
    return this.authService.post(`${this.apiUrl}CreateRole/${id}`,Role);
  }

  UpdateRole(id:number, Role:any):Observable<any>{
    return this.authService.put(`${this.apiUrl}UpdateRole/${id}`,Role);
  }

  DeleteRole(id:number):Observable<any>{
    return this.authService.delete(`${this.apiUrl}DeleteRole/${id}`);
  }

  GetAllPermissions():Observable<any>{
    return this.authService.get(`${this.apiUrl}GetAllPermissions`);
  }

  GetPermissionCategories():Observable<any>{
    return this.authService.get(`${this.apiUrl}GetPermissionCategories`);
  }

  GetPermissionsByCategory(category:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetPermissionCategories/${category}`);
  }

  AssignRoleToUser(Role:any):Observable<any>{
    return this.authService.post(`${this.apiUrl}AssignRoleToUser`,Role);
  }

  RemoveRoleFromUser(userId:number, id:number):Observable<any>{
    return this.authService.delete(`${this.apiUrl}RemoveRoleFromUser/${userId}/${id}`);
  }

  GetUserRoles(id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetUserRoles/${id}`);
  }

  GetUserWithRoles(id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetUserWithRoles/${id}`);
  }

  CheckUserHasRole(id:number, rolename:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}CheckUserHasRole/${id}/${rolename}`);
  }

  AssignPermissionToRole(Role:any):Observable<any>{
    return this.authService.post(`${this.apiUrl}AssignPermissionToRole`,Role);
  }

  RemovePermissionFromRole(RoleId:number, PermissionId:number):Observable<any>{
    return this.authService.delete(`${this.apiUrl}RemovePermissionFromRole/${RoleId}/${PermissionId}`);
  }

  GetRolePermissions(id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetRolePermissions/${id}`);
  }

  GetUserPermissions(id:number):Observable<any>{
    return this.authService.get(`${this.apiUrl}GetUserPermissions/${id}`);
  }

  CheckUserHasPermission(id:number, name:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}CheckUserHasPermission/${id}/${name}`);
  }

  GetMyRoles():Observable<any>{
    return this.authService.get(`${this.apiUrl}GetMyRoles`);
  }

  GetMyPermissions():Observable<any>{
    return this.authService.get(`${this.apiUrl}GetMyPermissions`);
  }

  CheckMyPermission(name:string):Observable<any>{
    return this.authService.get(`${this.apiUrl}CheckMyPermission/${name}`);
  }
}
