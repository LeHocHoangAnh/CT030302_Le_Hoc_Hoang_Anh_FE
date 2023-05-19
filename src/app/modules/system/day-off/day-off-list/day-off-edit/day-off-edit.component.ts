import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DayOffService } from 'src/app/data/service/day-off.service';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';

@Component({
  selector: 'app-day-off-edit',
  templateUrl: './day-off-edit.component.html',
  styleUrls: ['./day-off-edit.component.css'],
})
export class DayOffEditComponent implements OnInit {
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private dayOffService: DayOffService,
    private showMessage: ShowMessageComponent,
  ) {}
  public dayOffDetail: any;
  public dialogType = 'add';

  public isSubmited = false;
  public saveForm: FormGroup;
  public mes: MessageValidate = MessageValidate;
  ngOnInit() {
    this.saveForm = new FormGroup({
      id: new FormControl(),
      dayFrom: new FormControl(),
      dayTo: new FormControl(),
      reasonApply: new FormControl(),
    });
    if (this.config !== undefined && this.config.data !== undefined) {
      if (this.config.data.dayOffDetail !== null) {
        this.dialogType = 'edit';
        this.dayOffDetail = this.config.data.dayOffDetail;
        this.saveForm.controls['id'].setValue(this.dayOffDetail.id);
        this.saveForm.controls['dayFrom'].setValue(
          this.stringToDate(this.dayOffDetail.dayFrom)
        );
        this.saveForm.controls['dayTo'].setValue(
          this.stringToDate(this.dayOffDetail.dayTo)
        );
        this.saveForm.controls['reasonApply'].setValue(
          this.dayOffDetail.reasonApply
        );
      } else {
        this.saveForm.patchValue({ id: null });
      }
    }
  }
  // Convert string(dd/MM/yyyy) to date
  stringToDate(dateString: string) {
    let strArr = dateString.split('/');
    let date: string = strArr[0];
    let month: string = strArr[1];
    let year: string = strArr[2];

    return new Date(year + '-' + month + '-' + date);
  }
  // get Form Control
  get form() {
    return this.saveForm.controls;
  }
  // Set required form control
  setRequired() {
    this.saveForm.controls['dayFrom'].setValidators([Validators.required]);
    this.saveForm.controls['dayTo'].setValidators([Validators.required]);
    this.saveForm.controls['reasonApply'].setValidators([Validators.required]);

    this.saveForm.controls['dayFrom'].updateValueAndValidity();
    this.saveForm.controls['dayTo'].updateValueAndValidity();
    this.saveForm.controls['reasonApply'].updateValueAndValidity();
  }
  // Save configured day off
  saveDayOff() {
    this.isSubmited = true;
    this.setRequired();
    if (this.saveForm.invalid) {
      return;
    }
    this.dayOffService
      .saveDayOffConfig(this.saveForm.value)
      .subscribe((response) => {
        if (response.status == ConstantsCommon.HTTP_STATUS_200) {
          this.isSubmited = false;
          this.ref.close(response.status);
        }
        else{
          this.showMessage.showErrorMessage();
        }
      });
  }
}
