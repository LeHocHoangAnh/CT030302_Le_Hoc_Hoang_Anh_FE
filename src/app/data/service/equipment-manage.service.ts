import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl: string = environment.apiUrl + 'api/hr/equipment/';
  private httpOptions: any = environment.httpOptions;

  constructor(private http: HttpClient) { }

  getListEquipment(searchValue: any): Observable<any> {
    return this.http.post(this.apiUrl+'list', searchValue, this.httpOptions);
  }

  getDetailEquipment(id: number): Observable<any> {
    return this.http.get(this.apiUrl+'detail?id='+id, this.httpOptions);
  }

  edit(value: any): Observable<any> {
    return this.http.post(this.apiUrl+'edit', value, this.httpOptions);
  }
  
  switchOwnership(id: number, value: any): Observable<any> {
    return this.http.post(this.apiUrl+'switch?id='+id, value, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.apiUrl+'delete?id='+id, this.httpOptions);
  }

  getListEmployeeDropdown(): Observable<any> {
    return this.http.get(this.apiUrl+'employee-list', this.httpOptions);
  }
}
