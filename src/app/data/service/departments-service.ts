import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  
  constructor(private http: HttpClient) {}
  private apiUrl: string = environment.apiUrl + 'api/hr/';
  private httpOptions: any = environment.httpOptions;
  // fetch department data
  getDepartmentsList(req: any, actionDropDown:any): Observable<any> {
    let action='';
    if(actionDropDown!==null){
      action=actionDropDown.action;
    }
    return this.http.post(
      this.apiUrl + 'list-departments?action='+action,
      req,
      this.httpOptions
    );
  }
  // create new department
  createDepartment(
    departmantName: string,
    departmentAction: number,
  ): Observable<any> {
    let url =
      this.apiUrl +
      'create-department?name=' +
      departmantName +
      '&action=' +
      departmentAction;
    return this.http.post(url, this.httpOptions);
  }
  // get employee list depend on current department
  getEmployeeByDepartmentID(id: number, page: number,pageSize:number): Observable<any> {
    let url = this.apiUrl + 'employee-by-departmentID?id=' + id +'&page='+page+'&size='+pageSize;
    return this.http.get(url);
  }
  // get department by id
  getDepartmentByID(id: number): Observable<any> {
    let url = this.apiUrl + 'find-department?id=' + id;
    return this.http.get(url);
  }
  // update department by id
  updateDepartment(department: any): Observable<any>   {
    let url = this.apiUrl + 'update-department';
    return this.http.put(url, department);
  }
  // delete department by id
  deleteDepartment(id:number):Observable<any> {
    let url=this.apiUrl + 'delete-department?id='+id
    return this.http.delete(url);
  }
  // update department member
  updateDepartmentMember(id:number, member: number):Observable<any> {
    let url=this.apiUrl + "update-member?id="+id+"&member="+member;
    return this.http.put(url,this.httpOptions);
  }
}

