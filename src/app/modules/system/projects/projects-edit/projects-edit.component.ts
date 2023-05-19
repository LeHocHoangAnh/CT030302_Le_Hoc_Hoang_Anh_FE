import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { PaginationRequest } from "src/app/data/model/request/PaginationRequest";
import { HistoryService } from "src/app/data/service/history.service";
import { ProjectsService } from "src/app/data/service/projects-service";
import { ConstantsCommon } from "src/app/shared/constants.common";
import { MessageValidate } from "src/app/shared/message-validation";
import { HistoryEditComponent } from "../history-edit/history-edit.component";


@Component({
  selector: 'projects-edit',
  templateUrl: './projects-edit.component.html',
  styleUrls: ['./projects-edit.component.scss'],
})
export class ProjectsEditComponent implements OnInit {

  public totalRecord = 0;

  public pageSize = 10;

  public pageLinkSize = 10;

  public position: string;

  public data: any;

  public mes: MessageValidate = MessageValidate;

  public formData: FormGroup;

  public keySearch: any;

  public curentPage = 1;

  public columns: any[];

  public page: PaginationRequest = new PaginationRequest();

  public isSubmited: boolean = false;

  public id: any;

  public showToast: boolean = false;

  public listHistory: any[];

  public ref: DynamicDialogRef;

  constructor(
    private projectsService: ProjectsService,
    private router: ActivatedRoute,
    private messageService: MessageService,
    private historyService: HistoryService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private routers: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initTableHeader();
    const paramRoute = this.router.snapshot.paramMap.get('id');
    this.id = paramRoute ? paramRoute : null;
    if (this.id != null) {
      this.getData();
      this.getListHistory();
    }
  }

  initForm() {
    this.formData = new FormGroup({
    id: new FormControl(),
    nameProjects: new FormControl(),
    codeProjects: new FormControl(),
    customer: new FormControl(),
    technology: new FormControl(),
    description: new FormControl(),
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
      { header: 'Số giờ OT' },
      { header: 'Xóa' },
    ];
  }

  getListHistory() {
    this.page.pageSize = this.pageSize;
    this.page.pageNo = this.curentPage;
    this.historyService.getListHistory(this.id,this.page).subscribe(
      (data :any) => {
        if (data.status === ConstantsCommon.HTTP_STATUS_200) {
          this.listHistory = data.items.items;
          this.listHistory.forEach(item =>{
            item.otTime = Math.round(item.otTime/3600);
          })
          this.totalRecord = data.items.totalItems;
        }
      },
      (err) => {
        this.listHistory = [];
        this.totalRecord = 0;
      }
    );
  }

  deleteHistory(id:any){
    this.historyService.deleteHistory(id).subscribe(
      data => {
        if(data.status == ConstantsCommon.HTTP_STATUS_200){
          this.showSuccess();
          this.ngOnInit();
        }else{
          this.showError();
        }
      },
      err => {
        this.showError();
      }
    );
  }

  show(id) {
    this.showToast = true;
    this.ref = this.dialogService.open(HistoryEditComponent, {
      header: 'Chỉnh Sửa Lịch Sử Làm Việc',
      width: '70%',
      baseZIndex: 1000,
      data: {
        id: id,
        projectsId:this.id
      },
    });
    this.ref.onClose.subscribe((status: any) => {
      this.showToast = false;
      if (status === ConstantsCommon.HTTP_STATUS_200) {
        this.showSuccess;
        this.getListHistory();
      }
    });
  }

  confirm(position: string, id: number) {
    this.position = position;
    this.confirmationService.confirm({
      message: MessageValidate.MES_6,
      header: "Xác nhận xóa",
      acceptLabel: "Đồng ý",
      rejectLabel: "Từ chối",
      acceptVisible: true,
      rejectVisible: true,
      accept: () => {
        this.deleteHistory(id);
      },
      key: 'positionDialog',
    });
  }

  setObject(){
    this.formData.controls['id'].setValue(this.id);
    this.formData.controls['nameProjects'].setValue(this.data['nameProjects']);
    this.formData.controls['codeProjects'].setValue(this.data['codeProjects']);
    this.formData.controls['customer'].setValue(this.data['customer']);
    this.formData.controls['technology'].setValue(this.data['technology']);
    this.formData.controls['description'].setValue(this.data['description']);
    this.formData.controls['timeStart'].setValue(this.data['timeStart']);
    this.formData.controls['timeEnd'].setValue(this.data['timeEnd']);
  }

  get f() {
    return this.formData.controls;
  }

  getData(){
    this.projectsService.getDetailProjects(this.id).subscribe((res) => {
      if (res.status == ConstantsCommon.HTTP_STATUS_200) {
        this.data = res.items;
        this.setObject();
      }
    });
  }

  setRequired() {
    this.formData.controls["nameProjects"].setValidators([Validators.required]);
    this.formData.controls["codeProjects"].setValidators([Validators.required]);
    this.formData.controls["customer"].setValidators([Validators.required]);
    this.formData.controls["technology"].setValidators([Validators.required]);
    this.formData.controls["description"].setValidators([Validators.required]);
    this.formData.controls["timeStart"].setValidators([Validators.required]);
    this.formData.controls["timeEnd"].setValidators([Validators.required]);

    this.formData.controls["nameProjects"].updateValueAndValidity();
    this.formData.controls["codeProjects"].updateValueAndValidity();
    this.formData.controls["customer"].updateValueAndValidity();
    this.formData.controls["technology"].updateValueAndValidity();
    this.formData.controls["description"].updateValueAndValidity();
    this.formData.controls["timeStart"].updateValueAndValidity();
    this.formData.controls["timeEnd"].updateValueAndValidity();
  }

  saveProject(): void {
    this.isSubmited = true;
    this.setRequired();
    if (this.formData.invalid) {
      return;
    }
    this.projectsService.editProjects(this.formData.value).subscribe(
      (response) => {
        if (response.status == ConstantsCommon.HTTP_STATUS_200) {
          this.showSuccess();
          setTimeout(() => {
            this.routers.navigate(['projects-list']);
          }, 500);
        } else {
          this.showError();
        }
      },
      (error) => {
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
