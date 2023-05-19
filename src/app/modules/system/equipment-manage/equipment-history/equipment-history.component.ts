import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EquipmentService } from 'src/app/data/service/equipment-manage.service';
import { EquipmentRegisterService } from 'src/app/data/service/equipment-register.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';

@Component({
  selector: 'app-equipment-history',
  templateUrl: './equipment-history.component.html',
  styleUrls: ['./equipment-history.component.scss']
})
export class EquipmentHistoryComponent implements OnInit {
  public screenWidth: number;
  public mobileScreen: boolean = false;
  public id: number;
  public historyList: any;
  public emptyList: boolean = false;
  public cols: any;
  public editBackDate: boolean = false;
  public calendarValue: any;
  public DATE_TYPE = DATE_TYPE;
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private equipmentRegisterService: EquipmentRegisterService) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.mobileScreen = this.screenWidth < 768;
    switch (this.mobileScreen) {
      case false:
        this.cols = [
          { field: 'employeeCode', header: 'Mã Nhân Viên', width: '15%' },
          { field: 'employeeName', header: 'Tên Nhân Viên', width: '29%' },
          { field: 'departmentName', header: 'Phòng Ban', width: '20%' },
          { field: 'requestDate', header: 'Ngày Nhận', width: '18%' },
          { field: 'backDate', header: 'Ngày Trả', width: '18%' }
        ]
        break;
      case true:
        this.cols = [
          { field: 'employeeName', header: 'Tên Nhân Viên', width: '46%' },
          { field: 'requestDate', header: 'Ngày Nhận', width: '27%' },
          { field: 'backDate', header: 'Ngày Trả', width: '27%' }
        ]
        break;
    }
    this.id = this.config.data.id;
    this.getHistoryList();
  }
  getHistoryList() {
    this.equipmentRegisterService.getHistoryList(this.id).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.historyList = response.items;
      }
    })
  }
  editHistory(history: any, type: number) {
    switch (type) {
      case DATE_TYPE.REQUEST:
        history.editReqDateFlag = true;
        break;
      case DATE_TYPE.BACK:
        history.editBackDateFlag = true;
        break;
      default:
        break;
    }
  }
  submitEditedHistory(history: any, field: string) {
    setTimeout(() => {
      try {
        if (history[field]) {
          this.equipmentRegisterService.editHistoryList(history).subscribe((response) => {
            if (response.status === ConstantsCommon.HTTP_STATUS_200) {
              history.editReqDateFlag = false;
              history.editBackDateFlag = false;
              this.getHistoryList();
            }
          });
        }
      } catch (error) {
      }
    }, 200);
  }
}

enum DATE_TYPE {
  REQUEST = 0,
  BACK = 1
}