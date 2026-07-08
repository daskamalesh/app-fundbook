import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpCallService {

  constructor(private http: HttpClient) { }

  httpPost(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let mainurl = environment.apiUrl + url;
    return this.http.post<any>(mainurl, data, { headers });
  }
  httpGet(url: any): Observable<any> {
    let mainurl = environment.apiUrl + url;
    return this.http.get<any>(mainurl);
  }
  ///
  getIpClient(): Observable<any> {
    return this.http.get(environment.UrlGetIp);
  }
  ///
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
  downloadBackup(url: any): Observable<any> {
    let mainurl = environment.apiUrl + url;
    return this.http.get<any>(mainurl);
  }
  downloadFileWithFormat(url: string, fileType: string): Observable<any> {
    let mainurl = environment.apiUrl + url;
    return this.http.get(`${mainurl}?fileType=${fileType}`);
  }

  convertDateFormat(dateString: string): string {
    return dateString.replace(/-/g, '/');
  }
  convertToDDMMYYYYWithSlash(dateString: any): string {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } else {
      return '';
    }
  }
  convertToDDMMYYYY(dateString: any): string {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else {
      return '';
    }
  }
  convertDateFormatForDatePicker(dateString: string): string {
    if (!dateString) return '';
  
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
  
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
  
    return dateString;
  }
  convertToDate(dateString: string): Date {
    if (!dateString) return new Date(0); 
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); 
  }
  

}
