import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TimeKeepingService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl + 'api/employee/timekeeping';
  private httpOptions: any = environment.httpOptions;

  getTimeKeepingEmployee(date): Observable<any> {
    return this.http.post(this.apiUrl + '/getInformation',date,this.httpOptions);
  }

}
