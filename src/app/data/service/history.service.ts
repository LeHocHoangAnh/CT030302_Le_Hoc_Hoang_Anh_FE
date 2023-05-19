import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoryService{
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl + 'api/hr/';
  private httpOptions: any = environment.httpOptions;

  getListHistory(id:any,req:any): Observable<any> {
    return this.http.post(this.apiUrl+ 'list-history?id='+id,req,this.httpOptions);
  }

  getDetailHistory(id:any): Observable<any> {
    return this.http.get(this.apiUrl + 'history-detail?id='+id,this.httpOptions);
  }

  editHistory(req:any): Observable<any> {
    return this.http.post(this.apiUrl+ 'edit-history',req,this.httpOptions);
  }

  deleteHistory(id:any): Observable<any> {
    return this.http.post(this.apiUrl+ 'delete-history?id='+id,this.httpOptions);
  }

  checkEmployee(key:any): Observable<any> {
    return this.http.get(this.apiUrl + 'check-employee?key='+key,this.httpOptions);
  }
}
