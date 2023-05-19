import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownListData } from 'src/app/data/model/DropdownListData';
import { EquipmentService } from 'src/app/data/service/equipment-manage.service';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { MessageValidate } from 'src/app/shared/message-validation';
import { forkJoin, of } from 'rxjs';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-equipment-manage-edit',
  templateUrl: './equipment-manage-edit.component.html',
  styleUrls: ['./equipment-manage-edit.component.scss']
})
export class EquipmentManageEditComponent implements OnInit {
  public editForm: FormGroup;
  public id: number;
  public notNull: string = '(*)';
  public equipmentStatus: DropdownListData[] = ConstantsCommon.EQUIPMENT_STATUS;
  public equipmentCategory: DropdownListData[] = ConstantsCommon.EQUIPMENT_CATEGORY;
  public isSubmitted: boolean = false;
  public employeeList: any;
  //
  public screenWidth: any;
  public mobileScreen: boolean = false;
  //
  public isEdit: any;
  public editNameLabel: any;
  constructor(
    private equipmentService: EquipmentService,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.screenWidth = window.outerWidth;
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.isEdit = this.id !== null;
    this.mobileScreen = this.screenWidth < 768;
    forkJoin({
      requestOne: this.initForm(),
      requestTwo: this.getListEmployeeDropdown()
    })
  }

  initForm() {
    this.editForm = new FormGroup({
      id: new FormControl(this.id ? this.id : null),
      name: new FormControl(),
      serialNumber: new FormControl(),
      category: new FormControl(),
      description: new FormControl(),
      importDate: new FormControl(),
      vendor: new FormControl(),
      warrantyTime: new FormControl(),
      employeeId: new FormControl(),
      status: new FormControl(),
    })
    this.fetchEquipmentDetail();
  }
  fetchEquipmentDetail() {
    this.equipmentService.getDetailEquipment(this.id).subscribe((response: any) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.formControlValueMapping(response.items);
      }
    });
  }
  formControlValueMapping(detailEquipment: any) {
    this.editForm.controls['name'].setValue(detailEquipment.name);
    this.editForm.controls['serialNumber'].setValue(detailEquipment.serialNumber);
    this.editForm.controls['category'].setValue(detailEquipment.category);
    this.editForm.controls['description'].setValue(detailEquipment.description);
    this.editForm.controls['employeeId'].setValue(detailEquipment.employeeId);
    this.editForm.controls['status'].setValue(detailEquipment.status);
    this.editForm.controls['importDate'].setValue(detailEquipment.importDate?new Date(detailEquipment.importDate):null);
    this.editForm.controls['vendor'].setValue(detailEquipment.vendor);
    this.editForm.controls['warrantyTime'].setValue(detailEquipment.warrantyTime?new Date(detailEquipment.warrantyTime):null);
  }
  getListEmployeeDropdown() {
    this.equipmentService.getListEmployeeDropdown().subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.employeeList = response.items;
        this.editNameLabel = this.isEdit ? this.employeeList.filter(item => item.value === this.editForm.value.employeeId)[0]?.name : null;
      }
    })
  }
  get getControl() {
    return this.editForm.controls;
  }
  setRequired() {
    this.editForm.controls['name'].setValidators([Validators.required]);
    this.editForm.controls['serialNumber'].setValidators([Validators.required]);
    this.editForm.controls['category'].setValidators([Validators.required]);
    this.editForm.controls['name'].updateValueAndValidity();
    this.editForm.controls['serialNumber'].updateValueAndValidity();
    this.editForm.controls['category'].updateValueAndValidity();
  }
  onSubmit() {
    this.isSubmitted = true;
    this.setRequired();
    if (this.editForm.invalid) {
      return;
    }
    this.equipmentService.edit(this.editForm.value).subscribe((response) => {
      if (response.status === ConstantsCommon.HTTP_STATUS_200) {
        this.showSuccess();
        this.ref.close(response.status);
      }
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
