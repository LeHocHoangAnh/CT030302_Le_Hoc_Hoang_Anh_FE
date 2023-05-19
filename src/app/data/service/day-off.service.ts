import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DayOffService {
  private apiUrl: string = environment.apiUrl + 'api/hr/';
  private httpOptions: any = environment.httpOptions;
  constructor(private http: HttpClient) {}
  // get range of year
  getYearRange(): Observable<any> {
    let url = this.apiUrl + 'dayoff/get-year-range';
    return this.http.get(url);
  }
  // get day-off list in year
  getDayOffInYear(selectedYear: string): Observable<any> {
    let url = this.apiUrl + 'dayoff/list/';
    if (selectedYear === null || selectedYear.length < 0) {
      url += 'all';
    } else {
      url += selectedYear;
    }
    return this.http.get(url);
  }
  // create/update configured day-off
  saveDayOffConfig(req: any):Observable<any> {
    let url = this.apiUrl + 'dayoff/register';
    return this.http.post(url, req, this.httpOptions);
  }
  // delete day-off by id
  delete(id: any):Observable<any> {
    let url = this.apiUrl + 'dayoff/delete?id='+id;
    return this.http.delete(url);
  }
}
