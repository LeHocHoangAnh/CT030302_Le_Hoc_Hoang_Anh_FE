import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmployeeService } from "src/app/data/service/employee/employee.service";
import { TokenStorageService } from "src/app/data/service/token-storage.service";
import { ConstantsCommon, eRole } from "../../constants.common";

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  public profileName:string;

  public showSidebar: boolean = true;

  public isHr: boolean = false;
  public isLeader: boolean = false;
  public isSubLeader: boolean = false;
  public isComtor: boolean = false;
  public isCustomer: boolean = false;
  public id :any=null;
  public image:any;
  public dataHistory: any[];
  public dataProvider: any = [];
  constructor(
    private token: TokenStorageService,
    private employeeService: EmployeeService,
    private router: ActivatedRoute,
    ){}

  ngOnInit(): void {
    const paramRoute = this.router.snapshot.paramMap.get('id');
    this.id = paramRoute ? paramRoute : 0;
    this.profileName = this.token.getUser().profileName
    this.initCheck();
    this.getImgProfileEmployee();
  }

  changeSidebar(){
    this.showSidebar == true ? this.showSidebar = false : this.showSidebar = true
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
   getImgProfileEmployee(){
    this.employeeService.getProfileEmployee(this.id).subscribe((res)=>{
      if(res.status===ConstantsCommon.HTTP_STATUS_200){
        this.dataProvider =res.items.employee
        this.image=this.dataProvider.pictureProfile;
        this.dataHistory=res.items.history;
      }else{
        this.dataProvider=[];
        this.dataHistory=[];
      }
    },(err)=>{
      this.dataProvider=[];
      this.dataHistory=[];
    }
    )
   }
}
