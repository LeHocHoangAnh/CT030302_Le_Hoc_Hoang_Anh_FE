import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { EquipmentRegisterService } from 'src/app/data/service/equipment-register.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';

@Component({
  selector: 'app-employee-register-list',
  templateUrl: './employee-register-list.component.html',
  styleUrls: ['./employee-register-list.component.scss']
})
export class EmployeeRegisterListComponent implements OnInit {

  public searchDialog: boolean = false;
  public cols: any;
  public listEquipmentBooking: any;
  public mobileScreen: boolean = false;
  public screenWidth: number;
  public searchForm: FormGroup;
  //
  public listCategory: any[] = [];
  public listDepartment: any[] = [];
  public listConfirm: any[] = [];
  // paginator
  public recordStart: number;
  public recordEnd: number;
  public totalRecord: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;
  public pageLinkSize: number = 10;

  @ViewChild('paginator', { static: true }) paginator: Paginator;
  constructor(
    private equipmentRegisterService: EquipmentRegisterService,
    private messageService: MessageService,
    private deviceDetector: DeviceDetectorService) {
    this.mobileScreen = this.deviceDetector.isMobile();
    this.screenWidth = window.outerWidth;
  }

  ngOnInit(): void {
    this.pageSize = this.mobileScreen ? 9 : this.pageSize;
    this.fetchAllDropDown();
    this.initSearchForm();
    this.initTableHeader();
  }
  initSearchForm() {
    this.searchForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl(),
      confirm: new FormControl(),
      name: new FormControl(),
      departmentId: new FormControl(),
      category: new FormControl(),
    })
  }
  //
  initTableHeader() {
    this.cols =
      [
        { header: 'Tên Nhân Viên', width: '20vh' },
        { header: 'Phòng Ban', width: '10vh' },
        { header: 'Loại Thiết bị', width: '20vh' },
        { header: 'Mô Tả Thiết Bị', width: '20vh' },
        { header: 'Ngày Yêu Cầu', width: '20vh' },
        { header: 'Lí do', width: '20vh' },
        { header: 'Trạng Thái Đơn', width: '15vh' },
      ];
    this.getEmployeeRegistrationList();
  }
  fetchAllDropDown() {
    // department
    this.equipmentRegisterService.getListDepartment().subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.listDepartment = data.items;
      }
    });
    // category
    this.listCategory = ConstantsCommon.EQUIPMENT_CATEGORY;
    // confirm
    this.listConfirm = [
      {value: 0, name:'Chờ xác nhận'},
      {value: 1, name:'Xác nhận'}
    ]
  }
  //
  onSearch() {
    this.currentPage = 1;
    this.getEmployeeRegistrationList();
  }
  getEmployeeRegistrationList() {
    this.searchForm.value.pageNo = this.currentPage;
    this.searchForm.value.pageSize = this.pageSize;
    this.equipmentRegisterService.getEmployeeRegistrationList(this.searchForm.value).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.listEquipmentBooking = response.items.items;
        this.listEquipmentBooking.forEach(item => {
          item.category = this.listCategory.filter(category => item.category === category.value)[0].name;
        })
        this.totalRecord = response.items.totalItems;
        this.paginator.totalRecords = this.totalRecord;
        this.updateRecordSummary();
      }
      else {
        this.messageService.add({
          severity: 'error',
          detail: response.message,
        });
      }
    })
  }
  pageClick(event: any) {
    this.currentPage = event.page + 1;
    this.getEmployeeRegistrationList();
  }
  updateRecordSummary() {
    if (this.totalRecord > this.pageSize) {
      this.recordEnd = this.currentPage * this.pageSize;
      this.recordStart = this.recordEnd - this.pageSize + 1;
      if (this.recordEnd > this.totalRecord) {
        this.recordEnd =
          this.recordEnd - (this.pageSize - this.listEquipmentBooking.length);
      }
    } else {
      this.recordEnd = this.totalRecord;
      this.recordStart = 1;
    }
  }
  //
}
