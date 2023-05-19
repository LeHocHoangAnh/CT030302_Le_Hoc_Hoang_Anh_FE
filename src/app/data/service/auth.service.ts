import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl + 'api/auth';
  private httpOptions: any = environment.httpOptions;

  login(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data, this.httpOptions);
  }

  logout(strToken: any): Observable<any> {
    let token = {};
    token['token'] = strToken;
    return this.http.post(this.apiUrl + '/logout', token, this.httpOptions);
  }

  sendMailForgot(email: any): Observable<any>{
    return this.http.post(this.apiUrl + '/sendMail?email='+email, this.httpOptions);
  }
  
  checkToken(token: any): Observable<any>{
    return this.http.post(this.apiUrl + '/check/tokens?token='+token, this.httpOptions)
  }
  
  changePassword(passWord: any):  Observable<any>{
    return this.http.post(this.apiUrl + '/change/pass',passWord, this.httpOptions)
  }
  
}
