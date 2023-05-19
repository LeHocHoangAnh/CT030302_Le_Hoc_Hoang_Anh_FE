import { Component, HostListener, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountantService } from 'src/app/data/service/accountant-service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { ImportFileExelComponent } from '../importFileExel/import-file-exel.component';
import * as FileSaver from 'file-saver';
import { FormControl, FormGroup } from '@angular/forms';
import { DetailTimeKeepingRequest } from 'src/app/data/model/request/DetailTimeKeepingRequest';
import { EditAccountantComponent } from '../edit-accountant/edit-accountant.component';
import { CommonService } from 'src/app/shared/common.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'accountant',
  templateUrl: './accountant.component.html',
  styleUrls: ['./accountant.component.scss'],
})
export class AccountantComponent implements OnInit {
  public selectedTimes: any;

  public listTimes: any[];

  public searchForm: FormGroup;

  public timeKeeping: any[];

  public cols: any[];

  public pageLinkSize = 11;

  public keySearch: any;

  public pageSize = 11;

  public curentPage = 1;

  public totalRecord = 0;

  public recordStart = 1;

  public previousRecordStart = this.recordStart;

  public recordEnd: any;

  public innerWidth: any;

  public detailTimeKeepingSearch: DetailTimeKeepingRequest = new DetailTimeKeepingRequest();

  public tableScrollHeight: any;

  public frozenColumns: any;

  public ref: DynamicDialogRef;
  public dialogWidth: any;
  public res: any;
  public timeExport: any;

  constructor(
    private accountantService: AccountantService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private commonService: CommonService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.res = {
      r1280: '80%',
      r1366: '75%',
      r1400: '70%'
    };
    this.innerWidth = window.innerWidth;
    this.changePageSizeRes(window.innerWidth);
    this.searchForm = new FormGroup({
      employeeCode: new FormControl(),
      fullName: new FormControl(),
      timeYear: new FormControl(),
    });
    if (this.keySearch) {
      this.searchForm.setValue({
        employeeCode: this.keySearch.employeeCode,
        fullName: this.keySearch.fullName,
        timeYear: this.keySearch.timeYear,
      });
      this.curentPage = this.keySearch.pageNo;
    }
    this.initTableHeader();
    const apiResponse = forkJoin({
      timeDropdown: this.getTimeDropDown()
    }).subscribe((response) => {
      this.setTimeDropDown(response.timeDropdown);
      this.getListData();
    }, (err) => {
      console.log(err);
    })
  }

  ngAfterViewInit() {
    // Resize dialog based on window's resolution
    this.dialogWidth = this.commonService.changeDialogResolution(window.innerWidth, this.res);
  }

  initTableHeader() {
    this.frozenColumns = [
      { field: 'edit', header: 'Sửa', width: 5, frozen: true },
      { field: 'employeeCode', header: 'Mã NV', width: 5, frozen: true },
      { field: 'fullName', header: 'Tên NV', width: 10, frozen: true },
    ]
    this.cols = [
      { field: 'typeContract', header: 'Hợp Đồng', width: 10, frozen: false },
      { field: 'email', header: 'Email', width: 15, frozen: false },
      { field: 'lateTimeHour', header: 'Đi Muộn/ Về Sớm/ Ra Ngoài(Giờ)', width: 12, frozen: false },
      { field: 'lateTime', header: 'Đi Muộn/ Về Sớm(Lần)', width: 9, frozen: false },
      { field: 'keepingForget', header: 'Quên Chấm Công', width: 8, frozen: false },
      { field: 'salaryReal', header: 'Công Thực', width: 9, frozen: false },
      { field: 'leaveDayAccept', header: 'Phép', width: 8, frozen: false },
      { field: 'welfareLeave', header: 'Nghỉ Phúc Lợi', width: 8, frozen: false },
      { field: 'compensatoryLeave', header: 'Nghỉ Bù  ', width: 8, frozen: false },
      { field: 'remoteTime', header: 'Ngày Remote', width: 8, frozen: false },
      { field: 'salaryCount', header: 'Công Tính Lương', width: 8, frozen: false },
      { field: 'otNormal', header: 'OT Ngày Thường', width: 10, frozen: false },
      { field: 'otMorning7', header: 'OT Thứ 7', width: 10, frozen: false },
      { field: 'otSatSun', header: 'OT Chủ Nhật', width: 10, frozen: false },
      { field: 'otHoliday', header: 'OT Ngày Lễ', width: 10, frozen: false },
      { field: 'sumOtMonth', header: 'OT Tính Lương (hs1)', width: 10, frozen: false },
      { field: 'csrLeavePlus', header: 'Nghỉ Bù Cộng Thêm Theo Tháng', width: 11, frozen: false },
      { field: 'csrLeavePlusRound', header: 'Nghỉ Bù Cộng Thêm Làm Tròn', width: 10, frozen: false },
      { field: 'otPayInMonth', header: 'OT Trả Trong Tháng', width: 10, frozen: false },
      { field: 'otUnpaid', header: 'OT Tồn Chưa Thanh Toán', width: 10, frozen: false },
      { field: 'leaveRemainLastMonth', header: 'Phép Tháng Hiện Tại', width: 10, frozen: false },
      { field: 'csrLeaveLastMonth', header: 'Nghỉ Bù OT Tháng Hiện Tại', width: 10, frozen: false },
      { field: 'leaveRemainNow', header: 'Phép Lưu Trữ Tháng Tiếp Theo', width: 10, frozen: false },
      { field: 'csrLeaveNow', header: 'Nghỉ Bù Lưu Trữ Tháng Tiếp Theo', width: 11, frozen: false }
    ];
  }

  importExcel() {
    this.ref = this.dialogService.open(ImportFileExelComponent, {
      width: '50%',
      contentStyle: { 'max-height': 'max-content', overflow: 'auto' },
      data: this.selectedTimes,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.showSuccess();
        this.ngOnInit();
      }
    });
  }
  //
  getTimeDropDown(): Observable<any> {
    return this.accountantService.getListTimeDrop();
  }
  setTimeDropDown(response: any) {
    if (response.status == ConstantsCommon.HTTP_STATUS_200) {

      this.listTimes = response.items;
    }
  }
  //
  getListData(type: number = 0) {
    // if time-year is not chosen, get records of the lastest time
    if (!this.searchForm.value.timeYear && type == 0) {
      this.searchForm.controls['timeYear'].setValue(this.listTimes[0].name);
    }
    else {
      if ((this.searchForm.value.timeYear === null || this.searchForm.value.timeYear === undefined) && type == 0)
        this.searchForm.controls['timeYear'].setValue(this.listTimes[0].name);
    }
    //
    this.searchForm.value.pageSize = this.pageSize;
    this.searchForm.value.pageNo = this.curentPage;
    this.detailTimeKeepingSearch = this.searchForm.value;

    this.accountantService.getListDetailTimeKeeping(this.detailTimeKeepingSearch).subscribe(response => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.timeKeeping = response.items.items;
        this.totalRecord = response.items.totalItems;
        this.updateRecordSummary();
      }
      else {
        this.timeKeeping = [];
        this.totalRecord = 0;
      }
    });
  }
  setListData(response: any) {
  }
  //
  onSearch(type: number = 0) {
    this.curentPage = 1;
    this.getListData(type);
  }
  SearchInformation() {
    this.onSearch(1);
  }
  confirmExportExcel(event: Event) {
    this.timeExport = this.selectedTimes !== undefined ? this.selectedTimes : '';
    this.confirmationService.confirm({
      target: event.target,
      message: 'Xuất dữ liệu excel Tổng hợp chấm công của toàn bộ nhân viên',
      icon: 'bx bxs-download',
      accept: () => {
        this.exportExcel(this.timeExport);
      },
      reject: () => { }
    });
  }
  exportExcel(timeExport: string) {
    this.accountantService.exportFileExel(timeExport).subscribe((data) => {
      let file = new Blob([data], { type: 'application/vnd.ms-excel' });
      let EXCEL_EXTENSION = '.xlsx';
      let date = new Date();
      let name =
        this.selectedTimes !== undefined ? this.selectedTimes : 'Mới_nhất';
      FileSaver.saveAs(
        file,
        'thongke_' +
        name +
        '/' +
        date.getDate() +
        '-' +
        (date.getMonth() + 1) +
        '-' +
        date.getFullYear() +
        EXCEL_EXTENSION
      );
    });
  }
  // Resize dialog width when changing size of window's screen
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.dialogWidth = this.commonService.changeDialogResolution(event.target.innerWidth, this.res);
    this.changePageSizeRes(event.target.innerWidth);
  }
  toEditDialog(time: any) {
    let month = this.selectedTimes;
    if (month === null) {
      // get lastest month in timeDropdowns if time is not selected
      month = this.listTimes[0].name;
    }
    this.ref = this.dialogService.open(EditAccountantComponent, {
      header: 'Chỉnh sửa chi tiết chấm công',
      width: this.dialogWidth,
      baseZIndex: 1000,
      data: { time, month }
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.getListData();
        this.showSuccess();
      }
    })
  }
  //
  pageClick(event: any) {
    this.curentPage = event.page + 1;
    this.getListData();
  }
  //
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
  // change pageSize according to screen resolution
  changePageSizeRes(res: any): void {
    if (res <= 1390) { this.pageSize = 12; this.pageLinkSize = 6 }
    else if (res < 1700) { this.pageSize = 14; this.pageLinkSize = 10 }
    else { this.pageSize = 14; this.pageLinkSize = 16 }
  }
  // update record summary by page
  updateRecordSummary() {
    if (this.totalRecord > this.pageSize) {
      this.recordEnd = this.curentPage * this.pageSize;
      this.recordStart = this.recordEnd - this.pageSize + 1;
      if (this.recordEnd > this.totalRecord) {
        this.recordEnd = this.recordEnd - (this.pageSize - this.timeKeeping.length);
      }
    }
    else {
      this.recordEnd = this.totalRecord;
      this.recordStart = 1;
    }
  }
}
