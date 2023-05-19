import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { EquipmentRegisterService } from 'src/app/data/service/equipment-register.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
@Component({
  selector: 'app-equipment-register-list',
  templateUrl: './equipment-register-list.component.html',
  styleUrls: ['./equipment-register-list.component.scss']
})
export class EquipmentRegisterListComponent implements OnInit {
  public mobileScreen: boolean = false;
  public isHr: boolean;
  public tableRows: number = 10;
  public ref: DynamicDialogRef;
  //
  public ownedEquipmentCols: any;
  public ownedEquipmentList: any;
  public registrationCols: any;
  public registrationList: any;
  //
  public equipmentCategory = ConstantsCommon.EQUIPMENT_CATEGORY;
  public registrationStatus = [
    { value: 0, name: 'Chờ Xác Nhận' },
    { value: 1, name: 'Xác Nhận' },
    { value: 2, name: 'Từ Chối' }
  ]
  //
  public equipmentDetailDialog: boolean = false;
  public equipmentDetail: any;
  //
  constructor(
    private token: TokenStorageService,
    private equipmentRegisterService: EquipmentRegisterService,
    private deviceDetector: DeviceDetectorService) {
      this.mobileScreen = deviceDetector.isMobile();
      this.tableRows = this.mobileScreen ? 8 : 10;
  }

  ngOnInit(): void {
    let rules = this.token.getUser()?.roles;
    this.isHr = rules.indexOf(eRole.HR) >= 0 ? true : false;
    this.initOwnedEquipmentTable();
    this.initRegistrationTable();
  }

  // *** init tables and theirs data
  initOwnedEquipmentTable() {
    switch (this.mobileScreen) {
      case false:
        this.ownedEquipmentCols = [
          { field: 'name', header: 'Tên Thiết Bị', width: '20%' },
          { field: 'serialNumber', header: 'Số Seri', width: '20%' },
          { field: 'category', header: 'Loại Thiết Bị', width: '15%' },
          { field: 'description', header: 'Thông Tin Thiết Bị', width: '20%' },
          { field: 'requestDate', header: 'Ngày Nhận', width: '20%' },
          { field: 'hisory', header: 'Lịch Sử', width: '5%' },
        ]
        break;
      case true:
        this.ownedEquipmentCols = [
          { field: 'view', header: 'Chi Tiết', width: '25%' },
          { field: 'name', header: 'Tên Thiết Bị', width: '55%' },
          { field: 'hisory', header: 'Lịch Sử', width: '20%' },
        ]
        break;
    }
    this.getUserEquipmentList();
  }
  getUserEquipmentList() {
    this.equipmentRegisterService.getUserEquipmentList().subscribe((response: any) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.ownedEquipmentList = response.items;
        this.ownedEquipmentList.forEach((item: any) => item.category = this.equipmentCategory.filter(category => category.value === item.category)[0].name);
      }
    });
  }

  initRegistrationTable() {
    switch (this.mobileScreen) {
      case false:
        this.registrationCols = [
          { field: 'edit', header: 'Sửa', width: '5%' },
          { field: 'category', header: 'Loại Thiết Bị', width: '30%' },
          { field: 'description', header: 'Mô Tả Thiết Bị', width: '30%' },
          { field: 'requestDate', header: 'Ngày Nhận', width: '15%' },
          { field: 'confirm', header: 'Trạng Thái', width: '20%' },
        ]
        break;
      case true:
        this.registrationCols = [
          { field: 'edit', header: 'Sửa', width: '17%' },
          { field: 'category', header: 'Loại Thiết Bị', width: '50%' },
          { field: 'confirm', header: 'Trạng Thái', width: '33%' },
        ]
        break;
    }
    this.getUserRegistrationList();
  }
  getUserRegistrationList() {
    this.equipmentRegisterService.getUserRegistrationList().subscribe((response: any) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.registrationList = response.items;
        this.registrationList.forEach((item: any) => item.category = this.equipmentCategory.filter(category => category.value === item.category)[0].name);
        this.registrationList.forEach((item: any) => item.confirm = this.registrationStatus.filter(status => status.value === item.confirm)[0].name);
      }
    });
  }
  // end ***
}
