import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DepartmentsService } from 'src/app/data/service/departments-service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { updateDepartment } from 'src/app/data/model/request/ListDepartmentsRequest';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.css'],
})
export class DepartmentEditComponent implements OnInit {
  public id: number;
  public columns: any[];
  public employeeList: any[];
  public department: any;
  public currentDisplayMember: number;
  //
  public totalRecord = 0;
  public currentPage = 1
  public pageSize = 15;
  public pageLinkSize = 15;
  public recordStart = 1;
  public previousRecordStart = this.recordStart;
  public recordEnd: any;
  // update department name
  departmentName: string = '';
  departmentProbPeriod: number;
  // dropdown for updating department action
  action: any[] = [
    { name: 'Ngừng Hoạt Động', action: 0 },
    { name: 'Đang Hoạt Động', action: 1 },
    { name: 'Tạm Ngưng', action: 2 },
  ];
  selectedAction: { name: String; action: number };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private departmentService: DepartmentsService,
    private messageService: MessageService,
    private router: Router
  ) {
    // get current department id
    this.id = parseInt(
      this.document.location.href.split('department-edit/')[1]
    );
    // get member displayed in department-list component with specific id(sent by router)
    let state = this.router.getCurrentNavigation().extras.state;
    if (state) { this.currentDisplayMember = state.displayMember; }
  }
  ngOnInit(): void {
    this.initTableHeader();
    this.getDepartmentData();
  }
  // initialize header and table data
  initTableHeader() {
    this.columns = [
      { header: 'Mã NV' },
      { header: 'Email' },
      { header: 'Họ Tên' },
      { header: 'Giới Tính' },
      { header: 'Hợp Đồng' },
      { header: 'Điện Thoại' },
      { header: 'Ngày Sinh' },
      { header: 'Phòng Ban' },
    ];
    this.getEmployeeByDepartmentID();
  }
  // get employee list depend on department id
  getEmployeeByDepartmentID() {
    this.departmentService.getEmployeeByDepartmentID(this.id, this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        if (response.status === ConstantsCommon.HTTP_STATUS_200) {
          this.employeeList = response.items.items;
          this.totalRecord = response.items.totalItems;
          // check and update member when employee list is fetched
          this.updateMember(this.totalRecord)
          // update page records summary
          this.updateRecordSummary();
        }
      },
      (err) => {
        this.employeeList = [];
        this.totalRecord = 0;
      }
    );
  }
  // get department using id
  getDepartmentData() {
    this.departmentService.getDepartmentByID(this.id).subscribe(
      (response) => {
        if (response.status === ConstantsCommon.HTTP_STATUS_200) {
          this.department = response.items;
          this.departmentName = this.department.name;
          let actionType = this.department.action;
          this.selectedAction = this.action.filter(
            (item) => item.action === actionType
          )[0];
          this.departmentProbPeriod = this.department.probationaryPeriod;
        }
      },
      (err) => {
        this.department = null;
      }
    );
  }
  // update department by requestBody Department entity
  updateDepartment() {
    if (!this.departmentName || this.departmentName === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: "'Tên Phòng Ban' không được để trống",
      });
    } else {
      this.department.name = this.departmentName;
      this.department.action = this.selectedAction.action;
      this.departmentService
        .updateDepartment(this.department)
        .subscribe((response) => {
          if (response.status === ConstantsCommon.HTTP_STATUS_200) {
            this.messageService.add({
              severity: 'success',
              detail: 'Phòng ban đã được cập nhật',
            });
            setTimeout(() => {
              this.router.navigate(['departments-list']);
            }, 300);
          }
        });
    }
  }
  // page click
  pageClick(event: any) {
    this.currentPage = event.page + 1;
    this.getEmployeeByDepartmentID();
  }

  // update record summary by page
  updateRecordSummary() {
    if (this.totalRecord > this.pageSize) {
      this.recordEnd = this.currentPage * this.pageSize;
      this.recordStart = this.recordEnd - this.pageSize + 1;
      if (this.recordEnd > this.totalRecord) {
        this.recordEnd = this.recordEnd - (this.pageSize - this.employeeList.length);
      }
    }
    else {
      this.recordEnd = this.totalRecord;
      this.recordStart = 1;
    }
  }

  // compare and update member
  updateMember(totalEmployee: any) {
    if (totalEmployee != this.currentDisplayMember) {
      this.departmentService.updateDepartmentMember(this.id, totalEmployee).subscribe();
    }
  }
}
