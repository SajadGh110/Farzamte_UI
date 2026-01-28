import {Injectable} from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService{
  tokenExpired(token: string): boolean {
    if (!token) return true;
    
    try {
      const decoded: any = jwtDecode(token);
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decoded.exp);
      
      return expirationDate < new Date();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
  
  getTokenExpiration(token: string): Date | null {
    if (!token) return null;
    
    try {
      const decoded: any = jwtDecode(token);
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decoded.exp);
      
      return expirationDate;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }
  
  getTokenPayload(token: string): any {
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
