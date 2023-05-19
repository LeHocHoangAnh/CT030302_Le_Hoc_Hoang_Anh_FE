import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApproveService } from 'src/app/data/service/approve-service';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';
import { BookingDayOff } from 'src/app/shared/common-filter';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';

@Component({
  selector: 'app-confirm-edit',
  templateUrl: './confirm-edit.component.html',
  styleUrls: ['./confirm-edit.component.scss'],
})
export class ConfirmEditComponent implements OnInit {

  public detail: any;

  public multipleDetail: any[] = [];

  public confirmForm: FormGroup;

  public confirm: any;

  public status: any;

  public confirmReason: string = '';

  public rangeDates: any[];

  public statusCols: any[] = [];

  public approveStatus: any[] = [];

  public waitStatus: number = ConstantsCommon.WAIT_STATUS;

  public accpetStatus: number = ConstantsCommon.ACCEPT_STATUS;

  public rejectStatus: number = ConstantsCommon.REJECT_STATUS;

  public imagePreview: boolean = false;

  public statusPreview: boolean = false;

  public confirmDialog: boolean = false;

  public flagApprove: number;

  public Bookings: any[] = [];

  public mobileScreen: boolean = false;

  public equipmentCategory = ConstantsCommon.EQUIPMENT_CATEGORY;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private approveService: ApproveService,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService,
    private deviceDetector: DeviceDetectorService
  ) {
    this.mobileScreen = deviceDetector.isMobile();
  }

  ngOnInit() {
    if (this.config !== undefined && this.config.data !== undefined) {
      if (this.config.data.flag == 0) {
        this.flagApprove = 0;
        this.getDetailBooking(this.config.data.id);
        this.getDetailStatus(this.config.data.id);
      }
      if (this.config.data.flag == 1) {
        this.flagApprove = 1;
        this.getMultipleDetailBooking(this.config.data.multipleSelected);
        this.getMultipleDetailBookingStatus(this.config.data.id.multipleSelected);
      }
    }
  }
  getMultipleDetailBooking(multipleSelected: number[]) {
    this.approveService.getMultipleDetailBooking(multipleSelected).subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.multipleDetail = data.items;
      }
    },
      (error) => {

      });
  }
  getMultipleDetailBookingStatus(multipleSelected: any) {
    throw new Error('Method not implemented.');
  }

  getDetailBooking(id: any) {
    this.approveService.getDetailBooking(id).subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.detail = data.items;
        if (this.detail.status === 9) {
          this.detail.approver = this.equipmentCategory.filter(item => item.value === this.detail.approver)[0].name
          this.detail.requestDay = new Date(this.detail.requestDay).toLocaleDateString();
        }
        // fill request-date and back-date from booking detail to calendar's data
        let from = new Date(this.detail.requestDay);
        let to = new Date(this.detail.backDay);
        this.rangeDates = [from, to];
        //
        // this.confirm = data.items.confirm;
        this.status = data.items.status;
      }
    },
      (error) => {

      });

    this.approveService.getDetailBookingStatus(id).subscribe((response) => {
      if (response.status = ConstantsCommon.HTTP_STATUS_200) {
        let approverName: any[] = response.items[0];
        let approveProgress: any[] = response.items[1];
        let approveReason: any[] = response.items[2];
        let progressTablelength = approverName.length;
        if (progressTablelength > 0) {
          for (let i = 0; i < approverName.length; i++) {
            if (approverName[i] == this.tokenStorageService.getUser().profileName) {
              this.confirm = approveProgress[i];
            }
          }
        }
        else {
        }
      }
      else {
        this.approveStatus = [];
      }
    })
  }
  updateBooking() {
    this.confirmDialog = true;
  }

  updateReject() {
    this.confirmDialog = false;
  }
  updateAccept() {
    if (this.flagApprove == 1) {
      this.onUpdateMultiple()
    }
    else {
      this.onUpdate();
    }
  }
  onUpdateMultiple() {
    this.multipleDetail.forEach((x) => {
      switch (x.status) {
        case "Nghỉ Phép":
          this.status = BookingDayOff.DAY_OFF;
          break;
        case "Đi Muộn/Về Sớm":
          this.status = BookingDayOff.WORKING_LATE;
          break;
        case "Remote":
          this.status = BookingDayOff.REMOTE;
          break;
        case "Ra Ngoài":
          this.status = BookingDayOff.GO_OUT;
          break;
        case "OT":
          this.status = BookingDayOff.OT;
          break;
        case "Nghỉ Phúc Lợi":
          this.status = BookingDayOff.PERSONAL_LEAVE;
          break;
        case "Nghỉ Bù":
          this.status = BookingDayOff.COMPENSATORY_LEAVE
          break;
        case "Nghỉ Không Lương":
          this.status = BookingDayOff.UNPAID_LEAVE;
          break;
        case "Quên Chấm Công":
          this.status = BookingDayOff.KEEPING_FORGET;
          break;
        case "Đăng Ký Thiết Bị":
          this.status = 9;
          break;
        case null:
          this.status = 9;
          break;
      }
      let request: any = {
        id: x.id,
        confirm: this.confirm,
        status: this.status,
        confirmReason: this.confirmReason ? this.confirmReason : ''
      }
      this.Bookings.push(request);
    })
    this.approveService.UpdateBookings(this.Bookings).subscribe(
      (data) => {

        if (data.status == ConstantsCommon.HTTP_STATUS_200) {
          this.multipleDetail.forEach(x => {
            this.approveService.replyConfirmBooking(x.id).subscribe();
          })
          this.ref.close(data.status);
        } else {
          this.ref.close(data.status);
          this.messageService.add({
            severity: 'error',
            detail: data.message,
          });
        }
      },
      (error) => {
        this.showError();
      }
    );
  }
  onUpdate() {
    switch (this.status) {
      case "Nghỉ Phép":
        this.status = BookingDayOff.DAY_OFF;
        break;
      case "Đi Muộn/Về Sớm":
        this.status = BookingDayOff.WORKING_LATE;
        break;
      case "Remote":
        this.status = BookingDayOff.REMOTE;
        break;
      case "Ra Ngoài":
        this.status = BookingDayOff.GO_OUT;
        break;
      case "OT":
        this.status = BookingDayOff.OT;
        break;
      case "Nghỉ Phúc Lợi":
        this.status = BookingDayOff.PERSONAL_LEAVE;
        break;
      case "Nghỉ Bù":
        this.status = BookingDayOff.COMPENSATORY_LEAVE
        break;
      case "Nghỉ Không Lương":
        this.status = BookingDayOff.UNPAID_LEAVE;
        break;
      case "Quên Chấm Công":
        this.status = BookingDayOff.KEEPING_FORGET;
        break;
    }
    let request: any = {
      id: this.config.data.id,
      confirm: this.confirm,
      status: this.status,
      confirmReason: this.confirmReason ? this.confirmReason : ''
    }

    this.approveService.getUpdateBooking(request).subscribe(
      (data) => {
        if (data.status == ConstantsCommon.HTTP_STATUS_200) {
          this.approveService.replyConfirmBooking(data.items).subscribe();
          // send slack 
          if (this.status === 9) { // if approved application was a equipment registration -> send slack notice
            // let message: string; // admin khuongHao slack userId
            // this.approveService.buildSlackMessage(data.items, 'đăng ký cấp thiết bị').subscribe((response) => {
            //   if (response.status === ConstantsCommon.HTTP_STATUS_200) {
            //     message = '<@U01DLDS7Y06>' + response.items;
            //     this.approveService.slackSendMessage(message);
            //   }
            // })
            // this.approveService.buildDiscordMessage(data.items, 'đăng ký cấp thiết bị').subscribe((response) => {
            //   message = response.items
            //   this.approveService.discordSendMessage(message);
            // })
          }
          //
          this.ref.close(data.status);
        } else {
          this.ref.close(data.status);
          this.messageService.add({
            severity: 'error',
            detail: data.message,
          });
        }
      },
      (error) => {
        this.showError();
      }
    );
  }

  deleteBooking() {
    this.approveService.deleteBooking(this.config.data.id).subscribe(
      (data) => {
        if (data.status == ConstantsCommon.HTTP_STATUS_200) {
          this.ref.close(data.status);
        }
      },
      (error) => {
        this.showError();
      }
    )
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

  getDetailStatus(bookingID: any) {
    this.statusCols = [
      { header: 'Người phê duyệt' },
      { header: 'Trạng thái' },
      { header: 'Lý do' },
    ];
    this.approveService.getDetailBookingStatus(bookingID).subscribe((response) => {
      if (response.status = ConstantsCommon.HTTP_STATUS_200) {
        let approverName: any[] = response.items[0];
        let approveProgress: any[] = response.items[1];
        let approveReason: any[] = response.items[2];
        let progressTablelength = approverName.length;
        if (progressTablelength > 0) {
          for (let i = 0; i < approverName.length; i++) {
            this.approveStatus.push({ name: approverName[i], progress: approveProgress[i], reason: approveReason[i] })
          }
        }
        else {
          this.approveStatus.push({ name: this.detail.approver ? this.detail.approver : ConstantsCommon.WAIT_FOR_APPROVER, progress: this.confirm })
        }
      }
      else {
        this.approveStatus = [];
      }
    })
  }
}
