import { Component, HostListener, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import * as FileSaver from "file-saver";
import { MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Approve } from "src/app/data/model/request/approve";
import { ApproveBookingRequest } from "src/app/data/model/request/ApproveBookingRequest";
import { ApproveService } from "src/app/data/service/approve-service";
import { EmployeeService } from "src/app/data/service/employee/employee.service";
import { TokenStorageService } from "src/app/data/service/token-storage.service";
import { CommonService } from "src/app/shared/common.service";
import { ConstantsCommon, eRole } from "src/app/shared/constants.common";
import { MessageValidate } from "src/app/shared/message-validation";
import { ConfirmEditComponent } from "../confirm-edit/confirm-edit.component";
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'comfirm-day-off',
  templateUrl: './confirm-day-off.component.html',
  styleUrls: ['./confirm-day-off.component.scss']
})
export class ConfirmDayOffComponent implements OnInit {

  public pageLinkSize = 14;

  public keySearch: any;

  public pageSize = 11;

  public curentPage = 1;

  public totalRecord = 0;

  public listBooking: any[];

  public cols: any[];

  public listStatus: { name: String, value: number }[];

  public listDepartment: any[];

  public searchForm: FormGroup;

  public ref: DynamicDialogRef;

  public bookingSearch: any;

  public isLeader: boolean = false;

  public isManager: boolean = false;

  public flagAllBooking: boolean = false;

  public selectedAll: any[] = [];

  public selectedAlls: number[] = [];

  public flagSelectedAllBooking = false;

  public page: number[] = [];

  public approves: Approve[] = [];

  public searchDialog: boolean = false;
  public mobileScreen: boolean = false
  recordEnd: number;
  recordStart: number;
  public screenWidth: any;
  public batchApprover: boolean = false;

  // values for aggregate mode
  public searchAggreForm: FormGroup;
  public aggregateMode: boolean = false;
  public aggregateDataList: any[] = [];
  public aggreFrozenColumns: any[] = [];
  public aggreCols: any[] = [];
  public aggreSearch: any;
  //

  constructor(
    private approveService: ApproveService,
    private employService: EmployeeService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private token: TokenStorageService,
    private deviceService: DeviceDetectorService
  ) {
    this.screenWidth = window.outerWidth;
    this.mobileScreen = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    localStorage.removeItem("mutilSelect");
    this.pageLinkSize = this.mobileScreen ? 3 : 14;
    this.pageSize = this.mobileScreen ? 9 : 11;
    this.listStatus = [
      { name: 'Nghỉ Phép', value: 0 },
      { name: 'Đi Muộn/Về Sớm', value: 1 },
      { name: 'Remote', value: 2 },
      { name: 'Ra Ngoài', value: 3 },
      { name: 'OT', value: 4 },
      { name: 'Nghỉ Phúc Lợi', value: 5 },
      { name: 'Nghỉ Bù', value: 6 },
      { name: 'Nghỉ Không Lương', value: 7 },
      { name: 'Quên Chấm Công', value: 8 },
      { name: 'Đăng Ký Thiết Bị', value: 9 }
    ]
    this.searchForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl(),
      status: new FormControl(),
      wait: new FormControl(true), // default value 'cho xac nhan' checked 
      approve: new FormControl(true),
      refuse: new FormControl(true),
      name: new FormControl(),
      department: new FormControl(),
      flagAllBooking: new FormControl(true),
      deleteFlag: new FormControl(false),
    });
    this.initCheck();
    this.getTimeDropDown();
    // aggregateForm
    this.searchAggreForm = new FormGroup({
      timeYear: new FormControl(new Date()),
      fullName: new FormControl(),
      employeeCode: new FormControl(),
    })
    this.initAggregateTableHeader();
    //
    this.initTableHeader();
  }
  // init check role
  initCheck() {
    let rules = this.token.getUser()?.roles;
    let isLoggedIn = !!this.token.getToken();
    if (isLoggedIn) {
      if (rules.indexOf(eRole.LEADER) >= 0 && rules.indexOf(eRole.HR) >= 0) {
        this.isManager = true;
      }
      this.isLeader =
        rules.indexOf(eRole.LEADER) >= 0 && rules.indexOf(eRole.HR) < 0
          ? true
          : false;
    }
  }
  initTableHeader() {
    this.cols =
      [
        { header: 'Tên Nhân Viên', width: '20vh' },
        { header: 'Phòng Ban', width: '10vh' },
        { header: 'Loại Yêu Cầu', width: '20vh' },
        { header: 'Ngày Yêu Cầu', width: '20vh' },
        { header: 'Lí do', width: '20vh' },
        { header: 'Trạng Thái Đơn', width: '15vh' },
      ];
    this.getListData();
  }
  getTimeDropDown() {
    this.employService.getListDepartment().subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.listDepartment = data.items;
      }
    });
  }
  // Resize dialog width when changing size of window's screen
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileScreen = this.deviceService.isMobile();
  }
  show(id) {
    this.ref = this.dialogService.open(ConfirmEditComponent, {
      header: 'Phê Duyệt Yêu Cầu',
      width: this.mobileScreen ? '100%' : '55%',
      baseZIndex: 1000,
      data: {
        flag: 0,
        id: id,
      },
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.selectedAlls = [];
        this.showSuccess();
        this.getListData();
      }
    });
  }
  cancelMultipleSelected() {
    this.selectedAlls = [];
    this.approves = [];
    this.batchApprover = false;
  }
  showMultipleSelected(multipleSelected) {
    this.selectedAlls = [];
    let approves;
    if (localStorage.getItem("mutilSelect")) {
      approves = JSON.parse(localStorage.getItem("mutilSelect"));
    }
    if (approves === null || approves.length <= 0) {
      return
    }
    approves.forEach((boookings) => {
      boookings.bookings.forEach((booking) => this.selectedAlls.push(booking));
    })
    this.ref = this.dialogService.open(ConfirmEditComponent, {
      header: 'Phê Duyệt Yêu Cầu',
      width: this.mobileScreen ? '95%' : '55%',
      baseZIndex: 1000,
      data: {
        flag: 1,
        multipleSelected: this.selectedAlls,

      },
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        localStorage.removeItem("mutilSelect");
        this.page = [];
        this.selectedAlls = [];
        this.approves = [];
        this.batchApprover = false;
        this.showSuccess();
        this.getListData();
      }
    });
  }

  getListData() {
    this.searchForm.value.pageSize = this.pageSize;
    this.searchForm.value.pageNo = this.curentPage;
    this.bookingSearch = this.searchForm.value;
    this.bookingSearch.isLeader = this.isLeader;
    if (this.isManager) {
      if (this.searchForm.get('flagAllBooking').value == true) {
        this.bookingSearch.isLeader = true;
      }
      else {
        this.bookingSearch.isLeader = false;
      }
    }
    this.approveService.getListBooking(this.bookingSearch).subscribe(
      (data: any) => {
        if (data.status === ConstantsCommon.HTTP_STATUS_200) {
          this.listBooking = data.items.items;
          this.listBooking.forEach(item => item.requestDay = item.status==='Đăng Ký Thiết Bị'?(item.requestDay.split(' ')[0]):item.requestDay);
          this.totalRecord = data.items.totalItems;
          this.selectedAll = data.items.items;
          this.selectedAll = this.selectedAll.map(x => x.id);

          this.updateRecordSummary();
          let flag = false;
          let approves = JSON.parse(localStorage.getItem("mutilSelect"));
          if (approves) {
            approves.forEach(approve => {
              if (approve.page == this.curentPage) {
                if (approve.bookings.length == this.selectedAll.length) {
                  this.flagSelectedAllBooking = true;
                  this.page = [];
                  this.page.push(approve.page);
                }
                else {
                  this.flagSelectedAllBooking = false
                  this.page = [];
                }
                flag = true
                this.selectedAlls = approve.bookings;
              }
            })
          }
          if (!flag) {
            this.selectedAlls = [];
            this.flagSelectedAllBooking = false;
            this.page = [];
          }

        }
      },
      (err) => {
        this.listBooking = [];
        this.totalRecord = 0;
      }
    );
  }
  updateRecordSummary() {
    if (this.totalRecord > this.pageSize) {
      this.recordEnd = this.curentPage * this.pageSize;
      this.recordStart = this.recordEnd - this.pageSize + 1;
      if (this.recordEnd > this.totalRecord) {
        this.recordEnd =
          this.recordEnd - (this.pageSize - (this.aggregateMode ? this.aggregateDataList.length : this.listBooking.length));
      }
    } else {
      this.recordEnd = this.totalRecord;
      this.recordStart = 1;
    }
  }

  onSearch() {
    localStorage.removeItem("mutilSelect");
    this.selectedAlls = [];
    this.curentPage = 1;
    this.aggregateMode ? this.getAggregateData() : this.getListData();

  }

  pageClick(event: any) {


    this.curentPage = event.page + 1;
    this.aggregateMode ? this.getAggregateData() : this.getListData();
  }

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

  selectedAllBooking() {
    if (this.flagSelectedAllBooking == false) {
      this.selectedAlls = this.selectedAll;
      let approve = new Approve();
      approve.bookings = this.selectedAlls;
      approve.flagAll = true;
      approve.page = this.curentPage;
      this.approves = this.approves.filter((x) => { return x.page != this.curentPage })
      this.approves.push(approve);
      localStorage.setItem("mutilSelect", JSON.stringify(this.approves));
      this.flagSelectedAllBooking = true;
    }
    else {
      this.selectedAlls = [];
      let approve = new Approve();
      approve.bookings = this.selectedAlls;
      approve.flagAll = true;
      approve.page = this.curentPage;
      this.approves = this.approves.filter((x) => { return x.page != this.curentPage })
      this.approves.push(approve);
      // this.approves=this.approves.filter((x)=>{return x.page!=this.curentPage})
      localStorage.setItem("mutilSelect", JSON.stringify(this.approves));
      this.flagSelectedAllBooking = false;
    }
  }

  onCheckBox() {
    let approve = new Approve();
    this.page = [];
    approve.bookings = this.selectedAlls;
    approve.flagAll = true;
    approve.page = this.curentPage;
    this.approves = this.approves.filter((x) => { return x.page != approve.page });
    let flag = true;
    this.approves = this.approves.filter((x) => { return x.page != this.curentPage })
    this.approves.push(approve);
    localStorage.setItem("mutilSelect", JSON.stringify(this.approves));
    let approves = JSON.parse(localStorage.getItem("mutilSelect"));
    let length = 0;
    approves.forEach((x) => {
      if (x.page == this.curentPage) {
        length = x.bookings.length;
      }
    })
    if (length == this.selectedAll.length) {
      this.page.push(this.curentPage)
      this.flagSelectedAllBooking = true;
    }
    else {
      this.flagSelectedAllBooking = false;
    }
  }

  /** AggerateMode functions  **/
  // init search form
  toggleAction() {
    this.curentPage = 1;
    this.aggregateMode ? this.getAggregateData() : this.getListData();
  }
  // define table header's properties and fetch table data
  initAggregateTableHeader() {
    this.aggreFrozenColumns = [
      { field: 'employeeCode', header: 'Mã Nhân Viên', width: 10, frozen: true },
      { field: 'fullName', header: 'Tên Nhân Viên', width: 20, frozen: true },
    ]
    this.aggreCols = [
      { field: 'lateHour', header: 'Đi Muộn/ Về Sớm/ Ra Ngoài(Giờ)', width: 15, frozen: false },
      { field: 'lateTime', header: 'Đi Muộn/ Về Sớm(Lần)', width: 12, frozen: false },
      { field: 'awdTime', header: 'Ra Ngoài(Lần)', width: 7, frozen: false },
      { field: 'keepingForget', header: 'Quên Chấm Công', width: 10, frozen: false },
      { field: 'leaveDayAccept', header: 'Nghỉ Có Phép/Nghỉ bù', width: 12, frozen: false },
      { field: 'unpaidLeave', header: 'Nghỉ Không Hưởng Lương', width: 12, frozen: false },
      { field: 'remoteTime', header: 'Remote', width: 7, frozen: false },
      { field: 'otNormal', header: 'OT Ngày Thường', width: 10, frozen: false },
      { field: 'otMorning7', header: 'OT Thứ 7', width: 10, frozen: false },
      { field: 'otSatSun', header: 'OT Chủ nhật', width: 10, frozen: false },
      { field: 'otHoliday', header: 'OT Ngày Lễ', width: 10, frozen: false },
      { field: 'leaveRemainNow', header: 'Phép Còn Đến Hiện Tại', width: 11, frozen: false },
      { field: 'csrLeaveNow', header: 'Nghỉ Bù Còn Đến Hiện Tại', width: 12, frozen: false },
    ];
  }
  // fetch table data
  getAggregateData() {
    this.searchAggreForm.value.pageSize = this.pageSize;
    this.searchAggreForm.value.pageNo = this.curentPage;
    this.searchAggreForm.controls['timeYear'].value.setDate(15);
    this.aggreSearch = this.searchAggreForm.value;
    this.approveService.getListAggregateData(this.aggreSearch).subscribe((response: any) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.aggregateDataList = response.items;
        this.totalRecord = response.items[0].totalRecord;
        this.updateRecordSummary();
      }
      else {
        this.messageService.add({
          severity: 'error',
          detail: response.message,
        });
        if (this.isLeader) {
          this.aggregateMode = false;
        }
      }
    }, (error) => {
      this.aggregateDataList = [];
      this.totalRecord = 0;
    });
  }
  // export data
  exportAggregateData() {
    this.searchAggreForm.value.pageSize = this.pageSize;
    this.searchAggreForm.value.pageNo = this.curentPage;
    this.searchAggreForm.controls['timeYear'].value.setDate(15);
    this.aggreSearch = this.searchAggreForm.value;
    this.approveService.exportAggregateData(this.aggreSearch).subscribe((response: any) => {
      let timeSave = this.searchAggreForm.value.timeYear;
      let file = new Blob([response], { type: 'application/vnd.ms-excel' });
      let monthTime = ((timeSave.getMonth() + 1) > 9 ? '' : '0') + (timeSave.getMonth() + 1);
      let yearTime = timeSave.getFullYear() + '';
      let name = "application_summary_" + monthTime + '-' + yearTime;
      let EXCEL_EXTENSION = '.xlsx';
      FileSaver.saveAs(file, name + EXCEL_EXTENSION);
    })
  }
}
