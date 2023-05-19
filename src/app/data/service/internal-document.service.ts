import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditDocumentRequest } from '../model/request/EditDocumentRequest';
@Injectable({
  providedIn: 'root'
})
export class InternalDocumentService {
  
  public apiUrl: string = environment.apiUrl + 'api/hr/document/';
  private httpOptions: any = environment.httpOptions;

  constructor(private http: HttpClient) { }

  saveEdit(editRequest: EditDocumentRequest): Observable<any> {
    return this.http.post(this.apiUrl+'edit', editRequest, this.httpOptions)
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.apiUrl+'delete?id='+id, this.httpOptions);
  }

  getList(): Observable<any> {
    return this.http.get(environment.apiUrl+'api/employee/'+'document-list', this.httpOptions)
  }

  getDetail(documentId: number): Observable<any> {
    return this.http.get(environment.apiUrl+'api/employee/'+'document-detail?id='+documentId, this.httpOptions)
  }
}
