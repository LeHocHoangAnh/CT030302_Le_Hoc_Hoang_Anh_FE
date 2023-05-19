import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountantService } from 'src/app/data/service/accountant-service';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon } from 'src/app/shared/constants.common';

@Component({
  selector: 'app-edit-accountant',
  templateUrl: './edit-accountant.component.html',
  styleUrls: ['./edit-accountant.component.css'],
})
export class EditAccountantComponent implements OnInit {
  constructor(
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private showMessage: ShowMessageComponent,
    private accountantService: AccountantService
  ) { }

  public detailTime: any;
  public selectedMonth: any;
  public editRequest: any;
  public editForm: FormGroup;
  ngOnInit(): void {
    this.editForm = new FormGroup({
      lateTime: new FormControl(),
      lateTimeHour: new FormControl(),
      keepingForget: new FormControl(),
      salaryReal: new FormControl(),
      leaveDayAccept: new FormControl(),
      welfareLeave: new FormControl(),
      compensatoryLeave: new FormControl(),
      salaryCount: new FormControl(),
      otNormal: new FormControl(),
      otMorning7: new FormControl(),
      otSatSun: new FormControl(),
      otHoliday: new FormControl(),
      sumOtMonth: new FormControl(),
      csrLeavePlus: new FormControl(),
      csrLeavePlusRound: new FormControl(),
      otPayInMonth: new FormControl(),
      otUnpaid: new FormControl(),
      leaveRemainNow: new FormControl(),
      csrLeaveNow: new FormControl(),
      leaveRemainLastMonth: new FormControl(),
      csrLeaveLastMonth: new FormControl(),
      remoteTime: new FormControl()
    });
    this.initParentData();
  }

  // check and receive data from parent's component
  initParentData() {
    if (this.config !== undefined && this.config.data !== undefined) {
      this.detailTime = this.config.data.time;
      this.selectedMonth = this.config.data.month;
      this.initControlData();
    }
  }

  // initialize time-keeping values
  initControlData() {
    this.editForm.controls['lateTime'].setValue(this.detailTime.lateTime);
    this.editForm.controls['keepingForget'].setValue(
      this.detailTime.keepingForget
    );
    this.editForm.controls['salaryReal'].setValue(this.detailTime.salaryReal);
    this.editForm.controls['salaryCount'].setValue(this.detailTime.salaryCount);
    this.editForm.controls['leaveDayAccept'].setValue(
      this.detailTime.leaveDayAccept
    );
    this.editForm.controls['welfareLeave'].setValue(
      this.detailTime.welfareLeave
    );
    this.editForm.controls['compensatoryLeave'].setValue(
      this.detailTime.compensatoryLeave
    );
    this.editForm.controls['otNormal'].setValue(this.detailTime.otNormal);
    this.editForm.controls['otMorning7'].setValue(this.detailTime.otMorning7);
    this.editForm.controls['otSatSun'].setValue(this.detailTime.otSatSun);
    this.editForm.controls['otHoliday'].setValue(this.detailTime.otHoliday);
    this.editForm.controls['sumOtMonth'].setValue(this.detailTime.sumOtMonth);
    this.editForm.controls['csrLeavePlus'].setValue(this.detailTime.csrLeavePlus);
    this.editForm.controls['csrLeavePlusRound'].setValue(this.detailTime.csrLeavePlusRound);
    this.editForm.controls['lateTimeHour'].setValue(this.detailTime.lateTimeHour);
    this.editForm.controls['otPayInMonth'].setValue(this.detailTime.otPayInMonth);
    this.editForm.controls['otUnpaid'].setValue(this.detailTime.otUnpaid);
    this.editForm.controls['leaveRemainNow'].setValue(this.detailTime.leaveRemainNow);
    this.editForm.controls['csrLeaveNow'].setValue(this.detailTime.csrLeaveNow);
    this.editForm.controls['leaveRemainLastMonth'].setValue(this.detailTime.leaveRemainLastMonth);
    this.editForm.controls['csrLeaveLastMonth'].setValue(this.detailTime.csrLeaveLastMonth);
    this.editForm.controls['remoteTime'].setValue(this.detailTime.remoteTime);
  }

  // Save time-keeping value
  onSave() {
    this.editRequest = this.editForm.value;
    this.editRequest.fullName = this.detailTime.fullName;
    this.editRequest.employeeCode = this.detailTime.employeeCode;
    this.editRequest.email = this.detailTime.email;
    this.editRequest.typeContract = this.detailTime.typeContract;
    this.accountantService.editEmployeeKeeping(this.editRequest, this.selectedMonth).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.ref.close(response.status)
      } else {
        this.showMessage.showErrorMessage();
      }
    });
  }
}
