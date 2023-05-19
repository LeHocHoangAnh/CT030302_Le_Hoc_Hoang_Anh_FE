import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListDepartmentsRequest } from 'src/app/data/model/request/ListDepartmentsRequest';
import { DepartmentsService } from 'src/app/data/service/departments-service';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog/department-dialog.component';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.css'],
})
export class DepartmentsListComponent implements OnInit {
  // paginator
  public position: string;
  public totalRecord = 0;
  public pageSize = 10;
  public pageLinkSize = 10;
  public currentPage = 1;
  // data and form
  public departmentsList: any[];
  public filterForm: FormGroup;
  public columns: any[];
  public departments: ListDepartmentsRequest = new ListDepartmentsRequest();
  private currentChosenID: number;
  // action status
  public redStatus: string = 'Ngừng Hoạt Động';
  public greenStatus: string = 'Đang Hoạt Động';
  public yellowStatus: string = 'Tạm Ngưng';
  action: any[] = [
    { name: this.redStatus, action: 0 },
    { name: this.greenStatus, action: 1 },
    { name: this.yellowStatus, action: 2 },
  ];
  selectedAction: { name: String; action: number };
  // popup
  public ref: DynamicDialogRef;
  public mobileScreen: boolean = false;
  constructor(
    private departmentsService: DepartmentsService,
    private dialogService: DialogService,
    private showMessage: ShowMessageComponent,
    private router: Router,
    private confirmationService: ConfirmationService,
    private deviceDetector: DeviceDetectorService
  ) {
    this.mobileScreen = deviceDetector.isMobile();
  }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      departmentName: new FormControl(),
      departmentAction: new FormControl(),
    });
    this.initTableHeader();
  }
  // search by filter
  searchFunction() {
    this.currentPage = 1;
    this.getDepartmentList();
  }
  // initialize header and table data
  initTableHeader() {
    this.columns = this.mobileScreen?
    [
      { header: 'Sửa' },
      { header: 'Tên Phòng Ban' },
      { header: 'Số Nhân Viên' },
      { header: 'Trạng Thái Hoạt Động' },
      { header: 'Xóa' },
    ]:
    [
      { header: 'Sửa' },
      { header: 'ID Phòng Ban' },
      { header: 'Tên Phòng Ban' },
      { header: 'Số Nhân Viên' },
      { header: 'Trạng Thái Hoạt Động' },
      { header: 'Xóa' },
    ];
    this.getDepartmentList();
  }
  // fetch department data
  getDepartmentList() {
    this.filterForm.value.pageSize = this.pageSize;
    this.filterForm.value.pageNo = this.currentPage;
    this.departments = this.filterForm.value; // departments request
    let action = this.filterForm.value.departmentAction // action filter
    this.departmentsService.getDepartmentsList(this.departments, action).subscribe(
      (response: any) => {
        if (response.status === ConstantsCommon.HTTP_STATUS_200) {
          this.departmentsList = response.items.items;
          this.totalRecord = response.items.totalItems;
        }
      },
      (err) => {
        this.departmentsList = [];
        this.totalRecord = 0;
      }
    );
  }
  // open dialog for creating 
  triggerAddDialog() {
    this.ref = this.dialogService.open(DepartmentDialogComponent, {
      header: 'Tạo mới phòng ban',
      width: '45%',
      baseZIndex: 1000,
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.getDepartmentList();
        this.showMessage.showSuccessMessage();
      }
    });
  }
  // page forward
  pageClick(event: any) {
    this.currentPage = event.page + 1;
    this.getDepartmentList();
  }
  // routing to editing screen
  editDepartment(id: any, member:any) {
    this.router.navigate(['department-edit/' + id], {state:{displayMember:member}});
  }
  // delete confirm popup
  confirm(position: string, id: number) {
    this.position = position;
    this.confirmationService.confirm({
      message: MessageValidate.MES_6,
      header: "Xác nhận xóa",
      acceptLabel: "Đồng ý",
      rejectLabel: "Từ chối",
      acceptVisible: true,
      rejectVisible: true,
      accept: () => {
        this.deleteDepartment(id);
      },
      key: 'positionDialog',
    });
  }
  //delete function
  deleteDepartment(id:number){
      this.departmentsService.deleteDepartment(id).subscribe((response)=>{
        if(response.status===ConstantsCommon.HTTP_STATUS_200){
          this.showMessage.showSuccessMessage();
          this.getDepartmentList();
        } else{
          this.showMessage.showErrorMessage();
        }
      })
  }
}
