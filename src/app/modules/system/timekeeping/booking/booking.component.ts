import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { BookingDayOffService } from 'src/app/data/service/employee/booking-day-off.service';
import { BookingDayOff } from 'src/app/shared/common-filter';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';

interface DropDown {
  value: string;
  key: string;
}
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  public validate = MessageValidate;
  public dateStart: Date;
  public dateEnd: Date;
  public formData: FormGroup;
  public selectedTypeTime: DropDown;
  public selectedTypeRegistration: DropDown;
  public approverList: DropDown[] = [];
  public relatedEmployeeList: DropDown[] = [];
  public relatedEmployeeControl: DropDown[] = [];
  public typeDateList: DropDown[] = [];
  public requestStartDate: Date;
  public requestEndDate: Date;
  public id: any;
  public value: any;
  public confirm: number = 0;
  public dataRegist: any;
  public dataRequest: any;
  public position: string;
  public disabledDateEnd = false;
  public disabledHoursStart = false;
  public disabledHoursEnd = false;
  public minStartDateOT = true;
  public maxStartDateOT = true;
  public minEndDateOT = true;
  public maxEndDateOT = false;
  public submitted: boolean = false;
  public inProgress = false;
  public otNomalFlag = false;
  // standard time
  public standardTime: any;
  public standardCheckInMorning: any;
  public standardCheckOutMorning: any;
  public standardCheckInAfternoon: any;
  public standardCheckOutAfternoon: any;

  // status table
  public statusDialog: boolean = false;
  public statusCols: any[] = [];
  public approveStatus: any[] = [];
  public waitStatus: number = ConstantsCommon.WAIT_STATUS;
  public accpetStatus: number = ConstantsCommon.ACCEPT_STATUS;
  public rejectStatus: number = ConstantsCommon.REJECT_STATUS;

  public notNull: string = ConstantsCommon.IMPORTANT_VALUE;

  public keepingForgetFlag: boolean = false;

  public otFlag: boolean = false;
  public dropdownProjectOT: any[] = []

  public evidenceImageView: any;
  public evidenceImageFile = new FormData();

  public inputFileLabel: string = ConstantsCommon.NO_FILE_CHOSEN;
  public imagePreview: boolean = false;
  public selectTime: number;

  public checkIn: boolean;
  public checkOut: boolean;

  public isDayOff: boolean = false;

  public screenWidth: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private bookingDayOff: BookingDayOffService,
    private showMessage: ShowMessageComponent,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.screenWidth = window.outerWidth;
  }

  ngOnInit() {
    this.initForm();
    this.isDayOff = this.config.data?.dayOff;
  }

  initForm() {
    this.formData = new FormGroup({
      selectedTypeRegistration: new FormControl('', Validators.required),
      selectedTypeTime: new FormControl('', Validators.required),
      selectedApprover: new FormControl('', Validators.required),
      dateStart: new FormControl('', Validators.required),
      selectedRelatedEmployee: new FormControl(''),
      dateEnd: new FormControl('', Validators.required),
      reason: new FormControl('', Validators.required),
      checkin: new FormControl(),
      checkout: new FormControl(),
      selectedProject: new FormControl('')
    });
    this.getApproversAndRelatedEmployees();
    this.bookingDayOff.getStandardTime().subscribe(data => {
      this.standardTime = data.items;
      let defaultDate = '1970-01-01T';
      this.standardCheckInMorning = new Date(defaultDate + this.standardTime.checkInMorning);
      this.standardCheckOutMorning = new Date(defaultDate + this.standardTime.checkOutMorning);
      this.standardCheckInAfternoon = new Date(defaultDate + this.standardTime.checkInAfternoon);
      this.standardCheckOutAfternoon = new Date(defaultDate + this.standardTime.checkOutAfternoon);
      this.setDialog();
      this.onSelectregistrationType(this.registrationTypeList[0].key);
    });
  }
  get f() {
    return this.formData.controls;
  }

  setMinMaxTime(date) {
    this.requestStartDate = new Date(date);
    this.requestStartDate.setHours(this.standardCheckInMorning.getHours());
    this.requestStartDate.setMinutes(this.standardCheckInMorning.getMinutes());
    this.requestStartDate.setSeconds(this.standardCheckInMorning.getSeconds());
    this.requestEndDate = new Date(date);
    this.requestEndDate.setHours(this.standardCheckOutAfternoon.getHours());
    this.requestEndDate.setMinutes(this.standardCheckOutAfternoon.getMinutes());
    this.requestEndDate.setSeconds(this.standardCheckOutAfternoon.getSeconds());
  }

  setDialog() {
    if (this.config !== undefined && this.config.data !== undefined) {
      let date = this.config.data?.date;
      let id = this.config.data?.id;
      if (date) {
        this.setMinMaxTime(date);
        this.dateStart = this.dateEnd = new Date(this.requestStartDate);
      }
      if (id) {
        this.id = id;
        this.dateStart = this.dateEnd = new Date();
        this.getBookingById(this.id);
      }
    }
  }

  registrationTypeList: DropDown[] = [
    { value: 'Đăng ký nghỉ phép', key: BookingDayOff.DAY_OFF }, // 0
    { value: 'Đăng ký đi muộn', key: BookingDayOff.WORKING_LATE }, // 1
    { value: 'Đăng ký về sớm', key: BookingDayOff.WORKING_EARLY }, // 2
    { value: 'Đăng ký remote', key: BookingDayOff.REMOTE }, // 3
    { value: 'Đăng ký ra ngoài', key: BookingDayOff.GO_OUT }, // 4
    { value: 'Đăng ký OT', key: BookingDayOff.OT }, // 5
    { value: 'Đăng ký nghỉ phúc lợi', key: BookingDayOff.PERSONAL_LEAVE }, // 6
    { value: 'Đăng ký nghỉ bù', key: BookingDayOff.COMPENSATORY_LEAVE }, // 7
    { value: 'Đăng ký nghỉ không lương', key: BookingDayOff.UNPAID_LEAVE }, // 8
    { value: 'Đăng ký quên chấm công', key: BookingDayOff.KEEPING_FORGET },//9
  ];
  typeDateListInit: DropDown[] = [
    { value: 'Sáng', key: 'am' },
    { value: 'Chiều', key: 'pm' },
    { value: 'Cả ngày', key: 'full' },
    { value: 'Khác', key: 'other' },
  ];

  selectTypeRadio(key) {
    // checkin morning time
    let hourInAM = this.standardCheckInMorning.getHours();
    let minuteInAM = this.standardCheckInMorning.getMinutes();
    let secondInAM = this.standardCheckInMorning.getSeconds();
    // checkout morning time
    let hourOutAM = this.standardCheckOutMorning.getHours();
    let minuteOutAM = this.standardCheckOutMorning.getMinutes();
    let secondOutAM = this.standardCheckOutMorning.getSeconds();
    // checkin afternoon time
    let hourInPM = this.standardCheckInAfternoon.getHours();
    let minuteInPM = this.standardCheckInAfternoon.getMinutes();
    let secondInPM = this.standardCheckInAfternoon.getSeconds();
    // checkout afternoon time
    let hourOutPM = this.standardCheckOutAfternoon.getHours();
    let minuteOutPM = this.standardCheckOutAfternoon.getMinutes();
    let secondOutPM = this.standardCheckOutAfternoon.getSeconds();
    //
    this.minStartDateOT = true;
    this.maxStartDateOT = true;
    this.minEndDateOT = true;
    this.maxEndDateOT = false;
    this.disabledDateEnd = true;
    this.disabledHoursStart = true;
    this.disabledHoursEnd = true;
    this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
    if (
      this.value == BookingDayOff.DAY_OFF ||
      this.value == BookingDayOff.REMOTE ||
      this.value == BookingDayOff.UNPAID_LEAVE
    ) {
      this.minStartDateOT = false;
      this.minEndDateOT = false;
      this.maxEndDateOT = false;
      if (key == 'am') {
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutAM, minuteOutAM, secondOutAM);

      } else if (key == 'pm') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInPM, minuteInPM, secondInPM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

      } else if (key == 'full') {
        this.disabledDateEnd = false;
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

      }
    } else if (this.value == BookingDayOff.OT) {
      if (!(this.dateStart.getDay() === 6 || this.dateStart.getDay() === 0 || this.isDayOff)) {
        if (key == 'other') {
          this.minStartDateOT = false;
          this.minEndDateOT = false;
          this.maxStartDateOT = false;
          this.maxEndDateOT = false;
          this.disabledDateEnd = false;
          this.disabledHoursStart = false;
          this.disabledHoursEnd = false;

          if (!this.dataRequest) {
            this.dateStart = this.setStandardTime(this.requestStartDate, 0, 0, 0);
            this.dateEnd = this.setStandardTime(this.requestStartDate, 23, 59, 0);

            this.formData.controls['dateStart'].setValue(this.dateStart);
            this.formData.controls['dateEnd'].setValue(this.dateEnd);

            this.requestEndDate = new Date(this.requestStartDate);

            this.requestEndDate.setDate(this.dateEnd.getDate());
            this.requestEndDate.setHours(this.dateEnd.getHours());
            this.requestEndDate.setMinutes(this.dateEnd.getMinutes());

            this.formData.controls['selectedTypeTime'].setValue(this.typeDateListInit[3]);
            this.typeDateList = [];
            this.typeDateList.push(this.typeDateListInit[3]);
          }
          else {
            this.setDateFromDate(new Date(this.dataRequest.requestDay), this.dateStart);
            this.setDateFromDate(new Date(this.dataRequest.backDay), this.dateEnd);
          }

          this.otNomalFlag = true;
        }
      } else {
        if (key == 'am') {
          this.disabledDateEnd = true;
          this.disabledHoursStart = true;
          this.disabledHoursEnd = true;

          this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
          this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutAM, minuteOutAM, secondOutAM);

        } else if (key == 'pm') {
          this.disabledDateEnd = true;
          this.disabledHoursStart = true;
          this.disabledHoursEnd = true;

          this.dateStart = this.setStandardTime(this.requestStartDate, hourInPM, minuteInPM, secondInPM);
          this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

        } else if (key == 'full') {
          this.disabledDateEnd = true;
          this.disabledHoursStart = true;
          this.disabledHoursEnd = true;

          this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
          this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

        } else if (key == 'other') {
          this.minStartDateOT = false;
          this.maxStartDateOT = false;
          this.minEndDateOT = false;
          this.maxEndDateOT = false;
          this.disabledDateEnd = false;
          this.disabledHoursStart = false;
          this.disabledHoursEnd = false;

          this.dateStart = this.setStandardTime(this.requestStartDate, 0, 0, 0);
          this.dateEnd = this.setStandardTime(this.requestStartDate, 23, 59, 0);

          this.requestEndDate = new Date(this.requestStartDate);
          this.requestEndDate.setDate(this.dateEnd.getDate());
          this.requestEndDate.setHours(this.dateEnd.getHours());
          this.requestEndDate.setMinutes(this.dateEnd.getMinutes());
        }
      }
    } else if (this.value == BookingDayOff.WORKING_LATE) {
      this.disabledHoursEnd = false;
      if (key == 'am') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourInAM + 2, minuteInAM, secondInAM);
      } else if (key == 'pm') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInPM, minuteInPM, secondInPM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourInPM + 2, minuteInPM, secondInPM);
      }
    } else if (this.value == BookingDayOff.WORKING_EARLY) {
      this.disabledHoursStart = false;
      this.maxStartDateOT = false;
      this.minStartDateOT = false;
      if (key == 'am') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourOutAM - 2, minuteOutAM, secondOutAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutAM, minuteOutAM, secondOutAM);

      } else if (key == 'pm') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourOutPM - 2, minuteOutPM, secondOutPM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

      }
    } else if (this.value == BookingDayOff.GO_OUT) {
      this.disabledHoursStart = false;
      this.disabledHoursEnd = false;
      this.maxStartDateOT = false;
      this.minStartDateOT = false;
      if (key == 'am') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutAM, minuteOutAM, secondOutAM);
      } else if (key == 'pm') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInPM, minuteInPM, secondInPM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);
      }
      this.setDate(this.dateStart);
      this.setDate(this.dateEnd);
    } else if (this.value == BookingDayOff.PERSONAL_LEAVE) {
      if (key == 'am') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutAM, minuteOutAM, secondOutAM);

      } else if (key == 'pm') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInPM, minuteInPM, secondInPM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

      } else if (key == 'full') {
        this.disabledDateEnd = false;
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

      }
    } else if (this.value == BookingDayOff.COMPENSATORY_LEAVE) {
      if (key == 'am') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutAM, minuteOutAM, secondOutAM);

      } else if (key == 'pm') {
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInPM, minuteInPM, secondInPM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

      } else if (key == 'full') {
        this.disabledDateEnd = false;
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

      }
    } else if (this.value == BookingDayOff.KEEPING_FORGET) {
      if (key == 'other') {
        this.maxEndDateOT = false;
        this.minEndDateOT = false;
        this.disabledDateEnd = true;
        this.disabledHoursStart = false;
        this.disabledHoursEnd = false;
        this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
        this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);

      }
    }
  }

  onSelectregistrationType(key) {
    // checkin morning time
    let hourInAM = this.standardCheckInMorning.getHours();
    let minuteInAM = this.standardCheckInMorning.getMinutes();
    let secondInAM = this.standardCheckInMorning.getSeconds();
    // checkout morning time
    let hourOutAM = this.standardCheckOutMorning.getHours();
    let minuteOutAM = this.standardCheckOutMorning.getMinutes();
    let secondOutAM = this.standardCheckOutMorning.getSeconds();
    // checkin afternoon time
    let hourInPM = this.standardCheckInAfternoon.getHours();
    let minuteInPM = this.standardCheckInAfternoon.getMinutes();
    let secondInPM = this.standardCheckInAfternoon.getSeconds();
    // checkout afternoon time
    let hourOutPM = this.standardCheckOutAfternoon.getHours();
    let minuteOutPM = this.standardCheckOutAfternoon.getMinutes();
    let secondOutPM = this.standardCheckOutAfternoon.getSeconds();
    //
    this.keepingForgetFlag = false;
    this.selectedTypeTime = null;
    this.value = key;
    this.disabledDateEnd = false;
    this.disabledHoursStart = false;
    this.disabledHoursEnd = false;
    this.typeDateList = [];
    this.typeDateList.push(this.typeDateListInit[0]);
    this.typeDateList.push(this.typeDateListInit[1]);

    this.otNomalFlag = false;
    this.otFlag = false;
    this.minStartDateOT = true;
    this.maxStartDateOT = true;
    this.minEndDateOT = true;
    this.maxEndDateOT = false;
    this.disabledDateEnd = true;
    this.disabledHoursStart = true;
    this.disabledHoursEnd = true;
    if (
      key == BookingDayOff.DAY_OFF ||
      key == BookingDayOff.REMOTE ||
      key == BookingDayOff.PERSONAL_LEAVE ||
      key == BookingDayOff.COMPENSATORY_LEAVE ||
      key == BookingDayOff.UNPAID_LEAVE
    ) {
      this.typeDateList.push(this.typeDateListInit[2]);
      this.minStartDateOT = false;
      this.minEndDateOT = false;
      this.maxStartDateOT = false;
      this.maxEndDateOT = false;
      this.disabledDateEnd = false;
      this.disabledHoursStart = false;
      this.disabledHoursEnd = false;
      // this.typeDateList.push(this.typeDateListInit[3]);
    } else if (key == BookingDayOff.KEEPING_FORGET) {
      this.maxStartDateOT = false;
      this.minStartDateOT = false;
      this.disabledHoursStart = true;
      this.disabledHoursEnd = true;
      this.keepingForgetFlag = true;
      this.typeDateList = [];
      this.typeDateList.push(this.typeDateListInit[3]);
      this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
      this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);
    } else if (key == BookingDayOff.OT) {
      if (!(this.dateStart.getDay() === 6 || this.dateStart.getDay() === 0 || this.isDayOff) || this.dataRequest?.selectedTypeTime === "other") {
        this.minStartDateOT = false;
        this.minEndDateOT = false;
        this.maxStartDateOT = false;
        this.maxEndDateOT = false;
        this.disabledDateEnd = false;
        this.disabledHoursStart = false;
        this.disabledHoursEnd = false;

        if (!this.dataRequest) {
          this.dateStart = this.setStandardTime(this.requestStartDate, 0, 0, 0);
          this.dateEnd = this.setStandardTime(this.requestStartDate, 23, 59, 0);

          this.formData.controls['dateStart'].setValue(this.dateStart);
          this.formData.controls['dateEnd'].setValue(this.dateEnd);

          this.requestEndDate = new Date(this.requestStartDate);

          this.requestEndDate.setDate(this.dateEnd.getDate());
          this.requestEndDate.setHours(this.dateEnd.getHours());
          this.requestEndDate.setMinutes(this.dateEnd.getMinutes());

          this.formData.controls['selectedTypeTime'].setValue(this.typeDateListInit[3]);
          this.typeDateList = [];
          this.typeDateList.push(this.typeDateListInit[3]);
        }
        else {
          this.setDateFromDate(new Date(this.dataRequest.requestDay), this.dateStart);
          this.setDateFromDate(new Date(this.dataRequest.backDay), this.dateEnd);
        }

        this.otNomalFlag = true;
      }
      this.otFlag = true;
      this.bookingDayOff.getProjectDropdown().subscribe((response) => {
        if (response.status === ConstantsCommon.HTTP_STATUS_200) {
          this.dropdownProjectOT = response.items;
        }
      })
      this.typeDateList.push(this.typeDateListInit[2]);
      if (!(this.dateStart.getDay() === 6 || this.dateStart.getDay() === 0 || this.isDayOff)) {
        this.typeDateList = [];
      }
      this.typeDateList.push(this.typeDateListInit[3]);
    } else if (key == BookingDayOff.GO_OUT) {
      this.minStartDateOT = false;
      this.minEndDateOT = false;
      this.maxStartDateOT = false;
      this.maxEndDateOT = false;
      this.disabledDateEnd = false;
      this.disabledHoursStart = false;
      this.disabledHoursEnd = false;
    }
  }
  checkDateValidate = false;
  onSubmit() {
    this.submitted = true;
    if (this.otFlag) {
      this.dateStart.setDate
    }
    if (this.dateStart > this.dateEnd) {
      this.checkDateValidate = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Giờ kết thúc nhỏ hơn giờ bắt đầu',
      })
      return;
    }
    if (this.formData.get('selectedTypeRegistration').value == "KEEPING_FORGET") {
      this.formData.controls['selectedTypeTime'].setValue(this.typeDateListInit[3])
    }
    if (this.formData.invalid) {
      return;
    }
    if (!this.validOtDateInput()) {
      return;
    }
    let dateStart = this.formData.controls['dateStart'].value;
    let dateEnd = this.formData.controls['dateEnd'].value;
    if (this.keepingForgetFlag && !this.formData.value.checkin) {
      dateStart.setHours(0);
      dateStart.setMinutes(0);
      dateStart.setSeconds(0);
    }
    if (this.keepingForgetFlag && !this.formData.value.checkout) {
      dateEnd.setHours(0);
      dateEnd.setMinutes(0);
      dateEnd.setSeconds(0);
    }
    this.dataRegist = {
      id: this.id,
      registrationType: this.value,
      dateStart: this.getFormatedDate(dateStart, 'yyyy-MM-dd HH:mm:ss'),
      dateEnd: this.getFormatedDate(dateEnd, 'yyyy-MM-dd HH:mm:ss'),
      approver: this.formData.controls['selectedApprover'].value,
      relatedEmployee: this.formData.controls['selectedRelatedEmployee'].value ? this.formData.controls['selectedRelatedEmployee'].value : [],
      reason: this.formData.controls['reason'].value,
      projectId: this.formData.controls['selectedProject'].value,
      selectedTypeTime: this.formData.controls['selectedTypeTime'].value.key
    };
    this.bookingDayOff.createOrUpdateBooking(this.dataRegist).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          let registType = this.dataRegist.registrationType;
          if (registType !== 'KEEPING_FORGET') {
            // validate if requestDay >= today, then send slack notification
            var today = new Date();
            today.setHours(0)
            today.setMinutes(0)
            today.setSeconds(1)
            var diff = Math.max(today.getTime() - this.formData.value.dateStart.getTime(), 0);
            var daysBetween = Math.ceil(diff / (1000 * 3600 * 24));
            if (daysBetween < 1) {
              let message: string = '';
              // this.bookingDayOff.buildSlackMessage(res.items, this.getRegistTypeString(this.dataRegist)).subscribe((response) => {
              //   message = response.items
              //   this.bookingDayOff.slackSendMessage(message, registType);
              // })
              // this.bookingDayOff.buildDiscordMessage(res.items, this.getRegistTypeString(this.dataRegist)).subscribe((response) => {
              //   message = response.items
              //   this.bookingDayOff.discordSendMessage(message, registType);
              // });
            }
          }
          if (this.evidenceImageFile) {
            this.bookingDayOff.uploadEvidenceImg(this.dataRegist.id == null ? res.items : this.dataRegist.id, this.evidenceImageFile).subscribe((response: any) => {
              if (response.status !== ConstantsCommon.HTTP_STATUS_200) {
                this.messageService.add({
                  severity: 'error',
                  summary: response.message,
                  detail: res.message,
                });
              }
            });
          }
          this.bookingDayOff.sendMailBooking(res.items).subscribe();
          console.log(res)
          this.submitted = false;
          this.checkDateValidate = false;
          this.ref.close(res.status);
        } else if (res.status === ConstantsCommon.HTTP_STATUS_500) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
        else {
          this.showMessage.showErrorMessage();
        }
      },
      (err) => {
        this.showMessage.showErrorMessage();
      }
    );
  }
  getRegistTypeString(dataRegist: any): string {
    let registTypeString: any;
    let registType = dataRegist.registrationType;
    let selectedTypeTime = dataRegist.selectedTypeTime;
    switch (registType) {
      case 'DAY_OFF':
        registTypeString = ' xin nghỉ phép'
        break;
      case 'WORKING_LATE':
        registTypeString = ' xin đi muộn'
        break;
      case 'WORKING_EARLY':
        registTypeString = ' xin về sớm'
        break;
      case 'REMOTE':
        registTypeString = ' xin remote'
        break;
      case 'GO_OUT':
        registTypeString = ' xin ra ngoài'
        break;
      case 'PERSONAL_LEAVE':
        registTypeString = ' xin nghỉ phúc lợi'
        break;
      case 'COMPENSATORY_LEAVE':
        registTypeString = ' xin nghỉ bù'
        break;
      case 'UNPAID_LEAVE':
        registTypeString = ' xin nghỉ không lương'
        break;
      case 'OT':
        registTypeString = ' đăng ký OT'
        break;
    }
    if (registType === 'DAY_OFF' || registType === 'PERSONAL_LEAVE' || registType === 'COMPENSATORY_LEAVE' || registType === 'UNPAID_LEAVE') {
      registType += selectedTypeTime === 'am' ? ' sáng' : selectedTypeTime === 'pm' ? ' chiều' : '';
    }
    return registTypeString;
  }
  // validate inputed date for OT application
  validOtDateInput(): boolean {
    if (this.otFlag) {
      let standardCheckInAMMinutes = 510;
      let standardCheckOutAMMinutes = 720;
      let standardCheckInPMMinutes = 810;
      let standardCheckOutPMMinutes = 1110;

      let totalOtTime = (this.dateEnd.getTime() - this.dateStart.getTime()) / (1000 * 3600);
      totalOtTime = Math.round(totalOtTime * 100) / 100;

      // if (this.otNomalFlag && totalOtTime > 8) {
      //   this.dateStart = this.setStandardTime(this.requestStartDate, 0, 0, 0);
      //   this.dateEnd = this.setStandardTime(this.requestStartDate, 23, 59, 0);
      //   this.messageService.add({
      //     severity: 'error',
      //     summary: 'Lỗi',
      //     detail: this.dateEnd.getDate() === this.dateStart.getDate() ? 'Không thể đăng ký OT vào giờ hành chính' : 'Số giờ OT tối đa là 8',
      //   })
      //   return false;
      // }
      // else if (!this.otNomalFlag && totalOtTime > 8) {
      //   let requestMinute = this.dateStart.getHours() * 60 + this.dateStart.getMinutes();
      //   let backMinute = this.dateEnd.getHours() * 60 + this.dateStart.getMinutes();
      //   if (requestMinute <= standardCheckOutAMMinutes && backMinute >= standardCheckInPMMinutes) {
      //     totalOtTime -= 1.5;
      //     if (totalOtTime <= 8) {
      //       return true;
      //     }
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Lỗi',
      //       detail: 'Số giờ OT tối đa là 8',
      //     })
      //     return false;
      //   }
      // }
    }
    return true;
  }

  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  onDelete(id) {
    this.bookingDayOff.deleteBooking(id).subscribe(
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

  confirmDelete(pos: string, id: number) {
    this.position = pos;
    this.confirmService.confirm({
      message: MessageValidate.MES_6,
      header: 'Thông tin đăng ký',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Từ chối',
      acceptVisible: true,
      rejectVisible: true,
      accept: () => {
        this.onDelete(id);
      },
      key: 'positionDialog',
    });
  }

  setDate(date: Date) {
    if (this.dateStart == null) {
      this.dateStart = new Date(this.requestStartDate);
    }
    if (this.dateEnd == null) {
      this.dateEnd = new Date(this.requestStartDate);
    }
    if (date != null) {
      if (this.dateEnd < this.requestStartDate && this.value !== BookingDayOff.OT) {
        this.dateEnd = new Date(this.requestStartDate);
      }
      if (
        this.value == BookingDayOff.GO_OUT &&
        this.dateEnd > this.requestEndDate
      ) {
        this.dateEnd = new Date(this.requestStartDate);
      }
      let a = date.getHours();
      let b = date.getMinutes();
      if (a <= 8 && this.value !== BookingDayOff.OT) {
        date.setHours(8);
        date.setMinutes(b < 30 ? 30 : b);
        date.setSeconds(0);
      }
      if (a >= 18 && this.value !== BookingDayOff.OT) {
        date.setHours(18);
        date.setMinutes(0);
        date.setSeconds(0);
      }
    }
  }

  updateStartDate() {
    // Limit OT time must be out of office hours 
    if (this.value == BookingDayOff.OT && this.formData.value.selectedTypeTime.key === 'other') {
      this.setDateFromDate(this.requestStartDate, this.dateStart);
      // let standardCheckInMinutes = 510;
      // let standardCheckOutMinutes = 1110;
      // if (!(this.dateStart.getDay() === 6 || this.dateStart.getDay() === 0 || this.isDayOff)) {
      //   let dateStartTime = this.dateStart.getHours() * 60 + this.dateStart.getMinutes();
      //   if (dateStartTime > standardCheckInMinutes && dateStartTime < standardCheckOutMinutes) {
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: 'Không thể đăng ký OT vào giờ hành chính',
      //     })
      //     this.dateStart = this.setStandardTime(this.requestStartDate, 0, 0, 0);
      //   }
      // }
    }
    if (this.value == BookingDayOff.WORKING_EARLY || this.value == BookingDayOff.GO_OUT || this.value == BookingDayOff.KEEPING_FORGET) {
      this.setDateFromDate(this.requestStartDate, this.dateStart);
    }

    this.setDate(this.dateStart);
  }

  updateEndDate(type: number) {
    // if date is chosen, not time
    if (type == 0) {
      this.dateEnd.setDate(this.formData.controls['dateEnd'].value.getDate());
      this.dateEnd.setMonth(this.formData.controls['dateEnd'].value.getMonth());
      this.dateEnd.setFullYear(this.formData.controls['dateEnd'].value.getFullYear());
      this.formData.controls['dateEnd'].value.setHours(this.dateEnd.getHours());
      this.formData.controls['dateEnd'].value.setMinutes(this.dateEnd.getMinutes());
      this.formData.controls['dateEnd'].value.setSeconds(this.dateEnd.getSeconds());
      this.setDateFromDate(this.formData.controls['dateEnd'].value, this.requestEndDate);
    }

    // Limit OT time must be out of office hours 
    if (this.value == BookingDayOff.OT && this.formData.value.selectedTypeTime.key === 'other') {
      this.setDateFromDate(this.requestEndDate, this.dateEnd);
      // let standardCheckInMinutes = 510;
      // let standardCheckOutMinutes = 1110;
      // if (!(this.dateStart.getDay() === 6 || this.dateStart.getDay() === 0 || this.isDayOff)) {
      //   let dateEndTime = this.dateEnd.getHours() * 60 + this.dateEnd.getMinutes();
      //   if (dateEndTime > standardCheckInMinutes && dateEndTime < standardCheckOutMinutes) {
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: 'Không thể đăng ký OT vào giờ hành chính',
      //     })
      //     this.dateEnd = this.setStandardTime(this.requestStartDate, 23, 59, 0);
      //   }
      // }
    }

    if (this.value == BookingDayOff.WORKING_EARLY || this.value == BookingDayOff.GO_OUT || this.value == BookingDayOff.KEEPING_FORGET) {
      this.setDateFromDate(this.requestEndDate, this.dateEnd);
    }

    if (this.maxEndDateOT == false) {
      this.setDate(this.dateEnd);
    } else {
      this.requestStartDate.setHours(19);
      this.requestStartDate.setMinutes(0);
      this.requestStartDate.setSeconds(0);
    }
  }
  // get detail booking
  getBookingById(id) {
    this.bookingDayOff.getInformationBooking(id).subscribe((res) => {
      if (res.status === ConstantsCommon.HTTP_STATUS_200) {
        this.dataRequest = res.items.bookingDayOff;
        if (this.dataRequest.evidenceImage !== null) {
          this.inputFileLabel = this.dataRequest.evidenceImage.split('evdImg-')[1];
          this.evidenceImageView = this.dataRequest.evidenceImage;
        }
        this.dataRequest.approverFullName = res.items.approverFullName;
        if (this.dataRequest) {
          setTimeout(() => {
            this.setDataBooking();
            this.selectedTypeTime = this.typeDateListInit[2];
            if (this.dataRequest.approveProgress.filter((item) => {
              return item != ConstantsCommon.WAIT_STATUS + '';
            }).length > 0 && this.dataRequest.approveProgress.filter((item) => {
              return item != ConstantsCommon.REJECT_STATUS + '';
            }).length > 0) {
              this.inProgress = true;
            }

            if (this.confirm == 2) {
              this.inProgress = false;
            }
            if (this.dataRequest.selectedTypeTime == "full") {
              this.selectedTypeTime = this.typeDateListInit[2];

            }

            if (this.dataRequest.selectedTypeTime == "am") {
              this.selectedTypeTime = this.typeDateListInit[0];

            }
            if (this.dataRequest.selectedTypeTime == "pm") {
              this.selectedTypeTime = this.typeDateListInit[1];

            }
            if (this.dataRequest.selectedTypeTime == "other") {
              this.selectedTypeTime = this.typeDateListInit[3];
            }
            if (this.dataRequest.selectedTypeTime != "other" && this.dataRequest.status != 1 && this.dataRequest.status != 3) {
              this.selectTypeRadio(this.dataRequest.selectedTypeTime)
            }
            if (this.dataRequest.status === 8 || this.dataRequest.status === 1) {
              this.selectTypeRadioForBookingDetail(this.dataRequest.selectedTypeTime, this.dataRequest)
            }
          }, 200);
        }

      } else {
        this.dataRequest = null;
      }
    }),
      (err) => {
        this.dataRequest = null;
      };
  }

  selectTypeRadioForBookingDetail(key, detaiBooking: any) {
    // checkin morning time
    let hourInAM = this.standardCheckInMorning.getHours();
    let minuteInAM = this.standardCheckInMorning.getMinutes();
    let secondInAM = this.standardCheckInMorning.getSeconds();
    // checkout morning time
    let hourOutAM = this.standardCheckOutMorning.getHours();
    let minuteOutAM = this.standardCheckOutMorning.getMinutes();
    let secondOutAM = this.standardCheckOutMorning.getSeconds();
    // checkin afternoon time
    let hourInPM = this.standardCheckInAfternoon.getHours();
    let minuteInPM = this.standardCheckInAfternoon.getMinutes();
    let secondInPM = this.standardCheckInAfternoon.getSeconds();
    // checkout afternoon time
    let hourOutPM = this.standardCheckOutAfternoon.getHours();
    let minuteOutPM = this.standardCheckOutAfternoon.getMinutes();
    let secondOutPM = this.standardCheckOutAfternoon.getSeconds();
    //
    this.minStartDateOT = true;
    this.maxStartDateOT = true;
    this.minEndDateOT = true;
    this.maxEndDateOT = false;
    this.disabledDateEnd = true;
    this.disabledHoursStart = true;
    this.disabledHoursEnd = true;
    if (detaiBooking.status == 3) {
      this.disabledHoursStart = false;
      this.disabledHoursEnd = false;
      this.setDate(this.dateStart);
      this.setDate(this.dateEnd);
    }
    if (detaiBooking.status == 8) {
      this.dateStart = this.setStandardTime(this.requestStartDate, hourInAM, minuteInAM, secondInAM);
      this.dateEnd = this.setStandardTime(this.requestStartDate, hourOutPM, minuteOutPM, secondOutPM);
      this.disabledHoursStart = true;
      this.disabledHoursEnd = true;

      // this.setDate(this.dateStart);
      // this.setDate(this.dateEnd);
      let checkInHours = new Date(detaiBooking.requestDay).getHours();
      let checkInMinutes = new Date(detaiBooking.requestDay).getMinutes();
      let checkOutHours = new Date(detaiBooking.backDay).getHours();
      let checkOutMinutes = new Date(detaiBooking.backDay).getMinutes();

      if ((checkInHours + ":" + checkInMinutes) != "0:0") {
        this.checkIn = true;
        this.disabledHoursStart = false;
        this.dateStart = new Date(detaiBooking.requestDay);
      }
      if (checkOutHours != 0) {
        this.checkOut = true;
        this.disabledHoursEnd = false;
        this.dateEnd = new Date(detaiBooking.backDay)
      }
    }
    if (detaiBooking.status == 1) {

      this.minStartDateOT = false;
      this.minEndDateOT = false;
      this.maxStartDateOT = false;
      this.maxEndDateOT = false;
      this.disabledDateEnd = false;
      this.disabledHoursStart = false;
      this.disabledHoursEnd = false;
      if (
        (this.dateStart.getHours() == hourInAM &&
          this.dateStart.getMinutes() == minuteInAM) ||
        (this.dateStart.getHours() == hourInPM &&
          this.dateStart.getMinutes() == minuteInPM)
      ) {
        this.disabledHoursStart = true;
        this.disabledHoursEnd = false;
        this.selectedTypeRegistration = this.registrationTypeList[1];
      }
      if ((this.dateEnd.getHours() == hourOutAM) || (this.dateEnd.getHours() == hourOutPM)) {
        this.disabledHoursEnd = true;
        this.disabledHoursStart = false;
        this.selectedTypeRegistration = this.registrationTypeList[2];
      }

      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }
  }

  setDataBooking() {
    // checkin morning time
    let hourInAM = this.standardCheckInMorning.getHours();
    let minuteInAM = this.standardCheckInMorning.getMinutes();
    let secondInAM = this.standardCheckInMorning.getSeconds();
    // checkout morning time
    let hourOutAM = this.standardCheckOutMorning.getHours();
    let minuteOutAM = this.standardCheckOutMorning.getMinutes();
    let secondOutAM = this.standardCheckOutMorning.getSeconds();
    // checkin afternoon time
    let hourInPM = this.standardCheckInAfternoon.getHours();
    let minuteInPM = this.standardCheckInAfternoon.getMinutes();
    let secondInPM = this.standardCheckInAfternoon.getSeconds();
    // checkout afternoon time
    let hourOutPM = this.standardCheckOutAfternoon.getHours();
    let minuteOutPM = this.standardCheckOutAfternoon.getMinutes();
    let secondOutPM = this.standardCheckOutAfternoon.getSeconds();

    this.setMinMaxTime(this.dataRequest['requestDay']);
    this.dateStart = new Date(this.dataRequest['requestDay']);
    this.formData.controls['reason'].setValue(this.dataRequest.reason);
    this.formData.controls['selectedApprover'].setValue(this.dataRequest.approverIDs);
    this.formData.controls['selectedRelatedEmployee'].setValue(this.dataRequest.relatedEmployeeIDs);
    this.dateEnd = new Date(this.dataRequest['backDay']);
    this.confirm = this.dataRequest['confirm'];
    this.formData.controls['selectedProject'].setValue(this.dataRequest.projectId);

    let approverName = this.dataRequest['approverFullName'];
    let approveProgress = this.dataRequest['approveProgress'];
    let approveReason = this.dataRequest['approveReason'];
    if (approverName && approverName.length > 0) {
      for (let i = 0; i < approverName.length; i++) {
        this.approveStatus.push({ name: approverName[i], progress: approveProgress[i], reason: approveReason[i] })
      }
    }
    else {
      this.approveStatus.push({ name: this.dataRequest['approver'] ? this.dataRequest['approver'] : ConstantsCommon.WAIT_FOR_APPROVER, progress: this.dataRequest.confirm })
    }

    let status = this.dataRequest['status'];
    // 0-nghi - 1-late/early - 2-remote 3-ra ngoai 4-ot 5-pesonal-leave 6-compensatory-leave
    if (status == 0) {
      this.selectedTypeRegistration = this.registrationTypeList[0];
      this.formData.controls['dateStart'].setValue(new Date(this.dataRequest['requestDate']));
      this.formData.controls['dateEnd'].setValue(new Date(this.dataRequest['backDate']));
      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }

    if (status == 1) {
      if (
        (this.dateStart.getHours() == hourInAM &&
          this.dateStart.getMinutes() == minuteInAM) ||
        (this.dateStart.getHours() == hourInPM &&
          this.dateStart.getMinutes() == minuteInPM)
      ) {
        this.disabledHoursStart = true;
        this.selectedTypeRegistration = this.registrationTypeList[1];
      }
      if ((this.dateEnd.getHours() == hourOutAM) || (this.dateEnd.getHours() == hourOutPM)) {
        this.disabledHoursEnd = true;
        this.selectedTypeRegistration = this.registrationTypeList[2];
      }

      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }
    if (status == 2) {
      this.selectedTypeRegistration = this.registrationTypeList[3];
      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }
    if (status == 3) {
      this.selectedTypeRegistration = this.registrationTypeList[4];
      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }
    if (status == 4) {
      this.selectedTypeRegistration = this.registrationTypeList[5];
      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }
    if (status == 5) {
      this.selectedTypeRegistration = this.registrationTypeList[6];
      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }
    if (status == 6) {
      this.selectedTypeRegistration = this.registrationTypeList[7];
      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }
    if (status == 7) {
      this.selectedTypeRegistration = this.registrationTypeList[8];
      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }
    if (status == 8) {

      this.selectedTypeRegistration = this.registrationTypeList[9];
      this.formData.controls['selectedTypeRegistration'].setValue(
        this.selectedTypeRegistration.key
      );
    }

    this.selectedTypeTime = this.typeDateList[0];
    this.formData.controls['selectedTypeTime'].setValue(
      this.selectedTypeTime.key
    );
    this.onSelectregistrationType(this.selectedTypeRegistration);
  }

  // common function set standard time
  setStandardTime(requestDate: any, hour: any, minute: any, second: any): Date {
    let standardDate = new Date(requestDate);
    standardDate.setHours(hour);
    standardDate.setMinutes(minute);
    standardDate.setSeconds(second);

    return standardDate;
  }
  // get dropdown values for approver list
  getApproversAndRelatedEmployees() {
    this.bookingDayOff.getApproversAndRelatedEmployees().subscribe((response) => {
      if (response.status = ConstantsCommon.HTTP_STATUS_200) {
        let approverList = response.items[0];
        let relatedEmployeeList = response.items[1];
        approverList.forEach(element => {
          this.approverList.push({ key: element.name, value: element.value + '' });
        });
        relatedEmployeeList.forEach(element => {
          this.relatedEmployeeList.push({ key: element.name, value: element.value + '' });
        });
        this.relatedEmployeeControl = this.relatedEmployeeList;
      }
      else
        this.approverList = [];
    })
  }
  selectApprover() {
    let selectedApprover = this.formData.value.selectedApprover;
    this.relatedEmployeeControl = this.relatedEmployeeList.filter(relatedItem => selectedApprover.find((approverItem: any) => approverItem === relatedItem.value) === undefined);
  }
  // check on image uploaded 
  onUploadImg($event: any) {
    const allowedType = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'jfif', 'avif', 'svg', 'ico', 'gif', 'webp'];
    let fileExtension = $event.target.files[0].name.split('.');
    if (allowedType.includes(fileExtension[fileExtension.length - 1])) {
      this.inputFileLabel = $event.target.files[0].name;
      this.evidenceImageFile.append('file', $event.target.files[0], $event.target.files[0].name);
      this.eventFileToImage($event);
    }
  }
  // show image in dialog
  previewImage() {
    // if image is uploaded to ts, enable dialog
    if (this.evidenceImageView) {
      this.imagePreview = true;
    }
  }
  //read file to image
  eventFileToImage($event) {
    const reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onload = (e) => {
      this.evidenceImageView = e.target.result;
    };
  }

  checkBoxForget(check: any) {
    if (check == 0) {
      this.disabledHoursStart = !this.disabledHoursStart;
    }
    else {
      this.disabledHoursEnd = !this.disabledHoursEnd;
    }
  }

  setDateFromDate(dateFrom: Date, dateTo: Date) {
    if (dateTo === null) {
      dateTo = dateFrom
    }
    else {
      dateTo.setDate(dateFrom.getDate());
      dateTo.setMonth(dateFrom.getMonth());
      dateTo.setFullYear(dateFrom.getFullYear());
    }
  }
}
