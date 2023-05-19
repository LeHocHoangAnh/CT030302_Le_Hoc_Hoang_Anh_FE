import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingDayOffService {
  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl + 'api/bookingDayOff';
  private httpOptions: any = environment.httpOptions;

  getInformationBooking(data: any): Observable<any> {
    return this.http.get(
      this.apiUrl + '/getInformation?id=' + data,
      this.httpOptions
    );
  }

  getAllBooking(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl + '/getAllBooking',
      data,
      this.httpOptions
    );
  }

  createOrUpdateBooking(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl + '/createOrUpdate',
      data,
      this.httpOptions
    );
  }

  deleteBooking(data: any): Observable<any> {
    return this.http.delete(
      this.apiUrl + '/delete?id=' + data,
      this.httpOptions
    );
  }

  getListConfigDayOff(selectedDate: any): Observable<any> {
    return this.http.post(this.apiUrl + '/getListConfigDayOff', selectedDate, this.httpOptions);
  }

  getStandardTime(): Observable<any> {
    return this.http.get(this.apiUrl + '/getStandardTime', this.httpOptions)
  }

  getApproversAndRelatedEmployees(): Observable<any> {
    return this.http.get(this.apiUrl + '/getEmployeeDropdown', this.httpOptions)
  }

  getRemainLeaves(date: any): Observable<any> {
    return this.http.get(this.apiUrl + '/remainLeaves?date=' + date, this.httpOptions)
  }

  uploadEvidenceImg(id: number, file: any): Observable<any> {
    return this.http.post(this.apiUrl + '/uploadEvidenceImg?id=' + id, file);
  }
  getProjectDropdown(): Observable<any> {
    return this.http.get(this.apiUrl + '/projectDropdown');
  }
  sendMailBooking(bookingDayOffId: any): any {
    return this.http.get(this.apiUrl + '/send-mail-booking?id=' + bookingDayOffId);
  }
  // buildSlackMessage(bookingId: number, registType: string): Observable<any> {
  //   return this.http.post(this.apiUrl + '/slack-message?id=' + bookingId, registType);
  // }
  // buildDiscordMessage(bookingId: number, registType: string): Observable<any> {
  //   return this.http.post(this.apiUrl + '/discord-message?id=' + bookingId, registType);
  // }
  // slackSendMessage(message: string, registType: any) {
  //   const axios = require('axios').default;
  //   // ITS GLOBAL Workspace, #notice channel
  //   let url='https://hooks.slack.com/services/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';
  //   // TTJava Workspace, #general channel
  //   // let url = 'https://hooks.slack.com/services/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';
  //   if (registType === 'OT') {
  //     url = 'https://hooks.slack.com/services/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';
  //   }

  //   var payload = { "text": message };
  //   axios.post(url, JSON.stringify(payload))
  // }

  // discordSendMessage(message: string, registType: any) {
  //   let url = 'https://discord.com/api/webhooks/1039489158856593469/FIjscw4Ge4KJJuNNlP8GTWzzgV8QDX_NHePVcPkEepqff747hi-4THCm9fbq3vSaIgN3';
  //   message = message;

  //   this.http.post(
  //     url,
  //     JSON.stringify({
  //       "type": 1,
  //       "id": "1039489158856593469",
  //       "name": "HRM Notice",
  //       "username": "HRM Notice",
  //       "avatar_url": "https://s3.ap-southeast-1.amazonaws.com/hrm-avatar/image_2022_10_24T02_24_40_711Z.png",
  //       "channel_id": "1037996383086583868",
  //       "guild_id": "1037986393256886272",
  //       "application_id": null,
  //       "content": message,
  //       "token": "FIjscw4Ge4KJJuNNlP8GTWzzgV8QDX_NHePVcPkEepqff747hi-4THCm9fbq3vSaIgN3"
  //     }),
  //     this.httpOptions).subscribe();
  // }
}
