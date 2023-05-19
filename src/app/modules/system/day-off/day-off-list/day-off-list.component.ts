import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DayOffService } from 'src/app/data/service/day-off.service';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { DayOffEditComponent } from './day-off-edit/day-off-edit.component';
import { CommonService } from 'src/app/shared/common.service';
@Component({
  selector: 'app-day-off-list',
  templateUrl: './day-off-list.component.html',
  styleUrls: ['./day-off-list.component.css'],
})
export class DayOffListComponent implements OnInit {
  constructor(
    private dayOffService: DayOffService,
    private dialogService: DialogService,
    private showMessage: ShowMessageComponent,
    private confirmationService: ConfirmationService,
    private commonService: CommonService
  ) {}
  public position: string;
  public yearRange: any;
  public selectedYear: string = null;
  public columns: any;
  public dayOffs: any[];

  public ref: DynamicDialogRef;
  public dialogWidth: any;
  public res:any;

  ngOnInit(): void {
    this.res={
      r1280:'30%', 
      r1366:'30%',
      r1400:'30%'
    };
    this.getYearRange();
    this.initTableHeader();
  }
  ngAfterViewInit(){
    // Resize dialog based on window's resolution
    this.dialogWidth = this.commonService.changeDialogResolution(window.innerWidth, this.res);
  }
  // initialize header and data table
  initTableHeader() {
    this.columns = [
      { header: 'Sửa' },
      { header: 'Từ ngày' },
      { header: 'Đến ngày' },
      { header: 'Lý do' },
      { header: 'Xóa' },
    ];
    this.getDayOffs();
  }
  // Get year range for search-by-year dropdown
  getYearRange() {
    this.dayOffService.getYearRange().subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.yearRange = response.items;
      }
    });
  }
  // search
  onSearch() {
    this.getDayOffs();
  }
  // Get day off list according to selected year
  getDayOffs() {
    this.dayOffService
      .getDayOffInYear(this.selectedYear)
      .subscribe((response) => {
        if ((response.status = ConstantsCommon.HTTP_STATUS_200)) {
          this.dayOffs = response.items;
          this.dayOffs.forEach((item) => {
            item.dayFrom = this.convertDate(item.dayFrom);
            item.dayTo = this.convertDate(item.dayTo);
          });
        }
      });
  }
  // Convert timestamp to dd/MM/yyyy
  convertDate(timeStamp: any) {
    let dayTime = new Date(timeStamp);

    let getDate = ('0' + dayTime.getDate()).slice(-2);
    let getMonth = ('0' + (dayTime.getMonth() + 1)).slice(-2);
    let getYear = dayTime.getFullYear();

    return getDate + '/' + getMonth + '/' + getYear;
  }
  // Resize dialog width when changing size of window's screen
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let innerWidth = event.target.innerWidth;
    this.dialogWidth = this.commonService.changeDialogResolution(innerWidth, this.res);
  }
  // open dialog for create/update
  triggerDialog(dayOffDetail: any) {
    let header = 'Thêm mới ngày nghỉ';
    if (dayOffDetail !== null) header = 'Chỉnh sửa ngày nghỉ'
    this.ref = this.dialogService.open(DayOffEditComponent, {
      header: header,
      width: this.dialogWidth,
      baseZIndex: 1000,
      data: { dayOffDetail: dayOffDetail },
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.getDayOffs();
        this.getYearRange();
        this.showMessage.showSuccessMessage();
      }
    });
  }
  // delete confirm popup
  confirmDelete(position: string, id: number) {
    this.position = position;
    this.confirmationService.confirm({
      message: MessageValidate.MES_6,
      header: "Xác nhận xóa",
      acceptLabel: "Đồng ý",
      rejectLabel: "Từ chối",
      acceptVisible: true,
      rejectVisible: true,
      accept: () => {
        this.deleteDayOff(id);
      },
      key: 'positionDialog',
    });
  }
  // delete day-off by id
  deleteDayOff(id: any){
    this.dayOffService.delete(id).subscribe((response)=>{
      if(response.status===ConstantsCommon.HTTP_STATUS_200){
        this.showMessage.showSuccessMessage();
        this.getDayOffs();
        this.getYearRange();
      }
      else{
        this.showMessage.showErrorMessage();
      }
    })
  }
}
