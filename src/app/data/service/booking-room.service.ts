import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingRoomService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl + 'api/employee/booking-room';
  private httpOptions: any = environment.httpOptions;

  getListBookingRoomByDate(req:any): Observable<any> {
    return this.http.post(this.apiUrl + '/list-booking-room-by-date',req, this.httpOptions);
  }

  getBookingRoomById(id:any): Observable<any> {
    return this.http.get(this.apiUrl + '/booking-room-by-id?id='+id, this.httpOptions);
  }

  createOrUpdateBookingRoom(data:any, type: any): Observable<any> {
    return this.http.post(this.apiUrl + '/update-create-booking-room?type='+type,data, this.httpOptions);
  }

  deleteBookingRoomById(id:any, deleteType:any): Observable<any> {
    return this.http.post(this.apiUrl + '/delete-booking-room?id='+id+'&type='+deleteType, this.httpOptions);
  }

  searchListBookingRoom(req:any): Observable<any> {
    return this.http.post(this.apiUrl+ '/search-list-booking-room',req,this.httpOptions);
  }
  
  confirmBookingMeetingRoom(req:any): Observable<any> {
    return this.http.post(this.apiUrl+ '/confirm-booking-meeting-room',req,this.httpOptions);
  }
  
  sendMailBookingRoom(bookingRoom: any) {
    return this.http.post(this.apiUrl + '/send-mail-booking-room', bookingRoom);
  }

  sendMailConfirmRoom(bookingRoomId: number) {
    return this.http.get(this.apiUrl + '/send-mail-confirm-room?id='+bookingRoomId);
  }
}
