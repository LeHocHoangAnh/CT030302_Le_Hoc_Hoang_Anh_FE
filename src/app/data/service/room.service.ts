import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl + 'api/employee';
  private httpOptions: any = environment.httpOptions;

  getListRoom(): Observable<any> {
    return this.http.get(this.apiUrl + '/list-room', this.httpOptions);
  }

  updateOrCreateRoom(req:any): Observable<any> {
    return this.http.post(this.apiUrl + '/updateOrCreateRoom',req, this.httpOptions);
  }

  deleteRoom(id:any): Observable<any> {
    return this.http.post(this.apiUrl + '/delete-room?id='+id, this.httpOptions);
  }
}
