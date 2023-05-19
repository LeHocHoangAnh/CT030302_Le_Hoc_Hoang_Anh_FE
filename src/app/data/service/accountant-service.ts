import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountantService{
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl + 'api/hr/';
  private httpOptions: any = environment.httpOptions;

  private httpFile = {headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),}
  importFileExel(req:any,time:any): Observable<any> {
    return this.http.post(this.apiUrl + 'import/timekeep?time='+time,req);
  }

  getListTimeDrop(): Observable<any> {
    return this.http.get(environment.apiUrl + 'api/employee/list/timesDropDown',this.httpOptions);
  }

  getListDetailTimeKeeping(req:any): Observable<any> {
    return this.http.post(this.apiUrl+ 'list/dataDetailTimeKeeping',req,this.httpOptions);
  }

  exportFileExel(year:any): Observable<any> {
    return this.http.get(this.apiUrl + 'list/export/excel?year='+year,{responseType:'arraybuffer' as 'json'});
  }

  editEmployeeKeeping(editRequest: any, month: any): Observable<any>  {
    let url = this.apiUrl+'list/editEmployeeKeeping?time='+month;
    return this.http.put(url, editRequest, this.httpOptions);
  }
}
