import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentRegisterService {
  public apiUrl = environment.apiUrl + 'api/employee/equipment/'
  private httpOptions: any = environment.httpOptions;

  constructor(private http: HttpClient) { }

  getHistoryList(id: number): Observable<any> {
    return this.http.post(this.apiUrl + 'history-list', id, this.httpOptions);
  }
  getUserEquipmentList(): Observable<any> {
    return this.http.get(this.apiUrl + 'equipment-list', this.httpOptions);
  }
  getUserRegistrationList() {
    return this.http.get(this.apiUrl + 'registration-list', this.httpOptions);
  }
  getApproversEmployees(): Observable<any> {
    return this.http.get(this.apiUrl + 'approvers-list', this.httpOptions);
  }
  edit(request: any): Observable<any> {
    return this.http.post(this.apiUrl + 'registration-edit', request, this.httpOptions);
  }
  delete(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'registration-delete?id=' + id, this.httpOptions);
  }
  getDetailRegistration(id: number): Observable<any> {
    return this.http.get(this.apiUrl + 'registration-detail?id=' + id, this.httpOptions);
  }
  getEmployeeRegistrationList(request: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'api/hr/equipment/registration-list', request, this.httpOptions)
  }
  getListDepartment(): Observable<any> {
    return this.http.get(environment.apiUrl + 'api/hr/equipment/department-list', this.httpOptions)
  }

  editHistoryList(request: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'api/hr/equipment/history-edit', request, this.httpOptions)
  }
}
