import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl + 'api/employee';
  private httpOptions: any = environment.httpOptions;

  getListRole(): Observable<any> {
    return this.http.get(this.apiUrl + '/listRole', this.httpOptions);
  }

  createOrUpdateRole(req:any): Observable<any> {
    return this.http.post(this.apiUrl + '/createOrUpdate',req, this.httpOptions);
  }

  deleteRole(id:any): Observable<any> {
    return this.http.post(this.apiUrl + '/delete?id='+id, this.httpOptions);
  }

  getDetailRoleGroup(id:any): Observable<any> {
    return this.http.get(this.apiUrl + '/detail-roleGroup?id='+id, this.httpOptions);
  }
}
