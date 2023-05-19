import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/list';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookingRoomService } from 'src/app/data/service/booking-room.service';
import { RoomService } from 'src/app/data/service/room.service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon, eRole } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { BookingPopupComponent } from '../booking-popup/booking-popup.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  providers: [DialogService, MessageService],
})
export class BookingListComponent implements OnInit {
  public validate = MessageValidate;
  public visibleSidebar: any;
  public selectedDate: any;
  public ref: DynamicDialogRef;
  public dateNow: Date;
  public formData: FormGroup;
  public id: any;
  public statuses: any;
  public position: String;
  public statusActive = 'Hoạt động';
  public statusNotActive = 'Tạm dừng';
  // create new room variables
  public nameReq: any;
  public statusReq: any;
  public colorReq: any
  //
  public roomDialog: any;
  public submitted: boolean;
  public listRoom: any[] = [];
  public listBookingRoom: any[] = [];
  public allEvents: any[] = [];
  public allResources: any[] = [];
  public cloneRooms: { [s: string]: any } = {};
  public checkEdit: boolean = false;
  public roomActive = ConstantsCommon.STATUS_ACTIVE;
  public roomNotActive = ConstantsCommon.STATUS_NOT_ACTIVE;
  public viewType: string = 'week';
  public screenWidth: number;
  public mobileScreen: boolean = false;

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  constructor(
    public dialogService: DialogService,
    private showMessage: ShowMessageComponent,
    private roomService: RoomService,
    private bookingRoomService: BookingRoomService,
    private tokenStorage: TokenStorageService,
    private confirmService: ConfirmationService,
    private deviceDetector: DeviceDetectorService
  ) { 
    this.screenWidth = window.outerWidth;
    this.mobileScreen = this.screenWidth < 768;
  }

  ngOnInit(): void {
    this.dateNow = new Date();
    this.getListRoom();
    this.initForm();
    this.searchByDate(1);
    this.id = this.tokenStorage.getUser().id;
    this.statuses = [
      { label: 'Hoạt động', value: this.roomActive },
      { label: 'Tạm ngưng', value: this.roomNotActive },
    ];
    this.initCheck();
  }

  initCheck() {
    let rules = this.tokenStorage.getUser()?.roles;
    let isLoggedIn = !!this.tokenStorage.getToken();
    if (isLoggedIn) {
      this.checkEdit = rules.indexOf(eRole.HR) >= 0 ? true : false;
    }
  }

  confirmDelete(pos: string, room: any) {
    this.position = pos;
    this.confirmService.confirm({
      message: MessageValidate.MES_6,
      header: 'Thông tin thay đổi',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Từ chối',
      acceptVisible: true,
      rejectVisible: true,
      accept: () => {
        this.onDelete(room.id);
      },
      key: 'positionDialogList',
    });
  }

  onDelete(id: number) {
    this.roomService.deleteRoom(id).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          this.showMessage.showSuccessMessage();
          this.getListRoom();
        } else {
          this.showMessage.showErrorMessage();
        }
      },
      (err) => {
        this.showMessage.showErrorMessage();
      }
    );
  }
  openNew() {
    this.nameReq = null;
    this.statusReq = null;
    this.roomDialog = true;
  }
  hideDialog() {
    this.roomDialog = false;
    this.submitted = false;
  }
  saveRoom() {
    this.submitted = true;
    if (this.nameReq == null || this.statusReq == null) {
      return;
    }
    let roomRq = {
      id: null,
      name: this.nameReq,
      status: this.statusReq,
      displayColor: this.colorReq
    };
    this.roomService.updateOrCreateRoom(roomRq).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          this.showMessage.showSuccessMessage();
          this.submitted = false;
          this.roomDialog = false;
          this.getListRoom();
        } else {
          this.showMessage.showErrorMessage();
        }
      },
      (err) => {
        this.showMessage.showErrorMessage();
      }
    );
  }

  onVisibleSidebar() {
    this.getListRoom();
    this.visibleSidebar = true;
  }
  onRowEditInit(room: any) {
    this.cloneRooms[room.id] = { ...room };
  }

  onRowEditSave(room: any) {
    this.roomService.updateOrCreateRoom(room).subscribe(
      (res) => {
        if (res.status === ConstantsCommon.HTTP_STATUS_200) {
          this.showMessage.showSuccessMessage();
        } else {
          this.showMessage.showErrorMessage();
        }
      },
      (err) => {
        this.showMessage.showErrorMessage();
      }
    );
  }

  onRowEditCancel(room: any, index: number) {
    this.listRoom[index] = this.cloneRooms[room.id];
  }

  initForm() {
    this.formData = new FormGroup({
      dateRequest: new FormControl(new Date(), Validators.required),
    });
  }

  getListRoom() {
    this.roomService.getListRoom().subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.listRoom = data.items;
        this.setDataRoom();
      }
    });
  }

  searchByDate(type: number) {    
    let dateRequest: Date = this.formData.controls['dateRequest'].value;
    if(this.viewType==='week'){
      if(this.calendarComponent && type!==0){
        dateRequest = this.calendarComponent.getApi().view.activeStart;
      } else if(!this.calendarComponent || type===0){
        while(dateRequest.getDay() != 0){
          dateRequest.setDate(dateRequest.getDate()-1);
        }
      }
    }
    let dateReq = {
      dateRequest: dateRequest,
      days: this.viewType
    }
    this.bookingRoomService
      .getListBookingRoomByDate(dateReq)
      .subscribe((data) => {
        if (data.status == ConstantsCommon.HTTP_STATUS_200) {
          this.listBookingRoom = data.items;
          this.setDataBookingRoom();
        }
      });
    this.calendarComponent?.getApi().gotoDate(this.formData.controls['dateRequest'].value);
  }
  // Resize dialog width when changing size of window's screen
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.outerWidth;
    this.mobileScreen = this.screenWidth < 768;
  }
  show(roomId, timeStart, timeEnd, id, timeId) {
    this.ref = this.dialogService.open(BookingPopupComponent, {
      header: 'Đăng ký phòng họp',
      width: this.mobileScreen?'95%':'40%',
      baseZIndex: 1000,
      data: {
        id: id,
        timeId: timeId,
        timeStart: timeStart,
        timeEnd: timeEnd,
        roomId: roomId,
      },
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.searchByDate(1);
        this.showMessage.showSuccessMessage();
      }
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [listPlugin, resourceTimelinePlugin],
    themeSystem: 'bootstrap5',
    initialView: this.deviceDetector.isMobile()?'listWeek':'timeGridWeek',
    allDaySlot: false,
    locale: 'vi-VN',
    aspectRatio: 2,
    selectable: true,
    selectMirror: true,
    customButtons: {
      todayCustom: {
        text: 'Hiện Tại',
        click: () => {
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.today();
          this.formData.controls['dateRequest'].setValue(calendarApi.getDate())
          this.searchByDate(1);
        },
      },
      prevCustom: {
        text: 'Trước',
        icon: window.outerWidth<768?'chevron-left':'',
        click: () => {
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.prev();
          this.formData.controls['dateRequest'].setValue(calendarApi.getDate())
          this.searchByDate(1);
        },
      },
      nextCustom: {
        text: 'Sau',
        icon: window.outerWidth<768?'chevron-right':'',
        click: () => {
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.next();
          this.formData.controls['dateRequest'].setValue(calendarApi.getDate())
          this.searchByDate(1);
        },
      },
      timeCustom: {
        text: 'Ngày',
        click: () => {
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.changeView('resourceTimeline');
          calendarApi.setOption('selectable', true);
          this.viewType = 'day';
          calendarApi.today();
          this.formData.controls['dateRequest'].setValue(calendarApi.getDate())
          this.searchByDate(1);
        }
      },
      weekCustom: {
        text: 'Tuần',
        click: () => {
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.changeView('timeGridWeek');
          this.viewType = 'week';
          this.searchByDate(1);
        }
      },
      listWeekCustom: {
        text: 'Nhật Ký',
        click: () => {
          let calendarApi = this.calendarComponent.getApi();
          calendarApi.changeView('listWeek');
          this.viewType = 'week';
          this.searchByDate(1);
        }
      },
    },
    headerToolbar: {
      left: 'prevCustom,'+(window.outerWidth<768?'':'todayCustom,') +'nextCustom',
      center: 'title',
      right: (window.outerWidth<768?'':'timeCustom,') +'weekCustom,listWeekCustom',
    },

    resourceAreaHeaderContent: 'Tên phòng',
    height: '80vh',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventChange: this.handleEventClick.bind(this),
  };

  handleDateSelect(selectInfo: DateSelectArg) {
    this.show(
      selectInfo.resource ? selectInfo.resource.id : null,
      selectInfo.start.toString(),
      selectInfo.end.toString(),
      null,
      null
    );
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.show(null, null, null, clickInfo.event.id, clickInfo.event.groupId);
  }

  setDataRoom() {
    this.allResources = [];
    this.listRoom.forEach((value) => {
      let title = value.status == this.roomActive ? value.name : value.name + ' (Tạm ngưng)'
      let detailRoom: any = {
        id: value.id,
        title: title,
      };
      this.allResources = [...this.allResources, detailRoom];
    });
    this.calendarOptions.resources = this.allResources;
  }

  setDataBookingRoom() {
    this.allEvents = [];
    this.listBookingRoom.forEach((data) => {
      let detailBookingRoom: any = {
        id: data.bookingRoom.id,
        groupId: data.id,
        title: data.bookingRoom.reason,
        start: data.timeStart,
        end: data.timeEnd,
        resourceId: data.bookingRoom.room.id,
        color: data.bookingRoom.room.displayColor,
        occupancy: 40,
      };
      this.allEvents = [...this.allEvents, detailBookingRoom];
    });
    this.calendarOptions.events = this.allEvents;
  }
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
}
