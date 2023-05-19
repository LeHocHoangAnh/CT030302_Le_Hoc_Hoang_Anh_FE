import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApproveService } from 'src/app/data/service/approve-service';
import { BookingRoomService } from 'src/app/data/service/booking-room.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
interface DropDown {
  value: string;
  key: string;
}
@Component({
  selector: 'app-confirm-booking-room-edit',
  templateUrl: './confirm-booking-room-edit.component.html',
  styleUrls: ['./confirm-booking-room-edit.component.scss'],
})
export class ConfirmBookingRoomEditComponent implements OnInit {
  public detail: any;
  public daysOfWeek:string = '';

  public confirmForm: FormGroup;

  public status: any;
  public fullName: any;
  
  public daysOfWeekPicker = [
    {name:'Thứ Hai', value:'1'},
    {name:'Thứ Ba', value:'2'},
    {name:'Thứ Tư', value:'3'},
    {name:'Thứ Năm', value:'4'},
    {name:'Thứ Sáu', value:'5'},
    {name:'Thứ Bảy', value:'6'},
    {name:'Chủ Nhật', value:'7'}
  ]

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private approveService: ApproveService,
    private messageService: MessageService,
    private bookingRoomService: BookingRoomService
  ) {}

  ngOnInit() {
    if (this.config !== undefined && this.config.data !== undefined) {
      this.fullName = this.config.data?.fullName;
      this.getDetailBooking(this.config.data.id);
    }
  }

  getDetailBooking(id: any) {
    this.bookingRoomService.getBookingRoomById(id).subscribe(
      (data) => {
        if (data.status == ConstantsCommon.HTTP_STATUS_200) {
          this.detail = data.items;
          if(this.detail.periodType==1){
            let comma = ', ';
            if(this.detail.daysOfWeek && this.detail.daysOfWeek.length>0){
              this.detail.daysOfWeek.forEach(item => {
                this.daysOfWeek += (this.daysOfWeek.length>0?comma:'') + this.daysOfWeekPicker.find(x => x.value.includes(item)).name;
              });
            }
          }
          this.status = data.items.status;
        }
      },
      (error) => {}
    );
  }

  updateBooking() {
    let request: any = {
      id: this.config.data.id,
      status: this.status,
    };
    this.bookingRoomService.confirmBookingMeetingRoom(request).subscribe(
      (data) => {
        if (data.status == ConstantsCommon.HTTP_STATUS_200) {
          this.bookingRoomService.sendMailConfirmRoom(request.id).subscribe();
          this.ref.close(data.status);
        } else {
          this.showError();
        }
      },
      (error) => {
        this.showError();
      }
    );
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
}
