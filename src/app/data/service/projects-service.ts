import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService{
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl + 'api/hr/';
  private httpOptions: any = environment.httpOptions;

  getListProjects(req:any): Observable<any> {
    return this.http.post(this.apiUrl+ 'list-projects',req,this.httpOptions);
  }

  getDetailProjects(id:any): Observable<any> {
    return this.http.get(this.apiUrl + 'projects-detail?id='+id,this.httpOptions);
  }

  editProjects(req:any): Observable<any> {
    return this.http.post(this.apiUrl+ 'edit-projects',req,this.httpOptions);
  }

  deleteProjects(id:any): Observable<any> {
    return this.http.post(this.apiUrl+ 'delete-projects?id='+id,this.httpOptions);
  }
}
