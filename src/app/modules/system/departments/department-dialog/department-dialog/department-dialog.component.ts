import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DepartmentsService } from 'src/app/data/service/departments-service';
import { ShowMessageComponent } from 'src/app/shared/component/show-message.component';
import { ConstantsCommon } from 'src/app/shared/constants.common';

@Component({
  selector: 'app-department-dialog',
  templateUrl: './department-dialog.component.html',
  styleUrls: ['./department-dialog.component.css'],
})
export class DepartmentDialogComponent implements OnInit {
  constructor(
    private departmentsService: DepartmentsService,
    private showMessage: ShowMessageComponent,
    public ref: DynamicDialogRef,
    private messageService: MessageService
  ) {}
  // dropdown for choosing department action
  action: any[] = [
    { name: 'Ngừng Hoạt Động', action: 0 },
    { name: 'Đang Hoạt Động', action: 1 },
    { name: 'Tạm Ngưng', action: 2 },
  ];
  selectedAction: { name: String; action: number } ;
  //
  ngOnInit(): void {
    this.selectedAction = { name: 'Ngừng Hoạt Động', action: 0 };
  }
  // adding new department
  submitted: boolean = false;
  onSubmit(name: string) {
    if (!name || name === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: "'Tên Phòng Ban' không được để trống",
      });
    } else {
      let departmantName = name;
      let departmentAction = this.selectedAction.action;
      this.departmentsService
        .createDepartment(departmantName, departmentAction)
        .subscribe((response) => {
          if (response.status === ConstantsCommon.HTTP_STATUS_200) {
            this.submitted = false;
            this.ref.close(response.status);
          } else {
            this.showMessage.showErrorMessage();
          }
        });
    }
  }
}
