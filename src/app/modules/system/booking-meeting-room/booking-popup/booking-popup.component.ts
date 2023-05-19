import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookingRoomService } from 'src/app/data/service/booking-room.service';
import { RoomService } from 'src/app/data/service/room.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.component.html',
  styleUrls: ['./booking-popup.component.scss'],
})
export class BookingPopupComponent implements OnInit {
  public validate = MessageValidate;
  public formData: FormGroup;
  public position: String;
  public confirm = 0;
  public id: any;
  public timeStart: Date;
  public timeEnd: Date;
  public dateNow: Date;
  public listRoom: any;
  public bookingRoomDetail: any;
  public checkEdit: Boolean;
  public disableEndDate: boolean = true;
  public notNull = ConstantsCommon.IMPORTANT_VALUE;
  public registerId: any;
  public registerUserName: any;
  public editValidateFlag: boolean = true;

  public currentTimeId: any;
  public eventGroupId: any;
  public eventRoomId: any;

  public periodTypes = [
    { name: 'Một ngày', value: 0 },
    { name: 'Lặp lại', value: 1 }
  ]
  public DATE_START = 0;
  public DATE_END = 1;
  public daysOfWeekPicker = [
    { name: 'Thứ Hai', value: '1' },
    { name: 'Thứ Ba', value: '2' },
    { name: 'Thứ Tư', value: '3' },
    { name: 'Thứ Năm', value: '4' },
    { name: 'Thứ Sáu', value: '5' },
    { name: 'Thứ Bảy', value: '6' },
    { name: 'Chủ Nhật', value: '7' }
  ]

  public updateType = [
    { name: 'Duy nhất bản ghi này', value: 0 },
    { name: 'Toàn bộ bản ghi trong chuỗi sự kiện', value: 1 },
  ]
  public chosenUpdateType = 0;

  //dialog type
  public dialogType: any;
  public DELETE_DIALOG = 0;
  public dialogLabelDelete = 'Xác nhận thao tác xóa';
  public dialogContentDelete = 'Chọn thao tác xóa cho bản ghi';
  public UPDATE_DIALOG = 1
  public dialogLabelUpdate = 'Xác nhận thao tác cập nhật';
  public dialogContentUpdate = 'Chọn thao tác cập nhật cho bản ghi';

  // delete function's variables
  public deleteId: any;
  public dialogDisplay: boolean = false;

  //
  public screenWidth: any;
  public mobileScreen: boolean = false;
  constructor(
    private showMessage: ShowMessageComponent,
    private confirmService: ConfirmationService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private roomService: RoomService,
    private bookingRoomService: BookingRoomService,
    private tokenStorage: TokenStorageService,
    private messageService: MessageService
  ) { 
    this.screenWidth = window.outerWidth;
  }

  ngOnInit(): void {
    this.mobileScreen = this.screenWidth <768;
    // init groupId and timeId from list screen
    this.currentTimeId = this.config.data.timeId;
    this.eventGroupId = this.config.data.id;
    this.eventRoomId = +this.config.data.roomId;
    //
    this.dateNow = new Date();
    this.checkEdit = false;

    this.getListRoom()
    this.initForm();
    this.timeStart = new Date();
    this.timeEnd = new Date();
    this.setDialog();
    this.checkTimeStart();
    this.checkTimeEnd();
    this.initCheck();
  }

  initCheck() {
    let rules = this.tokenStorage.getUser()?.roles;
    let isLoggedIn = !!this.tokenStorage.getToken();
    if (isLoggedIn) {
      this.checkEdit = rules.indexOf(eRole.HR) >= 0 ? true : false;
    }
  }

  initForm() {
    this.formData = new FormGroup({
      id: new FormControl(),
      roomId: new FormControl(this.eventRoomId?this.eventRoomId:null, Validators.required),
      timeStart: new FormControl(new Date(), Validators.required),
      timeEnd: new FormControl(new Date(), Validators.required),
      periodType: new FormControl(null, Validators.required),
      daysOfWeek: new FormControl([]),
      reason: new FormControl('', Validators.required),
    });
  }

  getListRoom() {
    this.roomService.getListRoom().subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.listRoom = data.items;
      }
    });
  }

  checkTimeStart() {
    let date = new Date(this.formData.controls['timeStart'].value);
    if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0) {
      if (
        (date.getUTCMinutes() >= 15 && date.getUTCMinutes() <= 30) ||
        (date.getUTCMinutes() >= 30 && date.getUTCMinutes() < 45)
      ) {
        this.timeStart.setUTCHours(date.getUTCHours());
        this.timeStart.setUTCMinutes(30);
      } else if (date.getUTCMinutes() < 15) {
        this.timeStart.setUTCHours(date.getUTCHours());
        this.timeStart.setUTCMinutes(0);
      } else {
        this.timeStart.setUTCMinutes(0);
        this.timeStart.setUTCHours(date.getUTCHours() + 1);
      }
      this.timeStart.setUTCSeconds(0);
      this.timeEnd.setMilliseconds(0);
    }

    this.formData.controls['timeStart'].setValue(this.timeStart);

  }

  checkTimeEnd() {
    let date = new Date(this.formData.controls['timeEnd'].value);
    if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0) {
      if (
        (date.getUTCMinutes() >= 15 && date.getUTCMinutes() <= 30) ||
        (date.getUTCMinutes() >= 30 && date.getUTCMinutes() < 45)
      ) {
        this.timeEnd.setUTCHours(date.getUTCHours());
        this.timeEnd.setUTCMinutes(30);
      } else if (date.getUTCMinutes() < 15) {
        this.timeEnd.setUTCHours(date.getUTCHours());
        this.timeEnd.setUTCMinutes(0);
      } else {
        this.timeEnd.setUTCMinutes(0);
        this.timeEnd.setUTCHours(date.getUTCHours() + 1);
      }
      this.timeEnd.setUTCSeconds(0);
      this.timeEnd.setMilliseconds(0);
    }

    this.formData.controls['timeEnd'].setValue(this.timeEnd);
  }

  checkDateStart() {
    let date = new Date(this.formData.controls['timeStart'].value);
    this.timeStart.setDate(date.getDate());
    this.timeStart.setMonth(date.getMonth());
    this.timeStart.setFullYear(date.getFullYear());
  }

  checkDateEnd() {
    let date = new Date(this.formData.controls['timeEnd'].value);
    this.timeEnd.setDate(date.getDate());
    this.timeEnd.setMonth(date.getMonth());
    this.timeEnd.setFullYear(date.getFullYear());
  }

  get f() {
    return this.formData.controls;
  }
  setDialog() {
    if (this.config !== undefined && this.config.data !== undefined) {
      this.timeStart =
        this.config.data?.timeStart != null
          ? new Date(this.config.data?.timeStart)
          : this.timeStart;
      this.timeEnd =
        this.config.data?.timeEnd != null
          ? new Date(this.config.data?.timeEnd)
          : this.timeEnd;
      this.formData.controls['timeStart'].setValue(this.timeStart);
      this.formData.controls['timeEnd'].setValue(this.timeEnd);
      this.formData.controls['roomId'].setValue(this.eventRoomId);
      this.id = this.config.data?.id;
      if (this.id) {
        this.formData.controls['id'].setValue(this.id);
        this.getBookingRoomById(this.id);
      }
    }
  }

  getBookingRoomById(id: any) {
    this.bookingRoomService.getBookingRoomById(id).subscribe((res) => {
      if (res.status === ConstantsCommon.HTTP_STATUS_200) {
        this.formData.controls['id'].setValue(id);
        this.formData.controls['reason'].setValue(res.items.reason);
        this.formData.controls['roomId'].setValue(res.items.roomId);

        this.timeStart = new Date(res.items.timeStart);
        this.formData.controls['timeStart'].setValue(new Date(res.items.timeStart));
        this.timeEnd = new Date(res.items.timeEnd);
        this.formData.controls['timeEnd'].setValue(new Date(res.items.timeEnd));

        this.formData.controls['periodType'].setValue(res.items.periodType);
        this.formData.controls['periodType'].disable();
        this.formData.controls['daysOfWeek'].setValue(res.items.daysOfWeek);
        this.formData.controls['daysOfWeek'].disable();
        this.registerUserName = res.items.employeeName;
        this.confirm = res.items.status;

        this.registerId = res.items.employeeId;
        if (id !== null) {
          this.editValidateFlag = this.tokenStorage.getUser().id === this.registerId;
        }
        if (this.registerId != this.tokenStorage.getUser().id) {
          this.disableFormData();
        }
      }
    });
  }
  disableFormData() {
    this.formData.controls['roomId'].disable();
    this.formData.controls['timeStart'].disable();
    this.formData.controls['timeEnd'].disable();
    this.formData.controls['periodType'].disable();
    this.formData.controls['daysOfWeek'].disable();
    this.formData.controls['reason'].disable();
  }
  // delete functions
  confirmDelete() {
    this.dialogDisplay = true
    this.dialogType = this.DELETE_DIALOG;
  }
  deleteAccept() {
    this.onDelete(this.currentTimeId, this.chosenUpdateType);
  }
  dialogReject() {
    this.dialogDisplay = false;
  }

  onDelete(id, deleteType) {
    this.bookingRoomService.deleteBookingRoomById(id, deleteType).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          this.ref.close(res.status);
        } else {
          this.showMessage.showErrorMessage();
        }
      },
      (err) => {
        this.showMessage.showErrorMessage();
      }
    );
  }
  // update functions
  submitted = false;
  onSubmit() {
    if (this.formData.controls['id'].value !== null) {
      this.dialogDisplay = true;
      this.dialogType = this.UPDATE_DIALOG;
    }
    else {
      this.onUpdate(null, null);
    }
  }

  updateAccept() {
    let updateId = this.chosenUpdateType === 1 ? this.eventGroupId : this.currentTimeId;
    let type = this.chosenUpdateType;
    this.onUpdate(updateId, type)
  }

  onUpdate(id, type) {
    this.checkTimeStart();
    this.checkTimeEnd();
    this.submitted = true;
    this.formData.controls['id'].setValue(id);

    let dateStartReq = new Date(
      this.formData.controls['timeStart'].value
    );
    let dateEndReq = new Date(
      this.formData.controls['timeEnd'].value
    );
    let timeStart = dateStartReq.getHours()*60+ dateStartReq.getMinutes();
    let timeEnd = dateEndReq.getHours()*60+ dateEndReq.getMinutes();
    if (this.formData.invalid || timeEnd - timeStart < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Thời gian kết thúc lớn hơn thời gian bắt đầu',
      })
      return;
    }
    this.bookingRoomService
      .createOrUpdateBookingRoom(this.formData.value, type)
      .subscribe(
        (res) => {
          if (res.status === ConstantsCommon.HTTP_STATUS_200) {
            this.bookingRoomService.sendMailBookingRoom(this.formData.value).subscribe();
            this.submitted = false;
            this.ref.close(res.status);
          } else {
            this.messageService.add({
              severity: 'error',
              detail: res.details,
            });

          }
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            detail: MessageValidate.MES_ERROR_TIME_OVERLAP,
          });
        }
      );
  }
  // when change start date with indayMeeting type, set endDate = startDate
  onChangeStartDate() {
    if (this.disableEndDate) {
      this.changeFormDateNotTime(this.formData.value.timeStart, this.DATE_END);
    }
  }
  // trigger function each time change radio button
  changePeriodType(periodType: any) {
    if (periodType === 0) {
      this.disableEndDate = true;
      this.changeFormDateNotTime(this.formData.value.timeStart, this.DATE_END);
      this.formData.controls['daysOfWeek'].setValue([]);
    }
    if (periodType === 1) {
      this.disableEndDate = false;
    }
  }
  // mapping date to date, keep time still
  changeFormDateNotTime(changeDate: Date, dateType: number) {
    if (dateType === this.DATE_START) {
      let dateStart = this.timeStart;
      dateStart.setDate(changeDate.getDate());
      dateStart.setMonth(changeDate.getMonth());
      dateStart.setFullYear(changeDate.getFullYear());
      this.formData.controls['timeStart'].setValue(dateStart);
    }
    if (dateType === this.DATE_END) {
      let dateEnd = this.timeEnd;
      dateEnd.setDate(changeDate.getDate());
      dateEnd.setMonth(changeDate.getMonth());
      dateEnd.setFullYear(changeDate.getFullYear());
      this.formData.controls['timeEnd'].setValue(dateEnd);
    }
  }
}
