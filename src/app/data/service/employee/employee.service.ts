import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl + 'api/employee';
  private httpOptions: any = environment.httpOptions;

  changePassword(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl + '/changePassword',
      data,
      this.httpOptions
    );
  }

  getProfileEmployee(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/profile?id=' + id, this.httpOptions);
  }

  login(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data, this.httpOptions);
  }


  getAllEmployees(req: any) {
    return this.http.post(this.apiUrl + '/list', req, this.httpOptions);
  }
  createOrUpdateEmployee(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/register', data, this.httpOptions);

  }

  getEmployeeByid(id): Observable<any> {
    return this.http.get(this.apiUrl + '/getById?id=' + id, this.httpOptions);
  }


  deleteEmployee(id): Observable<any> {
    return this.http.post(this.apiUrl + "/delete?id=" + id, this.httpOptions);
  }

  getListDepartment(): Observable<any> {
    return this.http.get(this.apiUrl + "/getListDepartment", this.httpOptions);
  }

  getLastEmployee(): Observable<any> {
    return this.http.get(this.apiUrl + "/getLastEmployee", this.httpOptions);
  }

  getListAutoEmployee(): Observable<any> {
    return this.http.get(this.apiUrl + "/getListAutoEmployee", this.httpOptions);
  }

  uploadImage(code: any, req: any): Observable<any> {
    return this.http.post(this.apiUrl + '/uploadImg?code=' + code, req);
  }

  deleteImage(code: any): Observable<any> {
    return this.http.get(this.apiUrl + '/deleteImage?code=' + code, this.httpOptions);
  }

  exportExcel(idListOrSearchId:any,exportAllFlag:boolean):Observable<any> {
    return this.http.post(this.apiUrl + '/toExcel?exportAllFlag='+exportAllFlag, idListOrSearchId,{responseType:'arraybuffer' as 'json'});
  }

  updateEmailNotifications(emailRequest:any):Observable<any>{
    return this.http.post(this.apiUrl + '/set-notifications', emailRequest, this.httpOptions);
  }
}
