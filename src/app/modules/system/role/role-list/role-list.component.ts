import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from 'src/app/data/service/role.service';
import { RoleEditComponent } from '../role-edit/role-edit.component';
import { MessageValidate } from 'src/app/shared/message-validation';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstantsCommon } from 'src/app/shared/constants.common';

@Component({
  selector: 'role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit {
  public closeResult: string;

  public position: string;

  public listData: [];

  public roleLabel = "Xác nhận Role";

  public editForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.editForm = new FormGroup({
      id: new FormControl(null),
      roleName: new FormControl(''),
    });
    this.getListRole();
  }

  getListRole() {
    this.roleService.getListRole().subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.listData = data.items;
      } else {
        this.listData = [];
      }
    });
  }

  confirm(position: string, id: number) {
    this.position = position;
    this.confirmationService.confirm({
      message: MessageValidate.MES_6,
      header: this.roleLabel,
      acceptVisible: true,
      rejectVisible: true,
      accept: () => {
        this.delete(id);
      },
      key: 'positionDialog',
    });
  }

  editItem(role: any) {
    const ref = this.modalService.open(RoleEditComponent);
    ref.componentInstance.roleModel = role;
    ref.result.then((yes) => {
      this.ngOnInit();
    });
  }

  delete(id: any) {
    this.roleService.deleteRole(id).subscribe((data) => {
      if (data.status == ConstantsCommon.HTTP_STATUS_200) {
        this.getListRole();
        this.showSuccess();
      } else {
        this.showError();
      }
    });
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
