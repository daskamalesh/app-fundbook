import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  userDeatilInfo: any;
  url: any = environment.urlApiUserAuth + 'FetchLoginMenuRole';

  constructor(private http: HttpClient) {
    // this.userDeatilInfo = localStorage.getItem('userDeatil');
    // this.getMenu(JSON.parse(this.userDeatilInfo).LoginRoleID);
  }
  getMenu(data: any): Observable<any> {
    let mainurl = environment.apiUrl + this.url;
    return this.http.post<any>(mainurl, data);
  }
}
