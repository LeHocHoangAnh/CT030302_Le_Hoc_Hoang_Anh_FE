import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable, of } from 'rxjs';
import { EquipmentRegisterService } from 'src/app/data/service/equipment-register.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';

@Component({
  selector: 'app-equipment-register-edit',
  templateUrl: './equipment-register-edit.component.html',
  styleUrls: ['./equipment-register-edit.component.scss']
})
export class EquipmentRegisterEditComponent implements OnInit {
  public notNull: string = '(*)';
  public screenWidth: number;
  public mobileScreen: boolean = false;
  public editForm: FormGroup;
  public equipmentCategory = ConstantsCommon.EQUIPMENT_CATEGORY;
  public approverList: any[] = [];
  public submitted: boolean = false;
  public id: number;
  public confirm: number;
  constructor(
    private equipmentRegisterService: EquipmentRegisterService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private confirmationService: ConfirmationService) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.mobileScreen = this.screenWidth < 768;
    this.initForm();
    const apiResponses = forkJoin({
      approvers: this.getApproversApi(),
      detail: this.getDetailRegistartionApi(),
    }).subscribe(item => {
      this.getApprovers(item.approvers);
      this.getDetailRegistration(item.detail);
    })
  }
  initForm() {
    this.editForm = new FormGroup({
      id: new FormControl(),
      category: new FormControl(),
      description: new FormControl(),
      requestDate: new FormControl(),
      reason: new FormControl(),
      approver: new FormControl(),
    });
  }

  // *** api return ***
  // approvers
  getApproversApi(): Observable<any> {
    return this.equipmentRegisterService.getApproversEmployees();
  }
  getApprovers(apiResponse: any) {
    if (apiResponse.status) {
      if (apiResponse.status = ConstantsCommon.HTTP_STATUS_200) {
        apiResponse.items.forEach(element => {
          this.approverList.push({ name: element.name, value: element.id });
        });
      }
      else {
        this.approverList = [];
      }
    }
  }
  // details
  getDetailRegistartionApi(): Observable<any> {
    return this.id ? this.equipmentRegisterService.getDetailRegistration(this.id) : of({});
  }
  getDetailRegistration(apiResponse: any): any {
    if (apiResponse.status) {
      if (apiResponse.status === ConstantsCommon.HTTP_STATUS_200) {
        this.mappingDetailRegistration(apiResponse.items)
      }
      else {
        this.ref.close(apiResponse.status);
        this.showError();
      }
    }
  }
  // *** end ***
  mappingDetailRegistration(detail: any) {
    this.editForm.controls['id'].setValue(detail.id);
    this.editForm.controls['category'].setValue(detail.approver);
    this.editForm.controls['description'].setValue(detail.selectedTypeTime);
    this.editForm.controls['requestDate'].setValue(new Date(detail.requestDay));
    this.editForm.controls['reason'].setValue(detail.reason);
    this.editForm.controls['approver'].setValue(Number(detail.approverIDs[0]));
    this.confirm = detail.confirm;
  }

  get getControl() {
    return this.editForm.controls;
  }

  setRequired() {
    this.editForm.controls['category'].setValidators([Validators.required]);
    this.editForm.controls['description'].setValidators([Validators.required]);
    this.editForm.controls['requestDate'].setValidators([Validators.required]);
    this.editForm.controls['reason'].setValidators([Validators.required]);
    this.editForm.controls['approver'].setValidators([Validators.required]);
    this.editForm.controls['category'].updateValueAndValidity();
    this.editForm.controls['description'].updateValueAndValidity();
    this.editForm.controls['requestDate'].updateValueAndValidity();
    this.editForm.controls['reason'].updateValueAndValidity();
    this.editForm.controls['approver'].updateValueAndValidity();
  }
  // save/update
  onSubmit() {
    this.submitted = true;
    this.setRequired();
    if (this.editForm.invalid) {
      return;
    }
    this.equipmentRegisterService.edit(this.editForm.value).subscribe((response: any) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.showSuccess();
        this.ref.close(response.status);
      }
    }, (error) => { this.showError() })
  }

  openDeleteConfirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Xác nhận thao tác xóa bản ghi thiết bị?',
      accept: () => {
        this.deleteRegistration();
      },
      reject: () => { }
    })
  }
  deleteRegistration() {
    this.equipmentRegisterService.delete(this.id).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.showSuccess();
        this.ref.close(response.status);
      }
      else {
        this.showError();
      }
    }, (error) => {
      this.showError();
      this.ref.close(ConstantsCommon.HTTP_STATUS_405);
    })
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
