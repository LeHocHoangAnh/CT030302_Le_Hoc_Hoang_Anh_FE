import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApproveService {
  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl + 'api/leader/';
  private httpOptions: any = environment.httpOptions;

  getListBooking(req: any): Observable<any> {
    return this.http.post(this.apiUrl + 'listBooking', req, this.httpOptions);
  }

  getDetailBooking(id: any): Observable<any> {
    return this.http.get(this.apiUrl + "detailBooking?id=" + id, this.httpOptions);
  }

  getUpdateBooking(req: any): Observable<any> {
    return this.http.post(this.apiUrl + 'updateBooking', req, this.httpOptions);
  }

  UpdateBookings(req: any): Observable<any> {
    return this.http.post(this.apiUrl + 'updateBookings', req, this.httpOptions);
  }

  getListDropDownBooking(): Observable<any> {
    return this.http.get(this.apiUrl + "listDropDownBooking", this.httpOptions);
  }

  getDetailBookingStatus(id: number): Observable<any> {
    let url = this.apiUrl + "getDetailBookingStatus?id=" + id;
    return this.http.get(url, this.httpOptions);
  }

  deleteBooking(bookingId: any): Observable<any> {
    let url = this.apiUrl + "deleteBooking?id=" + bookingId;
    return this.http.get(url, this.httpOptions);
  }

  replyConfirmBooking(bookingDayOffId: number) {
    return this.http.get(this.apiUrl + 'reply-confirm-mail?id=' + bookingDayOffId);
  }

  getListAggregateData(aggreSearch: any): Observable<any> {
    return this.http.post(this.apiUrl + 'list-aggregate-data', aggreSearch);
  }

  getMultipleDetailBooking(multipleSelected: number[]): Observable<any> {
    return this.http.get(this.apiUrl + 'detailMultiple/booking?multipleSelected=' + multipleSelected, this.httpOptions)
  }

  exportAggregateData(aggreSearch): Observable<any> {
    return this.http.post(this.apiUrl + 'export-aggregate-data', aggreSearch, { responseType: 'arraybuffer' as 'json' });
  }

  // buildSlackMessage(bookingId: number, registType: string): Observable<any> {
  //   return this.http.post(this.apiUrl+'slack-message?id='+ bookingId, registType);
  // }

  // buildDiscordMessage(bookingId: number, registType: string): Observable<any> {
  //   return this.http.post(this.apiUrl+'discord-message?id='+ bookingId, registType);
  // }

  // slackSendMessage(message: string) {
  //   const axios = require('axios').default;
  //   let url='https://hooks.slack.com/services/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';
  //   var payload = {"text": message};
  //   axios.post(url, JSON.stringify(payload))
  // }
  // discordSendMessage(message: string) {
  //   const axios = require('axios').default;
  //   let url = 'https://discord.com/api/webhooks/1044511496085979197/cRp7AhQD08pDqlHx2V2ZrUDBhQxDfjN3ldrFHt4TQuElGPCK1HhXypSNXYO_edCIirsu';
  //   message = message;

  //   this.http.post(
  //     url,
  //     JSON.stringify({
  //       "type": 1,
  //       "id": "1039489158856593469",
  //       "name": "HRM Notice",
  //       "username": "HRM Notice",
  //       "avatar_url": "https://s3.ap-southeast-1.amazonaws.com/hrm-avatar/image_2022_10_24T02_24_40_711Z.png",
  //       "channel_id": "1037998317336014890",
  //       "guild_id": "1037986393256886272",
  //       "application_id": null,
  //       "content": message,
  //       "token": "FIjscw4Ge4KJJuNNlP8GTWzzgV8QDX_NHePVcPkEepqff747hi-4THCm9fbq3vSaIgN3"
  //     }),
  //     this.httpOptions).subscribe();
  // }
}
