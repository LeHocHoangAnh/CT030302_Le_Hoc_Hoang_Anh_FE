import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { EditHistoryRequest } from "src/app/data/model/request/EditHistoryRequest";
import { EmployeeService } from "src/app/data/service/employee/employee.service";
import { HistoryService } from "src/app/data/service/history.service";
import { ProjectsService } from "src/app/data/service/projects-service";
import { ConstantsCommon } from "src/app/shared/constants.common";
import { MessageValidate } from "src/app/shared/message-validation";


@Component({
  selector: 'history-edit',
  templateUrl: './history-edit.component.html',
  styleUrls: ['./history-edit.component.scss'],
})
export class HistoryEditComponent implements OnInit {

  public totalRecord = 0;

  public pageSize = 30;

  public searchForm: FormGroup;

  public pageLinkSize = 30;

  public position: string;

  public data: any;

  public mes: MessageValidate = MessageValidate;

  public formData: FormGroup;

  public keySearch: any;

  public keyCheck: any;

  public curentPage = 1;

  public showCheck: boolean = true;

  public columns: any[];

  public isSubmited: boolean = false;

  public editRequest : EditHistoryRequest = new EditHistoryRequest();

  public id: any;

  public projectsId: any;

  public employee: any[];

  public filteredEmployee: any[];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private historyService: HistoryService,
    private messageService: MessageService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.listAutoFilter();
    this.initForm();
    this.initTableHeader();
    if (this.config !== undefined && this.config.data !== undefined) {
      if(this.config.data.id != null){
        this.showCheck = false;
        this.id = this.config.data.id
      }
      this.projectsId = this.config.data.projectsId
      this.getData();
    }
  }

  initForm() {
    this.formData = new FormGroup({
    idEmployee: new FormControl(),
    name: new FormControl(),
    role: new FormControl(),
    timeStart: new FormControl(),
    timeEnd: new FormControl()
    });
  }

  initTableHeader() {
    this.columns = [
      { header: 'Sửa' },
      { header: 'Mã Nhân Viên' },
      { header: 'Tên Nhân Viên' },
      { header: 'Ngày Tham Gia' },
      { header: 'Ngày Kết Thúc' },
      { header: 'Vai Trò' },
      { header: 'Xóa' },
    ];
  }

  setObject(){
    this.formData.controls['idEmployee'].setValue(this.data['idEmployee']);
    this.formData.controls['name'].setValue(this.data['name']);
    this.formData.controls['role'].setValue(this.data['role']);
    this.formData.controls['timeStart'].setValue(this.data['timeStart']);
    this.formData.controls['timeEnd'].setValue(this.data['timeEnd']);
  }

  get f() {
    return this.formData.controls;
  }

  getData(){
    this.historyService.getDetailHistory(this.id).subscribe((res) => {
      if (res.status == ConstantsCommon.HTTP_STATUS_200) {
        this.data = res.items;
        this.setObject();
      }
    });
  }

  setRequired() {
    this.formData.controls["name"].setValidators([Validators.required]);
    this.formData.controls["role"].setValidators([Validators.required]);
    this.formData.controls["timeStart"].setValidators([Validators.required]);
    this.formData.controls["timeEnd"].setValidators([Validators.required]);

    this.formData.controls["name"].updateValueAndValidity();
    this.formData.controls["role"].updateValueAndValidity();
    this.formData.controls["timeStart"].updateValueAndValidity();
    this.formData.controls["timeEnd"].updateValueAndValidity();
  }

  saveProject(): void {
    this.isSubmited = true;
    this.setRequired();
    if (this.formData.invalid) {
      return;
    }
    this.editRequest = this.formData.value;
    this.editRequest.id = this.id;
    this.editRequest.idProjects = this.projectsId;
    this.historyService.editHistory(this.editRequest).subscribe(
      (response) => {
        if (response.status == ConstantsCommon.HTTP_STATUS_200) {
          this.showSuccess();
          this.ref.close(response.status);
        } else {
          this.showError();
        }
      },
      (error) => {
        this.showError();
      }
    );
  }

  filterEmployee(event) {
    let query = event.query;
    this.filteredEmployee = this.employee.filter(item => item.toLowerCase().indexOf(query.toLowerCase()) !== -1);
}

  listAutoFilter(){
    this.employeeService.getListAutoEmployee().subscribe(data => {
      if(data.status == ConstantsCommon.HTTP_STATUS_200){
        this.employee = data.items;
      }else{
        this.employee = []
      }

  },
  err => {
    this.employee = []
  }
  );
  }

  checkEmployee() {
    this.historyService.checkEmployee(this.keyCheck).subscribe(
      data => {
        if(data.status == ConstantsCommon.HTTP_STATUS_200){
          this.formData.controls['idEmployee'].setValue(data.items.id)
          this.formData.controls['name'].setValue(data.items.name)
        }else{
          this.messageService.add({
            severity: 'warn',
            detail: MessageValidate.MES_CHECK_EMPLOYEE,
          });
        }
      },
      error => {
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

  pageClick(event: any) {
    this.curentPage = event.page + 1;
  }
}
