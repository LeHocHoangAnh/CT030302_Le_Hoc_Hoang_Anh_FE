import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/data/service/role.service';
import { MessageService } from 'primeng/api';
import { MessageValidate } from 'src/app/shared/message-validation';

class RoleModel {
  id: number;
  roleName: string;
}

@Component({
  selector: 'role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss'],
})
export class RoleEditComponent implements OnInit {
  roleModel:RoleModel;
  editForm: FormGroup;
  isLoading = false;
  constructor(
    public modal: NgbActiveModal,
    private roleService: RoleService,
    private messageService:MessageService,
  ) {}

  ngOnInit() {
    this.getFormInit();
    if(this.roleModel != null) {
      this.setForm();
    }
  }

  getFormInit() {
    this.editForm = new FormGroup({
      id: new FormControl(''),
      roleName: new FormControl('')
    })
  }

  onSubmit() {
    this.roleService.createOrUpdateRole(this.editForm.value).subscribe(
      (result) => {
       this.modal.close();
       this.showSuccess();
      },
      (error) => {
        this.modal.close();
        this.showError();
      }
    );
  }

  private setForm() {
      this.editForm.patchValue({
        id: this.roleModel.id,
        roleName: this.roleModel.roleName,
      });
  }

  showSuccess() {
    this.messageService.add({severity:'info', detail: MessageValidate.MES_SUCCESS});
  };

  showError() {
    this.messageService.add({severity:'error', detail: MessageValidate.MES_ERROR});
  };
}
