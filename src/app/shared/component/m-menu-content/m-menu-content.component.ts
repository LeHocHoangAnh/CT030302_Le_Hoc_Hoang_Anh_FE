import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { EmployeeService } from 'src/app/data/service/employee/employee.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ConstantsCommon, eRole } from "../../constants.common";

@Component({
  selector: 'app-m-menu-content',
  templateUrl: './m-menu-content.component.html',
  styleUrls: ['./m-menu-content.component.scss']
})
export class MMenuContentComponent implements OnInit {
  public display: boolean = false;
  // role
  public isHr: boolean = false;
  public isLeader: boolean = false;
  public isSubLeader: boolean = false;
  public isComtor: boolean = false;
  public isCustomer: boolean = false;
  //
  public id: any = null;
  public dataProvider: any = [];
  public image: any;
  public confirmDisplay: boolean = false;
  public pendingNavUrl: string | undefined;

  constructor(
    private token: TokenStorageService,
    private employeeService: EmployeeService,
    private router: ActivatedRoute,
    private routerV: Router,
    private tokenStorageService: TokenStorageService,
    private confirmationService: ConfirmationService) {
    const paramRoute = this.router.snapshot.paramMap.get('id');
    this.id = paramRoute ? paramRoute : 0;
  }

  ngOnInit(): void {
    this.initCheck();
    this.getProfileEmployee();
  }

  initCheck() {
    let rules = this.token.getUser()?.roles;
    let isLoggedIn = !!this.token.getToken();
    if (isLoggedIn) {
      this.isHr = rules.indexOf(eRole.HR) >= 0 ? true : false;
      this.isLeader = rules.indexOf(eRole.LEADER) >= 0 ? true : false;
      this.isSubLeader = rules.indexOf(eRole.SUB_LEADER) >= 0 ? true : false;
      this.isComtor = rules.indexOf(eRole.COMTOR) >= 0 ? true : false;
      this.isCustomer = rules.indexOf(eRole.CUSTOMER) >= 0 ? true : false;
    }
  }

  getProfileEmployee() {
    this.employeeService.getProfileEmployee(this.id).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          this.dataProvider = res.items.employee;
          this.image = this.dataProvider.pictureProfile;
        } else {
          this.dataProvider = [];
        }
      },
      (err) => {
        this.dataProvider = [];
      }
    );
  }

  notResponsivePageRoutingConfirm(routerLink: string) {
    this.confirmDisplay = true;
    this.pendingNavUrl = routerLink;
  }
  confirm() {
    this.routerV.navigate([this.pendingNavUrl]);
    this.confirmDisplay = false;
  }
  reject() {
    this.confirmDisplay = false;
    this.pendingNavUrl = undefined;
  }
  logout() {
    this.tokenStorageService.signOut(this.tokenStorageService.getToken());
  }
}
