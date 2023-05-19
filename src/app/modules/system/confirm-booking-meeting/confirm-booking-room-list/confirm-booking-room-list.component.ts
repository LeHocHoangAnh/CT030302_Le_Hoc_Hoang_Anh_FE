import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookingRoomService } from 'src/app/data/service/booking-room.service';
import { RoomService } from 'src/app/data/service/room.service';
import { CommonService } from 'src/app/shared/common.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { ConfirmBookingRoomEditComponent } from '../confirm-booking-room-edit/confirm-booking-room-edit.component';

@Component({
  selector: 'app-confirm-booking-room-list',
  templateUrl: './confirm-booking-room-list.component.html',
  styleUrls: ['./confirm-booking-room-list.component.scss'],
})
export class ConfirmBookingRoomListComponent implements OnInit {
  public pageLinkSize = 20;

  public keySearch: any;

  public pageSize = 20;

  public currentPage = 1;

  public totalRecord = 0;

  public listBooking: any[];

  public cols: any[];

  public searchForm: FormGroup;

  public ref: DynamicDialogRef;
  public listRoom: any;

  public dialogWidth: any;
  public res:any;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private roomService: RoomService,
    private bookingRoomService: BookingRoomService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.res={
      r1280:'75%', 
      r1366:'65%',
      r1400:'50%'
    };
    this.initForm();
    this.initTableHeader();
    this.getListRoom();
  }

  ngAfterViewInit(){
    this.dialogWidth = this.commonService.changeDialogResolution(window.innerWidth, this.res);
  }

  initForm() {
    this.searchForm = new FormGroup({
      time: new FormControl(new Date()),
      wait: new FormControl(true),
      approve: new FormControl(true),
      refuse: new FormControl(true),
      name: new FormControl(),
      roomId: new FormControl(),
    });
  }
  initTableHeader() {
    this.cols = [
      { header: 'Tên nhân viên' },
      { header: 'Tên phòng' },
      { header: 'Lý do' },
      { header: 'Ngày bắt đầu' },
      { header: 'Ngày kết thúc' },
      { header: 'Trạng Thái' },
      { header: 'Duyệt' },
    ];
    this.getListData();
  }

  // Resize dialog width when changing size of window's screen
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.dialogWidth = this.commonService.changeDialogResolution(event.target.innerWidth, this.res);
  }
  show(id,fullName) {
    this.ref = this.dialogService.open(ConfirmBookingRoomEditComponent, {
      header: 'Phê Duyệt Yêu Cầu',
      width: this.dialogWidth,
      baseZIndex: 1000,
      data: {
        id: id,
        fullName:fullName,
      },
    });
    this.ref.onClose.subscribe((status: any) => {
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.showSuccess();
        this.getListData();
      }
    });
  }

  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  getListData() {
    this.searchForm.value.pageSize = this.pageSize;
    this.searchForm.value.pageNo = this.currentPage;
    let bookingSearch = {
      ...this.searchForm.value,
      time: this.getFormatedDate(this.searchForm.controls['time'].value,'MM/yyyy')
    }
    this.bookingRoomService.searchListBookingRoom(bookingSearch).subscribe(
      (data: any) => {
        if (data.status === ConstantsCommon.HTTP_STATUS_200) {
          this.listBooking = data.items.items;
          this.totalRecord = data.items.totalItems;
        }
      },
      (err) => {
        this.listBooking = [];
        this.totalRecord = 0;
      }
    );
  }
  getListRoom() {
    this.roomService.getListRoom().subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.listRoom = data.items;
      }
    });
  }
  onSearch() {
    this.currentPage = 1;
    this.getListData();
  }

  pageClick(event: any) {
    this.currentPage = event.page + 1;
    this.getListData();
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
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
