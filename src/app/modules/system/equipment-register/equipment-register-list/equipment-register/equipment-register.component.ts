import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConstantsCommon } from 'src/app/shared/constants.common';
import { EquipmentRegisterEditComponent } from '../../equipment-register-edit/equipment-register-edit.component';

@Component({
  selector: 'app-equipment-register',
  templateUrl: './equipment-register.component.html',
  styleUrls: ['./equipment-register.component.scss']
})
export class EquipmentRegisterComponent implements OnInit {
  @Input() registrationCols: any;
  @Input() registrationList: any;
  @Input() tableRows: any;
  @Input() mobileScreen: any;
  @Output() registerEndEvent = new EventEmitter<boolean>();

  public ref: DynamicDialogRef;
  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  openRegisterDialog(id: number) {
    this.ref = this.dialogService.open(EquipmentRegisterEditComponent, {
      header: id ? 'Chỉnh sửa' : 'Tạo Đơn',
      baseZIndex: 1,
      width: this.mobileScreen ? '99%' : '33%',
      data: { id: id }
    })
    this.ref.onClose.subscribe((response: any) => {
      if (response === ConstantsCommon.HTTP_STATUS_200) {
        this.registerEndEvent.emit(true);
      }
      else {
        this.registerEndEvent.emit(false);
      }
    })
  }
}
