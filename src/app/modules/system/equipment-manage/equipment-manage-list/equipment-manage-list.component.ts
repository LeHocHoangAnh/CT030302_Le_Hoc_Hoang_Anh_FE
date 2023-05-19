import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { DropdownListData } from 'src/app/data/model/DropdownListData';
import { EquipmentService } from 'src/app/data/service/equipment-manage.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { EquipmentHistoryComponent } from '../equipment-history/equipment-history.component';
import { EquipmentManageEditComponent } from '../equipment-manage-edit/equipment-manage-edit.component';

@Component({
  selector: 'app-equipment-manage-list',
  templateUrl: './equipment-manage-list.component.html',
  styleUrls: ['./equipment-manage-list.component.scss']
})
export class EquipmentManageListComponent implements OnInit {
  public equipmentStatus: DropdownListData[] = ConstantsCommon.EQUIPMENT_STATUS;
  public equipmentCategory: DropdownListData[] = ConstantsCommon.EQUIPMENT_CATEGORY;
  public searchForm: FormGroup;
  public employeeList: DropdownListData[] = [];
  public selectedEmployee:any;
  public ref: DynamicDialogRef;
  public screenWidth: any;
  public mobileScreen: boolean = false;
  // view warranty detail
  public isWarrantyViewing: boolean = false;
  public warrantyDetail: any;
  // switch equipment's ownership
  public isSwitchingUser:boolean = false;
  public currentSwitchingEquipment:number;
  public currentSwitchingEmployee:string;
  // paginator
  public recordStart: number;
  public recordEnd: number;
  public totalRecord: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;
  public pageLinkSize: number = 10;
  // table
  public equipmentList: any;
  public equipmentCols: any;
  // 
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  //
  constructor(
    private equipmentService: EquipmentService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.mobileScreen = this.screenWidth < 768;
    this.pageSize = this.screenWidth<1366?9:this.pageSize;
    this.initSearchForm();
    this.initEquipmentTable();
    this.getListEmployeeDropdown();
  }
  initSearchForm() {
    this.searchForm = new FormGroup({
      name: new FormControl(),
      serialNumber: new FormControl(),
      category: new FormControl(),
      status: new FormControl(),
      date: new FormControl(),
      employeeList: new FormControl(),
    })
  }
  initEquipmentTable() {
    this.equipmentCols = [
      { header: 'Sửa', width: '5%' },
      { header: 'Tên Thiết Bị', width: '12%' },
      { header: 'Số Seri', width: '12%' },
      { header: 'Loại Thiết Bị', width: '10%' },
      { header: 'Thông Tin Thiết Bị', width: '15%' },
      { header: 'Nhân Viên Sử Dụng', width: '15%' },
      { header: 'Đổi', width: '5%' },
      { header: 'Trạng Thái', width: '10%' },
      { header: 'Bảo Hành', width: '6%' },
      { header: 'Lịch Sử', width: '5%' },
      { header: 'Xóa', width: '5%' }
    ];
    this.getListEquipment();
  }

  getListEquipment() {
    this.searchForm.value.pageNo = this.currentPage;
    this.searchForm.value.pageSize = this.pageSize;
    this.equipmentService.getListEquipment(this.searchForm.value).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.equipmentList = response.items.items;
        // pre-processing display data before using
        this.equipmentList.forEach(item =>  {
          item.status = this.equipmentStatus.filter(statusItem => statusItem.value === item.status)[0].name;
          item.category = this.equipmentCategory.filter(categoryItem => categoryItem.value === item.category)[0].name;
        });
        this.totalRecord = response.items.totalItems;
        this.paginator.totalRecords = this.totalRecord;
        this.updateRecordSummary();
      }
    })
  }

  getListEmployeeDropdown() {
    this.equipmentService.getListEmployeeDropdown().subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.employeeList = response.items;
      }
    })
  }
  onSearch() {
    this.currentPage = 1;
    this.paginator.changePage(0);
    this.getListEquipment();
  }
  updateRecordSummary() {
    if (this.totalRecord > this.pageSize) {
      this.recordEnd = this.currentPage * this.pageSize;
      this.recordStart = this.recordEnd - this.pageSize + 1;
      if (this.recordEnd > this.totalRecord) {
        this.recordEnd =
          this.recordEnd - (this.pageSize - this.equipmentList.length);
      }
    } else {
      this.recordEnd = this.totalRecord;
      this.recordStart = 1;
    }
  }
  pageClick(event: any) {
    this.currentPage = event.page + 1;
    this.getListEquipment();
  }

  // *** open dynamic dialog functions ***
  openDetailDialog(id: number) {
    this.ref = this.dialogService.open(EquipmentManageEditComponent, {
      header: id ? 'Chi Tiết' : 'Tạo Mới',
      baseZIndex: 1,
      width: this.mobileScreen ? '98%' : '35%',
      data: { id: id }
    })
    this.ref.onClose.subscribe((status) => {
      if(status !== undefined && status != null){
        this.onSearch();
      }
    })
  }
  openHistoryDialog(id: number){
    this.ref = this.dialogService.open(EquipmentHistoryComponent, {
      header: 'Lịch Sử Sử Dụng',
      baseZIndex: 1,
      width: this.mobileScreen ? '98%' : '50%',
      data: { id: id }
    })
  }
  confirmDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Xác nhận thao tác xóa bản ghi thiết bị?',
      accept: () => {
        this.deleteEquipment(id);
      },
      reject: () => {

      }
    })
  }
  deleteEquipment(id: number) {
    this.equipmentService.delete(id).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.showSuccess();
        this.onSearch();
      }
      else {
        this.showError();
      }
    })
  }
  // *** end ***
  // *** dialog switch user's functions ***
  userSwitchDialog(id: number, employee:string){
    this.isSwitchingUser = true;
    this.currentSwitchingEquipment = id;
    this.currentSwitchingEmployee = employee;
  }
  onRowSelect(event: any){
    this.confirmationService.confirm({
      target: event.target,
      message: 'Xác nhận thao tác thay đổi người sử dụng?',
      accept: () => {
        this.switchOwnership(event.data.value);
        this.selectedEmployee = [];
      },
      reject: () => {

      }
    })
  }
  switchOwnership(value: any){
    this.equipmentService.switchOwnership(this.currentSwitchingEquipment, value).subscribe((response) => {
      if(response.status===ConstantsCommon.HTTP_STATUS_200){
        this.showSuccess();
        this.onSearch();
        this.isSwitchingUser = false;
      }
    })
  }
  // *** end ***// *** dialog switch user's functions ***
  warrantyDetailDialog(id: number){
    this.isWarrantyViewing = true;
    let fullDetail = this.equipmentList.filter(item => item.id === id)[0];
    this.warrantyDetail = [{
      name: fullDetail.name,
      serialNumber: fullDetail.serialNumber,
      importDate: fullDetail.importDate,
      vendor: fullDetail.vendor,
      warrantyTime: fullDetail.warrantyTime
    }]
  }
  // *** end ***

  showSuccess() {
    this.messageService.add({
      severity: 'info',
      detail: MessageValidate.MES_SUCCESS,
    });
  }
  showError() {
    this.messageService.add({
      severity: 'error',
      detail: MessageValidate.MES_ERROR,
    });
  }
}
