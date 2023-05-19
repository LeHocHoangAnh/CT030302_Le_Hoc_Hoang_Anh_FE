import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/data/service/employee/employee.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ConstantsCommon } from '../../constants.common';

@Component({
  selector: 'app-ng-drop-down',
  templateUrl: './ng-drop-down.component.html',
  styleUrls: ['./ng-drop-down.component.scss'],
})
export class NgDropDownComponent implements OnInit {
  public image: any;

  public id :any = null;

  public dataHistory: any[];
  public dataProvider: any = [];

  constructor(private tokenStorageService: TokenStorageService, 
     private employeeService: EmployeeService,
     private router: ActivatedRoute,) {}

  ngOnInit(): void {
    const paramRoute = this.router.snapshot.paramMap.get('id');
    this.id = paramRoute ? paramRoute : 0;
    this.getProfileEmployee()
  }
  logout() {
    this.tokenStorageService.signOut(this.tokenStorageService.getToken());
  }
  getProfileEmployee() {
    this.employeeService.getProfileEmployee(this.id).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          this.dataProvider = res.items.employee;
          this.image = this.dataProvider.pictureProfile;
          this.dataHistory = res.items.history;
        } else {
          this.dataProvider = [];
          this.dataHistory = [];
        }
      },
      (err) => {
        this.dataProvider = [];
        this.dataHistory = [];
      }
    );
  }

}
