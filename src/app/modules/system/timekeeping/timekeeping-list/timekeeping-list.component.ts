import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  CalendarOptions,
  EventClickArg,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import { MessageService } from 'primeng/api';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookingDayOffService } from 'src/app/data/service/employee/booking-day-off.service';
import { TimeKeepingService } from 'src/app/data/service/employee/time-keeping.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { CommonService } from 'src/app/shared/common.service';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
import { BookingComponent } from '../booking/booking.component';
import { forkJoin, Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-timekeeping-list',
  templateUrl: './timekeeping-list.component.html',
  styleUrls: ['./timekeeping-list.component.scss'],
  providers: [DialogService, MessageService],
})
export class TimekeepingListComponent implements OnInit {
  public timeKeepingDetail: any[] = [];
  public timeKeepingSummary: any;
  public overallDetailKeeping: any;
  public allevents: any[] = [];
  public currentDate: Date;
  public formRequest: FormGroup;
  public rules: string[] = [];
  public isLoggedIn: boolean;
  public isHr: boolean = false;
  public bookingDetail: any[] = [];
  public listConfig: any[] = [];
  public listData: any[] = [];
  //
  public selectedDate: any;
  public listDropDownDate: any[] = [];
  //
  public totalDayOffAccepted: number = 0;
  public screenWidth: any;
  public mobileScreen: boolean = false;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    height: this.deviceDetector.isMobile() ? '58vh' : '80vh',
    customButtons: {
      todayCustom: {
        text: 'Hiện tại',
        click: () => {
          this.listData = [];
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.today();
          this.selectedDate = new Date();
          this.selectedDate.setDate(15);
          this.fetchCalendarEvents();
        },
      },
      prevCustom: {
        text: 'Trước',
        click: () => {
          this.listData = [];
          this.selectedDate = new Date(this.selectedDate);
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.prev();
          this.getDate(1);
        },
      },
      nextCustom: {
        text: 'Sau',
        click: () => {
          this.listData = [];
          this.selectedDate = new Date(this.selectedDate);
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.next();
          this.getDate(2);
          // this.getListConfigDayOff();
        },
      }
    },
    headerToolbar: {
      left: 'prevCustom,nextCustom',
      center: 'title',
      right: 'todayCustom',
    },
    initialView: 'dayGridMonth',
    locale: 'vi-VN',
    weekends: true,
    editable: false,
    selectable: true,
    eventOrder: 'false',
    dayMaxEvents: true,
    fixedWeekCount: false,
    showNonCurrentDates: true,
    // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateSelect.bind(this)
  };

  constructor(
    private timeKeeping: TimeKeepingService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private showMessage: ShowMessageComponent,
    private tokenStorageService: TokenStorageService,
    private bookingDayOff: BookingDayOffService,
    private commonService: CommonService,
    private deviceDetector: DeviceDetectorService
  ) {
    this.screenWidth = window.outerWidth;
    this.mobileScreen = deviceDetector.isMobile();
  }
  ngOnInit() {
    this.initCheck();
    this.initForm();
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.selectedDate.setDate(15);

    this.fetchCalendarEvents();

  }
  ref: DynamicDialogRef;

  // Resize dialog width when changing size of window's screen
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.outerWidth;
    this.mobileScreen = this.deviceDetector.isMobile();
  }
  show(date, id) {
    let dayOff = false;
    for (let item of this.listConfig) {
      let fromDate = new Date(item.dayFrom);
      fromDate.setHours(0);
      fromDate.setMinutes(0);
      fromDate.setSeconds(0);
      let toDate = new Date(item.dayTo);
      toDate.setHours(23);
      toDate.setMinutes(59);
      toDate.setSeconds(59);
      if (fromDate <= date && date <= toDate) {
        dayOff = true;
        break;
      }
    }
    this.ref = this.dialogService.open(BookingComponent, {
      header: 'Đăng ký OT/Ngày nghỉ',
      width: this.mobileScreen ? '100%' : '55%',
      baseZIndex: 2,
      data: {
        id: id,
        date: date,
        dayOff: dayOff
      },
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.showMessage.showSuccessMessage();
        this.fetchCalendarEvents();
        // this.getInformationBooking(this.selectedDate);
        // this.getTimeKeeping(this.selectedDate);
      }
    });
  }
  initCheck() {
    this.rules = this.tokenStorageService.getUser()?.roles;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isHr = this.rules.indexOf(eRole.HR) >= 0 ? true : false;
    }
  }

  initForm() {
    this.formRequest = new FormGroup({
      date: new FormControl(),
    });
  }

  getDate(event) {
    this.allevents = []
    if (event == 0) {
      // this.selectedDate.setDate(15);
      this.selectedDate.setMonth(this.selectedDate.getMonth());
    }
    if (event == 1) {
      // this.selectedDate.setDate(15);
      this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
    }
    if (event == 2) {
      // this.selectedDate.setDate(15);
      this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
    }
    this.fetchCalendarEvents();

  }
  fetchCalendarEvents() {
    this.allevents = [];
    this.calendarOptions.events = [];
    const appiResponse = forkJoin({
      booking: this.getInformationBooking(this.selectedDate),
      holiday: this.getListConfigDayOff(),
      timeKeeping: this.getTimeKeeping(this.selectedDate)
    }).subscribe((response) => {
      this.setInformationBooking(response.booking);
      this.setListConfigDayOff(response.holiday);
      this.setTimeKeeping(response.timeKeeping);
    },
      (err) => {
        console.log(err);
      }
    );

  }
  getRemainLeaves() {
    this.bookingDayOff.getRemainLeaves(this.formRequest.value.date).subscribe((response) => {
      if (response.status == ConstantsCommon.HTTP_STATUS_200) {
        this.overallDetailKeeping = response.items;
        this.totalDayOffAccepted = (
          (this.overallDetailKeeping?.leaveDayAccept ? this.overallDetailKeeping.leaveDayAccept : 0) +
          (this.overallDetailKeeping?.compensatoryLeave ? this.overallDetailKeeping.compensatoryLeave : 0));
      }
      else {
        this.overallDetailKeeping = {} as any;
        this.totalDayOffAccepted = 0;
      }
    }, (error) => {
      this.overallDetailKeeping = {} as any;
      this.totalDayOffAccepted = 0;
    });
  }
  //
  getInformationBooking(date: any): Observable<any> {
    this.formRequest.controls['date'].setValue(
      this.getFormatedDate(date, 'yyyy-MM-dd')
    );
    this.bookingDetail = [];
    return this.bookingDayOff.getAllBooking(this.formRequest.value);
  }
  setInformationBooking(res: any) {
    if (res.status === ConstantsCommon.HTTP_STATUS_200) {
      this.bookingDetail = res.items;
      if (this.bookingDetail) {
        this.setDataBooking();
      }
    } else {
      this.bookingDetail = [];
    }
  }
  //
  getTimeKeeping(date: Date): Observable<any> {
    this.formRequest.controls['date'].setValue(
      this.getFormatedDate(date, 'yyyy-MM-dd')
    );
    this.timeKeepingDetail = [];
    this.timeKeepingSummary = [];
    return this.timeKeeping.getTimeKeepingEmployee(this.formRequest.value);
  }
  setTimeKeeping(res: any) {
    if (res.status === ConstantsCommon.HTTP_STATUS_200) {
      this.timeKeepingDetail = res.items?.timekeepingDetail;
      if (this.timeKeepingDetail) {
        this.setData();
      }
      this.timeKeepingSummary = res.items?.timeKeepingSummary;
      this.getRemainLeaves();
      if (res.items) {
        this.totalDayOffAccepted = (
          (this.timeKeepingSummary?.countTotalDayOffAccept ? this.timeKeepingSummary?.countTotalDayOffAccept : 0) +  // paidLeave
          (this.timeKeepingSummary?.countCompensatoryLeave ? this.timeKeepingSummary.countCompensatoryLeave : 0) + // compensatoryLeave
          (this.timeKeepingSummary?.countPersonalLeave ? this.timeKeepingSummary.countPersonalLeave : 0)); // personalLeave
      }
    } else {
      this.timeKeepingDetail = [];
      this.timeKeepingSummary = [];
    }

  }
  //
  setDataBooking() {
    this.bookingDetail.forEach((value) => {
      let title;
      if (value.status == 0) {
        title = 'Xin nghỉ phép';
      } else if (value.status == 1) {
        title = 'Xin đi muộn-về sớm';
      } else if (value.status == 2) {
        title = 'Xin remote';
      } else if (value.status == 3) {
        title = 'Xin ra ngoài';
      } else if (value.status == 4) {
        title = 'Xin OT';
      } else if (value.status == 5) {
        title = 'Xin nghỉ phúc lợi';
      } else if (value.status == 6) {
        title = 'Xin nghỉ bù';
      }
      else if (value.status == 7) {
        title = 'Xin nghỉ không lương';
      }
      else if (value.status == 8) {
        title = 'Quên chấm công';
      }
      let confirm;
      if (value.confirm == 0) {
        confirm = '#ff9800';
      } else if (value.confirm == 1) {
        confirm = '#04aa6d';
      } else if (value.confirm == 2) {
        confirm = '#f44336';
      }
      // let requestDay=new Date(value.requestDay);
      let backDay = new Date(value.backDay);
      let nextDayBack = new Date(backDay);
      if (backDay.getHours() > 8) {
        nextDayBack.setDate(nextDayBack.getDate() + 1);
      }

      let information: any = {
        start: this.getFormatedDate(value.requestDay ? new Date(value.requestDay) : null, 'yyyy-MM-dd'),
        end: this.getFormatedDate(nextDayBack, 'yyyy-MM-dd'),
        id: value.id,
        title: title,
        date: this.getFormatedDate(
          value.requestDay ? new Date(value.requestDay) : null,
          'yyyy-MM-dd'
        ),
        color: confirm,
      };

      this.allevents = [...this.allevents, information];
    });

    this.calendarOptions.events = this.allevents;
  }

  setData() {
    this.timeKeepingDetail.forEach((value) => {
      let dateCheckIn = this.getFormatedDate(
        value.checkIn ? new Date(value.checkIn) : null,
        'hh:mm:ss aaaa'
      );
      let dateCheckOut = this.getFormatedDate(
        value.checkOut ? new Date(value.checkOut) : null,
        'hh:mm:ss aaaa'
      );
      // check if working day is a holiday
      this.allevents.forEach(element => {
        if (element.start <= value.dateWorking && element.end >= value.dateWorking && element.checkDayOff === true) {
          value.checkDayOff = true;
        }
      });
      //
      let checkIn: any = {
        title: dateCheckIn ? dateCheckIn : 'Trống',
        date: value.dateWorking,
        color: dateCheckIn ? '#04aa6d' : '#f44336',
      };

      let checkOut: any = {
        title: dateCheckOut ? dateCheckOut : 'Trống',
        date: value.dateWorking,
        color: dateCheckIn ? '#04aa6d' : '#f44336',
      };
      let totalTimeLateByDay: any = {

        title: value?.totalTimeLateByDay,
        date: value.dateWorking,
        color:
          value.status == 1 && value.totalTimeLateByDay == '00:00:00'
            ? '#04aa6d'
            : '#f44336',
      };
      if (!value.checkDayOff &&
        !(value.status == 1 && checkIn.title === 'Trống' && checkOut.title === 'Trống')) // add condition if working day is a full-day-off leave
      {
        this.allevents.push(checkIn);
        this.allevents.push(checkOut);
        if (value.totalTimeLateByDay != '00:00:00') {
          this.allevents = [...this.allevents, totalTimeLateByDay];
        }
      }
    });

    this.calendarOptions.events = this.allevents;
  }

  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  handleDateSelect(selectInfo: any) {
    if (
      this.getDiffMonths(this.currentDate, this.selectedDate) < 4
    ) {
      this.show(selectInfo.date, null);
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      this.getDiffMonths(this.currentDate, this.selectedDate) < 4
    ) {
      if (clickInfo.event.id) {
        this.show(clickInfo.event.start, clickInfo.event.id);
      }
    }
  }
  getDiffMonths(currentDate: Date, selectedDate: Date): number {
    return Math.max(currentDate.getMonth() - selectedDate.getMonth() + 12 * (currentDate.getFullYear() - selectedDate.getFullYear()));
  }
  //
  getListConfigDayOff(): Observable<any> {
    this.listConfig = [];
    return this.bookingDayOff.getListConfigDayOff(this.selectedDate);
  }
  setListConfigDayOff(data: any) {
    if (data.status == ConstantsCommon.HTTP_STATUS_200) {
      this.listConfig = data.items;
      this.listConfig.map((value) => {
        let endDate = new Date(new Date(value.dayTo).setHours(23));
        let objEvent =
        {
          start: value.dayFrom,
          end: this.getFormatedDate(endDate, 'yyyy-MM-dd hh:mm:ss'),
          // display:'background',
          backgroundColor: '#04aa6d',
          title: value.reasonApply,
          color: '#04aa6d',
          checkDayOff: true,
        };
        this.allevents = [...this.allevents, objEvent];
      });
      this.calendarOptions.events = this.allevents;
    } else {
      this.listConfig = [];
    }
  }
  //

  dateOption() {
    if (this.selectedDate !== undefined && this.selectedDate !== null) {
      let calendarApi = this.calendarComponent.getApi();
      this.listData = [];
      this.fetchCalendarEvents();
      calendarApi.gotoDate(this.selectedDate);
    }
  }
}
